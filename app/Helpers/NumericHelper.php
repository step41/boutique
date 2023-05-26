<?php 

namespace App\Helpers;

use Illuminate\Support\Facades\Config 		as CFG;
use App\Facades\ArrayHelper 				as ARR;
use App\Facades\CommonHelper 				as COM;
use App\Facades\HtmlHelper 					as H;
use App\Facades\InflectionHelper 			as INF;
use App\Facades\JudyHelper 					as J;
use App\Facades\NumericHelper 				as NUM;
use App\Facades\MessageHelper 				as MSG;
use App\Facades\StringHelper 				as STR;
use App\Facades\TranslationHelper 			as T;
use App\Facades\UTFHelper 					as UTF;
use Log;

/**
 * Numeric Helper Class
 * 
 * Various methods to assist in the manipulation of numeric values
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class NumericHelper {

	/**
	 * Determine if a number is within a specified numeric range
	 *
	 * @param  	integer  		$value
	 * @param 	array 			$range
	 * @return \Carbon\Carbon
	 */
	public function isWithinRange($value = NULL, $range = NULL) {
		if (isset($value) && is_int($value) && isset($range) && is_array($range)):
			if (count($range) === 2):
				list($min, $max) = $range;
				return filter_var(
					$value, 
					FILTER_VALIDATE_INT, 
						array(
							'options' => array(
							'min_range' => $min, 
							'max_range' => $max
						)
					)
				);
			else:
				$errMsg = T::_('The $range argument must be of type ARRAY and contain exactly 2 elements of type INTEGER');
				Log::error($errMsg);
			endif;
		else:
			$errMsg = sprintf(T::_('Call to method %s() in the class %s failed because one or more arguments was missing.'),__METHOD__, __CLASS__);
			Log::error($errMsg);
		endif;

		return FALSE;
	}

	/**
	 * Pad a numeric value with characters
	 *
	 * @param	int 		$num 			Numeric value to pad
	 * @param 	int 		$pos 			Number of pad items 
	 * @param 	string 		$str 			Character that will be used to pad
	 * @param 	int 		$type 			Integer value (or constant) that represents which side(s) of the value will have padding added
	 * @return	string
	 * @access	public
	 * @since	5.0
	 */
	public function pad($num = NULL, $pos = 2, $str = '0', $type = STR_PAD_LEFT) {
		if (isset($num)):
			return str_pad($num, $pos, $str, $type);
		endif;
	}

	/**
	 * Pad a numeric value with characters
	 *
	 * @param	int 		$num 			Numeric value to pad
	 * @param 	int 		$pos 			Number of pad items 
	 * @param 	string 		$str 			Character that will be used to pad
	 * @param 	int 		$type 			Integer value (or constant) that represents which side(s) of the value will have padding added
	 * @return	string
	 * @access	public
	 * @since	5.0
	 */
	public function padFormat($num = NULL, $pos = 2, $str = '0', $type = STR_PAD_RIGHT) {
		if (isset($num)):
			return str_pad(number_format((float)$num, $pos), $pos, $str, $type);
		endif;
	}

}

