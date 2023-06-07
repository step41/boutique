<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * @link https://spatie.be/docs/laravel-permission/v5/basic-usage/basic-usage
     * 
     */
    public function run(): void
    {        

        $ps = [
            'view orders',
            'view products',
            'view stocks',
            'view users',
            'add orders',
            'add products',
            'add stocks',
            'add users',
            'update orders',
            'update products',
            'update stocks',
            'update users',
            'delete orders',
            'delete products',
            'delete stocks',
            'delete users',
            'manage orders',
            'manage products',
            'manage stocks',
            'manage users',
        ];
        $rs = [
            'visitor' => [
                'view products',
            ],
            'subscriber' => [
                'view orders',
                'view products',
                'view stocks',
            ],
            'author' => [
                'view orders',
                'view products',
                'view stocks',
                'add orders',
                'add products',
                'update orders',
                'update products',
            ],
            'manager' => [
                'view orders',
                'view products',
                'view stocks',
                'view users',
                'add orders',
                'add products',
                'add stocks',
                'update orders',
                'update products',
                'update stocks',
            ],
            'administrator' => [
                'view orders',
                'view products',
                'view stocks',
                'view users',
                'add orders',
                'add products',
                'add stocks',
                'add users',
                'update orders',
                'update products',
                'update stocks',
                'delete orders',
                'delete products',
                'delete stocks',
                'manage orders',
                'manage products',
                'manage stocks',
            ],
            'superadmin' => $ps,
        ];
    
        Schema::disableForeignKeyConstraints();
        //Artisan::call('optimize:clear');
        DB::disableQueryLog();
        DB::table('role_has_permissions')->delete();
        DB::table('model_has_permissions')->delete();
        DB::table('model_has_roles')->delete();
        Permission::truncate();
        Role::truncate();
        Schema::enableForeignKeyConstraints();
        $saved = [];
        foreach ($ps as $p):
            $saved[$p] = Permission::create(['name' => $p]);
        endforeach;
        foreach ($rs as $r => $ps):
            $role = Role::create(['name' => $r]);
            foreach ($ps as $p):
                $role->givePermissionTo($saved[$p]);
            endforeach;
        endforeach;
        $users = User::all();
        foreach ($users as $user):
            $user->assignRole('manager');
        endforeach;
        
    }
}
