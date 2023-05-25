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
 * Translation Helper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		5.0  
 */
class TranslationHelper {  

	/**
	 * Translates a string value from one language into another
	 *
	 * This method serves as a simple placeholder for now since no actual translation is currently available. 
	 * However, code can be written (presently) so that when this functionality is implemented in the future,
	 * no additional work is required.
	 *
	 * @return	string					Returns the translated string
	 * @access	public
	 * @since	5.0
	 */
	public function _($str = NULL) {
		return $str;
	}
	
} 

