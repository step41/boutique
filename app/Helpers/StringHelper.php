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
 * String Manipulation and Generation Helper Class
 *
 * With regards to multibyte compatibility, the majority of standard string functions
 * in PHP have been replicated below using wrapper methods to allow for backwards
 * compatibility (no multibyte support). Since we currently have complete control over
 * the environment, multibyte support is enabled and most functions in the app and
 * framework are using the multibyte version. In the event that multibyte support was
 * ever unavailable, there are a few straggler native calls to mb_* that would need
 * to be replaced with their non-multibyte equivalents. This was necessary to prevent
 * circular logic in the classes that are loaded at the very beginning during the
 * framework instantiation. Unfortunately, PHP's native support for function overloading
 * was reputed to be very buggy and troublesome and is now officially deprecated in 
 * PHP version 7+. So we opted to use the wrapper methods below instead. For more 
 * details on PHP multibyte string functions and overloading see the link below.
 *
 * @link 		http://php.net/manual/en/mbstring.overload.php
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		5.0  
 */
class StringHelper {  

	/**
	 * Pattern matching string for formatting SQL queries
	 *
	 * @var string
	 */
	public $matchSqlRes = '/(.*?)(DESCRIBE|SHOW|SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|\s+AS|\s+FROM|\s+WHERE|\s+(RIGHT|LEFT)\s*(INNER|OUTER)\s*JOIN|\s+ON|\s+LIMIT|\s+ORDER BY|\s+INTO|\s+SET|\s+VALUES)\s+(.*?)/';
	
	/**
	 * Pattern matching string for formatting SQL queries
	 *
	 * @var string
	 */
	public $matchSqlOps = '/(^|\s+|\(|\[|,|<|>|.+?)(\([0-9]+\)|=[0-9]+|&&|!|\|\||<=>|\(\)|<<|%|!=|\+|>>|\*)($|\s+|\(|\)|\[|\]|,|<|>|=)/'; 
	
	/**
	 * Pattern matching string for formatting SQL queries
	 *
	 * @var string
	 */
	public $matchSqlActs = '/(^|\s+|\(|\[|,|<|>)(CREATE|DELETE|DROP|INSERT|SELECT|UPDATE)($|\s+|\(|\)|\[|\]|,|<|>|=)/';
	
	/**
	 * Pattern matching string for formatting SQL queries
	 *
	 * @var string
	 */
	public $matchSqlCons = '/(^|\s+|\(|\[|,|<|>|=)(AND|AS|ASC|ASCII|AUTO_INCREMENT|AVG|BETWEEN|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BTREE|CASE|CHAR|CHARSET|CHECKSUM|COALESCE|COLLATION|COMMENT|COMPACT|CONVERT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|DATABASE|DATE|DATETIME|DAY|DAYOFMONTH|DAYOFWEEK|DAYOFYEAR|DECIMAL|DEFAULT|DELAY_KEY_WRITE|DESC|DISTINCT|DIV|DOUBLE|DYNAMIC|ELSE|ELT|ENGINE|ENUM|FIXED|FLOAT|FOREIGN KEY|FOREIGN|FROM|GET_FORMAT|HOUR|IF|IN|INNER|INT|INTO|IS|INNODB|JOIN|KEY|LAST_INSERT_ID|LEFT|LENGTH|LIKE|LIMIT|LOCALTIME|LOCALTIMESTAMP|LONGBLOB|LONGTEXT|MATCH|MAX_ROWS|MEDIUMBLOB|MEDIUMINT|MEDIUMTEXT|MEMORY|MICROSECOND|MINUTE|MOD|MONTH|MONTHNAME|MYISAM|NOT|NULL|NUMERIC|OFFSET|OLD_PASSWORD|ON|OR|ORDER BY|OUTER|PASSWORD|PRIMARY KEY|PRIMARY|PRIVILEGES|QUARTER|REAL|REFERENCES|REGEXP|REPEAT|REPLACE|RESTRICT|RIGHT|RLIKE|ROW_FORMAT|SCHEMA|SECOND|SET|SMALLINT|TABLE|TEXT|THEN|TIME|TIMESTAMP|TIMESTAMPADD|TIMESTAMPDIFF|TINYBLOB|TINYINT|TINYTEXT|TRUNCATE|TYPE|USER|USING|UTC_DATE|UTC_TIME|UTC_TIMESTAMP|VALUES|VARBINARY|VARCHAR|VIEW|WEEK|WHEN|WHERE|XOR|YEAR)($|\s+|\(|\)|\[|\]|,|<|>|=)/'; 
	
