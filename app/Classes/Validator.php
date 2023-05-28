<?php namespace App\Classes;

use Illuminate\Support\Facades\Config 		as CFG;
use App\Facades\ArrayHelper 				as ARR;
use App\Facades\CommonHelper 				as COM;
use App\Facades\HtmlHelper 					as H;
use App\Facades\InflectionHelper 			as INF;
use App\Facades\JudyHelper 					as J;
use App\Facades\NumericHelper 				as NUM;
use App\Facades\Message 					as MSG;
use App\Facades\StringHelper 				as STR;
use App\Facades\TranslationHelper 			as T;
use App\Facades\UTFHelper 					as UTF;
use Log;


/**
 * Form validation library.
 *
 * @see https://github.com/blackbelt/php-validation
 * @see Based on idea: http://brettic.us/2010/06/18/form-validation-class-using-php-5-3/
 * 
 * @author 		Tasos Bekos <tbekos@gmail.com>
 * @author 		Chris Gutierrez <cdotgutierrez@gmail.com>
 * @author 		Corey Ballou <ballouc@gmail.com>
 * @author		Jeff Todnem
 * @since 		1.0  
 */ 
class Validator {

	protected $_arguments 		= array();
	protected $_ifParamIs  		= FALSE;
	protected $_ifParamNot 		= FALSE;
	protected $_ifSet	  		= FALSE;
	protected $_ifNotSet		= FALSE;
	protected $_data 			= NULL;
	protected $_params 			= array();
	protected $_errors 			= array();
	protected $_fields 			= array();
	protected $_filters 		= array();
	protected $_functions 		= array();
	protected $_messages 		= array();
	protected $_rules 			= array();
	protected $_validData 		= array();
	protected $_allrules		= array(
		'alphaNum' 			=> TRUE,
		'ccNum' 			=> TRUE,
		'date' 				=> TRUE,
		//'dateFormat'		=> array(DATETIME_FORMAT_YMDHIS),
		//'dateMax' 			=> array('2015-09-01 00:00:00', DATETIME_FORMAT_YMDHIS),
		//'dateMin' 			=> array('2014-02-01 00:00:00', DATETIME_FORMAT_YMDHIS),
		'endsWith' 			=> array('THE-END'),
		'endsNotWith' 		=> array('NOT-THE-END'),
		'digits' 			=> TRUE,
		'email' 			=> TRUE,
		'equals'			=> array('EQUAL-TO-ME'),
		'equalsNot'			=> array('NOT-EQUAL-TO-ME'),
		'float' 			=> TRUE,
		'integer' 			=> TRUE,
		'ip' 				=> TRUE,
		'length' 			=> array(10),
		'lengthBetween' 	=> array(15, 20),
		'lengthMax' 		=> array(8),
		'lengthMin' 		=> array(3),
		'matchesField'		=> array('validator_rule_testing_field_email', 'Validate Email'),
		'matchesNotField'	=> array('validator_rule_testing_field_email', 'Validate Email'),
		'matchesRegExp'		=> array('#^[a-z0-9-\s]+$#i'),
		'numBetween'		=> array(6,18),
		'numMax'			=> array(12),
		'numMin'	 		=> array(6),
		'fieldIn' 			=> array('field_name_one, field_name_two, field_name_four'),
		'required' 			=> TRUE,
		'startsWith' 		=> array('THE-START'),
		'startsNotWith' 	=> array('NOT-THE-START'),
		'url' 				=> TRUE,
	);

	public static $translations	= array();

