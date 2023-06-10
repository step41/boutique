<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Repositories\RoleRepository;
use App\Facades\Message as MSG;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use Auth;
use Session;

/**
 * User Controller
 *
 * @package		Controllers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class UserController extends Controller {

    use RolePermissions, ValidateFromCache;
    
    /**
     * Create a new controller instance.
     *
     * @param User $model
     * @param UserRepository $repository
     * @param RoleRepository $roleRepository
     */
    public function __construct(User $model, UserRepository $repository, RoleRepository $roleRepository) {

        $this->middleware('auth');
        $this->model = $model;
        $this->repository = $repository;
        $this->roleRepository = $roleRepository;
    
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {

        if ($this->userCan('delete users')):

            $user = $this->repository->get($id);

            if ($user->count()):

                // Additional check for ownership or override access
                if (Auth::user()->id != $id && $this->userHasOverride($user)):
                
                    $user->delete();

                    return MSG::success('User deleted successfully');

                endif;
            
            else:

                return MSG::danger('Invalid user identifier');

            endif;

        endif;

    }

    /**
     * Retrieve a specified resource (viewing|modifying).
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {

        if ($this->userCan('view users')):

            $user = $this->repository->get($id);

            return json_encode($user);

        endif;

    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {

        if ($this->userCan('view users')):

            $input = $request->all();

            $users = $this->repository->getAllWithRoles();
            
            if (!empty($input['search'])):

                // Full text search does not support AI fields so we'll get a bit creative here to 
                // meet the requirements. We'll use the logic that if keywords are a mix, we will compare
                // against FULL TEXT index, but if it's an integer value then we'll assume the user wants
                // to match a record ID. 
                $matchId = (preg_replace('/[0-9]+/', '', $input['search']) === '');
            
                $users = ($matchId) ? $users->where('users.id', $input['search']) : $users->search($input['search']);
            
            endif;

            $orderBy = (!empty($input['orderby'])) ? $input['orderby'] : 'users.name';

            $sort = (!empty($input['sort']) && strtolower($input['sort']) === 'desc') ? 'desc' : 'asc';
            
            $users = $users->orderBy($orderBy, $sort)->paginate(10)->onEachSide(0);

            // Get all roles for write form drop list
            $roles = $this->roleRepository->getRoleNameById();

            return view('pages.user.index', compact('users', 'roles'));

        endif;

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        if ($this->userCan('add users')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                // Capture role for sync
                $role = $input['role_id'];
                
                // Remove role from general input
                unset($input['role_id']);

                $user = $this->model->create($input)->roles()->sync($role);

            endif;

        endif;

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {

        if ($this->userCan('update users')):

            $input = $request->all();

            if ($this->validateFromCache($input)):

                $user = $this->repository->get($id);

                if ($user->count()):

                    // Additional check for ownership or override access
                    if ($this->userHasOverride($user)):
                    
                        // Check for password changes
                        if (empty($input['password']) || empty($input['password_confirm'])):
                            unset($input['password']);
                        endif;

                        // Capture role for sync
                        $role = $input['role_id'];
                        
                        // Remove role and password confirm from general input
                        unset($input['role_id'], $input['password_confirm']);

                        $user->fill($input)->save();

                        // Limit role change if current user
                        if (Auth::user()->id != $id):
                            $user->roles()->sync($role);
                        endif;

                        return MSG::success('User updated successfully');
                    
                    endif;
                
                else:
    
                    return MSG::danger('Invalid user identifier');
    
                endif;

            endif;

        endif;

    }

}