	/**
	 * Pattern matching string for formatting SQL queries
	 *
	 * @var string
	 */
	public $matchSqlMods = '/(^|\s+|\(|\[|,|<|>)(ABS|ACOS|ADDDATE|ADDTIME|AES_DECRYPT|AES_ENCRYPT|ASIN|ATAN|ATAN2|BIN|BIT_AND|BIT_LENGTH|BIT_OR|BIT_XOR|CAST|CEIL|CEILING|CHARACTER_LENGTH|CHAR_LENGTH|COERCIBILITY|COMPRESS|CONCAT|CONCAT_WS|CONNECTION_ID|CONV|CONVERT_TZ|COS|COT|COUNT|CRC32|CURDATE|CURTIME|DATEDIFF|DATE_ADD|DATE_FORMAT|DATE_SUB|DAYNAME|DECODE|DEGREES|DES_DECRYPT|DES_ENCRYPT|ENCODE|ENCRYPT|EXPORT_SET|EXP\(\)|EXTRACT|FIELD|FIND_IN_SET|FLOOR|FORMAT|FOUND_ROWS|FROM_DAYS|FROM_UNIXTIME|GET_LOCK|GREATEST|GROUP_CONCAT|HEX|IFNULL|INET_ATON|INET_NTOA|INSTR|ISNULL|IS_FREE_LOCK|IS_USED_LOCK|LAST_DAY|LCASE|LEAST|LN|LOAD_FILE|LOCATE|LOG|LOG10|LOG2|LOWER|LPAD|LTRIM|MAKEDATE|MAKETIME|MAKE_SET|MASTER_POS_WAIT|MAX|MD5|MID|MIN|NOW|NULLIF|OCT|OCTET_LENGTH|ORD|PERIOD_ADD|PERIOD_DIFF|PI|POSITION|POW|POWER|QUOTE|RADIANS|RAND|RELEASE_LOCK|REVERSE|ROUND|RPAD|RTRIM|SEC_TO_TIME|SESSION_USER|SHA|SHA1|SIGN|SLEEP|SOUNDEX|SPACE|SQRT|STD|STDDEV|STDDEV_POP|STDDEV_SAMP|STR_TO_DATE|SUBDATE|SUBSTR|SUBSTRING|SUBSTRING_INDEX|SUBTIME|SUM|SYSDATE|SYSTEM_USER|TAN|TIMEDIFF|TIME_FORMAT|TIME_TO_SEC|TO_DAYS|TRIM|UCASE|UNCOMPRESS|UNCOMPRESSED_LENGTH|UNHEX|UNIX_TIMESTAMP|UPPER|UUID|VARIANCE|VAR_POP|VAR_SAMP|VERSION|WEEKDAY|WEEKOFYEAR)($|\s+|\(|\)|\[|\]|,|<|>|=)/';

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlRes	= '#5E5EFF'; 	// Light Blue

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlText = '#900'; 		// Dark Red

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlOps = '#800000';  	// Brown

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlActs = '#5E5EFF'; 	// Light Blue

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlCons = '#5E5EFF'; 	// Light Blue

	/**
	 * Color value for formatting SQL queries
	 *
	 * @var string
	 */
	public $colorSqlMods = '#EF3DDD'; 	// Light Pink	 

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	public function __construct() {
		$this->charset = 'UTF-8'; 
		if (!defined('UTF8_ENABLED') && !defined('MB_ENABLED')):
			UTF::initLib($this->charset);
		endif;
	}
	
	/**
	 * Explode a string based on case and then return as string of words
	 *
	 * @param	string		$string		String to explode
	 * @return	string					String of words based on case explosion
	 * @access	public
	 * @since	5.0
	 */
	public function caseToWords($string) {
		$arrWords = $this->explodeCase($string);
		return implode(' ',$arrWords);
	}

	/**
	 * Returns the last element of a delimited string
	 *
	 * @param	string		$string		String to modify
	 * @param	string		$delim		Delimiter used to separate string items
	 * @return	string					Returns the last element item of the string after explosion
	 * @access	public
	 * @since	5.0
	 */
	public function delimpop($string = '', $delim = '/') {
		$string = explode($delim, $string);
		$string = end($string);
		return $string;	
	}
	
	/**
	 * Explode a string based on case
	 *
	 * @param	string		$string		String to explode
	 * @return	array					Array of exploded letters
	 * @access	public
	 * @since	5.0
	 */
	public function explodeCase($string) {
		return preg_split('/([A-Z][^A-Z]*)/', $string, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE); 
	}