	/**
	 * Constructor
	 * 
	 * Define values to validate.
	 *
	 * @param 	array 				$params
	 * @return 	void
	 * @access 	public
	 * @since 	5.0
	 */
	public function __construct(array $data = []) {
		$this->_params = $data;
		$this->_allrules['dateFormat'] = array(config('constants.DATETIME_FORMAT_YMDHIS'));
		$this->_allrules['dateMax'] = array('2015-09-01 00:00:00', config('constants.DATETIME_FORMAT_YMDHIS'));
		$this->_allrules['dateMin'] = array('2014-02-01 00:00:00', config('constants.DATETIME_FORMAT_YMDHIS'));
	
		if (empty(self::$translations)):
			self::$translations = array(
				'alphaNum' 			=> T::_('%s must only contain letters and numbers'),
				'ccNum' 			=> T::_('%s must be a valid credit card number'),
				'symbols'			=> T::_('symbols'),
				'date' 				=> T::_('%s is not a valid date'),
				'dateFormat'		=> T::_('%s must be in date format: %s'),
				'dateMax' 			=> T::_('%s must be earlier than: %s'),
				'dateMin' 			=> T::_('%s must be later than: %s'),
				'endsWith' 			=> T::_('%s must end with: %s'),
				'endsNotWith' 		=> T::_('%s must not end with: %s'),
				'default' 			=> T::_('%s has an error'),
				'digits' 			=> T::_('%s must consist only of digits'),
				'email' 			=> T::_('%s is an invalid email address'),
				'equals' 			=> T::_('%s must equal the value: %s'),
				'equalsNot'			=> T::_('%s must not equal the value: %s'),
				'float' 			=> T::_('%s must consist of a float value'),
				'integer' 			=> T::_('%s must consist of an integer value'),
				'ip' 				=> T::_('%s is an invalid IP address'),
				'length' 			=> T::_('%s must be exactly %s %s'),
				'lengthBetween' 	=> T::_('%s must be between %s and %s %s'),
				'lengthMax' 		=> T::_('%s must be no longer than %s %s'),
				'lengthMin' 		=> T::_('%s must be at least %s %s'),
				'matchesField'		=> T::_('%s must match the value in field: %s'),
				'matchesNotField'	=> T::_('%s must not match the value in field: %s'),
				'matchesRegExp'		=> T::_('%s must match the regular expression: %s'),
				'numBetween' 		=> T::_('%s must be a number between %s and %s%s'),
				'numMax'			=> T::_('%s must be a number less than%s %s'),
				'numMin'			=> T::_('%s must be a number greater than%s %s'),
				'fieldIn' 			=> T::_('%s must be among these fields: %s'),
				'orEqualTo' 		=> T::_('or equal to'),
				'required' 			=> T::_('%s is required'),
				'startsWith' 		=> T::_('%s must start with: %s'),
				'startsNotWith' 	=> T::_('%s must not start with: %s'),
				'url' 				=> T::_('%s is an invalid url'),
				'withoutLimits' 	=> T::_('(without limits)'),
			);
		endif;
		if (!empty($data)):
			$this->setData($data);
		endif;
	}

