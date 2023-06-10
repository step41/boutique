<?php

namespace App\Repositories;

use Spatie\Permission\Models\Role;

/**
 * Role Repository
 *
 * @package		Repositories
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class RoleRepository
{
    /**
     * Get single instance
     *
     * @param  $id
     *
     * @return App/Models/Role;
     */
    public function get($id)
    {
        $item = Role::findOrFail($id);
        return $item;
    }

    /**
     * Get list of user roles
     *
     * @param  $id
     *
     * @return [];
     */
    public function getRoleNameById()
    {
        
        $roles = [];
        $items = Role::get();
        foreach ($items as $item):
            $roles[$item->id] = ucfirst($item->name);
        endforeach;
        return $roles;

    }

}