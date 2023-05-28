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
 * InflectionHelper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem 
 * @since 		4.0
 */
class InflectionHelper {  
	
	/**
	 * Common plural word patterns
	 *
	 * @var array
	 */
    static $plural = array(
        '/(quiz)$/i'               => "$1zes",
        '/^(ox)$/i'                => "$1en",
        '/([m|l])ouse$/i'          => "$1ice",
        '/(matr|vert|ind)ix|ex$/i' => "$1ices",
        '/(x|ch|ss|sh)$/i'         => "$1es",
        '/([^aeiouy]|qu)y$/i'      => "$1ies",
        '/(hive)$/i'               => "$1s",
        '/(?:([^f])fe|([lr])f)$/i' => "$1$2ves",
        '/(shea|lea|loa|thie)f$/i' => "$1ves",
        '/sis$/i'                  => "ses",
        '/([ti])um$/i'             => "$1a",
        '/(tomat|potat|ech|her|vet)o$/i'=> "$1oes",
        '/(bu)s$/i'                => "$1ses",
        '/(alias)$/i'              => "$1es",
        '/(octop)us$/i'            => "$1i",
        '/(ax|test)is$/i'          => "$1es",
        '/(us)$/i'                 => "$1es",
        '/s$/i'                    => "s",
        '/$/'                      => "s"
    );

	/**
	 * Common singular word patterns
	 *
	 * @var array
	 */
    static $singular = array(
        '/(quiz)zes$/i'             => "$1",
        '/(matr)ices$/i'            => "$1ix",
        '/(vert|ind)ices$/i'        => "$1ex",
        '/^(ox)en$/i'               => "$1",
        '/(alias)es$/i'             => "$1",
        '/(octop|vir)i$/i'          => "$1us",
        '/(cris|ax|test)es$/i'      => "$1is",
        '/(shoe)s$/i'               => "$1",
        '/(o)es$/i'                 => "$1",
        '/(bus)es$/i'               => "$1",
        '/([m|l])ice$/i'            => "$1ouse",
        '/(x|ch|ss|sh)es$/i'        => "$1",
        '/(m)ovies$/i'              => "$1ovie",
        '/(s)eries$/i'              => "$1eries",
        '/([^aeiouy]|qu)ies$/i'     => "$1y",
        '/([lr])ves$/i'             => "$1f",
        '/(tive)s$/i'               => "$1",
        '/(hive)s$/i'               => "$1",
        '/(li|wi|kni)ves$/i'        => "$1fe",
        '/(shea|loa|lea|thie)ves$/i'=> "$1f",
        '/(^analy)ses$/i'           => "$1sis",
        '/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i'  => "$1$2sis",
        '/([ti])a$/i'               => "$1um",
        '/(n)ews$/i'                => "$1ews",
        '/(h|bl)ouses$/i'           => "$1ouse",
        '/(corpse)s$/i'             => "$1",
        '/(us)es$/i'                => "$1",
        '/s$/i'                     => ""
    );

	/**
	 * Array populated with irregular plural word types
	 *
	 * @var array
	 */
    static $irregular = array(
    	'address' => 'addresses',
        'registered'   => 'registered',
        'move'   => 'moves',
        'foot'   => 'feet',
        'goose'  => 'geese',
        'sex'    => 'sexes',
        'child'  => 'children',
        'man'    => 'men',
        'tooth'  => 'teeth',
        'music'  => 'music',
        'person' => 'people',
        'dns' 	 => 'dns',
        'admin'  => 'admin'
    );

	/**
	 * Array populated with collective plural word types
	 *
	 * @var array
	 */
    static $uncountable = array(
        'sheep',
        'fish',
        'deer',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    );

	/**
	 * Custom irregular word patterns populated by external
	 * inflection configuration file.
	 *
	 * @var array
	 */
    static $irregularWords = array();
	
	/**
	 * Custom multi-word patterns that require splitting. This array
	 * will be populated by the external inflection configuration file.
	 *
	 * @var array
	 */
    static $splitWords = array();
	
	/**
	 * Constructor
	 *
	 * @uses	CFG::get()
	 *
	 * @return	void
	 */
	public function __construct() {
		$inflection = CFG::get('inflection');
		static::$irregularWords = $inflection['irregular']; 
		static::$splitWords = $inflection['splitwords']; 
	}
	
