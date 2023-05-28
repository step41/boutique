<?php 

namespace App\Helpers;

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
 * UTFLib UTF-8 Class
 * 
 * General UTF8 class for dealing with UTF-8 processing of strings.
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class UTFHelper {

	/**
	 * Constructor
	 *
	 * @uses	Log::classInit()
	 *
	 * @param	object		Application instance
	 * @return	void
	 */
	public function __construct() {
		if (!defined('UTF8_ENABLED') && !defined('MB_ENABLED')):
			$this->initLib();
		endif;
	}
	
	/**
	 * Clean UTF-8 strings
	 *
	 * Ensures strings are UTF-8
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function cleanString($str) {
		if ($this->isASCII($str) === FALSE):
			$str = @iconv('UTF-8', 'UTF-8//IGNORE', $str);
		endif;
		return $str;
	}

	/**
	 * Convert to UTF-8
	 *
	 * Attempts to convert a string to UTF-8
	 *
	 * @access	public
	 * @param	string
	 * @param	string	- input encoding
	 * @return	string
	 */
	public function convertToUTF8($str, $encoding) {
		if (function_exists('iconv')):
			$str = @iconv($encoding, 'UTF-8', $str);
		elseif (MB_ENABLED === TRUE):
			return @mb_convert_encoding($str, 'UTF-8', $encoding);
		endif;
		return FALSE;
	}

	/**
	 * Initializes the UTFLib and determines if UTF-8 support is to be enabled.
	 * This method sets internal encoding for multibyte string functions if necessary
	 * and sets a flag so we don't have to repeatedly use extension_loaded() or 
	 * function_exists().
	 *
	 * @uses 	PRM::get()
	 * 
	 * @access	public
	 * @return	string
	 * @since	5.0
	 */
	public function initLib($charset = 'UTF-8') {
		if (!defined('MB_ENABLED')):
			if (extension_loaded('mbstring')):
				define('MB_ENABLED', TRUE);
				mb_internal_encoding($charset);
			else:
				define('MB_ENABLED', FALSE);
			endif;
		endif;
		if (!defined('UTF8_ENABLED')):
			if (
				defined('PREG_BAD_UTF8_ERROR')	// PCRE must support UTF-8
				&& function_exists('iconv')		// iconv must be installed
				&& MB_ENABLED === TRUE			// mbstring must be enabled
				&& $charset === 'UTF-8'			// Application charset must be UTF-8
			):
				define('UTF8_ENABLED', TRUE);
				Log::debug('UTF8 Support Enabled');
			else:
				define('UTF8_ENABLED', FALSE);
				Log::debug('UTF8 Support Disabled');
			endif;
		endif;
	}

	/**
	 * Is ASCII?
	 *
	 * Tests if a string is standard 7-bit ASCII or not
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function isASCII($str) {
		return (preg_match('/[^\x00-\x7F]/S', $str) === 0);
	}
	
	/**
	 * Remove ASCII control characters
	 *
	 * Removes all ASCII control characters except horizontal tabs,
	 * line feeds, and carriage returns, as all others can cause
	 * problems in XML
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function safeASCII($str) {
		return STR::removeInvisibleChars($str, FALSE);
	}

}

