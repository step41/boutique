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
 * Message Helper Class
 *
 * The Message class is responsible for tracking informational, warning and error messages
 * between the back-end server execution and the front-end client display. This allows
 * the end user to see application-specific messages that may be pertinent to their
 * current activity. 
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		5.0  
 */
class MessageHelper { 

	/**
	 * Holds one or more messages
	 *
	 * @var array
	 */
	protected static $_messages = array();

	/**
	 * Array of valid message types
	 *
	 * @var array
	 */
	protected $_messageTypes = array('danger', 'warning', 'info', 'success', 'validation');

	/**
	 * Constructor
	 *
	 * @uses 	Log::classInit()
	 *
	 * @return	void
	 */
	public function __construct() {

	}

	/**
	 * Append the current message registry with one or more new entries
	 *
	 * @param	string			$type		Message type. Options:(danger|info|success|validation|warning)
	 * @param	string|array	$value		Message value to assign. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function add($type = 'info', $value = NULL) {
		if (isset($value)):
			if (is_string($value)):
				$value = array('text' => $value);
			endif;
			self::$_messages[$type][] = $value;
			$messages = array('messages' => self::$_messages);
			header('Boutique-Messages: '.json_encode($messages));
		endif;
	}
	
 	/**
	 * Clear and reset the message registry
	 *
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function clr() {
		self::$_messages = array();
	}
	
  	/**
	 * Add informational message to message registry
	 *
	 * @param	string|array	$value		Message value to assign. 
	 * @param	int				$code		HTTP status code. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function danger($value = NULL, $code = NULL) {
		$this->add(__FUNCTION__, $value, $code);
	}
	
  	/**
	 * Retrieve registered messages
	 *
	 * @return	array						Returns an array of messages set during application execution.
	 * @access	public
	 * @since	5.0
	 */
	public function get() {
		return self::$_messages;
	}
	
  	/**
	 * Add informational message to message registry
	 *
	 * @param	string|array	$value		Message value to assign. 
	 * @param	int				$code		HTTP status code. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function info($value = NULL, $code = NULL) {
		$this->add(__FUNCTION__, $value, $code);
	}
	
  	/**
	 * Add success message to message registry
	 *
	 * @param	string|array	$value		Message value to assign. 
	 * @param	int				$code		HTTP status code. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function success($value = NULL, $code = NULL) {
		$this->add(__FUNCTION__, $value, $code);
	}
	
  	/**
	 * Add validation message to message registry
	 *
	 * @param	string|array	$value		Message value to assign. 
	 * @param	int				$code		HTTP status code. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function validation($value = NULL, $code = NULL) {
		$this->add(__FUNCTION__, $value, $code);
	}
	
  	/**
	 * Add warning message to message registry
	 *
	 * @param	string|array	$value		Message value to assign. 
	 * @param	int				$code		HTTP status code. 
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function warning($value = NULL, $code = NULL) {
		$this->add(__FUNCTION__, $value, $code);
	}
		
}
