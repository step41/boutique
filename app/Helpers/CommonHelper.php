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
 * Common Helper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class CommonHelper {  

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	public function __construct() {

	}
		
	/**
	 * Checks current client browser version
	 *
	 * @uses 	STR::mbstripos()
	 * @uses 	STR::mbstrpos()
	 *
	 * @return	string|boolean					Returns the name of the current browser or FALSE if unknown
	 * @access	public
	 * @since	5.0
	 */
	public function browser() {
		$browser = FALSE;
		if (isset($_SERVER['HTTP_USER_AGENT'])):
			$ua = $_SERVER['HTTP_USER_AGENT'];
			if (STR::mbstrpos($ua, 'Lynx') !== FALSE):
				$browser = 'lynx';
			elseif (STR::mbstripos($ua, 'chrome') !== FALSE):
				$browser = 'chrome';
			elseif (STR::mbstripos($ua, 'safari') !== FALSE):
				$browser = 'safari';
			elseif ((STR::mbstrpos($ua, 'MSIE') !== FALSE || STR::mbstrpos($ua, 'Trident') !== FALSE) && STR::mbstrpos($ua, 'Win') !== FALSE):
				$browser = 'ieWin';
			elseif (STR::mbstrpos($ua, 'MSIE') !== FALSE && STR::mbstrpos($ua, 'Mac') !== FALSE):
				$browser = 'ieMac';
			elseif (STR::mbstrpos($ua, 'Gecko') !== FALSE):
				$browser = 'gecko';
			elseif (STR::mbstrpos($ua, 'Opera') !== FALSE):
				$browser = 'opera';
			elseif (STR::mbstrpos($ua, 'Nav') !== FALSE && STR::mbstrpos($ua, 'Mozilla/4.') !== FALSE):
				$browser = 'netscape4';
			endif;
		endif;
		return $browser;
	}
	
	/**
	 * Verify that a function is callable
	 *
	 * Executes a function_exists() check, and if the Suhosin PHP
	 * extension is loaded - checks whether the function that is
	 * checked might be disabled in there as well.
	 *
	 * @param	string	$function	Function to verify
	 * @return	bool	TRUE if the function exists and is safe to call, otherwise FALSE
	 * @access	public
	 * @since	5.0
	 */
	public function canUseFunction($function = NULL) {
		static $_suhosinFunctionBlacklist;
		if (isset($function) && function_exists($function)):
			if (!isset($_suhosinFunctionBlacklist)):
				if (extension_loaded('suhosin')):
					$_suhosinFunctionBlacklist = explode(',', trim(@ini_get('suhosin.executor.func.blacklist')));
					if (!in_array('eval', $_suhosinFunctionBlacklist, TRUE) && @ini_get('suhosin.executor.disable_eval')):
						$_suhosinFunctionBlacklist[] = 'eval';
					endif;
				else:
					$_suhosinFunctionBlacklist = array();
				endif;
			endif;
			return !in_array($function, $_suhosinFunctionBlacklist, TRUE);
		endif;
		return FALSE;
	}

	/** 
	 * Verify that a method exists within a class and is publicly available
	 * 
	 * @param	string	$class			Name of the class to be validated
	 * @param	string	$method			The name of the method within the class to be verified
	 * @return 	bool					Returns TRUE if method exists, otherwise FALSE.
	 * @access 	public
	 * @since 	5.0
	 */
	public function canUseMethod($class = NULL, $method = NULL) {
		$cu = (isset($class));
		if (!$cu):
			Log::warning(sprintf(T::_('The method %s() failed because the $class argument is NULL'), __METHOD__));
		endif;
		$cu = ($cu && $class); 
		if (!$cu):
			Log::warning(sprintf(T::_('The method %s() failed because the $class argument is set but has no value'), __METHOD__));
		endif;
		$cu = ($cu && isset($method)); 
		$className = $this->classNamespaceRemoved($class);
		if (!$cu):
			Log::warning(sprintf(T::_('The method %s() failed because the $method argument is NULL'), __METHOD__));
		endif;
		$cu = ($cu && $method); 
		if (!$cu):
			Log::warning(sprintf(T::_('The method %s() failed because the $method argument is set but has no value'), __METHOD__));
		endif;
		$cu = ($cu && (strncmp($method, '__', 1) === 0 || strncmp($method, '_', 1) !== 0));
		$methodName = $method;
		if (!$cu):
			Log::warning(sprintf(T::_('The method %s() failed because the method \'%s\' appears to be private or protected'), __METHOD__, $methodName));
		endif;
		$cu = ($cu && is_array($methods = get_class_methods($class)) && in_array(STR::mbstrtolower($method), array_map('STR::mbstrtolower', $methods))); 
		if (!$cu):
			//Log::warning(sprintf(T::_('The method %s() failed because the method \'%s\' does not exist within the \'%s\' class'), __METHOD__, $methodName, $className));
		endif;
		return $cu;
	}

	/** 
	 * Function used to extract the individual methods of a class
	 *
	 * @uses 	STR::mbstrtoupper()
	 *
	 * @param	mixed		$class			Fully-namespaced class name or instantiated class object
	 * @param	array		$options		One or more arguments passed as optional parameters
	 * @return 	void
	 * @since 	5.0
	 */
	public function classMethods($class = NULL, $options = array()) {
		$defaults = array('showargs' => TRUE, 'showprivate' => FALSE);
		$options = (isset($options) && is_array($options)) ? array_merge($defaults, $options) : $defaults;
		extract($options);
		$methods = array();
		if (isset($class) && (is_string($class) || is_object($class))):
			$name = (is_string($class)) ? $class : get_class($class);
			//Log::debug('...Now listing class methods for class: '.$class);
			$methodsTemp = get_class_methods($class);
			if (is_array($methodsTemp)):
				sort($methodsTemp);
				foreach ($methodsTemp as $method):
					if ($showprivate === TRUE || strncmp($method, '_', 1) !== 0):
						if ($showargs):
							$arguments = '';
							$ref = new \ReflectionMethod($class, $method);
							$args = $ref->getParameters();
							foreach ($args as $arg):
								// $param is an instance of ReflectionParameter
								$argname = $arg->getName();
								$argopt = $arg->isOptional();
								$argdef = ($arg->isDefaultValueAvailable()) ? $arg->getDefaultValue() : '';
								$argdef = (is_string($argdef)) ? $argdef : STR::mbstrtoupper(gettype($argdef));
								$bb = ($argopt) ? '[' : '';
								$be = ($argopt) ? ']' : '';
								$arguments .= ($arguments) ? ', ' : '';
								$arguments .= $argname;
								$arguments .= ($argdef) ? ' = '.$argdef : '';
							endforeach;
						endif;
						$methods[$name][$method] = $method.' ( '.$arguments.' )';
						//Log::debug('class method: '.$method.' ( '.$arguments.' )');
					endif;
				endforeach;
			endif;
		endif;
		return $methods; 	
	}
	
	/** 
	 * Function used to extract the individual class name from a namespace path
	 *
	 * @param	string		$namespace		Class namespace string
	 * @return 	void
	 * @since 	5.0
	 */
	public function classNamespaceRemoved($namespace = '') {
		$arrNamespaceParts = explode('\\',$namespace);
		return end($arrNamespaceParts); 	
	}
	
	/** 
	 * Rebuild the autoload class map via composer
	 *
	 * @return	null
	 * @access 	public 
	 * @since	5.0
	 */
	public function composerDumpAutoload() {
		Log::debug('Rebuilding composer class auto-loader file now...');
		exec('export COMPOSER_HOME=/var/www/html/myboutique.loc && cd /var/www/html/myboutique.loc && composer dump-autoload -o;');
	}
	
	/** 
	 * Function used to extract one or more email addresses from a string value
	 *
	 * @param	string		$value			String value to parse for email addresses
	 * @return 	void
	 * @since 	5.0
	 */
	public function extractEmail($value = NULL) {
		$emails = array();
		if (isset($value) && is_string($value)):
			$value = str_replace('<', ' ', $value);
			$value = str_replace('>', ' ', $value);
			$value = str_replace("\r\n", ' ', $value);
			$value = str_replace("\n", ' ', $value);
			$value = trim($value);
			$tokens = preg_split('/ /', $value);
			foreach ($tokens as $token):
				$email = filter_var($token, FILTER_VALIDATE_EMAIL);
				if ($email !== FALSE): 
					$emails[] = $email;
				endif;
			endforeach;
		endif;
		return $emails;
	}
	
	/**
	 * NOTE!! You can't use a function to check if a variable exists without it being initialized 
	 * in the process of passing it to the function as an argument. So this method is only good in
	 * theory. I had hoped to use it to test for a variety of common object types and evaluate 
	 * whether their respective states qualified for a state of existence. But PHP does not allow
	 * for this. Leaving it here for legacy purposes only. :(
	 *
	 * @param 	mixed		$value		The item to be evaluated
	 * @return 	boolean					TRUE if eval is successful, FALSE otherwise.
	 * @access 	public
	 * @since 	5.0
	 */
	public function is($value = NULL) {
		return (
			isset($value) && 
			(
				is_bool($value) || 
				is_numeric(trim($value)) || 
				(is_string(trim($value)) && trim($value)) || 
				(is_array($value) && $af = array_filter($value) && !isset($af))
			)
		) ? TRUE : FALSE;
	}
	
	/**
	 * Is ajax Request?
	 *
	 * Test to see if a request contains the HTTP_X_REQUESTED_WITH header
	 *
	 * @uses 	STR::mbstrtolower()
	 *
	 * @return 	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isAjaxRequest() {
		return (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && STR::mbstrtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
	}

	/**
	 * Is CGI Request
	 *
	 * Test to see if a request was via Common Gateway Interface.
	 * 
	 * @uses 	STR::mbsubstr()
	 *
	 * @return 	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isCGI() {
		return (STR::mbsubstr(php_sapi_name(), 0, 3) == 'cgi');
	}
	
	/**
	 * Is CLI Request
	 *
	 * Test to see if a request was made from the command line.
	 *
	 * @return 	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isCLI() {
		return (PHP_SAPI === 'cli' || defined('STDIN'));
	}
	
	/**
	 * Is FastCGI
	 *
	 * Test to see if FastCGI is enabled on the server
	 *
	 * @uses 	REQ::phpinfoToArray()
	 *
	 * @return 	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isFastCgi() {
		$phpinfo = REQ::phpinfoToArray();
		$configure = (isset($phpinfo['general']['configure_command'])) ? $phpinfo['general']['configure_command'] : NULL;
		return ($configure && preg_match('/--enable-fastcgi/', $configure));
	}
	
	/**
	 * Is Function
	 *
	 * Test to see if value passed is a callable function
	 *
	 * @return 	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isFunction($value = NULL) {
		return (isset($value) && (is_string($value) && function_exists($value)) || (is_object($value) && ($value instanceof \Closure)));
	}

	/**
	 * Is HTTPS?
	 *
	 * Determines if the application is accessed via an encrypted
	 * (HTTPS) connection.
	 *
	 * @uses 	STR::mbstrtolower()
	 *
	 * @return	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isHTTPS() {
		if (!empty($_SERVER['HTTPS']) && STR::mbstrtolower($_SERVER['HTTPS']) !== 'off'):
			return TRUE;
		elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https'):
			return TRUE;
		elseif (!empty($_SERVER['HTTP_FRONT_END_HTTPS']) && STR::mbstrtolower($_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off'):
			return TRUE;
		endif;
		return FALSE;
	}
	
	/**
	 * Is mobile
	 *
	 * Determines if the application is accessed via a mobile device based
	 * on the User Agent string provided.
	 *
	 * @uses 	STR::mbstrpos()
	 *
	 * @return	boolean
	 * @access 	public
	 * @since 	5.0
	 */
	public function isMobile() {
		static $isMobile;
		if (isset($isMobile)):
			return $isMobile;
		endif;
		$isMobile = FALSE;
		if (!empty($_SERVER['HTTP_USER_AGENT'])):
			$uaStrings = array('Mobile', 'Android', 'Silk/', 'Kindle', 'BlackBerry', 'Opera Mini', 'Opera Mobi');
			foreach ($uaStrings as $uaString):
				if (STR::mbstrpos($_SERVER['HTTP_USER_AGENT'], $uaString) !== FALSE):
					$isMobile = TRUE;
					break;
				endif; 
			endforeach;
		endif;
		return $isMobile;
	}

	/**
	 * Determines if the current version of PHP is greater then the supplied value
	 *
	 * Since there are a few places where we conditionally test for PHP > 5
	 * we'll set a variable.
	 *
	 * @param	string
	 * @return	bool	TRUE if the current version is $version or higher
	 * @access 	public
	 * @since 	5.0
	 */
	public function isPHP($version = '5.3.0') {
		$_isPHP;
		$version = (string)$version;
		if (empty($_isPHP[$version])):
			$_isPHP[$version] = (version_compare(PHP_VERSION, $version) < 0) ? FALSE : TRUE;
		endif;
		return $_isPHP[$version];
	}
	
	/**
	 * Determines if the string value passed is a valid regular expression.
	 *
	 * @param	string			$value			The regexp to be evaluated
	 * @return	bool							TRUE if criteria is met, otherwise FALSE
	 * @access 	public
	 * @since 	5.0
	 */
	public function isRegExp($value = NULL) {
		if (isset($value) && is_string($value)):
			return (@preg_match('~'.$value.'~', NULL) !== FALSE);
		endif;
		return FALSE;
	}
	
	/**
	 * Determines if the current incoming request is a standard page load or refresh 
	 * via web browser or crawler. We are trying to eliminate ajax requests and requests 
	 * for external files such as javascript and css files.
	 *
	 * @uses 	STR::mbstrtoupper()
	 *
	 * @return	bool		TRUE if criteria is met, otherwise FALSE
	 * @access 	public
	 * @since 	5.0
	 */
	public function isStandardPageLoad() {
		return (
			STR::mbstrtoupper($_SERVER['REQUEST_METHOD']) === 'GET' 
			&& !isset($_GET['file']) 
			&& !$this->isAjaxRequest() 
		);
	}
	
	/**
	 * Determines if the specified e-mail address is valid or not.
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @return	bool		TRUE if criteria is met, otherwise FALSE
	 * @access 	public
	 * @since 	5.0
	 */
	public function isValidEmail($email, $checkDNS = FALSE) {
		
		$valid = (
				/* Preference for native version of function */
				function_exists('filter_var') && filter_var($email, FILTER_VALIDATE_EMAIL) !== FALSE
				) || (
					/* The maximum length of an e-mail address is 320 octets, per RFC 2821. */
					STR::mbstrlen($email) <= 320
					/*
					 * The regex below is based on a regex by Michael Rushton.
					 * However, it is not identical. I changed it to only consider routeable
					 * addresses as valid. Michael's regex considers a@b a valid address
					 * which conflicts with section 2.3.5 of RFC 5321 which states that:
					 *
					 * Only resolvable, fully-qualified domain names (FQDNs) are permitted
					 * when domain names are used in SMTP. In other words, names that can
					 * be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed
					 * in Section 5) are permitted, as are CNAME RRs whose targets can be
					 * resolved, in turn, to MX or address RRs. Local nicknames or
					 * unqualified names MUST NOT be used.
					 *
					 * This regex does not handle comments and folding whitespace. While
					 * this is technically valid in an email address, these parts aren't
					 * actually part of the address itself.
					 */
					and preg_match_all(
						'/^(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?))'.
						'{255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?))'.
						'{65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|'.
						'(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))'.
						'(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|'.
						'(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|'.
						'(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})'.
						'(?:(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.){1,126})'.'{1,}'.
						'(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-+[a-z0-9]+)*)|'.
						'(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|'.
						'(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::'.
						'(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|'.
						'(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|'.
						'(?:(?!(?:.*[a-f0-9]:){5,})'.'(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::'.
						'(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|'.
						'(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|'.
						'(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))$/iD',
						$email)
				);
	
		if ($valid):
			if ($checkDNS && ($domain = end(explode('@',$email, 2)))):
				/*
				Note:
				Adding the dot enforces the root.
				The dot is sometimes necessary if you are searching for a fully qualified domain
				which has the same name as a host on your local domain.
				Of course the dot does not alter results that were OK anyway.
				*/
				return checkdnsrr($domain . '.', 'MX');
			endif;
			return TRUE;
		endif;
		return FALSE;
		
	}

	/**
	 * Determines if the specified URL is valid or not.
	 *
	 * @uses 	STR::mbstrpos()
	 *
	 * @return	bool		TRUE if criteria is met, otherwise FALSE
	 * @access 	public
	 * @since 	5.0
	 */
	public function isValidURL($url) {
		$url = STR::mbstrpos($url, 'http') !== 0 ? "http://$url" : $url;
		return (filter_var($url, FILTER_VALIDATE_URL) !== FALSE);
	}
		
	/**
	 * Determines if the current operating system is Microsoft Windows
	 * 
	 * @uses 	STR::mbstrtoupper()
	 * @uses 	STR::mbsubstr()
	 *
	 * @return	bool		TRUE if OS == Windows
	 * @access 	public
	 * @since 	5.0
	 */
	public function isWindows() {
		return (STR::mbstrtoupper(STR::mbsubstr(PHP_OS, 0,3)) == 'WIN');
	}

	/**
	 * Converts a pixel measurement to inches, cm and mm
	 * 
	 * The CSS spec defines 1px as 1/96in and notes that it is (or should be) device-independent 
	 * Inch to millimeter conversion is 1in = 2.54cm and 1in = 25.4mm
	 * From a pixel measurement, we can then convert to provide translated measurements for inches and mm
	 *
	 * @return	array		Returns an array including resulting conversions
	 * @access 	public
	 * @since 	5.0
	 */
	public function pixelsToUnits($value = NULL, $precision = 3, $unit = NULL) {
		$conversions = ['px' => '', 'in' => '', 'cm' => '', 'mm' => ''];
		if (!empty($value)):
			$conversions['px'] = floatval($value);
			$conversions['in'] = number_format(floatval(floatval($value) * (1/96)), $precision);
			$conversions['cm'] = number_format(floatval(floatval($value) * (1/96) * 2.54), $precision);
			$conversions['mm'] = number_format(floatval(floatval($value) * (1/96) * 2.54 * 10), $precision);
		endif;
		return (!empty($unit)) ? $conversions[$unit] : $conversions;
	}
	
	/**
	 * Determines the current web server version
	 * 
	 * @uses 	STR::mbstrpos()
	 *
	 * @return	string|boolean			Returns the name of the current web server or FALSE if unknown
	 * @access	public
	 * @since	5.0
	 */
	public function server() {
		$server = FALSE;
		if (isset($_SERVER['SERVER_SOFTWARE'])):
			$ss = $_SERVER['SERVER_SOFTWARE'];
			if (STR::mbstrpos($ss, 'Apache') !== FALSE || STR::mbstrpos($ss, 'LiteSpeed') !== FALSE):
				$server = 'apache';
			elseif (STR::mbstrpos($ss, 'nginx') !== FALSE):
				$server = 'nginx';
			elseif (STR::mbstrpos($ss, 'Microsoft-IIS') !== FALSE):
				$server = 'iis';
				if (intval(STR::mbsubstr($ss, STR::mbstrpos($ss, 'Microsoft-IIS/') + 14)) >= 7):
					$server = 'iis7';
				endif;
			endif;
		endif;
		return $server;
	}

	/** 
	 * Verify a static slug exists for item and that it matches value provided
	 * 
	 * @param	object	$item			Object item to parse for slug_static property
	 * @param	string	$match			String value to match against object->slug_static property value
	 * @return 	bool					Returns TRUE if property exists and matches value, otherwise FALSE.
	 * @access 	public
	 * @since 	5.0
	 */
	public function staticSlugMatch($item = NULL, $match = NULL) {
		$staticSlug = FALSE;
		if (!empty($item) && !empty($match)): 
			if (is_object($item) && !empty($item->slug_static)): 
				$staticSlug = $item['slug_static'];
			elseif (is_array($item) && !empty($item['slug_static'])): 
				$staticSlug = $item['slug_static'];
			endif;
			return (!empty($staticSlug) && ($staticSlug === $match));  
		endif;
		return FALSE;
	}

}