	/**
	 * Recursively apply filters to a value
	 *
	 * @param 	mixed 				$val 				Reference
	 * @return 	void
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _applyFilter(&$val) {
		if (is_array($val)):
			foreach ($val as $key => &$item):
				$this->_applyFilter($item);
			endforeach;
		else:
			foreach ($this->_filters as $filter):
				$val = $filter($val);
			endforeach;
		endif;
	}

	/**
	 * Applies filters based on a data key
	 *
	 * @param 	string 				$key
	 * @return 	void
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _applyFilters($key) {
		$this->_applyFilter($this->_data[$key]);
	}

	/**
	 * Get a default date formatting string if no other format is requested
	 *
	 * @return 	string
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _getDefaultDateFormat() {
		return config('constants.DATETIME_FORMAT_YMDHIS');
	}

	/**
	 * Get default error message.
	 *
	 * @param 	string 				$rule
	 * @param 	array 				$args
	 * @return 	string
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _getDefaultMessage($rule, $args = NULL) {
		switch ($rule):
			case 'dateMax':
			case 'dateMin':
				$message = sprintf(self::$translations[$rule], '%s', $args[0]->format($args[1]));
				break;

			case 'lengthBetween':
				$message = sprintf(self::$translations[$rule], '%s', $args[0], $args[1], (isset($args[2]) ? $args[2] : self::$translations['symbols']));
				break;

			case 'matchesField':
			case 'matchesNotField':
				$message = sprintf(self::$translations[$rule], '%s', $args[1]);
				break;

			case 'numBetween':
				$message = sprintf(self::$translations[$rule], '%s', $args[0], $args[1], (isset($args[2]) ? '' : ' '.self::$translations['withoutLimits']));
				break;

			case 'numMax':
			case 'numMin':
				$message = sprintf(self::$translations[$rule], '%s', (isset($args[1]) ? ' '.self::$translations['orEqualTo'] : ''), $args[0]);
				break;

			case 'fieldIn':
				$message = sprintf(self::$translations[$rule], '%s', implode(', ', $args[0]));
				break;

			case 'length':
			case 'lengthMax':
			case 'lengthMin':
				$message = sprintf(self::$translations[$rule], '%s', $args[0], (isset($args[1]) ? $args[1] : self::$translations['symbols']));
				break;

			case 'dateFormat':
			case 'endsWith':
			case 'endsNotWith':
			case 'equals':
			case 'equalsNot':
			case 'matchesRegExp':
			case 'startsWith':
			case 'startsNotWith':
				$message = sprintf(self::$translations[$rule], '%s', $args[0]);
				break;

			case 'alphaNum':
			case 'ccNum':
			case 'date':
			case 'digits':
			case 'email':
			case 'float':
			case 'integer':
			case 'ip':
			case 'required':
			case 'url':
				$message = self::$translations[$rule];
				break;

			default:
				$message = self::$translations['default'];
				break;
		
		endswitch;
		return $message;
	}

	/**
	 * _getVal with added support for retrieving values from numeric and
	 * associative multi-dimensional arrays. When doing so, use DOT notation
	 * to indicate a break in keys, i.e.:
	 *
	 * key = "one.two.three"
	 *
	 * would search the array:
	 *
	 * array('one' => array(
	 *	  'two' => array(
	 *		  'three' => 'RETURN THIS'
	 *	  )
	 * );
	 *
	 * @uses 	STR::mbstrpos()
	 *
	 * @param 	string 				$key
	 * @return 	mixed
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _getVal($key) {
		// handle multi-dimensional arrays
		if (STR::mbstrpos($key, '.') !== FALSE):
			$arrData = NULL;
			$keys = explode('.', $key);
			$keyLen = count($keys);
			for ($i = 0; $i < $keyLen; ++$i):
				if (trim($keys[$i]) == ''):
					return FALSE;
				else:
					if (is_null($arrData)):
						if (!isset($this->_data[$keys[$i]])):
							return FALSE;
						endif;
						$arrData = $this->_data[$keys[$i]];
					else:
						if (!isset($arrData[$keys[$i]])):
							return FALSE;
						endif;
						$arrData = $arrData[$keys[$i]];
					endif;
				endif;
			endfor;
			return $arrData;
		else:
			return (isset($this->_data[$key])) ? $this->_data[$key] : FALSE;
		endif;
	}

	/**
	 * Register error.
	 *
	 * @param 	string 				$rule
	 * @param 	string 				$key
	 * @param 	string 				$message			Validation results message
	 * @return 	void
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _registerError($rule, $key, $message = NULL) {
		if (empty($message)):
			$message = $this->_messages[$rule];
		endif;
		$message = sprintf($message, $this->_fields[$key]);
		$this->_errors[$key] = $message;
	}

	/**
	 * Reset rules and filters
	 *
	 * @return 	void
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _reset() {
		$this->_ifParamIs = FALSE;
		$this->_ifParamNot = FALSE;
		$this->_ifSet = FALSE;
		$this->_ifNotSet = FALSE;
		$this->_rules = array();
		$this->_filters = array();
	}

	/**
	 * Recursively validates a value
	 *
	 * @param 	string 				$key
	 * @param 	mixed 				$val
	 * @return 	bool
	 * @access 	protected
	 * @since 	5.0
	 */
	protected function _validate($key, $val, $recursive = FALSE) {
		if ($recursive && is_array($val)):
			// run validations on each element of the array
			foreach ($val as $index => $item):
				if (!$this->_validate($key, $item, $recursive)):
					// halt validation for this value.
					return FALSE;
				endif;
			endforeach;
			return TRUE;
		else:
			// try each rule function
			foreach ($this->_rules as $rule => $is_TRUE):
				if ($is_TRUE):
					$function = $this->_functions[$rule];
					$args = $this->_arguments[$rule]; // Arguments of rule
					$valid = (empty($args)) ? $function($key, $val) : $function($key, $val, $args);
					if ($valid === FALSE):
						$this->_registerError($rule, $key);
						$this->_reset();
						return FALSE;
					endif;
				endif;
			endforeach;
			$this->_validData[$key] = $val;
			return TRUE;
		endif;
	}