	/**
	 * Translates a camel case string into a string separated by specified delimiter
	 * @param    string		$str                     	String in camelCase format
	 * @param    delim		$str                     	Delimiter used to separate the string parts
	 * @return   string									$str separated into individual parts
	 */
	public function fromCamelCase($str = '', $delim = '_') {
		$arrAcronyms = explode(',', CFG::get('constants.ACRONYMS_UCASE_NOSPLIT'));
		if (!in_array($str, $arrAcronyms)):
			$str[0] = $this->mbstrtolower($str[0]); 
			/* Keeping the php 5.x version in case I need to roll back for some reason 
				$func = create_function('$c', 'return $this->mbstrtolower($c[1]);');
			*/

			/* Version compatible with php 7.x where create_function is deprecated */
			$func = function($c) { return $this->mbstrtolower($c[1]); };
			return preg_replace_callback('/([A-Z])/', $func, $str);
		endif;
		return $str;
	}
	
	/**
	 * Code Highlighter
	 *
	 * Colorizes code strings
	 *
	 * @param	string	the text string
	 * @return	string
	 */
	public function highlightCode($str) {
		/* The highlight string function encodes and highlights
		 * brackets so we need them to start raw.
		 *
		 * Also replace any existing PHP tags to temporary markers
		 * so they don't accidentally break the string out of PHP,
		 * and thus, thwart the highlighting.
		 */
		$str = str_replace(array('&lt;', '&gt;', '<?', '?>', '<%', '%>', '\\', '</script>'),
					array('<', '>', 'phptagopen', 'phptagclose', 'asptagopen', 'asptagclose', 'backslashtmp', 'scriptclose'),
					$str);

		// The highlight_string function requires that the text be surrounded
		// by PHP tags, which we will remove later
		$str = highlight_string('<?php '.$str.' ?>', TRUE);

		// Remove our artificially added PHP, and the syntax highlighting that came with it
		$str = preg_replace(array(
						'/<span style="color: #([A-Z0-9]+)">&lt;\?php(&nbsp;| )/i',
						'/(<span style="color: #[A-Z0-9]+">.*?)\?&gt;<\/span>\n<\/span>\n<\/code>/is',
						'/<span style="color: #[A-Z0-9]+"\><\/span>/i'
					),
					array(
						'<span style="color: #$1">',
						"$1</span>\n</span>\n</code>",
						''
					),
					$str);

		// Replace our markers back to PHP tags.
		return str_replace(array('phptagopen', 'phptagclose', 'asptagopen', 'asptagclose', 'backslashtmp', 'scriptclose'),
					array('&lt;?', '?&gt;', '&lt;%', '%&gt;', '\\', '&lt;/script&gt;'),
					$str);
	}

	/**
	 * Returns HTML escaped variable
	 *
	 * @param	mixed
	 * @return	mixed
	 * @access	public
	 * @since	5.0
	 */
	public function htmlEscape($var) {
		return is_array($var) ? array_map(array($this,'htmlEscape'), $var) : htmlspecialchars($var, ENT_QUOTES, $this->charset);
	}

	/**
	 * Strips HTML tags leaving equivalent line breaks in place in preparation
	 * for viewing formerly HTML content within a simple textarea form field.
	 *
	 * @param	string			$content				Original HTML string content
	 * @return	string									Line-breaked content minus any HTML tags 
	 * @access	public
	 * @since	5.0
	 */
	public function htmlToText($content = '') {
		$elms = 'address|article|aside|blockquote|br|dd|div|dl|fieldset|figure|footer|h1|h2|h3|h4|h5|h6|header|hgroup|hr|ol|output|p|pre|section|table|ul';
		$content = strip_tags(preg_replace('/<\/('.$elms.'\s*\/)+>/', '[[CARRIAGE_RETURN]]', $content));
		$content = str_replace('[[CARRIAGE_RETURN]]', "\n\r", $content);
		return $content;
	}

