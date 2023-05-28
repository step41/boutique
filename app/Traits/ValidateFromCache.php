<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Facades\ArrayHelper as ARR;
use App\Facades\TranslationHelper as T;
use App\Facades\Message as MSG;
use App\Classes\Validator;
use Auth;
use Log;

trait ValidateFromCache 
{
	/**
	 * Checks all request submissions and compares the current CSRF token in the form against
	 * any available validation cache files. If a match is found, validation rules are extracted
	 * and processed against request key-value pairs. If validation passes successfully or a
	 * cache file is not found, the submitted request will continue as expected. Any errors
	 * that occur during validation will halt any further request processing, and will be
	 * returned immediately to the client in a messages header for further action.
	 *
	 * @uses	ARR::toArray()
	 * @uses	Log::debug()
	 * @uses	Log::warning()
	 * @uses	MSG::validation()
	 *
	 * @return 	object									Returns an object of this type
	 * @since 	1.0
	 */
	public function validateFromCache($params = []) {
		$csrfToken = '_token';
		$csrfHash = csrf_token();
        $cacheId = ((Auth::user()) ? Auth::user()->email : 'public').'_validationcache_'.$csrfHash; 
		//dd(Cache::get($cacheId));
		if (isset($params[$csrfToken]) && $params[$csrfToken] === $csrfHash && $cache = Cache::get($cacheId)):
			Log::debug(T::_('...Validation cache found. Processing rules now...'));
			$ov = new Validator($params);
			$fields = array_intersect(array_keys($cache), array_keys($params));
			foreach ($fields as $field):
				$label = $cache[$field]['label'];
				$rules = $cache[$field]['data-validate'];
				//Log::debug(sprintf(T::_('...Validator now processing the following rules: %s'), print_r($rules, TRUE)));
				foreach ($rules as $method => $args):
					if (is_callable(array($ov, $method))):
						$args = (is_bool($args)) ? array() : ARR::toArray($args);
						call_user_func_array(array($ov, $method), $args);
					else:
						//Log::warning(sprintf(T::_('The method %s() encountered an invalid rule declaration: %s'), __METHOD__, $method)); 	
					endif;
				endforeach;
				$ov->validate($field, $label);
			endforeach;
			//Log::debug(sprintf(T::_('...Validation complete. Processed rules for the following items: %s'), print_r($fields, TRUE)));
			if ($ov->hasErrors()):
				//Log::debug(sprintf(T::_('...Validation found errors on one or more of the following items: %s'), print_r($fields, TRUE)));
				$errors = $ov->getAllErrors();
				MSG::validation($errors);
				return FALSE;
			endif;
		endif;
		return TRUE;
	}


}
