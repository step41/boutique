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
 * Judy Helper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class JudyHelper { 
 
	public $bs;
	public $iti;
	public $itm;
	public $sti;
	public $stm;

	public function __construct() {
		if (!defined('SUPPORT_JUDY')):
			define('SUPPORT_JUDY', (function_exists('judy_version')));
		endif;
		if (SUPPORT_JUDY):
			$this->bs 	= \Judy::BITSET;
			$this->iti 	= \Judy::INT_TO_INT;
			$this->itm 	= \Judy::INT_TO_MIXED;
			$this->sti	= \Judy::STRING_TO_INT;
			$this->stm 	= \Judy::STRING_TO_MIXED;
		endif;
	}

	/**
	 * Create and return a valid Judy array object based on requested type
	 *
	 * @param	object		$arr			Valid object of type Judy
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function a($type = 'stm') {
		if (SUPPORT_JUDY):
			return new \Judy($this->$type);
		else:
			return array();
		endif;
	}

	/**
	 * Locate the Nth index present in the Judy array
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function byCount($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->byCount($index);
			elseif (is_array($arr) && isset($arr[$index])):
				return $arr[$index];
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Count the number of elements in the array or object
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	array				$options		Optional parameters for function calls
	 * @return	mixed								Returns the number of elements in array
	 * @access	public
	 * @since 	5.0
	 */
	public function count($arr = NULL, $options = array()) {
		if (isset($arr)):
			$defaults = array('beg' => 0, 'end' => -1, 'mode' => COUNT_NORMAL);
			$options = array_merge($defaults, $options);
			extract($options);
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->count($beg, $end);
			elseif (is_array($arr) || is_object($arr)):
				return count($arr, $mode);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Dump the contents of a Judy array out to page
	 *
	 * @uses 	STR::mbstrtoupper()
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$count			Depth count of array elements
	 * @return	string								Returns array structure as a string
	 * @access	public
	 * @since 	5.0
	 */
	public function dump($var = NULL, $count = 0) {
		$output = '';
		if (isset($var) && SUPPORT_JUDY && $this->isJudy($var)):
			foreach ($var as $k => $v):
				$output .= "\n".str_repeat("\t", $count).'['.$k.' ('.STR::mbstrtoupper(gettype($k)).')] => '; 
				if (SUPPORT_JUDY && $this->isJudy($v)):
					$output .= $this->dump($v, ($count + 1));
				else:
					$output .= $v;
				endif;
			endforeach;
		endif;
		return $output;
	}

	/**
	 * Search (inclusive) for the first index present that is equal to or greater 
	 * than the passed index. The index can be an integer or a string corresponding 
	 * to the index where to start the search. 
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function first($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->first($index);
			elseif (is_array($arr)):
				foreach ($arr as $key => $val):
					if ($key === $index):
						return $key;
					endif;
				endforeach;
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Search (inclusive) for the first absent index present that is equal to or greater 
	 * than the passed index. The index can be an integer or a string corresponding 
	 * to the index where to start the search. Since the concept of an "empty" key does
	 * not exist within PHP arrays, this method will simply return FALSE if called against
	 * a PHP array.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function firstEmpty($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->firstEmpty($index);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Unset an array
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	void
	 * @access	public
	 * @since 	5.0
	 */
	public function free(&$arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				$arr->free();
			elseif (is_array($arr)):
				$arr = array();
			endif;
		endif;
	}

	/**
	 * Return the type of the current array. PHP arrays will simply return ARRAY. Judy
	 * arrays will return the specific type of Judy array in use.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function getType($arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->getType();
			elseif (is_array($arr)):
				return gettype($arr);
			endif;
		endif;
	}

	/**
	 * Determine if object passed is either a PHP array or a Judy array object
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	boolean								Return TRUE if PHP array or Judy array object, otherwise FALSE
	 * @access	public
	 * @since 	5.0
	 */
	public function isArray($arr = NULL) {
		return (isset($arr) && (is_array($arr) || (SUPPORT_JUDY && is_object($arr) && @get_class($arr) === 'Judy')));
	}

	/**
	 * Determines if object provided is of type Judy
	 * 
	 * @param	array|object	$arr			Either a standard PHP array or a Judy array object
	 * @return	boolean							Returns TRUE if object is of type Judy, otherwise FALSE
	 * @access 	public
	 * @since	5.0
	 */
	public function isJudy($arr = NULL) {
		return (isset($arr) && is_object($arr) && @get_class($arr) === 'Judy');
	}
	
	/**
	 * Retrieve an array of keys extracted from the given array.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function keys($arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				$keys = array();
				foreach ($arr as $jkey => $jval):
					$keys[] = $jkey;
				endforeach;
				return $keys;
			elseif (is_array($arr)):
				return array_keys($arr);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Search (inclusive) for the last index present that is equal to or less than 
	 * the passed index. The index can be an integer or a string corresponding to 
	 * the index where to start the search. 
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function last($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->last($index);
			elseif (is_array($arr)):
				foreach ($arr as $key => $val):
					if ($key === $index):
						return $key;
					endif;
				endforeach;
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Search (inclusive) for the last absent index present that is equal to or less 
	 * than the passed index. The index can be an integer or a string corresponding 
	 * to the index where to start the search. Since the concept of an "empty" key does
	 * not exist within PHP arrays, this method will simply return FALSE if called against
	 * a PHP array.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function lastEmpty($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->lastEmpty($index);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Return the memory used by a Judy array. This functionality is not available for
	 * a PHP array and the method below does not appear to actually return anything but
	 * zero for Judy arrays so this one is pretty much useless.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	int									Return the memory used by the Judy array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function memoryUsage($arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->memoryUsage();
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Merge two or more arrays together into a single array
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function merge($arr = NULL) {
		if (isset($arr)):
			$args = func_get_args();
			array_shift($args);
			$arrays = $args;
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				$arrlen = count($arr);
				foreach ($arrays as $array):
					foreach ($array as $key => $val):
						if (is_numeric($key)):
							$arr[count($arr)] = $val;
						elseif (is_string($key)):
							$arr[$key] = $val;
						endif;
					endforeach;
				endforeach;
			elseif (is_array($arr)):
				return call_user_func_array('array_merge', $arrays);
			endif;
		endif;
		return $arr;
	}

	/**
	 * Search (exclusive) for the next index present that is greater than the passed index. 
	 * The index can be an integer or a string corresponding to the index where to start the 
	 * search. 
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function next($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->next($index);
			elseif (is_array($arr)):
				$next = FALSE;
				foreach ($arr as $key => $val):
					if ($next):
						return $key;
					endif;
					if ($key === $index):
						$next = TRUE;
					endif;
				endforeach;
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Search (exclusive) for the next absent index that is greater than the passed index. 
	 * The index can be an integer or a string corresponding to the index where to start the 
	 * search. Since the concept of an "empty" key does not exist within PHP arrays, this 
	 * method will simply return FALSE if called against a PHP array.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array. 
	 * @access	public
	 * @since 	5.0
	 */
	public function nextEmpty($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->nextEmpty($index);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Whether an offset exists
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	mixed				$offset			The offset to find
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function offsetExists($arr = NULL, $offset = NULL) {
		if (isset($arr) && isset($offset)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->offsetExists($offset);
			elseif (is_array($arr)):
				return in_array($offset, array_keys($arr));
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Offset to retrieve
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	mixed				$offset			The offset to find
	 * @return	mixed								Returns the value at specified offset
	 * @access	public
	 * @since 	5.0
	 */
	public function offsetGet($arr = NULL, $offset = NULL) {
		if (isset($arr) && isset($offset)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->offsetGet($offset);
			elseif (is_array($arr) && isset($arr[$offset])):
				return $arr[$offset];
			endif;
		endif;
		return NULL;
	}

	/**
	 * Offset to set
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	mixed				$offset			The offset to assign
	 * @param	mixed				$value			The value to assign
	 * @return	void								
	 * @access	public
	 * @since 	5.0
	 */
	public function offsetSet(&$arr = NULL, $offset = NULL, $value = NULL) {
		if (isset($arr) && isset($offset) && isset($value)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				$arr->offsetSet($offset, $value);
			elseif (is_array($arr)):
				$arr[$offset] = $value;
			endif;
		endif;
	}

	/**
	 * Offset to unset
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	mixed				$offset			The offset to unset
	 * @return	void								
	 * @access	public
	 * @since 	5.0
	 */
	public function offsetUnset(&$arr = NULL, $offset = NULL) {
		if (isset($arr) && isset($offset) && isset($value)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				$arr->offsetUnset($offset);
			elseif (is_array($arr)):
				unset($arr[$offset]);
			endif;
		endif;
	}

	/**
	 * Search for the previous index in the array. Search (exclusive) for the previous 
	 * index present that is less than the passed index. The index can be an integer or a 
	 * string corresponding to the index where to start the search.  
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array 
	 * @access	public
	 * @since 	5.0
	 */
	public function prev($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->prev($index);
			elseif (is_array($arr)):
				foreach ($arr as $key => $val):
					if ($key === $index):
						return $prev;
					endif;
					$prev = $key;
				endforeach;
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Search for the previous absent index in the array. Search (exclusive) for the previous 
	 * index absent that is less than the passed index. The index can be an integer or a string 
	 * corresponding to the index where to start the search. Since the concept of an "empty" 
	 * key does not exist within PHP arrays, this method will simply return FALSE if called 
	 * against a PHP array.
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @param	int					$index			The index position within the array
	 * @return	mixed								Return the corresponding index in the array 
	 * @access	public
	 * @since 	5.0
	 */
	public function prevEmpty($arr = NULL, $index = 0) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return $arr->prevEmpty($index);
			endif;
		endif;
		return FALSE;
	}

	/**
	 * Serialize a valid Judy array object or PHP array into a string
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function serial($arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				/* Convert Judy array object to PHP array - hopefully without memory issues *crosses fingers* */
				$arr = ARR::toArray($arr);
			endif;
			if (is_array($arr)):
				/* Serialize like normal */
				$str = serialize($arr);
				return $str;
			endif;
		endif;
		return NULL;
	}

	/**
	 * Return the size of the current Judy array. This method is an alias of the count()
	 * method above. 
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function size($arr = NULL) {
		return $this->count($arr);
	}

	/**
	 * Return the type of a Judy array
	 *
	 * @param	object		$arr				A Judy array object
	 * @return	int								Return an integer corresponding to a Judy type, otherwise FALSE
	 * @access	public
	 * @since 	5.0
	 */
	public function type($arr = NULL) {
		if (isset($arr)):
			if (SUPPORT_JUDY && $this->isJudy($arr)):
				return judy_type($arr);
			endif;
		endif;
		return NULL;
	}

	/**
	 * Unserialize a string into a PHP array
	 *
	 * @param	array|object		$arr			PHP array or valid Judy array object
	 * @return	mixed
	 * @access	public
	 * @since 	5.0
	 */
	public function unserial($content = NULL) {
		if (isset($content) && is_string($content)):
			$arr = unserialize($arr);
			return $str;
		endif;
		return NULL;
	}

	/**
	 * Return or print the current PHP Judy version. If the return value is not used, 
	 * the string will be printed. 
	 *
	 * @return	string								Return a string of the PHP Judy version. 
	 * @access	public
	 * @since 	5.0
	 */
	public function version() {
		if (SUPPORT_JUDY):
			return judy_version();
		endif;
		return NULL;
	}

}
