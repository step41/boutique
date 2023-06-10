<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Repositories\RoleRepository;
use App\Facades\Message as MSG;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Traits\RolePermissions;
use App\Traits\ValidateFromCache;
use App\Classes\Validator;
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

                // Cannot delete own account
                if (Auth::user()->id != $id):
                
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

            $input = $request->query();

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

            $input = $request->post();

            if ($this->validateFromCache($input)):

                $user = $this->model->create($input)->roles()->sync($input['role_id']);

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

        $input = $request->post();

        if ($this->validateFromCache($input)):

            $user = $this->repository->get($id);

            if ($user->count()):

                // Additional check for ownership or override access
                if ($this->validatePassword($user, $input) && $this->userHasOverride($user)):
                
                    // Remove password fields from input to avoid blank password hashing
                    if (empty($input['password']) || empty($input['password_confirm'])):
                        unset($input['password'], $input['password_confirm']);
                    endif;

                    $user->fill($input)->save();

                    // Limit role change if current user
                    if (Auth::user()->id != $id && Auth::user()->roles()->first()->id >= $user->roles()->first()->id):
                        $user->roles()->sync($input['role_id']);
                    endif;

                    return MSG::success('User updated successfully');
                
                endif;
                
            else:

                return MSG::danger('Invalid user identifier');

            endif;

        endif;

    }

	/**
	 * Custom validation rules that handle server-side specific validation requirements.
	 *
     * @uses    MSG::validation()
     * 
	 * @param	object				$user			    The user account to be affected
	 * @param	object				$post			    The post array values
	 * @access  protected
	 * @return  mixed
	 * @since	5.0
	 */
	protected function validatePassword($user = NULL, $post = NULL) {
        $hash = $user->password;
        $text = $post['password_current'];
		$err = __('Password changes require a valid current password');
		$ov = new Validator($post);
		$ov->callback([$this, 'validatePasswordCurrent'], $err, [$text, $hash])->validateIfSet('password', 'New Password');
		$ov->callback([$this, 'validatePasswordCurrent'], $err, [$text, $hash])->validateIfSet('password_confirm', 'Confirm Password');
		if ($ov->hasErrors()):
			MSG::validation($ov->getAllErrors());
			return FALSE;
		endif;
		return TRUE;
	}

	/**
	 * Verifies current password against database in the event of a password change request.
	 *
	 * @uses	Auth::user()
	 * @uses	Hash::check()
	 *
	 * @return	boolean									Returns TRUE if validation passes, otherwise FALSE
	 * @access 	public
	 * @since	5.0
	 */
	public function validatePasswordCurrent(...$args) {
		if (Auth::user() && Auth::user()->hasPermissionTo('manage users')):
			return TRUE;
		elseif (!empty($args) && count($args) >= 4):
            [$key, $val, $text, $hash] = $args;
            return Hash::check($text, $hash);
        endif;
		return FALSE;
	}
	


}