	/**
	 * Strips HTML tags leaving equivalent line breaks in place in preparation
	 * for viewing formerly HTML content within a simple textarea form field.
	 *
	 * @param	string			$content				Original HTML string content
	 * @return	string									Line-breaked content minus any HTML tags 
	 * @access	public
	 * @since	5.0
	 */
	public function inflectToVars($value = '') {
		$vars = [];
		if (!empty($value)): 
			$vars['lcs'] = strtolower($value);
			$vars['lcp'] = str_plural($vars['lcs']);
			$vars['lcss'] = $this->nameToSlug($vars['lcs']);
			$vars['lcsp'] = $this->nameToSlug($vars['lcp']);
			$vars['ccs'] = $this->nameToCamelCase($vars['lcs']);
			$vars['ucfs'] = ucfirst($vars['lcs']);
			$vars['ucfp'] = ucfirst($vars['lcp']);
			$vars['ucws']= $this->slugToWords($vars['lcs'], '_');
			$vars['ucwp'] = $this->slugToWords($vars['lcp'], '_');
			$vars['prefix'] = $vars['lcs'];
		endif; 
		return $vars;

	}

	/**
	 * Multi-byte compatible split function. Since this function is now removed in PHP7+
	 * we will substitute the equivalent preg_split for non-multibyte compatibility. Neither
	 * mb_split nor preg_split, provide an argument for specifying charset so it's possible
	 * that preg_split is also multibyte friendly. But this way, mb_split is always prioritized
	 * in case it's not.
	 *
	 * @param	string			$pattern		Splitting pattern to match
	 * @param	string			$string			String to split
	 * @param	int				$limit			Only substrings up to limit are returned. A limit of -1, 0 or NULL means "no limit".
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
 	public function mbsplit($pattern = '', $string = '', $limit = NULL) {
		if (isset($pattern) && is_string($pattern) && isset($string) && is_string($string)):
			$limit = (isset($limit) && is_numeric($limit)) ? $limit : NULL;
			return (UTF8_ENABLED) ? mb_split($pattern, $string, $limit) : preg_split($pattern, $string, $limit);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strrichr function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	bool			$part			Portion of haystack returned
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrrichr($haystack = '', $needle = '', $part = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$part = (isset($part) && is_bool($part)) ? $part : FALSE;
			return (UTF8_ENABLED) ? mb_strrichr($haystack, $needle, $part, $this->charset) : strrichr($haystack, $needle, $part);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible stripos function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	int				$offset			Starting position of search
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstripos($haystack = '', $needle = '', $offset = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_numeric($offset)) ? $offset : 0;
			return (UTF8_ENABLED) ? mb_stripos($haystack, $needle, $offset, $this->charset) : stripos($haystack, $needle, $offset);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible stristr function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	bool			$before			Determines which portion of haystack this function returns. If set to TRUE, it returns all of haystack from the beginning to the first occurrence of needle (excluding needle). If set to FALSE, it returns all of haystack from the first occurrence of needle to the end (including needle).
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstristr($haystack = '', $needle = '', $before = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_boolean($offset)) ? $offset : FALSE;
			return (UTF8_ENABLED) ? mb_stristr($haystack, $needle, $before, $this->charset) : stristr($haystack, $needle, $before);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strlen function
	 *
	 * @param	string			$string			String to convert
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrlen($string = '') {
		if (isset($string) && is_string($string)):
			return (UTF8_ENABLED) ? mb_strlen($string, $this->charset) : strlen($string);
		endif;
		return $string;
	}

	/**
	 * Multi-byte compatible strpos function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	int				$offset			Starting position of search
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrpos($haystack = '', $needle = '', $offset = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_numeric($offset)) ? $offset : 0;
			return (UTF8_ENABLED) ? mb_strpos($haystack, $needle, $offset, $this->charset) : strpos($haystack, $needle, $offset);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strrchr function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	bool			$part			Portion of haystack returned
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrrchr($haystack = '', $needle = '', $part = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$part = (isset($part) && is_bool($part)) ? $part : FALSE;
			return (UTF8_ENABLED) ? mb_strrchr($haystack, $needle, $part, $this->charset) : strrchr($haystack, $needle);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strripos function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	int				$offset			Starting position of search
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrripos($haystack = '', $needle = '', $offset = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_numeric($offset)) ? $offset : 0;
			return (UTF8_ENABLED) ? mb_strripos($haystack, $needle, $offset, $this->charset) : strripos($haystack, $needle, $offset);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strrpos function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	int				$offset			Starting position of search
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrrpos($haystack = '', $needle = '', $offset = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_numeric($offset)) ? $offset : 0;
			return (UTF8_ENABLED) ? mb_strrpos($haystack, $needle, $offset, $this->charset) : strrpos($haystack, $needle, $offset);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strstr function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	bool			$before			Determines which portion of haystack this function returns. If set to TRUE, it returns all of haystack from the beginning to the first occurrence of needle (excluding needle). If set to FALSE, it returns all of haystack from the first occurrence of needle to the end (including needle).
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrstr($haystack = '', $needle = '', $before = NULL) {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			$offset = (isset($offset) && is_boolean($offset)) ? $offset : FALSE;
			return (UTF8_ENABLED) ? mb_strstr($haystack, $needle, $before, $this->charset) : strstr($haystack, $needle, $before);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible strtolower function
	 *
	 * @param	string			$string			String to convert
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrtolower($string = '') {
		if (isset($string) && is_string($string)):
			return (UTF8_ENABLED) ? mb_strtolower($string, $this->charset) : strtolower($string);
		endif;
		return $string;
	}

	/**
	 * Multi-byte compatible strtoupper function
	 *
	 * @param	string			$string			String to convert
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbstrtoupper($string = '') {
		if (isset($string) && is_string($string)):
			return (UTF8_ENABLED) ? mb_strtoupper($string, $this->charset) : strtoupper($string);
		endif;
		return $string;
	}

	/**
	 * Multi-byte compatible substr function
	 *
	 * @param	string			$string			String to convert
	 * @param	int				$start			Starting position of substring
	 * @param	int				$length			Size of substring to capture
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbsubstr($string = '', $start = NULL, $length = NULL) {
		if (isset($string) && is_string($string)):
			$start = (isset($start) && is_numeric($start)) ? $start : 0;
			$length = (isset($length) && is_numeric($length)) ? $length : $this->mbstrlen($string);
			return (UTF8_ENABLED) ? mb_substr($string, $start, $length, $this->charset) : substr($string, $start, $length);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible substr_count function
	 *
	 * @param	string			$haystack		String to search
	 * @param	string			$needle			String to find
	 * @param	int				$offset			Starting position of search
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbsubstrcount($haystack = '', $needle = '') {
		if (isset($haystack) && is_string($haystack) && isset($needle) && is_string($needle)):
			return (UTF8_ENABLED) ? mb_substr_count($haystack, $needle, $this->charset) : substr_count($haystack, $needle);
		endif;
		return NULL;
	}

	/**
	 * Multi-byte compatible ucfirst function
	 *
	 * @param	string			$string			String to convert
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbucfirst($string = '') {
    	if (isset($string) && is_string($string)):
			return (UTF8_ENABLED) ? mb_strtoupper(mb_substr($string, 0, 1, $this->charset)).mb_substr($string, 1, NULL, $this->charset) : ucfirst($string);
		endif;
		return $string;
	}

	/**
	 * Multi-byte compatible ucwords function
	 *
	 * @param	string			$string			String to convert
	 * @return	string							Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function mbucwords($string = '') {
		if (isset($string) && is_string($string)):
			return (UTF8_ENABLED) ? mb_convert_case($string, MB_CASE_TITLE, $this->charset) : ucwords($string);
		endif;
		return $string;
	}

	/**
	 * Convert a string to SEO-friendly URL format
	 *
	 * @param	string		$name		String to convert
	 * @param 	array  		$slugs 	 	An array of existing slugs used for comparison when creating a unique slug. (OPTIONAL)
	 * @return	string					Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function nameToSlug($name = '', $slugs = NULL) {
		$slug = '';
		if (isset($name) && trim($name)):
			$slug = $this->mbstrtolower(preg_replace('/(^-+|-+$)/','', preg_replace('/(\s|-)+/i','-',trim(preg_replace('/[^a-z0-9\-\s]+/i',' ',$name)))));
		endif;
		if (isset($slugs)):
			$slugs = ARR::toArray($slugs, TRUE);
			$slugcnt = 0;
			$slugalt = $slug;
			while (ARR::findAny(array($slugalt, $slug.'-'.++$slugcnt), $slugs)):
				$slugalt = $slug.'-'.$slugcnt;
			endwhile;
			$slug = $slugalt;
		endif;
		return $slug;
	}
	
	/**
	 * Convert a string to a camelCaseFormat
	 *
	 * @param	string		$name		String to convert
	 * @return	string					Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function nameToCamelCase($name = '') {
		return $this->toCamelCase($this->mbstrtolower(preg_replace('/(\s|-)+/i','-',trim(preg_replace('/[^a-z0-9\-\s]+/i',' ',$name)))),'-');
	}
	
	/**
	 * Highlights and formats standard SQL string
	 *
	 * @param	string		$string		String to format
	 * @return	string					Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function queryFormat($query) {
		$style = 'text-transform:uppercase; color:';
		$query = htmlspecialchars($query); 
		$query = preg_replace('/\\\\\'/','&#39;',$query);
		$query = stripslashes($query); 
		$query = preg_replace('/((\(SELECT.+?\))( AS .+?(\s|,)))/i','<div style="margin:0 0 0 40px;">$2</div>$3',$query); 
		$query = preg_replace($this->matchSqlRes,'$1<br /><span style="'.$style.$this->colorSqlRes.'">$2</span> $5',$query); 
		$query = preg_replace('/\)<\/div><br(.*?)>/i','<br />)</div>',$query); 
		$query = preg_replace($this->matchSqlOps,'$1<span style="'.$style.$this->colorSqlRes.'">$2</span>$3',$query); 
		$query = preg_replace($this->matchSqlActs,'$1<span style="'.$style.$this->colorSqlActs.'">$2</span>$3',$query); 
		$query = preg_replace($this->matchSqlCons,'$1<span style="'.$style.$this->colorSqlCons.'">$2</span>$3',$query); 
		$query = preg_replace($this->matchSqlMods,'$1<span style="'.$style.$this->colorSqlMods.'">$2</span>$3',$query); 
		$query = preg_replace('/(\'([^\']+?)\'|\'\')/i','<span style="color:'.$this->colorSqlText.'">$1</span>',$query); 
		$query = preg_replace('/^<br \/>/i','',$query); 
		$query = preg_replace('/,([^\s]+?)/',', $1',$query);
		return $query;
	}

	/**
	 * Remove Invisible Characters
	 *
	 * This prevents sandwiching null characters
	 * between ascii characters, like Java\0script.
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function removeInvisibleChars($str, $urlEncoded = TRUE) {
		$nonDisplayables = array();
		/* every control character except newline (dec 10) carriage return (dec 13), and horizontal tab (dec 09) */
		if ($urlEncoded):
			$nonDisplayables[] = '/%0[0-8bcef]/';	// url encoded 00-08, 11, 12, 14, 15
			$nonDisplayables[] = '/%1[0-9a-f]/';	// url encoded 16-31
		endif;
		$nonDisplayables[] = '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/S';	// 00-08, 11, 12, 14-31, 127
		do {
			$str = preg_replace($nonDisplayables, '', $str, -1, $count);
		}
		while ($count);
		return $str;
	}
	
	/**
	 * Convert a standard SEO-friendly slug string to a space-separated ucwords format
	 *
	 * @param	string		$name		String to convert
	 * @return	string					Converted string
	 * @access	public
	 * @since	5.0
	 */
	public function slugToWords($slug = '', $delim = '-', $ucwords = TRUE) {
		if (isset($slug) && is_string($slug) && isset($delim) && is_string($delim)):
			$slug = explode($delim, trim($slug));
			$slug = implode(' ', $slug);
			if (isset($ucwords) && $ucwords):
				$slug = $this->mbucwords($slug);
			endif;
		endif;
		return $slug;
	}
	
	/**
	 * Stringify attributes for use in HTML tags.
	 *
	 * Helper function used to convert a string, array, or object
	 * of attributes to a string.
	 *
	 * @param	mixed	string, array, object
	 * @param	bool
	 * @return	string
	 * @access	public
	 * @since	5.0
	 */
	public function stringifyAttribs($attributes, $js = FALSE)	{
		$atts = NULL;
		if (empty($attributes)):
			return $atts;
		endif;
		if (is_string($attributes)):
			return ' '.$attributes;
		endif;
		$attributes = (array) $attributes;
		foreach ($attributes as $key => $val):
			$atts .= ($js) ? $key.'='.$val.',' : ' '.$key.'="'.$val.'"';
		endforeach;
		return rtrim($atts, ',');
	}
	
	/**
	 * Translates a string with a specific delimiter into camel case
	 *
	 * @uses 	STR::mbstrtoupper()
	 *
	 * @param    string		$str                     	String containing delimiters
	 * @param    delim		$str                     	Delimiter used to separate the string parts
	 * @param    bool		$firstCap				   	If true, capitalise the first char in $str
	 * @return   string									$str translated into camelCase
	 */
	public function toCamelCase($str = '', $delim = '_', $firstCap = FALSE) {
		$arrAcronyms = explode(',', CFG::get('constants.ACRONYMS_UCASE_NOSPLIT'));
		if (!in_array($str, $arrAcronyms)):
			if ($firstCap):
				$str[0] = $this->mbstrtoupper($str[0]);
			endif;
			/* Keeping the php 5.x version in case I need to roll back for some reason 
				$func = create_function('$c', 'return $this->mbstrtolower($c[1]);');
			*/
				
			/* Version compatible with php 7.2+ where create_function is deprecated */
			$func = function($c) { return $this->mbstrtoupper($c[1]); };
			$str = preg_replace_callback('/'.str_replace('.', '\.', $delim).'([a-z])/', $func, $str);
		endif;
		return $str;
	}		

	/**
	 * Convert a value of mixed type to an object of type String
	 *
	 * @param	mixed		$value		Value of mixed data type to convert to a string type
	 * @return	string					The requested value in a string format
	 * @access	public
	 * @since	5.0
	 *
	 * @todo  							Verify this function works as expected. This function 
	 *  								and the flatten function need to be checked to ensure 
	 * 									they are working. I've had problems with this in the 
	 * 									past.
	*/
	public function toString($value = NULL, $delim = ',') {
		$return = '';
		if (isset($value)):
			if (is_array($value) || is_object($value)):
				if (is_object($value)):
					$value = (array)$value;
				endif;
				$items = $this->flatten($value);
				$return = '';
				foreach ($items as $item):
					$return .= (($return) ? $delim : '').$item;
				endforeach;
			elseif (is_string($value)):
				$return = $value;
			elseif (is_numeric($value)):
				$return = (string)$value;
			endif;
		endif;
		return $return;
	}
	
	/**
	 * Truncate a string
	 *
	 * @uses 	H::comment()
	 *
	 * @param	string		$string		String to evaluate
	 * @param	int			$maxlen		The maximum length of the string before it will be truncated
	 * @param	boolean		$elip		Whether to append an elipses at the end of the string (if truncated)
	 * @return	string					Updated string value (truncated if required)
	 * @access	public
	 * @since	5.0
	 */
	public function trunc($string = '', $maxlen = 100, $elip = TRUE) {
		if ($maxlen && $this->mbstrlen($string) > $maxlen):
			$string = $this->mbsubstr($string, 0, $maxlen);
			$string = explode(' ', $string);
			if (count($string) > 1):
				array_pop($string);
			endif;
			$string = implode(' ', $string);
			$string = preg_replace('/([^a-zA-Z0-9]+)$/', '', $string);
			$string .= ($elip) ? '...'.H::comment('readmore') : '';
		endif;
		return $string;
	}
	
	/**
	 * Truncates a string up to X number of characters while preserving whole words and HTML tags
	 *
	 * @param string $text String to truncate.
	 * @param integer $length Length of returned string, including ellipsis.
	 * @param string $ending Ending to be appended to the trimmed string.
	 * @param boolean $exact If false, $text will not be cut mid-word
	 * @param boolean $considerHtml If true, HTML tags would be handled correctly
	 *
	 * @return string Trimmed string.
	 */
	function truncHtml($text, $length = 100, $ending = '...', $exact = TRUE, $considerHtml = TRUE) {
		if ($considerHtml):
			// Strip preceeding and ending white space
			$text = preg_replace('/(^\s*|\s*$)/', '', $text);
			// if the plain text is shorter than the maximum length, return the whole text
			if ($this->mbstrlen(preg_replace('/<.*?>/', '', $text)) <= $length):
				return $text;
			endif;
			// splits all html-tags to scanable lines
			preg_match_all('/(<.+?>)?([^<>]*)/s', $text, $lines, PREG_SET_ORDER);
			$total_length = $this->mbstrlen($ending);
			$open_tags = array();
			$truncate = '';
			foreach ($lines as $line_matchings):
				// if there is any html-tag in this line, handle it and add it (uncounted) to the output
				if (!empty($line_matchings[1])):
					// if it's an "empty element" with or without xhtml-conform closing slash
					if (preg_match('/^<(\s*.+?\/\s*|\s*(img|br|input|hr|area|base|basefont|col|frame|isindex|link|meta|param)(\s.+?)?)>$/is', $line_matchings[1])):
						// do nothing
					// if tag is a closing tag
					elseif (preg_match('/^<\s*\/([^\s]+?)\s*>$/s', $line_matchings[1], $tag_matchings)):
						// delete tag from $open_tags list
						$pos = array_search($tag_matchings[1], $open_tags);
						if ($pos !== FALSE):
							unset($open_tags[$pos]);
						endif;
					// if tag is an opening tag
					elseif (preg_match('/^<\s*([^\s>!]+).*?>$/s', $line_matchings[1], $tag_matchings)):
						// add tag to the beginning of $open_tags list
						array_unshift($open_tags, $this->mbstrtolower($tag_matchings[1]));
					endif;
					// add html-tag to $truncate'd text
					$truncate .= $line_matchings[1];
				endif;
				// calculate the length of the plain text part of the line; handle entities as one character
				$content_length = $this->mbstrlen(preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|[0-9a-f]{1,6};/i', ' ', $line_matchings[2]));
				if ($total_length+$content_length> $length):
					// the number of characters which are left
					$left = $length - $total_length;
					$entities_length = 0;
					// search for html entities
					if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|[0-9a-f]{1,6};/i', $line_matchings[2], $entities, PREG_OFFSET_CAPTURE)):
						// calculate the real length of all entities in the legal range
						foreach ($entities[0] as $entity):
							if ($entity[1]+1-$entities_length <= $left):
								$left--;
								$entities_length += $this->mbstrlen($entity[0]);
							else:
								// no more characters left
								break;
							endif;
						endforeach;
					endif;
					$truncate .= $this->mbsubstr($line_matchings[2], 0, $left+$entities_length);
					// maximum lenght is reached, so get off the loop
					break;
				else:
					$truncate .= $line_matchings[2];
					$total_length += $content_length;
				endif;
				// if the maximum length is reached, get off the loop
				if ($total_length>= $length):
					break;
				endif;
			endforeach;
		else:
			if ($this->mbstrlen($text) <= $length):
				return $text;
			else:
				$truncate = $this->mbsubstr($text, 0, $length - $this->mbstrlen($ending));
			endif;
		endif;
		// if the words shouldn't be cut in the middle...
		if (!$exact):
			// ...search the last occurance of a space...
			$spacepos = $this->mbstrrpos($truncate, ' ');
			if (isset($spacepos)):
				// ...and cut the text in this position
				$truncate = $this->mbsubstr($truncate, 0, $spacepos);
			endif;
		endif;
		// add the defined ending to the text
		$truncate .= $ending;
		if($considerHtml):
			// close all unclosed html-tags
			foreach ($open_tags as $tag):
				$truncate .= '</' . $tag . '>';
			endforeach;
		endif;
		return $truncate;
	}
	
	/**
	 * Ensure no repeated values in a string and order by values
	 *
	 * @param	string		$string			String to modify
	 * @param	string		$delimBefore	String delimiter prior to modification used to explode string
	 * @param	string		$delimAfter		String delimiter to use when rejoining after modification
	 * @return	string
	 * @access	public
	 * @since	5.0
	 */
	public function unique($string = '', $delimBefore = ',', $delimAfter = NULL) {
		$array = array_filter(explode($delimBefore, $string));
		$array = array_unique($array);
		sort($array);
		$string = implode((($delimAfter) ? $delimAfter : $delimBefore), $array);
		return $string;
	}
	
	/**
	 * Generate a random UID string of specified length
	 *
	 * @param	int			$len		Optional length parameter
	 * @param 	string 		$case  		Optional case conversion. Options: (NULL|'lower'|'upper')
	 * @return	string					The final UID string
	 * @access	public
	 * @since	5.0
	 */
	public function uid($len = 6, $case = NULL) {
		$uid = '';
		$lchar = 0;
		$char = 0;
		for ($i = 0; $i < $len; $i++):
			while ($char == $lchar):
				$char = rand(48,109);
				if ($char > 57): $char += 7; endif;
				if ($char > 90): $char += 6; endif;
			endwhile;
			$uid .= chr($char);
			$lchar = $char;
		endfor;
		if (isset($case)):
			if ($case === 'lower'):
				$uid = $this->mbstrtolower($uid);
			elseif ($case === 'upper'):
				$uid = $this->mbstrtoupper($uid);
			endif;
		endif;
		return $uid;
	}
		
	/**
	 * Generate a random 32-char UUID string
	 *
	 * @param	string		$prefix		Optional prefix to prepend to the UUID string
	 * @return	string					The final UUID string (with optional prefix)
	 * @access	public
	 * @since	5.0
	 */
	public function uuid($prefix = '') {
		$chars = uniqid(md5(rand()));
		$uuid = $this->mbsubstr($chars,0,8);
		$uuid .= $this->mbsubstr($chars,8,4);
		$uuid .= $this->mbsubstr($chars,12,4);
		$uuid .= $this->mbsubstr($chars,16,4);
		$uuid .= $this->mbsubstr($chars,20,12);
		return $prefix.$uuid;
	}

} 

