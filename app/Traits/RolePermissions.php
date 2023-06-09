<?php

namespace App\Traits;

use App\Models\User;
use App\Facades\Message as MSG;
use Auth;
use Log;

trait RolePermissions 
{

	protected $_overrideRoles = [
		'administrator', 
		'superadmin',
	];

	/**
	 * Checks for a logged in user and verifies role based access controls to ensure account 
	 * is authenticated and authorized to access a particular function or system area.
	 *
	 * @uses	Auth::user()
	 * @uses	MSG::danger()
	 *
	 * @param 	string		$permission					Preset text value that matches existing permissions in the database
	 * @return 	bool									Returns true or false depending on results of check
	 * @since 	1.0
	 */
	public function userCan($permission = NULL) {

		if (!empty($permission)):

			if (Auth::user() && Auth::user()->hasPermissionTo($permission)):

				return TRUE;

			endif;	
		endif;

		MSG::danger('You are not authorized', 401);
		abort('401', '401');

	}

	/**
	 * Checks for a logged in user and verifies role based access controls to ensure account 
	 * is authenticated and authorized to access a particular function or system area.
	 *
	 * @uses	Auth::user()
	 * @uses	MSG::danger()
	 *
	 * @param 	string		$role						Preset text value that matches existing roles in the database
	 * @return 	bool									Returns true or false depending on results of check
	 * @since 	1.0
	 */
	public function userHas($role = NULL) {

		if (!empty($role)):
			if (Auth::user() && Auth::user()->hasRole($role)):

				return TRUE;

			endif;	
		endif;

		MSG::danger('You are not authorized', 401);
		abort('401', '401');

	}

	/**
	 * Checks for a logged in user and verifies role based access controls to ensure account 
	 * is authenticated and authorized to access a particular function or system area.
	 *
	 * @uses	Auth::user()
	 * @uses	MSG::danger()
	 *
	 * @param 	array		$roles						Array containing one ore more preset text value that match existing roles in the database
	 * @return 	bool									Returns true or false depending on results of check
	 * @since 	1.0
	 */
	public function userHasAny($roles = NULL) {

		if (!empty($roles)):
			if (Auth::user() && Auth::user()->hasAnyRole($roles)):

				return TRUE;

			endif;	
		endif;

		MSG::danger('You are not authorized', 401);
		abort('401', '401');

	}

	/**
	 * Checks for a logged in user and verifies role based access controls to ensure account 
	 * is authenticated and authorized to access a particular function or system area.
	 *
	 * @uses	Auth::user()
	 * @uses	MSG::danger()
	 *
	 * @param 	array		$roles						Array containing one ore more preset text value that match existing roles in the database
	 * @return 	bool									Returns true or false depending on results of check
	 * @since 	1.0
	 */
	public function userHasAll($roles = NULL) {

		if (!empty($roles)):
			if (Auth::user() && Auth::user()->hasAllRoles($roles)):

				return TRUE;

			endif;	
		endif;

		MSG::danger('You are not authorized', 401);
		abort('401', '401');

	}

	/**
	 * Checks for a logged in user and verifies role based access controls to ensure account 
	 * is authenticated and authorized to access a particular function or system area.
	 *
	 * @uses	Auth::user()
	 * @uses	MSG::danger()
	 *
	 * @param 	Model		$model						Model collection with potential ownership (ref:user_id)
	 * @return 	bool									Returns true or false depending on results of check
	 * @since 	1.0
	 */
	public function userHasOverride($model = NULL) {

		$override = FALSE;

		if (Auth::user() && !empty($model)):

			if (isset($model->user_id)):

				$owner = (Auth::user()->id === $model->user_id);
				$elevated = $this->userHasAny($this->_overrideRoles);

				$override = ($owner || $elevated);

			elseif ($model instanceof User):

				$owner = (Auth::user()->id === $model->id);
				$elevated = (Auth::user()->hasPermissionTo('manage users'));

				$override = ($owner || $elevated);

			endif;

		endif;

		if ($override):

			return TRUE;
		
		else: 

			MSG::danger('You are not authorized', 401);
			abort('401', '401');		

		endif;

	}


}
