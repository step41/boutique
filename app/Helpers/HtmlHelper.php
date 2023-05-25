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
 * Html Helper Class
 *
 * A small class that helps output uniform and consistent HTML tag elements 
 * and attributes in a controlled fashion. While it may seem trivial to build
 * elements through a central class, it provides a single location where more
 * complex elements can be built and gives a certain level of control over the
 * patterns used to build each item type. Examples of how to use the class
 * methods to generate HTML output are as follows:
 *
 * 	// Two examples of returning the results as an HtmlHelper object so further processing and injection can occur
 * 	$a = H::make('a')->set('href','http://myboutique.loc')->set('title','My Favorite Blog')->set('text','Click here!');
 * 	$a = H::a()->set('href','http://myboutique.loc')->set('title','My Favorite Blog')->set('text','Click here!');
 * 	
 * 	// An example showing the injection of one element into another and echoing out the results
 * 	$img = H::img(array('src' => 'http://myboutique.loc/myimage.gif', 'alt' => 'My Favorite Gift', 'height' => '300px', 'width' => '400px'));
 * 	$a->inject($img)->out();
 *
 * 	// Two examples of returning the results as a string only (no echo)
 * 	$a = H::make('a')->set('href','http://myboutique.loc')->set('title','My Favorite Blog')->set('text','Click here!')->build();
 * 	$a = H::a()->set('href','http://myboutique.loc')->set('title','My Favorite Blog')->set('text','Click here!')->build();
 * 	
 * 	// Two examples showing how to echo the final string results automatically
 * 	H::make('a', array('href' => 'http://myboutique.loc', 'title' => 'My Favorite Blog', 'text' => 'Click here!'))->out();
 * 	H::a(array('href' => 'http://myboutique.loc', 'title' => 'My Favorite Blog', 'text' => 'Click here!')->out();
 * 	
 * 	// An example showing how to add text as part of the initial attributes array and echo out the final string
 * 	H::button(array('onclick' => 'getButtonHelp(this)', 'class' => 'buttonLarge', 'text' => 'Click here for helpful tips!'))->out();
 *
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		5.0  
 */
class HtmlHelper {

	/**
	 * Empty array placeholder for future element attributes
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_attribs = array();
	
	/**
	 * List of valid HTML element attributes
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_attributes = array(
		'accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'lang', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'onabort', 'onblur', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'oncontextmenu', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreadystatechange', 'onreset', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'onwaiting', 'xml:lang', 'xml:space', 'xml:base'
	);

	/**
	 * Array holding self-closing void element types
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_closed = array(
		'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
	);

	/**
	 * Array holding color names to their corresponding RGB values
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_colorNameToRGBs = array(
        'blue'          => 'rgb(0,56,168)',
        'cyan'          => 'rgb(0,163,209)',
        'purple'        => 'rgb(112,63,175)',
        'red'           => 'rgb(175,29,44)',
        'coral'         => 'rgb(224,66,80)',
        'yellow'        => 'rgb(255,236,56)',
        'dark green'    => 'rgb(0,85,63)',
        'light green'   => 'rgb(0,158,14)',
        'orange'        => 'rgb(248,107,7)',
        'black'         => 'rgb(0,0,0)',
        'white'         => 'rgb(255,255,255)',
        'metallic'      => 'rgba(0,0,0,0)',
        'transparent'   => 'rgba(0,0,0,0)',
        'mixed' 		=> ['rgb(175,29,44)', 'rgb(0,158,14)', 'rgb(0,56,168)'],
    );

	
	/**
	 * List of valid HTML document types
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_doctypes = array(
		'xhtml11'			=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
		'xhtml1-strict'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
		'xhtml1-trans'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
		'xhtml1-frame'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
		'xhtml-basic11'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
		'html5'				=> '<!DOCTYPE html>',
		'html4-strict'		=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
		'html4-trans'		=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
		'html4-frame'		=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
		'mathml1'			=> '<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">',
		'mathml2'			=> '<!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/mathml2.dtd">',
		'svg10'				=> '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">',
		'svg11'				=> '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
		'svg11-basic'		=> '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">',
		'svg11-tiny'		=> '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">',
		'xhtml-math-svg-xh'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">',
		'xhtml-math-svg-sh'	=> '<!DOCTYPE svg:svg PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">',
		'xhtml-rdfa-1'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">',
		'xhtml-rdfa-2'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.1//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-2.dtd">'
	);
	
	/**
	 * List of valid HTML elements
	 *
	 * @param	array
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_elements = array(
		'phrasing elements', 'a', 'p', 'hr', 'pre', 'ul', 'ol', 'dl', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'address', 'blockquote', 'ins', 'del', 'object', 'map', 'noscript', 'section', 'nav', 'article', 'aside', 'header', 'footer', 'video', 'audio', 'figure', 'table', 'form', 'fieldset', 'menu', 'canvas', 'details', 'link', 'style', 'meta name', 'meta http-equiv=refresh', 'meta http-equiv=default-style', 'meta charset', 'meta http-equiv=content-type', 'script', 'noscript', 'command', 'a', 'em', 'strong', 'small', 'mark', 'abbr', 'dfn', 'i', 'b', 's', 'u', 'code', 'var', 'samp', 'kbd', 'sup', 'sub', 'q', 'cite', 'span', 'bdo', 'bdi', 'br', 'wbr', 'ins', 'del', 'img', 'embed', 'object', 'iframe', 'map', 'area', 'script', 'noscript', 'ruby', 'video', 'audio', 'input', 'textarea', 'select', 'button', 'label', 'output', 'datalist', 'keygen', 'progress', 'command', 'canvas', 'time', 'meter'
	);
	
	/**
	 * Placeholder for current element tag
	 *
	 * @param	string
	 * @access 	protected
	 * @since	5.0
	 */
	protected $_elm;
	
	/**
	 * Magic method for outputting results to a string
	 *
	 * @return	string
	 * @access 	public
	 * @since	5.0
	 */
	public function __toString() {
		return $this->build();
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	boolean			$close			If FALSE, method will only output the opening element, otherwise element will be closed.
	 * @return	string							Returns an HTML string of one or more elements with attributes	
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _build($close = TRUE) {
		$q = (isset($this->_attribs['escapequotes'])) ? '\"' : '"';
		unset($this->_attribs['escapequotes']);
		$close = (isset($this->_attribs['close'])) ? $this->_attribs['close'] : ((isset($close)) ? $close : TRUE);
		unset($this->_attribs['close']);
		$text = (isset($this->_attribs['text'])) ? $this->_attribs['text'] : '';
		$build = '<'.$this->_elm;
		foreach($this->_attribs as $key => $value):
			$value = (is_bool($value)) ? (($value) ? $key : NULL) : $value;
			if (isset($value)):
				if (is_scalar($value)):
					$build .= ($key != 'text') ? ' '.$key.'='.$q.htmlentities($value).$q : '';
				else:
					$msg = T::_('The method %s() failed because a value of type '.gettype($value).' was passed. Value: '.json_encode($value));
					//Log::error(sprintf($msg, __FUNCTION__).'. '.debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 15));
					Log::warning(sprintf($msg, __FUNCTION__));
				endif;
			endif;
		endforeach;
		if (!in_array($this->_elm, $this->_closed)):
			$build .= '>'.$text.(($close) ? '</'.$this->_elm.'>' : '');
		elseif ($close):
			$build .= ' />';
		endif;
		$this->_clr();
		return $build;
	}
	
	/**
	 * Clear current list of attributes for the current Element object
	 *
	 * @return	void
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _clr() {
		$this->_elm = NULL;
		$this->_attribs = array();
	}
	
	/**
	 * Verifies class object passed is one of two acceptable types
	 *
	 * @param	mixed			$object			A class object or other unspecified type	
	 * @return	boolean							Returns TRUE if valid object, otherwise FALSE
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _isValidObject($object = NULL) {
		if (isset($object) && is_object($object)):
			$class = @get_class($object);
			return ($class && ($class === __CLASS__ || $class === __NAMESPACE__.'\Editor'));
		endif;
		return FALSE;
	}

	/**
	 * Generates an HTML ordered / unordered list from an single or 
	 * multi-dimensional array and saves it as an Element object.
	 *
	 * @param	string			$elm			Type of HTML list to generate
	 * @param	array			$list			Array of items to allocate as list children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @param	int				$counter		Counter used for recursive indents
	 * @return	object							Returns an Element object
	 * @access	protected
	 * @since	5.0
	 */
	protected function _list($elm = 'ul', $list = array(), $attribs = array(), $counter = 0) {
		$space = (isset($attribs['space'])) ? $attribs['space'] : '&nbsp;';
		$indent = str_repeat($space, ($counter * 4)); 
		$list = array_filter($list);
		$ul = $this->_make($elm, $attribs);
		foreach ($list as $key => $val):
			$li = $this->_make('li');
			if (is_array($val)):
				$li->set('text', $this->_list($elm, $val, $attribs, $counter + 1));
			else:
				$li->set('text', $indent.$val);
			endif;
			$ul->inject($li);
		endforeach;
		return $ul;
	}
	
	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	string			$elm			Element tag name
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _make($elm = NULL, $attribs = array()) {
		$object = new self();
		$object->_elm = STR::mbstrtolower($elm);
		if ($object->_isValidObject($attribs)):
			$attribs = ''.$attribs;
		elseif (isset($attribs['text']) && $object->_isValidObject($attribs['text'])):
			$attribs['text'] = ''.$attribs['text'];
		endif;
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$object->_attribs = $object->_merge($object->_attribs, $attribs);
		return $object;
	}
	
	/**
	 * Merge two values together into a final single array. If value provided
	 * is not an array, it will be converted to an array containing a 'text'
	 * key and the value assigned to this attribute. If any value is NULL, it
	 * will be excluded from the final array.
	 *
	 * @param	mixed			$value1			The first value to merge
	 * @param	mixed			$value2			The second value to merge
	 * @return	array							Returns an array	
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _merge($value1 = array(), $value2 = array()) {
		$array = array();
		if (!is_array($value1)):
			$value1 = array('text' => $value1);
		endif;
		if (!is_array($value2)):
			$value2 = array('text' => $value2);
		endif;
		return array_merge($value1, $value2);
	}
	
	/**
	 * Set Validation
	 *
	 * Checks for a validate attribute during element creation and adds validation criteria
	 * to a validation cache if found. Validation cache ident is formed using current CSRF 
	 * form token hash identifier as the hashed portion of the id. This allows the server 
	 * to auto-generate form field validation rules when a form with a matching CSRF token
	 * is submitted. 
	 *
	 * @uses	CFG::get()
	 * @uses	MC::cache()
	 * @uses	MC::validationId()
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	array							Returns an attribs array (modified if validate attribute is present)	
	 * @access 	protected
	 * @since	5.0
	 */
	protected function _setValidation($attribs = array()) {
		$attribs = (isset($attribs) && is_array($attribs)) ? $attribs : array();
		$noname = (isset($attribs['noname']) && $attribs['noname']);
		if (isset($attribs['name']) && $attribs['name']):
			$name = $attribs['name'];
		elseif (isset($attribs['data-name']) && $attribs['data-name']):
			$name = $attribs['data-name'];
		else: 
			$name = NULL;
		endif;
		if (isset($attribs['label']) && $attribs['label']):
			$label = $attribs['label'];
		elseif (isset($attribs['data-label']) && $attribs['data-label']):
			$label = $attribs['data-label'];
		elseif (isset($attribs['validate']['label']) && $attribs['validate']['label']):
			$label = $attribs['validate']['label'];
		else: 
			$label = NULL;
		endif;
		if (!$noname && !isset($attribs['name']) && isset($attribs['id'])):
			$attribs['name'] = $attribs['id'];
		endif;
		if (isset($attribs['validate']) && is_array($attribs['validate'])):
			unset($attribs['validate']['label']);
			$attribs['data-validate'] = $attribs['validate'];
		elseif (isset($attribs['required']) && $attribs['required']):
			$attribs['data-validate'] = array('required' => TRUE);
		endif;
		/* 20200316 - Commenting out for now until we can build in full validation for Boutique
		if (isset($label, $name, $attribs['data-validate'])):
			// Retrieve current CSRF token id for current form
			$ttl = CFG::get('options', 'csrfExpiration'); 
			$newcache = array();
			$newcache[$name] = array('label' => $label, 'data-validate' => $attribs['data-validate']); 
			$attribs['data-validate'] = json_encode($attribs['data-validate']);
			$cacheId = MC::validationId();
			if ($oldcache = MC::cache($cacheId)):
				$newcache = array_merge($oldcache, $newcache);
			endif;
			MC::cache($cacheId, $newcache, $ttl);
		endif;
 		*/
		unset(
			$attribs['required'],
			$attribs['validate']
		);
		return $attribs;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function a($attribs = array()) {
		if (isset($attribs) && is_string($attribs)):
			$attribs = array('href' => $attribs, 'text' => $attribs, 'target' => '_blank');
		endif;
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create a BootStrap button-icon-text (bit) object using BootStrap styles, CSS font
	 * icons and pseudo elements.
	 *
	 * @uses	STR::uuid()
	 *
	 * @param	string			$parentId		Overall accordion parent HTML identifier value 
	 * @param	array			$sections		Array containing attributes for each section
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function accordion($parentId = NULL, $sections = array()) {
		$output = '';
		if (isset($sections) && is_array($sections)):
			$defaults = array('title' => '', 'text' => '');
			$parentId = (is_string($parentId) && $parentId) ? $parentId : 'ocms_accordion_'.STR::uuid();
			foreach ($sections as $id => $attribs):
				$attribs = array_merge($defaults, $attribs);
				$output .= 
				$this->div(array('class' => 'panel panel-default'))->inject(
					$this->div(array('class' => 'panel-heading'))->inject(
						$this->h4(array('class' => 'panel-title'))->inject(
							$this->a(array('data-toggle' => 'collapse', 'data-parent' => '#'.$parentId, 'href' => '#'.$id, 'text' => $attribs['title']))
						)
					).
					$this->div(array('id' => $id, 'class' => 'panel-collapse collapse'))->inject(
						$this->div(array('class' => 'panel-body'))->inject(
							$this->p($attribs['text'])
						)
					)
				)
				;
			endforeach;
			$output = $this->div(array('id' => $parentId, 'class' => 'panel-group', 'text' => $output));
		endif;
		return $output;
	}
	
	/**
	 * Add one or more classes to an existing attributes array
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @param	string			$class			One or more class strings to add
	 * @return	array							Returns an attributes array		
	 * @access 	public
	 * @since	5.0
	 */
	public function addclass($attribs = array(), $class) {
		if (isset($attribs) && isset($class)):
			$oldclasses = (isset($attribs['class'])) ? array_filter(explode(' ', $attribs['class'])) : array();
			$newclasses = (is_array($class)) ? $class : array_filter(explode(' ', $class));
			$classes = array_merge($oldclasses, $newclasses);
			$attribs['class'] = implode(' ', $classes);
		endif;
		return $attribs;
	}
	
 	/**
	 * Generate an HTML string wrapper for alert elements
	 *
	 * @param	string			$type			Particular type of alert to wrap
	 * @param	string			$message		Alert content to include inside wrap
	 * @param	string			$title			Alert title to include inside wrap
	 * @return	string							Returns an HTML string
	 * @access 	public
	 * @since	5.0
	 */
	public function alert($type = 'info', $message = '', $title = '') {
		$type = (isset($type) && $type) ? $type : 'info';
		$message = (isset($message) && $message) ? $message : '';
		$title = (isset($title) && $title) ? $title : '';
		if ($type && $message):
			return 
			$this->div(array('class' => 'panel panel-alert panel-'.$type))->inject( 
				$this->div(array('class' => 'panel-heading'))->inject( 
					$this->h3(array('class' => 'panel-title', 'text' => $title))
				).
				$this->div(array('class' => 'panel-body', 'text' => $this->it('').$message))
			);
		endif;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function area($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function article($attribs = array()) {
		$defaults = array('role' => __FUNCTION__);
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function aside($attribs = array()) {
		$defaults = array('role' => 'complementary');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function b($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function badge($attribs = array()) {
		if (isset($attribs) && is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->addclass($attribs, 'badge ocms-badge ocms-badge-default');
		return $this->_make('span', $attribs);
	}
	
	/**
	 * Create a HTML header tag element with a default role of "banner". This is
	 * used primarily for the traditional banner seen at the top of a web site.
	 * This element can house primary navigation menus, a large background image,
	 * or other elements that are unique in distinguishing the site's purpose.
	 *
	 * @param	string|array	$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function banner($attribs = array()) {
		$defaults = array('role' => 'banner');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make('header', $attribs);
	}
	
	/**
	 * Create a button-icon-text (bit) object using CSS font icons and pseudo elements
	 *
	 * @param	string			$type			Type of CSS button to create (name of the specific class of button)
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function bit($type, $attribs = array()) {
		if (isset($type) && isset($attribs)):
			$defaults = array('aria-hidden' => 'true');
			$attribs = $this->addclass($attribs, 'icon icon-'.$type);
			if (isset($attribs['data-helptip']) && $attribs['data-helptip']):
				$attribs = $this->addclass($attribs, 'helptip');
			endif;
			if (isset($attribs['text']) && $attribs['text']):
				$attribs['text'] = ' '.trim($attribs['text']);
			endif;
			$attribs = $this->_merge($defaults, $attribs);
			return $this->button($attribs);
		endif;
	}
	
	/**
	 * Create a BootStrap button-icon-text (bit) object using BootStrap styles, CSS font
	 * icons and pseudo elements.
	 *
	 * @param	string			$type			Type of CSS button to create (name of the specific class of button)
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function bitbs($type, $attribs = array()) {
		if (isset($type)):
			$attribs = (isset($attribs) && is_array($attribs)) ? $attribs : array();
			$attribs = $this->addclass($attribs, 'icon-light btn btn-primary');
			return $this->bit($type, $attribs);
		endif;
	}
	
	/**
	 * Create a body open tag element
	 *
	 * @param	string|array	$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function body($attribs = array()) {
		return $this->_make('body', $attribs);
	}
	
	/**
	 * Create a body close tag element
	 *
	 * @return	string							Returns a body close tag	
	 * @access 	public
	 * @since	5.0
	 */
	public function bodyclose() {
		return $this->close('body');
	}
	
	/**
	 * Create a body open tag element
	 *
	 * @param	string|array	$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function bodyopen($attribs = array()) {
		$attribs = array_merge($attribs, array('close' => FALSE));
		return $this->_make('body', $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function box($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function br($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Shortcut for creating Bootstrap compatible primary buttons with standard styles
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @param	array			$size			Size of button type to create. Defaults to normal (blank). OPTIONS:(xs|sm|''|lg|block)
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function btn($attribs = array(), $size = '') {
		$defaults = array('type' => 'button', 'title' => '', 'text' => '');
		$baseClass = 'btn'.(($size) ? ' btn-'.$size : '');
		$attribs = $this->addclass($attribs, $baseClass.' btn-primary');
		$attribs = $this->_merge($defaults, $attribs);
		if (isset($attribs['action']) && isset($attribs['prefix'])):
			$attribs = $this->addclass($attribs, str_replace('_', '-', $attribs['prefix']).'-'.$attribs['action']);
			$attribs['data-action'] = $attribs['action'];
			if (!isset($attribs['id'])):
				$attribs['id'] = $attribs['prefix'].'_'.str_replace('-', '_', $attribs['action']);
			endif;
			if (!isset($attribs['title']) || !$attribs['title']):
				$attribs['title'] = ucfirst($attribs['text']);
			endif;
			$attribs['text'] = 
				$this->i(array('class' => 'btn-icon btn-icon-left btn-icon-'.$attribs['action'].' fa tt', 'title' => $attribs['title'])).
				$this->span(array('class' => 'btn-text', 'text' => $attribs['text']))
			;
			unset($attribs['action'], $attribs['prefix'], $attribs['title']);
		endif;
		return $this->_make('button', $attribs);
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function btnBlock($attribs = array()) {
		return $this->btn($attribs, 'block');
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function btnLg($attribs = array()) {
		return $this->btn($attribs, 'lg');
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function btnSm($attribs = array()) {
		return $this->btn($attribs, 'sm');
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function btnXs($attribs = array()) {
		return $this->btn($attribs, 'xs');
	}

	/**
	 * Create an HTML element returned as an Element object and add
	 * one or more key=value attributes to the object. Returns an object 
	 * of type Element so additional methods can be run against the object
	 * if needed.
	 *
	 * @param	boolean			$close			If FALSE, method will only output the opening element, otherwise element will be closed.
	 * @return	string							Returns an HTML string of one or more elements with attributes	
	 * @access 	public
	 * @since	5.0
	 */
	public function build($close = TRUE) {
		return $this->_build($close);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function button($attribs = array()) {
		$defaults = array('type' => 'button');
		$attribs = $this->addclass($attribs, 'btn');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create a link canonical element and return as an Element object.
	 *
	 * @param	string			$href			String value to assign to 'href' attribute
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function canonical($href = NULL) {
		if (!isset($href)):
			//$href = URLS::permalink();
		endif;
		return $this->_make('link', array('rel' => 'canonical', 'href' => $href));
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function checkbox($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function checkboxToggle($attribs = array()) {
		$overrides = array('value' => '1', 'nowrap' => TRUE);
		return $this->inputWrap(
			$this->label([
				'class'	=> 'switch switch-primary switch-yesnos',
				'text' 	=>	$this->checkbox($this->_merge($attribs, $overrides)).
							$this->span().
							$this->div()
			]),
			$attribs
		);
	}
	
	/**
	 * Generates a nested list of checkboxes and labels based on a one or multi-
	 * dimensional array.
	 *
	 * @param	array			$list			Array of items to allocate as list children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @param	int				$counter		Counter used for recursive indents
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function checklist($list = array(), $attribs = array(), $counter = 0) {
		$list = array_filter($list);
		$attribs = array_filter($attribs);
		$checked = (isset($attribs['checked'])) ? $attribs['checked'] : array();
		$indent = (isset($attribs['indent'])) ? $attribs['indent'] : 10;
		$margin = ($counter * $indent); 
		$ul = $this->ul(array(), array('style' => 'margin-left:'.$margin.'px;')); 
		foreach ($list as $key => $val):
			$li = $this->_make('li');
			if (is_array($val)):
				$li->inject($this->checklist($val, $attribs, $counter + 1));
			else:
				$cbattribs = $this->_merge($attribs, array('value' => $key));
				if (in_array($key, $checked)):
					$cbattribs['checked'] = 'checked';
				endif;
				$lab = $this->label();
				$lab->inject($this->checkbox($cbattribs).$val);
				$li->inject($lab);
			endif;
			$ul->inject($li);
		endforeach;
		return $ul;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cite($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Generate a closing string tag for an HTML element
	 *
	 * @param	string			$elm			The tag name of the element to close
	 * @return	string							Returns the HTML closing tag string
	 * @access 	public
	 * @since	5.0
	 */
	public function close($elm = NULL) {
		return (!in_array($elm, $this->_closed)) ? '</'.$elm.'>' : ' />';
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function code($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Provide an array of color names and their corresponding RGB values
	 *
	 * @return	array							Returns an array of color names => color rgb values
	 * @access 	public
	 * @since	5.0
	 */
	public function colorNameToRGBs() {
		return $this->_colorNameToRGBs;
	}

	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function combobox($options = array(), $attribs = array()) {
		$defaults = array('combobox' => TRUE);
		$attribs = $this->_merge($defaults, $attribs);
		return $this->select($options, $attribs);
	}
	
	/**
	 * Create an HTML, JS, CSS or conditional comment string
	 *
	 * The default option when building a comment tag is a standard HTML comment.
	 * Because this method returns a finalized HTML string and not an Element 
	 * object, you must specify your inner HTML text using the 'text' attribute
	 * during the same call to this method. 
	 * 
	 * You also have the option to specify a 'cc' attribute in order to add a 
	 * 'conditional comment' (versus a standard HTML comment). These conditional
	 * comments are recognized by Microsoft's Internet Explorer web browser only 
	 * but can be very useful when attempting to circumvent the various bugs in
	 * earlier versions of IE. To make a comment conditional, simply add a 'cc' 
	 * key to your attributes array and set it's value equal to any valid IE
	 * conditional statement. To save you a few extra characters, you are not
	 * required to include the starting 'if' portion of the statement as it gets
	 * automatically added during comment creation.
	 *
	 * @examples from link: http://en.wikipedia.org/wiki/Conditional_comment
	 *
	 *	Item 	Example 					Comment
	 * 	------	--------------------------	---------------------------------------------------------------------------------------------------------------------------
	 * 	! 		[if !IE] 					The NOT operator. Placed immediately in front of the feature, operator, or subexpression to reverse the Boolean meaning.
	 * 	lt 		[if lt IE 5.5] 				The less-than operator. Returns true if the first argument is less than the second argument.
	 * 	lte 	[if lte IE 6] 				The less-than or equal operator. Returns true if the first argument is less than or equal to the second argument.
	 * 	gt 		[if gt IE 5] 				The greater-than operator. Returns true if the first argument is greater than the second argument.
	 * 	gte 	[if gte IE 7] 				The greater-than or equal operator. Returns true if the first argument is greater than or equal to the second argument.
	 * 	( ) 	[if !(IE 7)] 				Subexpression operators. Used in conjunction with boolean operators to create more complex expressions.
	 * 	& 		[if (gt IE 5)&(lt IE 7)] 	The AND operator. Returns true if all subexpressions evaluate to true
	 * 	| 		[if (IE 6)|(IE 7)] 			The OR operator. Returns true if any of the subexpressions evaluates to true.	 
	 * 
	 *
	 * @link 	http://en.wikipedia.org/wiki/Conditional_comment
	 *
	 *
	 * @param	string|array	$attribs		String comment or key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function comment($attribs = array()) {
		$defaults = array('text' => '', 'type' => 'html');
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		$keycc = in_array('cc', array_keys($attribs));
		if ($attribs['type'] == 'block'):
			$co = '/*'."\n";
			$cc = "\n".'*/';
		elseif ($attribs['type'] == 'single'):
			$co = '//';
			$cc = "\n";
		else:
			$co = '<!--'.(($keycc === FALSE) ? ' ' : '[if '.ltrim($attribs['cc'],'if').']>');
			$cc = (($keycc === FALSE) ? ' ' : '<![endif]').'-->';
		endif;
		return $co.$attribs['text'].$cc;
	}
	
	/**
	 * Create a block comment used in Javascript or CSS
	 *
	 * @param	string|array	$attribs		String comment or key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function commentBlock($attribs = array()) {
		$defaults = array('text' => '', 'type' => 'block');
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		return $this->comment($attribs);
	}
	
	/**
	 * Create a block comment used in Javascript or CSS
	 *
	 * @param	string|array	$attribs		String comment or key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function commentSingle($attribs = array()) {
		$defaults = array('text' => '', 'type' => 'single');
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		return $this->comment($attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function container($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->addclass($attribs, 'container');
		return $this->div($attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function containerDanger($attribs = array()) {
		$defaults = array();
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		$container = 
			$this->div(array('class' => 'container'))->inject(
				$this->div(array('class' => 'alert alert-danger text-left'))->inject(
					$this->div($attribs)
				)
			)
		;
		return $container;
	}

	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function containerFluidDanger($attribs = array()) {
		$defaults = array();
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		$container = 
			$this->div(array('class' => 'container-fluid'))->inject(
				$this->div(array('class' => 'alert alert-danger text-left'))->inject(
					$this->div($attribs)
				)
			)
		;
		return $container;
	}

	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function containerFluid($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->addclass($attribs, 'container-fluid');
		return $this->div($attribs);
	}
	
	/**
	 * Create a traditional checkbox or radio button object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function csscheck($attribs = array(), $class = 'csscheck') {
		$text = '';
		$defaultClasses = 'icon icon-radio-unchecked';
		if (in_array('text', array_keys($attribs))):
			$text = $attribs['text'];
			unset($attribs['text']);
		endif;
		$labelAttribs = (isset($attribs['id'])) ? array('for' => $attribs['id']) : array();
		$labelAttribs['text'] = 
			((preg_match('/(group|radio)/i', $class)) ? $this->radio($attribs) : $this->checkbox($attribs)).
			$this->span(array('class' => $class.' '.$defaultClasses)).
			$this->span(array('class' => 'csslabel', 'text' => $text))
		;
		return $this->label($labelAttribs);
	}
	
	/**
	 * Create an (x) checkbox object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssdelete($attribs = array()) {
		return $this->csscheck($attribs, __FUNCTION__);
	}
	
	/**
	 * Create a traditional checkbox object to regulate a tabbed list using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssgroup($attribs = array()) {
		return $this->cssradio($attribs, __FUNCTION__);
	}

	/**
	 * Create a plussed (+) checkbox object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssplus($attribs = array()) {
		return $this->csscheck($attribs, __FUNCTION__);
	}
	
	/**
	 * Create a traditional (o) radio button object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssradio($attribs = array(), $class = 'cssradio') {
		return $this->csscheck($attribs, $class);
	}

	/**
	 * Create a pre-checked (but hidden until selected) checkbox object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssselect($attribs = array()) {
		return $this->csscheck($attribs, __FUNCTION__);
	}
	
	/**
	 * Create a favorite (star) checkbox object using CSS properties and pseudo elements
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function cssstar($attribs = array()) {
		return $this->csscheck($attribs, __FUNCTION__);
	}
	
	/**
	 * Generates an HTML datalist from an array and returns results as an Element object
	 *
	 * Datalists elements differ from their elder brethren, the select element, in that
	 * the datalist element provides the end user with one or more options they can select
	 * or they also have the option of manually entering a new value as well. Like the 
	 * select element, you can also specify an attribute of 'selected' if you wish for
	 * a particular option to be pre-selected when echoing out the final response.
	 *
	 * @param	array			$options		Array of option items to allocate as datalist children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function datalist($options = array(), $attribs = array()) {
		$selected = NULL;
		if (in_array('selected', array_keys($attribs))):
			$selected = $attribs['selected'];
			unset($attribs['selected']);
		endif;
		$dl = $this->_make(__FUNCTION__, $attribs);
		foreach ($options as $val => $text):
			$optattribs = array('value' => $val, 'text', $text);
			if (isset($selected) && $selected == $val):
				$optattribs['selected'] = 'selected';
			endif;
			$opt = $this->_make('option', $optattribs);
			$dl->inject($opt);
		endforeach;
		return $dl;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function date($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function datetime($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
 	/**
	 * Generate an HTML string wrapper for alert elements to use within a popup dialog element
	 *
	 * @param	string			$type			Particular type of alert to wrap
	 * @param	string			$message		Alert content to include inside wrap
	 * @param	string			$title			Alert title to include inside wrap
	 * @param	string			$buttons		HTML string (or object of this class) containing one or more button elements to use in dialog footer area
	 * @return	string							Returns an HTML string
	 * @access 	public
	 * @since	5.0
	 */
	public function dialert($type = 'default', $message = '', $title = '', $buttons = '') {
		if ($type && $message):
			return sprintf($this->dialog(), 'modal-alert modal-'.$type, 'alert', $title, $message, $buttons);
		endif;
	}
	
 	/**
	 * Generate a printf-able HTML string wrapper for dialog elements
	 *
	 * Elements requiring replacement: 
	 * 		1. Dialog Class (in additional to default classes)
	 * 		2. Dialog ID (appended with _dialog)
	 *		3. Dialog Title (for dialog header area)
	 *		4. Dialog Text (for dialog message area)
	 *		5. Dialog Buttons (a close button is already provided by default)
	 *
	 * @param	string		$prefix				Prefix string to assign to various button attributes
	 * @param	string		$classes			One or more CSS classes separated by spaces
	 * @return	string							Returns an HTML string or Element class object
	 * @access 	public
	 * @since	5.0
	 */ 
	public function dialog($prefix = NULL, $classes = '') {
		$uuid = STR::mbstrtolower(STR::uid(6));
		$prefix = (isset($prefix) && is_string($prefix) && $prefix) ? $prefix : 'btn_'.$uuid;
		$classes = (isset($classes) && is_string($classes) && $classes) ? $classes : '';
		return 
		$this->div(array('class' => 'modal fade %s', 'id' => '%s_dialog', 'data-keyboard' => 'false', 'data-backdrop' => 'static'))->inject(
			$this->div(array('class' => 'modal-dialog '.$classes))->inject(
				$this->div(array('class' => 'modal-content'))->inject(
					$this->div(array('class' => 'modal-header'))->inject(
						$this->i(array('class' => 'fa fa-times-circle btn-modal-close tt', 'data-dismiss' => 'modal', 'title' => 'Close this dialog')).
						$this->h3(array('text' => '%s'))
					).
					$this->div(array('class' => 'modal-body', 'text' => '%s')).
					$this->div(array('class' => 'modal-footer'))->inject(
						$this->div(array('class' => 'btn-group'))->inject(
							$this->btn(array('id' => 'dialog_close_'.$uuid, 'prefix' => $prefix, 'action' => 'close', 'text' => T::_('Close'), 'data-dismiss' => 'modal')).
							$this->btn(array('id' => 'dialog_help_'.$uuid, 'prefix' => $prefix, 'action' => 'help', 'text' => T::_('Help'), 'class' => 'btn-help')).
							'%s'
						)
					)
				)
			)
		);
	}
	
 	/**
	 * Generate advanced panel button.
	 *
	 * @param	string		$prefix				Unique identifier string for the dialog in question
	 * @param	array		$attribs			Element key-value attributes array
	 * @return	string							Returns an HTML string or Element class object
	 * @access 	public
	 * @since	5.0
	 */
	public function dialogPanelButtonAdvanced($prefix = '', $attribs = array()) {
		$defaults = array(
			'id' => 'btn_'.$prefix.'_advanced', 
			'prefix' => $prefix, 
			'action' => 'advanced', 
			'data-navigate' => $prefix.'_advanced', 
			'text' => T::_('Advanced')
		);
		$attribs = array_merge($defaults, $attribs);

		return $this->btn($attribs);
	}
	
 	/**
	 * Generate general panel button.
	 *
	 * @param	string		$prefix				Unique identifier string for the dialog in question
	 * @param	array		$attribs			Element key-value attributes array
	 * @return	string							Returns an HTML string or Element class object
	 * @access 	public
	 * @since	5.0
	 */
	public function dialogPanelButtonGeneral($prefix = '', $attribs = array()) {
		$defaults = array(
			'id' => 'btn_'.$prefix.'_general', 
			'prefix' => $prefix, 
			'action' => 'general', 
			'class' => 'active', 
			'data-navigate' => $prefix.'_general', 
			'text' => T::_('General')
		);
		$attribs = array_merge($defaults, $attribs);

		return $this->btn($attribs);
	}
	
 	/**
	 * Generate styles panel buttons to enable switching between panel content and styles.
	 *
	 * @param	string		$prefix				Unique identifier string for the dialog in question
	 * @return	string							Returns an HTML string or Element class object
	 * @access 	public
	 * @since	5.0
	 */
	public function dialogPanelButtonsGeneralAdvanced($prefix = '') {
		$btnSegment = $this->div(array('class' => 'btn-group segmented-control'))->inject(
			$this->dialogPanelButtonGeneral($prefix).
			$this->dialogPanelButtonAdvanced($prefix)
		);

		return $btnSegment;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function div($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML DOCTYPE string based on a specific identifier type
	 *
	 * @param	string			$type		Specific doctype to build
	 * @return	string						Returns the full doctype string
	 * @access 	public
	 * @since	5.0
	 */
	public function doctype($type = 'xhtml1-trans') {
		return in_array($type, array_keys($this->_doctypes)) ? $this->_doctypes[$type] : ''; 
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function em($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function email($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}

	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @uses 	STR::mbucwords()
	 *
	 * @param	string			$type			Embedded resource type
	 * @param	string			$code			Embedded resource text or code
	 * @param	string			$title			Embedded resource title
	 * @param	string			$description	Embedded resource description
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function embedded($type = 'video', $code = '', $title = '', $description = '', $attribs = array()) {
		$defaults = array();
		$classes = 'embedded-resource-figure text-center embed-responsive';
		if ($type === 'video'):
			$classes .= ' embed-responsive-16by9';
		endif;
		$embed = 
			$this->div(array('class' => 'embedded-resource'))->inject(
            	$this->figure(array('class' => 'embedded-resource-figure text-center embed-responsive embed-responsive-16by9', 'text' => $code)).
            	$this->figcaption(array('class' => 'text-center', 'text' => $this->em(STR::mbucwords($title))))
        	).
        	$this->p($description)
        ;
        $attribs = $this->_merge($defaults, $attribs);
        $attribs['text'] = $embed;
		return $this->div($attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @uses 	STR::mbucwords()
	 *
	 * @param	string			$code			Embedded resource text or code
	 * @param	string			$title			Embedded resource title
	 * @param	string			$description	Embedded resource description
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function embeddedVideo($code = '', $title = '', $description = '', $attribs = array()) {
		$type = 'video';
		return $this->embedded($type, $code, $title, $description, $attribs);
	}
	
	/**
	 * Create the two standard link tags for favicons and return as a string.
	 *
	 * @return	string						HTML string containing two standard favicon link tags
	 * @access 	public
	 * @since	5.0
	 */
	public function favicons() {
		return 	$this->_make('link', array('rel' => 'shortcut icon', 'type' => 'image/gif', 'href' => '/favicon.gif'))->build().
				$this->_make('link', array('rel' => 'shortcut icon', 'type' => 'image/ico', 'href' => '/favicon.ico'))->build();
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function fieldset($attribs = array()) {
		$defaults = array('legend' => '', 'text' => '');
		$attribs = $this->_merge($defaults, $attribs);
		$legend = $this->legend($attribs['legend']);
		$attribs['text'] = $legend.$attribs['text'];
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function figcaption($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function figure($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function file($attribs = array()) {
		$attribs = $this->addclass($attribs, 'form-control-file');
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function footer($attribs = array()) {
		$defaults = array('role' => 'complementary');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * HTML5 brings some new options for form elements:
	 * ------------------------------------------------
     * 		autocomplete: When autocomplete is on, the browser automatically complete values based on values that the user has entered before.
     * 		novalidate: When present, it specifies that the form-data (input) should not be validated when submitted.
	 *
	 * Enctype Options:
	 * ----------------
	 * 	application/x-www-form-urlencoded
	 *		- Default. All characters are encoded before sent (spaces converted to "+" symbols, special chars converted to ASCII HEX)
	 * 	multipart/form-data
	 * 		- No characters are encoded. This value is required when you are using forms that have a file upload control.
	 * 	text/plain
	 * 		- Spaces are converted to "+" symbols, but no special characters are encoded.
	 *
	 * @uses 	CFG::get()
	 * @uses 	PRM::get()
	 * @uses 	SEC::gtHashCSRF()
	 * @uses 	STR::mbstrpos()
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function form($attribs = array()) {
		$defaults = array(
			'action' 			=> '',
			'method' 			=> 'post',
			'enctype' 			=> 'application/x-www-form-urlencoded',
			'class' 			=> 'form-horizontal',
			'accept-charset'	=> CFG::get('app.charset'),
			'text' 				=> '',
		);
		$attribs = $this->_merge($defaults, $attribs);
		//Log::debug(T::_('...Injecting a hidden field into the current form to support HTTP method tracking.'));
		if (preg_match('/^(DELETE|PUT)$/i', $attribs['method'])): 
			$attribs['text'] .= $this->hidden(array('name' => '_method', 'value' => $attribs['method']));
			$attribs['method'] = 'post';
		endif;
		/* Add CSRF field if enabled, but leave it out for GET requests and requests to external websites */
		if (STR::mbstrtolower($attribs['method']) !== 'get'):
			//Log::debug(T::_('...Injecting a hidden field into the current form to support CSRF filtering. Hash value: ['.$hash.']'));
			$attribs['text'] .= $this->hidden(array('name' => '_token', 'value' => csrf_token()));
		endif;
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create a generic comment submission form based on a specific content id.
	 * This method currently returns a blank string since it still needs to be 
	 * built and page output is currently in flex so we are waiting to see what
	 * is required before updating this method.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function formComments($attribs = array()) {
		$defaults = array();
		$attribs = $this->_merge($defaults, $attribs);
		return '';
	}
	
	/**
	 * Retrieve an attribute from an Element object
	 *
	 * @param	string			$attribute		String attribute name
	 * @return	mixed							Returns the value of the requested attributes
	 * @access 	public
	 * @since	5.0
	 */
	public function get($attribute) {
		return $this->_attribs[$attribute];
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h1($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h2($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h3($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h4($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h5($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML header tag element.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function h6($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML head element.
	 *
	 * @param	string			$text			String value to assign to 'text' attribute
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function head($text = '') {
		return $this->_make(__FUNCTION__, array('text' => $text));
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function header($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function help($attribs = array()) {
		$attribs = $this->addclass($attribs, 'help-block');
		return $this->_make('span', $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function hidden($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('id' => $attribs);
		endif;
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function hr($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create a HTML close tag element
	 *
	 * @return	string							Returns an HTML close tag	
	 * @access 	public
	 * @since	5.0
	 */
	public function htmlclose() {
		return $this->close('html');
	}
	
	/**
	 * Create a HTML open tag element
	 *
	 * @param	string|array	$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function htmlopen($attribs = array()) {
		$defaults = array('xmlns' => 'http://www.w3.org/1999/xhtml', 'lang' => 'en_US');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make('html', $attribs)->build(FALSE);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function i($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function iframe($attribs = array()) {
		$defaults = array('src' => '');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array|string		$attribs	Element key-value attributes array or single string src attribute value
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function img($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('src' => $attribs);
		endif;
		$defaults = array('alt' => '', 'class' => 'img-responsive');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Inject innerHTML into an existing Element object
	 *
	 * @param	string|object		$value		Either a string or Element object type
	 * @return	objec							Returns an object of type Element
	 * @access 	public
	 * @since	5.0
	 */
	public function inject($value = NULL) {
		if (isset($value)):
			if (!isset($this->_attribs['text'])):
				$this->_attribs['text'] = '';
			endif;
			if (is_string($value)):
				$this->_attribs['text'] .= $value;
			elseif ($this->_isValidObject($value)):
				$this->_attribs['text'] .= $value->build();
			endif;
		endif;
		return $this;
	}
		
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * HTML4/5 valid input element types: 
	 *
	 * 		button, checkbox, color, date, datetime, datetime-local, email, file, hidden, image, month, 
	 *		number, password, radio, range, reset, search, submit, tel, text, time, url, week 
	 *
	 * HTML5 brings some new options for form input elements:
	 *		
	 *		autocomplete		When autocomplete is on, the browser automatically complete values based on values that the user has entered before.
	 *							Works with: text, search, url, tel, email, password, datepickers, range, and color.
	 *		autofocus	 		When present, it specifies that an <input> element should automatically get focus when the page loads.
	 *		form				The form attribute specifies one or more forms an <input> element belongs to.
	 *		formaction			The formaction attribute specifies the URL of a file that will process the input control when the form is submitted.
	 *							Works with: submit, image.
	 *		formenctype			The formenctype attribute specifies how the form-data should be encoded when submitting it to the server (only with method="post").  
	 *							Works with: submit, image.
	 *		formmethod			The formmethod attribute defines the HTTP method for sending form-data to the action URL. 
	 *							Works with: submit, image.
	 *		formnovalidate		When present, it specifies that the <input> element should not be validated when submitted.
	 *		formtarget			The formtarget attribute specifies a name or a keyword that indicates where to display the response that is received after submitting the form.
	 *		height/width		The height and width attributes specify the height and width of an <input> element (only used with <input type="image">).
	 *		list				The list attribute refers to a <datalist> element that contains pre-defined options for an <input> element.
	 *		min/max				The min and max attributes specify the minimum and maximum value for an <input> element. 
	 *							Works with: number, range, date, datetime, datetime-local, month, time and week.
	 *		multiple			When present, it specifies that the user is allowed to enter more than one value in the <input> element. 
	 *							Works with: email, file.
	 *		pattern (regexp)	The pattern attribute specifies a regular expression that the <input> element's value is checked against. 
	 *							Works with: text, search, url, tel, email, and password.
	 *		placeholder			Specifies a short hint that describes the expected value of an input field. Works with: text, search, url, tel, email, and password.
	 *		required			When present, it specifies that an input field must be filled out before submitting the form. 
	 *							Works with: text, search, url, tel, email, password, date pickers, number, checkbox, radio, and file.
	 *		step				The step attribute specifies the legal number intervals for an <input> element. Example: if step="3", legal numbers could be -3, 0, 3, 6, etc.
	 *							Works with: number, range, date, datetime, datetime-local, month, time and week.
	 *
	 * @param	string			$type			Type of input element to create
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function input($type = 'text', $attribs = array()) {
		$defaults = array(
			'help'			=> FALSE, 
			'help-visible'	=> FALSE, 
			'label' 		=> '', 
			'labelclass'	=> '', 
			'maxlength' 	=> '128', 
			'noname' 		=> FALSE, 
			'swaplabel'		=> FALSE,
			'toggle'		=> FALSE,
			'type' 			=> $type, 
			'value' 		=> '', 
			'wrapclass'		=> '', 
		);
		$attribs = $this->_merge($defaults, $attribs);
		$wrapAttribs = $attribs;
		$elm = __FUNCTION__;
		$noname = (isset($attribs['noname']) && $attribs['noname']);
		$cols = (isset($attribs['cols'])) ? $attribs['cols'] : FALSE;
		$size = (isset($attribs['size'])) ? $attribs['size'] : FALSE;
		$nowrap = (isset($attribs['nowrap'])) ? $attribs['nowrap'] : ((preg_match('/^(checkbox|hidden|radio)$/i', $type) && empty($attribs['label'])) ?: FALSE);
		if (!preg_match('/^hidden$/i', $type)):
			$fcc = ((preg_match('/^pseudo$/i', $type)) ? 'pseudo-' : '').'form-control';
			$attribs = $this->addclass($attribs, $fcc);
		endif;
		if ($attribs['type'] !== 'text'):
			unset($attribs['maxlength']);
		endif;
		if (!$noname && !isset($attribs['name']) && isset($attribs['id'])):
			$attribs['name'] = $attribs['id'];
		endif;
		$attribs = $this->_setValidation($attribs);
		if ($noname):
			unset($attribs['name']);
		endif;
		unset(
			$attribs['cols'], 
			$attribs['help'], 
			$attribs['help-visible'], 
			$attribs['label'], 
			$attribs['labelclass'],
			$attribs['noname'], 
			$attribs['nowrap'], 
			$attribs['size'], 
			$attribs['toggle'], 
			$attribs['swaplabel'], 
			$attribs['wrapclass']
		);
		if ($type === 'pseudo'):
			unset($attribs['type'], $attribs['value']);
			$elm = 'div';
		endif;
		$input = $this->_make($elm, $attribs);
		if ($cols && $nowrap):
			$input = $this->div(array('class' => 'col-'.$size.'-'.$cols))->inject($input);
		endif;
		return ($nowrap) ? $input : $this->inputWrap($input, $wrapAttribs);
	}
	
	/**
	 * Create a bootstrap compatible wrapping div and label for a standard form field
	 *
	 * Just a quick note here about nesting Bootstrap columns. If you want to wrap several
	 * fields inline with a label, simply do the normal split between label and field area
	 * (eg: col-xs-4 + col-xs-8), and then inside the fields column, wrap each field in its
	 * own respective col-xs-* div. The trick is to assign column sizes to the internal divs
	 * as though those divs were taking up 100 percent of the width (bootstrap max defaults
	 * to 12 column layouts). This will force them to occupy the full expanse within the 
	 * field area, but not exceed that space into the normal label area. See below for an
	 * actual example based on current usage. Note: The "form-group-inline" class is my own 
	 * custom class that makes adjustments to field padding based on various factors to ensure
	 * everything lines up neatly. This class replaces the standard "form-group" class.
	 *
	 * <div class="form-group-inline">
	 * 		<label class="col-xs-4">My Label</div>
	 * 		<div class="col-xs-8">
	 * 			<div class="col-xs-3"><input name="my_first_field" type="text" /></div>
	 * 			<div class="col-xs-9"><input name="my_second_field" type="text" /></div>
	 * 		</div>
	 * </div>
	 *
	 * @param	object			$input			Input object of type Element		
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function inputWrap($input = NULL, $attribs = array()) {
		if (isset($input) && isset($attribs) && is_array($attribs)):
			$isCMS = (request()->is('admin/*'));
			$defaults = array(
				'cols' 			=> (($isCMS) ? 9 : 8), 
				'for' 			=> '', 
				'help' 			=> FALSE,
				'help-visible' 	=> FALSE,
				'label' 		=> '', 
				'size' 			=> (($isCMS) ? 'xs' : 'md'), 
				'swaplabel'		=> FALSE,
				'inline'		=> FALSE,
				'labelclass'	=> '', 
				'wrapclass'		=> '', 
			);
			$attribs = array_merge($defaults, $attribs);
			$cols = (isset($attribs['cols'])) ? $attribs['cols'] : 8;
			$size = (isset($attribs['size'])) ? $attribs['size'] : 'xs';
			/* Unset all field (non-wrap) related attributes */
			unset(
				$attribs['blankoption'],
				$attribs['maxlength'], 
				$attribs['noname'], 
				$attribs['nowrap'], 
				$attribs['required'],
				$attribs['selected'], 
				$attribs['space'], 
				$attribs['spacerepeat'],
				$attribs['type'], 
				$attribs['validate'],
				$attribs['value'], 
				$attribs['wrap']
			);
			$swaplabel = FALSE;
			$label = $helpblock = $helpblockvisible = '';
			if (isset($attribs['swaplabel'])):
				$swaplabel = $attribs['swaplabel'];
				unset($attribs['swaplabel']);
			endif;
			if (isset($attribs['id'])):
				$attribs['for'] = $attribs['id'];
				unset($attribs['id']);
			endif;
			if (!empty($attribs['text'])):
				$attribs['text'] = ' '.trim($attribs['text']);
			endif;
			if (!empty($attribs['label'])):
				$cols = number_format(12 - $attribs['cols']);
				$cols = ($cols) ? $cols : 12;
				$class = 'col-'.$attribs['size'].'-'.$cols;
				$class .= ($swaplabel) ? ' label-right' : '';
				$class .= (!empty($attribs['labelclass'])) ? ' '.$attribs['labelclass'] : '';
				$labAttribs = array('class' => $class, 'for' => $attribs['for'], 'text' => $attribs['label']);
				$label = $this->label($labAttribs);
			endif;
			if (!empty($attribs['help'])):
				$helpblock = $this->span(array('class' => 'help-block'.(($isCMS) ? ' animation-slideDown' : ''), 'text' => $attribs['help']));
			endif;
			if (!empty($attribs['help-visible'])):
				$helpblockvisible = $this->span(array('class' => 'help-block-visible', 'text' => $attribs['help-visible']));
			endif;
			$groupClass = 'form-group'.((isset($attribs['inline']) && $attribs['inline']) ? '-inline' : '').' '.$attribs['wrapclass'];
			$grpWrapAttribs = array('class' => $groupClass);
			$inpWrapAttribs = array('class' => 'col-'.$attribs['size'].'-'.$attribs['cols']);
			$labellft = ($swaplabel) ? '' : $label;
			$labelrgt = ($swaplabel) ? $label : '';
			$input = $this->div($grpWrapAttribs)->inject($labellft.$this->div($inpWrapAttribs)->inject($input.$helpblock.$helpblockvisible).$labelrgt);
		endif;
		return $input;
	}
	
	/**
	 * Create an icon-text (it) object using CSS font icons and pseudo elements
	 *
	 * @param	string			$type			Type of CSS button to create (name of the specific class of button)
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns a label object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function it($type, $attribs = array()) {
		if (isset($type)):
			$defaults = array('aria-hidden' => 'true');
			$attribs = (isset($attribs) && is_array($attribs)) ?  $attribs : array();
			$attribs = $this->addclass($attribs, 'icon icon-'.$type);
			if (isset($attribs['data-helptip']) && $attribs['data-helptip']):
				$attribs = $this->addclass($attribs, 'helptip');
			endif;
			if (isset($attribs['text']) && $attribs['text']):
				$attribs['text'] = ' '.trim($attribs['text']);
			endif;
			$attribs = $this->_merge($defaults, $attribs);
			return $this->span($attribs);
		endif;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function label($attribs = array()) {
		if (!is_array($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$defaults = array();
		$attribs = array_merge($defaults, $attribs);
		$attribs = $this->addclass($attribs, 'control-label');
		$cols = (isset($attribs['cols'])) ? $attribs['cols'] : FALSE;
		$size = (isset($attribs['size'])) ? $attribs['size'] : FALSE;
		if ($cols && $size):
			$attribs = $this->addclass($attribs, 'cols-'.$size.'-'.$cols);
		endif;
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function labelExpress($attribs = array()) {
		if (!is_array($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$defaults = array();
		$attribs = array_merge($defaults, $attribs);
		$cols = (isset($attribs['cols'])) ? $attribs['cols'] : FALSE;
		$size = (isset($attribs['size'])) ? $attribs['size'] : FALSE;
		if ($cols && $size):
			$attribs = $this->addclass($attribs, 'cols-'.$size.'-'.$cols);
		endif;
		return $this->_make('label', $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function legend($attribs = array()) {
		$defaults = array();
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function li($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function lines($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function link($attribs = array()) {
		$defaults = array('rel' => 'stylesheet', 'media' => 'all', 'type' => 'text/css', 'href' => '');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function main($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function map($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Generates an HTML meta tag based on the $name parameter and returns 
	 * results as an Element object.
	 *
	 * @param	string			$name			Name attribute string of the meta tag
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function meta($name = '', $content = '') {
		return $this->_make(__FUNCTION__, array('name' => $name, 'content' => $content));
	}
	
	/**
	 * Generates an HTML meta author tag and returns results as an Element object.
	 *
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metaauth($content = '') {
		return $this->meta('author', $content);
	}
	
	/**
	 * Generates an HTML meta charset tag and returns results as an Element object.
	 *
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metacharset($content = 'UTF-8') {
		return $this->meta('charset', $content);
	}
	
	/**
	 * Generates an HTML meta description tag and returns results as an Element object.
	 *
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metadesc($content = '') {
		return $this->meta('description', $content);
	}
	
	/**
	 * Generates an HTML meta X-UA-Compatible tag and returns results as an Element object.
	 *
	 * @param	string			$equiv			String value to place in the http-equiv attribute
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metaedge() {
		$comment = $this->comment('Always force latest IE rendering engine (even in intranet) & Chrome Frame');
		return $comment.$this->metaequiv('X-UA-Compatible', 'IE=edge,chrome=1');
	}
	
	/**
	 * Generates an HTML meta content type tag and returns results as an Element object.
	 *
	 * @param	string			$equiv			String value to place in the http-equiv attribute
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metaequiv($equiv = 'Content-Type', $content = 'text/html; charset=UTF-8') {
		return $this->_make('meta', array('http-equiv' => $equiv, 'content' => $content));
	}
	
	/**
	 * Generates an HTML meta generator tag and returns results as an Element object.
	 *
	 * @param	string			$content		String value to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metagen($content = '') {
		return $this->meta('generator', $content);
	}
	
	/**
	 * Generates an HTML meta keywords tag and returns results as an Element object.
	 *
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metakeys($content = '') {
		return $this->meta('keywords', $content);
	}
	
	/**
	 * Generates an HTML meta property tag and returns results as an Element object.
	 *
	 * @param	string			$property		Property attribute string of the meta tag
	 * @param	string			$content		String of content to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metaprop($property = '', $content = '') {
		return $this->_make('meta', array('property' => $property, 'content' => $content));
	}
	
	/**
	 * Generates an HTML meta viewport tag and returns results as an Element object.
	 *
	 * Need to do more research into the various options for the viewport meta tag.
	 * Initially began with the following default options based on Wordpress:
	 *
	 *		Comment: Mobile viewport scale | Disable user zooming as the layout is optimized
	 *		Setting: initial-scale=1.0; maximum-scale=1.0; user-scalable=no
	 *
	 * But based on Bootstrap recommendations, I changed the above to the following:
	 *
	 * 		Comment: Set the viewport so this responsive site displays correctly on mobile devices
	 * 		Setting: width=device-width, initial-scale=1
	 *
	 * @param	string			$content		String value to place in the content attribute
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metaport($content = 'width=device-width, initial-scale=1') {
		$comment = $this->comment('Set the viewport so this responsive site displays correctly on mobile devices');
		return $comment.$this->meta('viewport', $content);
	}
	
	/**
	 * Generates an HTML meta robots tag and returns results as an Element object.
	 *
	 * @param	mixed			$value			Mixed valuerray containing one or more key-value attribute pairs
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function metarobots($value = NULL) {
		$defaults = array('content' => 'noodp,noydir', 'hidden' => TRUE);
		$attribs = array();
		if (isset($value)):
			if (is_bool($value)):
				$attribs['hidden'] = $value;
			elseif (is_string($value)):
				$attribs['content'] = $value;
			elseif (is_array($value)):
				$attribs = $value;
			endif;
		endif;
		$attribs = $this->_merge($defaults, $attribs);
		$content = $attribs['content'].(($attribs['content'] && $attribs['hidden']) ? ',' : '').(($attribs['hidden']) ? 'noindex' : '');
		return $this->meta('robots', $content);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function module($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function nav($attribs = array()) {
		$defaults = array('role' => 'navigation');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * Elements requiring replacement using sprintf: 
	 * 		1. Brand href. Use '#' or javascript:void(0) to avoid users leaving the page.
	 * 		2. Brand target. Options: (_blank|_self)
	 *		3. Brand text. Can be link text or an IMG tag if brand is rep'd by logo.
	 *		4. Menu content itself consisting of one or more nested UL elements.
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function navbar($attribs = array()) {
		$attribs = $this->addclass($attribs, 'navbar navbar-default');
		$id = 'navbar_collapse_'.STR::uid(6, 'lower');
		$headerAttribs = array(
			'class' => 'navbar-header',
		);
		$toggleAttribs = array(
    		'class' => 'navbar-toggle collapsed',
    		'data-toggle' => 'collapse',
    		'data-target' => '#'.$id
    	);
    	$srAttribs = array(
    		'class' => 'sr-only', 
    		'text' => '' //T::_('Toggle Nav')
    	);
    	$barAttribs = array(
    		'class' => 'icon-bar'
    	);
    	$brandAttribs = array(
    		'class' => 'navbar-brand',
    		'href' => '%s',
    		'target' => '%s',
    		'text' => '%s',
    	);
    	$collapseAttribs = array(
    		'id' => $id,
    		'class' => 'collapse navbar-collapse',
    		'text' => '%s',
     	);
		return $this->nav($attribs)->inject(
	        $this->div($headerAttribs)->inject(
	        	$this->button($toggleAttribs)->inject(
	        		$this->span($srAttribs).
	        		$this->span($barAttribs).
	        		$this->span($barAttribs).
	        		$this->span($barAttribs)
	        	).
	        	$this->a($brandAttribs)
	        ).
	        $this->div($collapseAttribs)
		);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	string							Returns an HTML string		
	 * @access 	public
	 * @since	5.0
	 */
	public function navtabs($attribs = array()) {
		$defaults = array('tabs' => array());
		$attribs = $this->_merge($defaults, $attribs);
		if (count($attribs['tabs'])):
			$uid = STR::uid(6, TRUE);
			$tabs = array_keys($attribs['tabs']);
			$contents = array_values($attribs['tabs']);
			$tabsList = '';
			$contentsList = '';
			foreach($tabs as $key => $tab):
				$itemAttribs = array(
					'href' => '#'.$uid.'-'.$key,
					'data-toggle' => 'tab',
					'text' => $tab,
				);
				if ($key === 0):
					$itemAttribs['class'] = 'active';
				endif;
				$tabsList .= $this->li($this->a($itemAttribs));
			endforeach;
			foreach($contents as $key => $content):
				$itemAttribs = array(
					'id' => $uid.'-'.$key,
					'class' => 'tab-pane',
					'text' => $content,
				);
				if ($key === 0):
					$itemAttribs['class'] = 'tab-pane active';
				endif;
				$contentsList .= $this->div($itemAttribs);
			endforeach;
			$tabsList = $this->ul($tabsList, array('class' => 'nav nav-tabs'));
			$contentsList = $this->div(array('class' => 'tab-content clear', 'text' => $contentsList));
			return $tabsList.$contentsList;
		endif;
	}

	/**
	 * Create an HTML input field designed for numerical values
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function number($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function noscript($attribs = array()) {
		if (isset($attribs) && is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif;
		$attribs = $this->addclass($attribs, 'ocms-noscript-message');
		$defaults = array('text' => T::_('You must enable Javascript to use this site\'s features'));
		$attribs = $this->_merge($defaults, $attribs);
		$attribs = array('text' => $this->div(array('class' => 'ocms-noscript', 'text' => $this->div($attribs))));
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Generates an HTML ordered list from an single or multi-dimensional array.
	 *
	 * @param	array			$list			Array of items to allocate as list children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function ol($list = array(), $attributes = array()) {
		if (is_array($list)):
			return $this->_list('ol', $list, $attributes);
		elseif (is_string($list)):
			return $this->_make(__FUNCTION__, $list);
		endif;
	}

	/**
	 * Create an HTML optgroup element.
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs or a string to be used as a label
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function optgroup($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('label' => $attribs);
		endif;
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function option($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Generates one or more HTML option tags  
	 *
	 * @param	array			$options		Array of option items to allocate as select children with a multi-dimensional array optional if indented nesting is required
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @param	int				$counter		Counter used for recursive indents / characters
	 * @return	string							Returns an HTML string containing all options and (optional) optgroups
	 * @access	public
	 * @since	5.0
	 */
	public function options($options = array(), $attribs = array(), $counter = 0, $optgroup = FALSE) {
		$stroptions = '';
		$optgroupcnt = 0;
		$optgroupold = '';
		$options = array_filter($options);
		$hasoptgroup = (isset($attribs['optgroup']) && $attribs['optgroup']);
		$icon = (isset($attribs['data-icon']) && $attribs['data-icon']) ? $attribs['data-icon'] : '';
		$space = (isset($attribs['space'])) ? $attribs['space'] : (($hasoptgroup) ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		$spacerepeat = (isset($attribs['spacerepeat'])) ? $attribs['spacerepeat'] : 1;
		$indent = str_repeat($space, ($counter * $spacerepeat)); 
		foreach ($options as $key => $val):
			$children = array();
			if (is_array($val)):
				if ($hasoptgroup):
					if ($counter === 0):
						$optgroup = $key;
						if ($optgroup !== $optgroupold):
							if ($optgroupcnt):
								$stroptions .= $this->close('optgroup');
							endif; 
							$stroptions .= $this->optgroup(array('label' => $optgroup, 'close' => FALSE));
						endif;
						$optgroupold = $optgroup;
						$optgroupcnt++;
					endif;
					$children = $val;
					$text = '';
				else:
					$text = array_keys($val);
					$text = array_shift($text);
					$children = $val[$text];
				endif;
			else:
				$text = $val;
			endif;
			$optattribs = array('value' => $key);
			if ($icon):
				$optattribs['data-icon'] = $icon;
			endif;
			$selected = (isset($attribs['value'])) ? $attribs['value'] : ((isset($attribs['selected'])) ? $attribs['selected'] : FALSE);
			if ($selected):
				/* Do a loose evaluation here so numerics in string form will still be seen as equal to their numeric equivalent */
				if ((is_array($selected) && in_array($key, $selected)) || $key == $selected):
					$optattribs['selected'] = 'selected';
				endif;
			endif;
			if ($hasoptgroup && $optgroup !== FALSE):
				$optattribs['data-optgroup'] = $optgroup;
			endif;
			$stroptions .= ($text) ? $this->option($optattribs)->inject($indent.' '.$text) : '';
			if (count($children)):
				$stroptions .= $this->options($children, $attribs, $counter + 1, $optgroup);
			endif;
		endforeach;
		if ($hasoptgroup && $counter === 0):
			$stroptions .= $this->close('optgroup');
		endif;
		return $stroptions;
	}
		
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function p($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function password($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function pre($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	string			$type			Type of input element to create
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function pseudo($attribs = array()) {
		$defaults = array(
			'noname' => TRUE,
		);
		if (is_string($attribs)):
			$attribs = array('label' => ' ', 'text' => $attribs);
		endif;
		$attribs = $this->_merge($attribs, $defaults);
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function q($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function radio($attribs = array()) {
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function range($attribs = array()) {
		$defaults = array(
			'class' => 'ocms-range',
			'min'	=> 0, 
			'max'	=> 0, 
			'step'	=> 1,
			'value'	=> 0
		);
		$attribs = $this->_merge($defaults, $attribs);
		return $this->input('range', $attribs);
	}
	
	/**
	 * Remove an attribute from an Element object
	 *
	 * @param	string			$attrib		The string name of the attribute to remove
	 * @return	void
	 * @access 	public
	 * @since	5.0
	 */
	function rem($attrib) {
		if (isset($this->_attribs[$attrib])):
			unset($this->_attribs[$attrib]);
		endif;
		return $this;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * If 'text' attribute is specified and requires CDATA wrapper, you can
	 * add the attribute of 'cdata' and set it equal to any loosely evaluated
	 * boolean value (TRUE, 1, YIPPEEKAIYAY, etc). This will result in the 
	 * CDATA tags being used to surround the existing script text. NOTE: the
	 * CDATA wrapper will surround ALL of the text. So if you only require it
	 * for a portion of the script, you will need to manually include it within
	 * the text attribute value.
	 *
	 * @param	string|array	$value			String containing the script 'src' or key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function script($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('src' => $attribs);
		else:
			$cdo = '/* <![CDATA[ */';
			$cdc = '/* ]]> */';
			$keycd = in_array('cdata', array_keys($attribs));
			$keytxt = in_array('text', array_keys($attribs));
			if ($keycd !== FALSE && $keytxt !== FALSE):
				$attribs['text'] = $cdo.$attribs['text'].$cdc;
			endif;
			unset($attribs['cdata']);
		endif;
		$defaults = array('type' => 'text/javascript');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function search($attribs = array()) {
		$elms = [];
		if (isset($attribs['input'])): 
			$inpDefaults = array('role' => 'search', 'nowrap' => TRUE);
			$inpAttribs = $this->_merge($inpDefaults, $attribs['input']);
			$elms[0] = $this->input(__FUNCTION__, $inpAttribs);
			unset($attribs['input']);
		endif;
		if (isset($attribs['button'])): 
			$btnDefaults = array('text' => $this->i(array('class' => 'fa fa-search')), 'nowrap' => TRUE, 'class' => 'btn btn-primary btn-ttb tt');
			$btnAttribs = $this->_merge($btnDefaults, $attribs['button']);
			$elms[1] = $this->span(array('class' => 'input-group-btn', 'text' => $this->button($btnAttribs)));
			unset($attribs['button']);
		endif;
		if (count($elms)): 
			$attribs['text'] = implode(' ', $elms);
			$attribs = $this->addclass($attribs, 'input-group');
			return $this->div($attribs);
		endif;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function section($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Generates an HTML select list from an array returned as an Element object
	 *
	 * Attribute options for the select generator are as follows: 
	 * 	1) selected 
	 * 	2) blankoption
	 * 	3) space
	 * 	4) spacerepeat
	 * 	5) optgroup
	 *
	 * If you wish to have a particular option pre-selected when the list echos out, simply
	 * add the attribute 'selected' to your $attribs array and set it equal to the value you 
	 * wish to select within the list options. 
	 * 
	 * Likewise, you can also add a blank option at the top of your select list by adding the 
	 * attribute 'blankoption' to your $attribs array and setting it equal to the text you wish 
	 * to appear for the top option's innerHTML. 
	 *
	 * Indented spacing can be added for nested lists with children by using the 'space' and 
	 * 'spacerepeat' atttributes to indicate the character used to indent child items (default 
	 * is '....'). 
	 *
	 * The spacerepeat option (defaults to 1) is the number of times you wish to have the 
	 * character specified in the 'space' attribute repeated for each level of indentation. 
	 *
	 * The option for generating an 'optgroup' tag must be specified using 'optgroup' => TRUE
	 * within the $attribs array. This assumes that the $options array being passed in is
	 * limited to two dimensions. The first (top) key will be used as the optgroup label and
	 * the sub-array of items will be used to generate the children key-value pairings. 
	 *
	 * @uses 	STR::mbsubstrcount()
	 *
	 * @param	string|array	$options		String (precompiled) or array of option items to allocate as select children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function select($options = array(), $attribs = array(), $test = FALSE) {
		$optcnt = (is_array($options)) ? ARR::countAll($options) : ((is_string($options)) ? STR::mbsubstrcount($options, 'option>') : 0);
		$defaults = array(
			'blankoption'		=> '',
			'data-live-search' 	=> (($optcnt > 20) ? 'true' : 'false'),
			'label' 			=> '', 
			'data-icon'			=> FALSE,
			'combobox'			=> FALSE,
			'selectize'			=> FALSE,
			'noname' 			=> FALSE,
			'nowrap' 			=> FALSE,
			'swaplabel' 		=> FALSE, 
			'value' 			=> '', 
			'wrapclass'			=> '',
		);
		$attribs = $this->_merge($defaults, $attribs);
		$attribs = $this->addclass($attribs, 'form-control');
		if ($attribs['selectize']): // simply added to prevent default selectpicker class being assigned
			unset($attribs['selectize']);
		elseif ($attribs['combobox']):
			$attribs = $this->addclass($attribs, 'combobox');
			unset($attribs['combobox']);
		else:
			$attribs = $this->addclass($attribs, 'selectpicker');
		endif;
		$cols = (isset($attribs['cols'])) ? $attribs['cols'] : FALSE;
		$size = (isset($attribs['size'])) ? $attribs['size'] : FALSE;
		$wrapattribs = $attribs;
		if (!isset($attribs['name']) && isset($attribs['id'])):
			$attribs['name'] = $attribs['id'];
		endif;
		if (isset($attribs['noname']) && $attribs['noname']):
			unset($attribs['name']);
		endif;
		unset($attribs['noname']);

		// Set option attributes to match those passed to the select function
		$optattribs = $attribs;
		
		if ($attribs['value']):
			$optattribs['selected'] = $attribs['value'];
			unset($attribs['value']);
		endif;
		$selected = NULL;
		$blankoption = NULL;
		$nowrap = $attribs['nowrap'];
		if (isset($attribs['multiple']) && $attribs['multiple'] === TRUE):
			$attribs['name'] = rtrim($attribs['name'], '[]').'[]';
			if (!isset($attribs['data-selected-text-format'])):
				$attribs['data-selected-text-format'] = 'count > 3';
			endif;
		endif;
		if (isset($attribs['blankoption']) && $attribs['blankoption']):
			$blankoption = $attribs['blankoption'];
			unset($attribs['blankoption']);
		endif;
		$attribs = $this->_setValidation($attribs);
		unset(
			$attribs['blankoption'],
			$attribs['cols'],
			$attribs['data-icon'],
			$attribs['help'], 
			$attribs['label'],
			$attribs['noname'],
			$attribs['nowrap'], 
			$attribs['required'],
			$attribs['selected'], 
			$attribs['size'], 
			$attribs['space'], 
			$attribs['spacerepeat'], 
			$attribs['wrapclass'], 
			$attribs['validate'],
			$attribs['value'], 
			$attribs['swaplabel'],
			$attribs['selectize'], 
			$attribs['combobox'], 
			$optattribs['space'], 
			$optattribs['spacerepeat'], 
			$optattribs['validate'],
			$optattribs['value']
		);
		$select = $this->_make(__FUNCTION__, $attribs);
		if ($test):
			dd($select);
		endif;
		if (isset($blankoption)):
			$select->inject($this->option(array('value' => '', 'text' => $blankoption)));
		endif;
		$optionslist = (is_array($options)) ? $this->options($options, $optattribs) : $options;
		$select = $select->inject($optionslist);
		if ($cols && $nowrap):
			$select = $this->div(array('class' => 'col-'.$size.'-'.$cols))->inject($select);
		endif;
		return ($nowrap) ? $select : $this->inputWrap($select, $wrapattribs);
		
	}
	
	/**
	 * Add an attribute to an Element object
	 *
	 * @param	string			$attribute		String attribute name
	 * @param	string			$value			Value to be assigned to attribute key
	 * @return	object							Returns an Element object
	 * @access 	public
	 * @since	5.0
	 */
	function set($attribute, $value = '') {
		if(!is_array($attribute)):
			$this->_attribs[$attribute] = $value;
		else:
			$this->_attribs = $this->_merge($this->_attribs, $attribute);
		endif;
		return $this;
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function slider($attribs = array()) {
		$defaults = array(
			'class' 			=> 'ocms-slider',
			'data-slider-min' 	=> 0, 
			'data-slider-max' 	=> 0, 
			'data-slider-value' => 0,
		);
		$attribs = $this->_merge($defaults, $attribs);
		return $this->input('text', $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function small($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function span($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function strong($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function style($attribs = array()) {
		$defaults = array('type' => 'text/css', 'media' => 'screen');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->_make(__FUNCTION__, $attribs);
	}

	/**
	 * Create a link stylesheet element and return as an Element object.
	 *
	 * @param	string			$href			String value to assign to 'href' attribute
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function stylesheet($href = '') {
		return $this->link(array('href' => $href));
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function sub($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function submit($attribs = array()) {
		$defaults = array('type' => 'submit');
		$attribs = $this->_merge($defaults, $attribs);
		return $this->button($attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function sup($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function table($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function tbody($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function td($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs	Element key-value attributes array
	 * @return	object						Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function text($attribs = array()) {
		if (is_string($attribs)):
			$attribs = array('id' => $attribs);
		endif;
		return $this->input(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function textarea($attribs = array()) {
		$defaults = array(
			'label' 		=> '',
			'noname' 		=> FALSE,
			'nowrap' 		=> FALSE,
			'swaplabel'		=> FALSE,
			'text'			=> '',
			'value' 		=> '',
			'wrap' 			=> 'hard',
			'wrapclass'		=> '',
		);
		$attribs = $this->addclass($attribs, 'form-control');
		$attribs = $this->_merge($defaults, $attribs);
		$cols = (isset($attribs['cols'])) ? $attribs['cols'] : FALSE;
		$size = (isset($attribs['size'])) ? $attribs['size'] : FALSE;
		$wrapattribs = $attribs;
		$nowrap = (isset($attribs['nowrap'])) ? $attribs['nowrap'] : FALSE;
		if ($attribs['value']):
			$attribs['text'] = $attribs['value'];
		endif;
		if (!isset($attribs['name'])):
			if (isset($attribs['id'])):
				$attribs['name'] = $attribs['id'];
			endif;
		endif;
		if (isset($attribs['noname']) && $attribs['noname']):
			unset($attribs['name']);
		endif;
		$attribs = $this->_setValidation($attribs);
		unset(
			$attribs['cols'],
			$attribs['label'],
			$attribs['noname'], 
			$attribs['nowrap'], 
			$attribs['required'],
			$attribs['size'], 
			$attribs['swaplabel'], 
			$attribs['validate'],
			$attribs['value'],
			$attribs['wrapclass'] 
		);
		$textarea = $this->_make(__FUNCTION__, $attribs);
		if ($cols && $nowrap):
			$select = $this->div(array('class' => 'col-'.$size.'-'.$cols))->inject($textarea);
		endif;
		return ($nowrap) ? $textarea : $this->inputWrap($textarea, $wrapattribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function tfoot($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function th($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function thead($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	string			$datetime		Datetime string value
	 * @param	string			$datetime8601	Datetime string value in 8601 format
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function time($datetime = NULL, $datetime8601 = NULL) {
		$attribs = array();
		if (isset($datetime)):
			$attribs['text'] = $datetime;
		endif;
		if (isset($datetime8601)):
			$attribs['datetime'] = $datetime8601;
		endif;
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function tr($attribs = array()) {
		return $this->_make(__FUNCTION__, $attribs);
	}
	
	/**
	 * Create an HTML title element.
	 *
	 * @param	string			$text			String value to assign to 'text' attribute
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function title($text = '') {
		return $this->_make(__FUNCTION__, array('text' => $text));
	}
	
	/**
	 * Generates an HTML unordered list from an single or multi-dimensional array.
	 *
	 * @param	array			$list			Array of items to allocate as list children
	 * @param	array			$attribs		Array containing one or more key-value attribute pairs
	 * @return	object							Returns an Element object
	 * @access	public
	 * @since	5.0
	 */
	public function ul($list = array(), $attribs = array()) {
		if (is_array($list)):
			return $this->_list('ul', $list, $attribs);
		elseif (is_string($list)):
			if (!is_array($attribs)):
				$attribs = array();
			endif;
			$attribs['text'] = $list;
			return $this->_make(__FUNCTION__, $attribs);
		endif;
	}

	/**
	 * Create the HTML element specified by the method name and save it as 
	 * an Element object. Add one or more key=value attributes to the object. 
	 * Returns an object of type Element so additional methods can be run 
	 * against the object when required.
	 *
	 * @param	array			$attribs		Element key-value attributes array
	 * @return	object							Returns an object of type Element		
	 * @access 	public
	 * @since	5.0
	 */
	public function video($src = '', $attribs = array()) {
		$defaults = array('controls' => TRUE);
		$ext = DF::info($src, 'extension') ?: 'mp4';
		$attribs['text'] = '<source src="'.$src.'" type="video/'.$ext.'">'.T::_('Sorry, your browser does not support embedded videos.');
		$attribs = $this->_merge($defaults, $attribs);
		$attribs = $this->addclass($attribs, 'embed-responsive-item');
		$video = $this->_make(__FUNCTION__, $attribs);
		return $this->_make('div', array('class' => 'text-center embed-responsive embed-responsive-16by9', 'text' => $video));
	}
	
	/**
	 * Generate an HTML wrapper for general content
	 *
	 * @param	string			$content		HTML strings or Element objects to contain within the wrapper
	 * @return	object							Returns an HTML string
	 * @access 	public
	 * @since	5.0
	 */
	public function wrapcont($attribs = array()) {
		$defaults = array('class' => 'col-lg-12', 'text' => '');
		if (is_string($attribs)):
			$attribs = array('text' => $attribs);
		endif; 
		$attribs = array_merge($defaults, $attribs);
		return
			$this->comment('Begin Content Wrapper').
			$this->div(array('id' => 'content_wrapper', 'close' => FALSE)).
				$this->comment('Begin Content Row').
				$this->div(array('class' => 'row', 'close' => FALSE)).
					$this->comment('Begin Content Column').
					$this->div(array('class' => $attribs['class'], 'text' => $attribs['text'])).
					$this->comment('End Content Column').
				$this->close('div').
				$this->comment('End Content Row').
			$this->close('div').
			$this->comment('End Content Wrapper')
		;
	}

}