	/**
	 * Field must contain only letters and numbers
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function alphaNum($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return (!preg_match('/[^a-z0-9]/i', $val));
		}, $message);
		return $this;
	}

	/**
	 * Callback method
	 *
	 * @param   string  			$name
	 * @param   mixed   			$function
	 * @param   mixed   			$params
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function callback($callback, $message = '', $params = array()) {
		if (is_callable($callback)):
			// If an array is callable, it is a method
			if (is_array($callback)):
				$func = new \ReflectionMethod($callback[0], $callback[1]);
			else:
				$func = new \ReflectionFunction($callback);
			endif;
			if (!empty($func)):
				// needs a unique name to avoid collisions in the rules array
				$name = 'callback_'.STR::uid();
				$this->setRule($name, function($key, $value) use ($func, $params, $callback) {
					// Creates merged arguments array with validation target as first argument
					$args = array_merge(array($key, $value), (is_array($params) ? $params : array($params)));
					if (is_array($callback)):
						// If callback is a method, the object must be the first argument
						return $func->invokeArgs($callback[0], $args);
					else:
						return $func->invokeArgs($args);
					endif;
				}, $message, $params);
			endif;
		else:
			$callback = (is_array($callback)) ? get_class($callback[0]).'::'.$callback[1] : $callback;
			throw new \Exception(sprintf(T::_('%s is not callable'), $callback));
		endif;
		return $this;
	}

	/**
	 * Field has to be a valid credit card number format.
	 *
	 * @see https://github.com/funkatron/inspekt/blob/master/Inspekt.php
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ccNum($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $value) {
			$value = str_replace(' ', '', $value);
			$length = STR::mbstrlen($value);

			if ($length < 13 || $length > 19):
				return FALSE;
			endif;

			$sum = 0;
			$weight = 2;

			for ($i = $length - 2; $i >= 0; $i--):
				$digit = $weight * $value[$i];
				$sum += floor($digit / 10) + $digit % 10;
				$weight = $weight % 2 + 1;
			endfor;

			$mod = (10 - $sum % 10) % 10;

			return ($mod == $value[$length - 1]);
		}, $message);
		return $this;
	}

	/**
	 * Field has to be a valid date.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function date($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			if (STR::mbstrlen(trim($val)) === 0):
				return TRUE;
			endif;
			try {
				$dt = new \DateTime($val, new \DateTimeZone('UTC'));
				return TRUE;
			} 
			catch(\Exception $e) {
				return FALSE;
			}
		}, $message);
		return $this;
	}

	/**
	 * Field has to have a value that matches the specified datetime string format.
	 *
	 * @param 	string 				$format 			Date-compatible formatting string
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function dateFormat($format = '', $message = NULL) {
		if (empty($format)):
			$format = $this->_getDefaultDateFormat();
		endif;
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$format = $args[0];
			try {
				return \DateTime::createFromFormat($format, $val);
			} 
			catch(\Exception $e) {
				return FALSE;
			}
		}, $message, array($format));
		return $this;
	}

	/**
	 * Field has to be a date earlier than or equal to X.
	 *
	 * @param 	string|int  		$date 				Date used for limit comparison
	 * @param 	string 				$format 			Date-compatible formatting string
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function dateMax($date = 0, $format = '', $message = NULL) {
		if (empty($format)):
			$format = $this->_getDefaultDateFormat();
		endif;
		if (is_numeric($date)):
			$date = new \DateTime($date.' days'); // Days difference from today
		else:
			$fieldValue = $this->_getVal($date);
			$date = ($fieldValue == FALSE) ? $date : $fieldValue;
			$date = \DateTime::createFromFormat($format, $date);
		endif;
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$limitDate = $args[0];
			$format = $args[1];
			return !($limitDate < \DateTime::createFromFormat($format, $val));
		}, $message, array($date, $format));
		return $this;
	}

	/**
	 * Field has to be a date later than or equal to X.
	 *
	 * @param   string|int  		$date	   			Date used for limit comparison
	 * @param   string	  			$format	 			Date-compatible formatting string
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function dateMin($date = 0, $format = '', $message = NULL) {
		if (empty($format)):
			$format = $this->_getDefaultDateFormat();
		endif;
		if (is_numeric($date)):
			$date = new \DateTime($date.' days'); // Days difference from today
		else:
			$fieldValue = $this->_getVal($date);
			$date = ($fieldValue == FALSE) ? $date : $fieldValue;
			$date = \DateTime::createFromFormat($format, $date);
		endif;
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$limitDate = $args[0];
			$format = $args[1];
			return ($limitDate > \DateTime::createFromFormat($format, $val)) ? FALSE : TRUE;
		}, $message, array($date, $format));
		return $this;
	}

	/**
	 * Every character in field, if completed, must be a digit.
	 * This is just like integer(), except there is no upper limit.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function digits($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return (STR::mbstrlen($val) === 0 || ctype_digit((string) $val));
		}, $message);
		return $this;
	}

	/**
	 * Field, if completed, has to be a valid email address.
	 * 
	 * @uses	COM::isValidEmail()
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbstrrpos()
	 * @uses 	STR::mbsubstr()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function email($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			if (STR::mbstrlen($val) == 0):
				return TRUE;
			endif;
			/* Replacing the original functionality below with COM::isValidEmail() */
			return COM::isValidEmail($val);
/*			
			$isValid = TRUE;
			$atIndex = STR::mbstrrpos($val, '@');
			if (is_bool($atIndex) && !$atIndex):
			   $isValid = FALSE;
			else:
				$domain = STR::mbsubstr($val, $atIndex+1);
				$local = STR::mbsubstr($val, 0, $atIndex);
				$localLen = STR::mbstrlen($local);
				$domainLen = STR::mbstrlen($domain);
				if ($localLen < 1 || $localLen > 64):
					$isValid = FALSE;
				elseif ($domainLen < 1 || $domainLen > 255):
					// domain part length exceeded
					$isValid = FALSE;
				elseif ($local[0] == '.' || $local[$localLen-1] == '.'):
					// local part starts or ends with '.'
					$isValid = FALSE;
				elseif (preg_match('/\.\./', $local)):
					// local part has two consecutive dots
					$isValid = FALSE;
				elseif (!preg_match('/^[A-Za-z0-9\-\.]+$/', $domain)):
					// character not valid in domain part
					$isValid = FALSE;
				elseif (preg_match('/\.\./', $domain)):
					// domain part has two consecutive dots
					$isValid = FALSE;
				elseif (!preg_match('/^(\\.|[A-Za-z0-9!#%&`_=\/$\'*+?^{}|~.-])+$/', str_replace("\\","",$local))):
					// character not valid in local part unless
					// local part is quoted
					if (!preg_match('/^"(\\\\"|[^"])+"$/', str_replace("\\\\","",$local))):
						$isValid = FALSE;
					endif;
				endif;
				// check DNS
				if ($isValid && !(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A"))):
					$isValid = FALSE;
				endif;
			endif;
			return $isValid;
*/			
		}, $message);
		return $this;
	}

	/**
	 * Field must not end with a specific substring.
	 *
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbsubstr()
	 *
	 * @param 	string 				$sub
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function endsNotWith($sub, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$sub = $args[0];
			return (STR::mbstrlen($val) === 0 || STR::mbsubstr($val, -STR::mbstrlen($sub)) !== $sub);
		}, $message, array($sub));
		return $this;
	}

	/**
	 * Field must end with a specific substring.
	 *
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbsubstr()
	 *
	 * @param 	string 				$sub
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function endsWith($sub, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$sub = $args[0];
			return (STR::mbstrlen($val) === 0 || STR::mbsubstr($val, -STR::mbstrlen($sub)) === $sub);
		}, $message, array($sub));
		return $this;
	}

	/**
	 * Field value equals the pre-assigned value in the rule
	 *
	 * @param 	string 				$value
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function equals($value, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return ((string) $args[0] === (string) $val);
		}, $message, array($value));
		return $this;
	}

	/**
	 * Field value does not match the pre-assigned value in the rule
	 *
	 * @param 	string 				$value
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function equalsNot($value, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return ((string) $args[0] !== (string) $val);
		}, $message, array($value));
		return $this;
	}

	/**
	 * Field name is among pre-assigned field names allowed for processing
	 *
	 * @param 	string|array 		$allowed 			Allowed values.
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function fieldIn($allowed, $message = NULL) {
		if (is_string($allowed)):
			$allowed = preg_split('/\s*,\s*/', $allowed);
		endif;
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return in_array($val, $args[0]);
		}, $message, array($allowed));
		return $this;
	}

	/**
	 * Add a filter callback for the data
	 *
	 * @param 	mixed 				$callback
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function filter($callback) {
		if (is_callable($callback)):
			$this->_filters[] = $callback;
		endif;
		return $this;
	}

	/**
	 * Field must contain a valid float value.
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function float($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return !(filter_var($val, FILTER_VALIDATE_FLOAT) === FALSE);
		}, $message);
		return $this;
	}

	/**
	 * Get all errors.
	 *
	 * @return 	array
	 * @access 	public
	 * @since 	5.0
	 */
	public function getAllErrors($keys = TRUE) {
		return ($keys === TRUE) ? $this->_errors : array_values($this->_errors);
	}

	/**
	 * Get specific error.
	 *
	 * @param 	string 				$field
	 * @return 	string
	 * @access 	public
	 * @since 	5.0
	 */
	public function getError($field) {
		return $this->_errors[$field];
	}

	/**
	 * Get translation messages for client-side validation
	 *
	 * @return 	array
	 * @access 	public
	 * @since 	5.0
	 */
	public function getTranslations() {
		$translations = array();
		foreach (self::$translations as $id => $msg):
			$translations['validate'.ucfirst($id)] = $msg;
		endforeach;
		return $translations;
	}

	/**
	 * Get valid data
	 *
	 * @return 	array
	 * @access 	public
	 * @since 	5.0
	 */
	public function getValidData() {
		return $this->_validData;
	}

	/**
	 * Whether errors have been found.
	 *
	 * @return 	bool
	 * @access 	public
	 * @since 	5.0
	 */
	public function hasErrors() {
		return (count($this->_errors) > 0);
	}

	/**
	 * Enable validation only if a value is not present in one or more fields
	 *
	 * @param 	array|string 		$flds
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ifNotSet($flds = NULL) {
		$this->_ifNotSet = (isset($flds)) ? ARR::trim(ARR::toArray($flds, TRUE)) : TRUE;
		return $this;
	}

	/**
	 * Enable validation only if a specific param is present and equal to the value passed
	 *
	 * @param 	array|string 		$keyval				An array such as the following: array(param => value)
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ifParamIs($keyval = NULL) {
		if (isset($keyval) && is_array($keyval)):
			$this->_ifParamIs = $keyval;
		endif;
		return $this;
	}

	/**
	 * Enable validation only if a specific param is present and not equal to the value passed
	 *
	 * @param 	array|string 		$keyval				An array such as the following: array(param => value)
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ifParamNot($keyval = NULL) {
		if (isset($keyval) && is_array($keyval)):
			$this->_ifParamNot = $keyval;
		endif;
		return $this;
	}

	/**
	 * Enable validation only if a value is present in one or more fields
	 *
	 * @param 	array|string 		$flds
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ifSet($flds = NULL) {
		$this->_ifSet = (isset($flds)) ? ARR::trim(ARR::toArray($flds, TRUE)) : TRUE;
		return $this;
	}

	/**
	 * Field must contain a valid integer value.
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function integer($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return !(filter_var($val, FILTER_VALIDATE_INT) === FALSE);
		}, $message);
		return $this;
	}

	/**
	 * Field has to be valid IP address.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function ip($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return (STR::mbstrlen(trim($val)) === 0 || filter_var($val, FILTER_VALIDATE_IP) !== FALSE);
		}, $message);
		return $this;
	}

	/**
	 * Field has to be X symbols long.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	int 				$len
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function length($len, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return (STR::mbstrlen(trim($val)) == $args[0]);
		}, $message, array($len));
		return $this;
	}

	/**
	 * Field has to be between minlength and maxlength symbols long.
	 *
	 * @param   int 				$minlength
	 * @param   int 				$maxlength
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function lengthBetween($minlength, $maxlength, $message = NULL) {
		$message = (empty($message)) ? $this->_getDefaultMessage(__FUNCTION__, array($minlength, $maxlength)) : NULL;
		$this->lengthMin($minlength, $message)->lengthMax($maxlength, $message);
		return $this;
	}

	/**
	 * Field has to be less than or equal to X symbols long.
	 *
	 * @uses 	STR::mbstrlen()
	 * 
	 * @param 	int 				$len
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function lengthMax($len, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return !(STR::mbstrlen(trim($val)) > $args[0]);
		}, $message, array($len));
		return $this;
	}

	/**
	 * Field has to be greater than or equal to X symbols long.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	int 				$len
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function lengthMin($len, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return !(STR::mbstrlen(trim($val)) < $args[0]);
		}, $message, array($len));
		return $this;
	}

	/**
	 * Field value is the same as another field (password comparison etc).
	 *
	 * @param 	string 				$field
	 * @param 	string 				$label
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function matchesField($field, $label = '', $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return ((string) $args[0] === (string) $val);
		}, $message, array($this->_getVal($field), $label));
		return $this;
	}

	/**
	 * Field value is note the same as another field (prevents duplicate values).
	 *
	 * @param 	string 				$field
	 * @param 	string 				$label
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function matchesNotField($field, $label = '', $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return ((string) $args[0] !== (string) $val);
		}, $message, array($this->_getVal($field), $label));
		return $this;
	}

	/**
	 * Field value matches the specified regular expression string
	 *
	 * @param 	string 				$regexp
	 * @param 	string 				$label
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function matchesRegExp($regexp, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			return (preg_match($args[0], (string) $val));
		}, $message, array($regexp));
		return $this;
	}

	/**
	 * Field must be a number between X and Y.
	 *
	 * @param 	numeric 			$min
	 * @param 	numeric 			$max
	 * @param 	bool 				$include 			Whether to include limit value.
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function numBetween($min, $max, $include = TRUE, $message = NULL) {
		$message = $this->_getDefaultMessage(__FUNCTION__, array($min, $max, $include));
		$this->numMin($min, $include, $message)->numMax($max, $include, $message);
		return $this;
	}

	/**
	 * Field must be a number greater than [or equal to] X.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	numeric 			$limit
	 * @param 	bool 				$include 			Whether to include limit value.
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function numMax($limit, $include = TRUE, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			if (STR::mbstrlen($val) === 0):
				return TRUE;
			endif;

			$val = (float) $val;
			$limit = (float) $args[0];
			$inc = (bool) $args[1];

			return ($val < $limit || ($inc === TRUE && $val === $limit));
		}, $message, array($limit, $include));
		return $this;
	}

	/**
	 * Field must be a number greater than [or equal to] X.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param numeric $limit
	 * @param 	bool 				$include 			Whether to include limit value.
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function numMin($limit, $include = TRUE, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			if (STR::mbstrlen($val) === 0):
				return TRUE;
			endif;

			$val = (float) $val;
			$limit = (float) $args[0];
			$inc = (bool) $args[1];

			return ($val > $limit || ($inc === TRUE && $val === $limit));
		}, $message, array($limit, $include));
		return $this;
	}

	/**
	 * Field must be filled in.
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function required($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			if (is_scalar($val)):
				$val = trim($val);
			endif;
			return !empty($val);
		}, $message);
		return $this;
	}

	/**
	 * Set the data to be validated
	 *
	 * @param 	mixed 				$data
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function setData(array $data) {
		$this->_data = $data;
		return $this;
	}

	/**
	 * Set rule.
	 *
	 * @param 	string 				$rule
	 * @param 	closure 			$function
	 * @param 	string 				$message			Validation results message
	 * @param 	array 				$args
	 * @return 	void
	 * @access 	public
	 * @since 	5.0
	 */
	public function setRule($rule, $function, $message = '', $args = array()) {
		if (!array_key_exists($rule, $this->_rules)):
			$this->_rules[$rule] = TRUE;
			if (!array_key_exists($rule, $this->_functions)):
				if (!is_callable($function)):
					die('Invalid function for rule: '.$rule);
				endif;
				$this->_functions[$rule] = $function;
			endif;
			$this->_arguments[$rule] = $args; // Specific arguments for rule
			$this->_messages[$rule] = (empty($message)) ? $this->_getDefaultMessage($rule, $args) : $message;
		endif;
	}

	/**
	 * Field must NOT start with a specific substring.
	 *
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbsubstr()
	 *
	 * @param 	string 				$sub
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function startsNotWith($sub, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$sub = $args[0];
			return (STR::mbstrlen($val) === 0 || STR::mbsubstr($val, 0, STR::mbstrlen($sub)) !== $sub);
		}, $message, array($sub));
		return $this;
	}

	/**
	 * Field must start with a specific substring.
	 *
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbsubstr()
	 * 
	 * @param 	string 				$sub
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function startsWith($sub, $message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val, $args) {
			$sub = $args[0];
			return (STR::mbstrlen($val) === 0 || STR::mbsubstr($val, 0, STR::mbstrlen($sub)) === $sub);
		}, $message, array($sub));
		return $this;
	}

	/**
	 * Generates a set of HTML fields with optional form to use for testing rules.
	 * Any new rules added to this class will need to be added to the $_allrules
	 * array above to be included in testing.
	 *
	 * @uses 	STR::mbstrtolower()
	 *
	 * @param 	boolean				$form				Whether fields are wrapped in a form (TRUE) or not (FALSE)
	 * @return 	string									Returns the HTML string of testing form and fields
	 * @access 	public
	 * @since 	5.0
	 */
	public function testFields($form = TRUE) {
		$output = '';
		foreach ($this->_allrules as $rule => $args):
			$args = array_merge(array($rule => $args), array('required' => TRUE));
			$output .=
				H::text(array(
					'id' => 'validator_rule_testing_field_'.STR::mbstrtolower($rule), 
					'label' => 'Validate '.ucfirst($rule), 
					'placeholder' => 'Criteria: '.json_encode($args),
					'validate' => $args, 
				))
			;
		endforeach;
		if ($form):
			$output = H::form($output);
		endif;
		return $output;
	}

	/**
	 * Field has to be valid internet address.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param 	string 				$message			Validation results message
	 * @return 	object									Returns an object of this class type
	 * @access 	public
	 * @since 	5.0
	 */
	public function url($message = NULL) {
		$this->setRule(__FUNCTION__, function($key, $val) {
			return (STR::mbstrlen(trim($val)) === 0 || filter_var($val, FILTER_VALIDATE_URL) !== FALSE);
		}, $message);
		return $this;
	}

	/**
	 * Validate
	 *
	 * @param 	string 				$key
	 * @param 	string 				$label
	 * @param	boolean				$recursive
	 * @return 	bool
	 * @access 	public
	 * @since 	5.0
	 */
	public function validate($key, $label = '', $recursive = FALSE) {
		$params = $this->_params;
		$validate = TRUE;
		if ($this->_ifSet !== FALSE):
			$validate = FALSE;
			$flds = (is_array($this->_ifSet)) ? $this->_ifSet : array($key);
			foreach ($flds as $fld):
				if (!empty($this->_data[$fld])):
					$validate = TRUE;
					break;
				endif;
			endforeach;
		endif;
		if ($this->_ifNotSet !== FALSE):
			$flds = (is_array($this->_ifNotSet)) ? $this->_ifNotSet : array($key);
			foreach ($flds as $fld):
				if (!empty($this->_data[$fld])):
					$validate = FALSE;
					break;
				endif;
			endforeach;
		endif;
		if ($this->_ifParamIs !== FALSE):
			$validate = FALSE;
			foreach ($this->_ifParamIs as $key => $vals):
				if (isset($params[$key])):
					$vals = ARR::toArray($vals, TRUE);
					foreach ($vals as $val):
						if ($params[$key] == $val):
							$validate = TRUE;
							break 2;
						endif;
					endforeach;
				endif;
			endforeach;
		endif;
		if ($this->_ifParamNot !== FALSE):
			$validate = FALSE;
			foreach ($this->_ifParamNot as $key => $vals):
				if (!isset($params[$key])):
					$validate = TRUE;
					break;
				elseif (isset($params[$key])):
					$vals = ARR::toArray($vals, TRUE);
					foreach ($vals as $val):
						if ($params[$key] == $val):
							$validate = FALSE;
							break 2;
						endif;
					endforeach;
				endif;
			endforeach;
		endif;
		if ($validate):
			// set up field name for error message
			$this->_fields[$key] = (empty($label)) ? 'The field named "'.$key.'"' : $label;
	
			// apply filters to the data
			$this->_applyFilters($key);
	
			$val = $this->_getVal($key);
	
			// validate the piece of data
			$this->_validate($key, $val, $recursive);
		endif;
		// reset rules
		$this->_reset();
		return (isset($val)) ? $val : NULL;
	}

	/**
	 * Validate if a value is not present in one or more fields
	 *
	 * @param 	string 				$key
	 * @param 	string 				$label
	 * @param	boolean				$recursive
	 * @return 	bool
	 * @access 	public
	 * @since 	5.0
	 */
	public function validateIfNotSet($key = NULL, $label = '', $recursive = FALSE) {
		return $this->ifNotSet()->validate($key, $label, $recursive);
	}

	/**
	 * Validate if a value is present in one or more fields
	 *
	 * @param 	string 				$key
	 * @param 	string 				$label
	 * @param	boolean				$recursive
	 * @return 	bool
	 * @access 	public
	 * @since 	5.0
	 */
	public function validateIfSet($key = NULL, $label = '', $recursive = FALSE) {
		return $this->ifSet()->validate($key, $label, $recursive);
	}

}

/**
 * Form validation exception handler
 *
 * @package		OriginCMS
 * @subpackage	Cores
 * @author 		Tasos Bekos <tbekos@gmail.com>
 * @author 		Chris Gutierrez <cdotgutierrez@gmail.com>
 * @author 		Corey Ballou <ballouc@gmail.com>
 * @author		Jeff Todnem
 * @since 		5.0  
 */ 
class ValidatorException extends \Exception {
	
    protected $_errors = array();
    
    public function __construct($message, array $errors = array()) {
        parent::__construct($message);
        $this->_errors = $errors;
    }
    
    public function getErrors() {
        return $this->_errors;
    }
	
}
