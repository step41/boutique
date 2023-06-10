<?php

namespace App\Repositories;

use App\Models\User;
use Auth;

/**
 * User Repository
 *
 * @package		Repositories
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class UserRepository
{
    /**
     * Get single instance
     *
     * @param  $id
     *
     * @return App/Models/User;
     */
    public function get($id)
    {
        $item = $this->getAllWithRoles()->findOrFail($id);
        return $item;
    }

    /**
     * Get user/role pivot data
     * 
     * Laravel is very inefficient when it comes to joins, running a separate query for ref lookups inside
     * the indexing loop. So I'm joining the data initially so there's only a single query and sorting
     * can be more easily accomplished.
     *
     * @param  $id
     *
     * @return App/Models/User;
     */
    public function getAllWithRoles()
    {
        $items = User::select('r.id as role_id', 'r.name as role_name', 'users.*')
            ->from('model_has_roles as mhr')
            ->join('users', 'mhr.model_id', '=', 'users.id')
            ->join('roles as r', 'mhr.role_id', '=', 'r.id')
        ;

        return $items;
    }

}