	/**
	 * Makes a phrase camel case. Spaces and underscores will be removed.
	 *
	 * @uses 	STR::mbucwords()
	 * @uses 	STR::mbstrtolower()
	 * @uses 	STR::mbsubstr()
	 *
	 * @example
	 * Inflection::camelize('mother cat'); 		// results in 'motherCat'
	 * Inflection::camelize('kittens in bed'); 	// results in 'kittensInBed'
	 *
	 * @param	string		$string		String to camelize
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
	public static function camelize($string) {
		$string = 'x'.STR::mbstrtolower(trim($string));
		$string = STR::mbucwords(preg_replace('/[\s_]+/', ' ', $string));
		return STR::mbsubstr(str_replace(' ', '', $string), 1);
	}

	/**
	 * Converts a camel case phrase into a spaced phrase.
	 *
	 * @uses 	STR::mbstrtolower()
	 *
	 * @example
	 * Inflection::decamelize('houseCat');    	// results in 'house cat'
	 * Inflection::decamelize('kingAllyCat'); 	// results in 'king ally cat'
	 *
	 * @param	string		$string		String to decamelize
	 * @param	string		$delim		Delimiter used to separate words 
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
	public static function decamelize($string, $delim = ' ') {
		return STR::mbstrtolower(preg_replace('/([a-z])([A-Z])/', '$1'.$delim.'$2', trim($string)));
	}

	/**
	 * Makes an underscored or dashed phrase human-readable.
	 *
	 * @example
	 * Inflection::humanize('kittens-are-cats');	// results in 'kittens are cats'
	 * Inflection::humanize('dogs_as_well');     	// results in 'dogs as well'
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
	public static function humanize($string) {
		return preg_replace('/[_-]+/', ' ', trim($string));
	}

	/**
	 * joinWords
	 *
	 * Converts multiple separate words into a combined multi-word string.
	 *
	 * @example
	 * Inflection::joinwords('cats and dogs'); // results in 'catsanddogs'
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
    public static function joinWords($string) {	
		foreach (static::$splitWords as $result => $pattern):
			$pattern = '/^'.$pattern.'$/i';
			if (preg_match($pattern, $string)):
				return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        return $string;
    }

	/**
	 * pluralize
	 *
	 * Converts a string in singular format to its commonly used plural
	 * format based on rules or regular expression patterns.
	 *
	 * @example
	 * Inflection::pluralize('cat'); // results in 'cats'
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
    public static function pluralize($string) {
        if (in_array(STR::mbstrtolower($string), static::$uncountable)):
            return $string;
		endif;
		foreach (static::$irregularWords as $pattern => $result):
			$pattern = '/'.$pattern.'$/i';
			if (preg_match($pattern,$string)):
				return preg_replace($pattern,$result,$string);
			endif;
		endforeach;
        foreach (static::$irregular as $pattern => $result):
            $pattern = '/'.$pattern.'$/i';
            if (preg_match($pattern, $string)):
                return preg_replace($pattern, $result, $string);
			endif;
        endforeach;
        foreach (static::$plural as $pattern => $result):
            if (preg_match($pattern, $string)):
                return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        return $string;
    }

	/**
	 * pluralizeIf
	 *
	 * Converts a string in singular format to its commonly used plural
	 * format based on rules or regular expression patterns if the numerical
	 * value of $count is greater than one. 
	 *
	 * @example
	 * Inflection::pluralizeIf(3, 'cat'); 	// results in '3 cats'
	 * Inflection::pluralizeIf(1, 'dog'); 	// results in '1 dog'
	 *
	 * @param	int			$count		Number of items
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
    public static function pluralizeIf($count, $string) {
        if ($count == 1):
            return '1 '.$string;
        else:
            return $count.' '.static::pluralize($string);
		endif;
    }
	
	/**
	 * singularize
	 *
	 * Converts a string in plural format to its commonly used singular
	 * format based on rules or regular expression patterns.
	 *
	 * @example
	 * Inflection::singularize('cats'); // results in 'cat'
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
    public static function singularize($string) {	
        if (in_array(STR::mbstrtolower($string), static::$uncountable)):
            return $string;
		endif;
		foreach (static::$irregularWords as $result => $pattern):
			$pattern = '/'.$pattern.'$/i';
			if (preg_match($pattern, $string)):
				return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        foreach (static::$irregular as $result => $pattern):
            $pattern = '/'.$pattern.'$/i';
            if (preg_match($pattern, $string)):
                return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        foreach (static::$singular as $pattern => $result):
            if (preg_match($pattern, $string)):
                return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        return $string;
    }

	/**
	 * splitWords
	 *
	 * Converts a combined multi-word string into multiple separate words.
	 *
	 * @example
	 * Inflection::splitwords('catsanddogs'); // results in 'cats and dogs'
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
    public static function splitWords($string) {	
		foreach (static::$splitWords as $pattern => $result):
			$pattern = '/^'.$pattern.'$/i';
			if (preg_match($pattern, $string)):
				return preg_replace($pattern, $result, $string);
			endif;
		endforeach;
        return $string;
    }

	/**
	 * Makes a phrase underscored instead of spaced.
	 *
	 * @example
	 * Inflection::underscore('five cats'); 	// results in 'five_cats';
	 *
	 * @param	string		$string		String to convert
	 * @return  string
	 * @access	public
	 * @since	5.0
	 */
	public static function underscore($string) {
		return preg_replace('/\s+/', '_', trim($string));
	}

}

