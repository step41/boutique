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
 * Arrays Manipulation Helper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class ArrayHelper {  

	public function appendToString($array, $value, $max = NULL) {
		if (is_array($array)):
			$pos = array_search($value, $array);
			if ($pos !== FALSE):
				array_splice($array, $pos, 1);
			endif;
			if (!is_null($max)):
				if (count($array) == $max):
					array_shift($array);
				endif;
			endif;
			if (!is_null($value) && $value != ''):
				$array[count($array)] = $value;
			endif;
			return implode(',', $array);
		endif;
	}
	
	public function clean($array, $preserve = FALSE) {
		if (is_array($array)):
			$array = call_user_func(array($this, 'trim'), $array);
			$count = 0;
			foreach ($array as $index => $value):
				if (empty($value)):
					if ($preserve):
						unset($array[$index]);
					else:
						array_splice($array, $count, 1);
					endif;
				else:
					$count++;
				endif;
			endforeach;
			return $array;
		endif;
		return false;
	}
	
	public function countAll($array = array()) {
		if (isset($array) && is_array($array)):
			return count($array, COUNT_RECURSIVE);
		endif;
		return NULL;
	}

	public function diffKeysRecursive($arr1 = NULL, $arr2 = NULL) {
		$outputDiff = [];
		if (isset($arr1) && is_array($arr1) && isset($arr2) && is_array($arr2)):
			foreach ($arr1 as $key => $val):
				if (array_key_exists($key, $arr2)):
					if (is_array($val)):
						$recursiveDiff = $this->diffKeysRecursive($val, $arr2[$key]);
						if (count($recursiveDiff)):
							$outputDiff[$key] = $recursiveDiff;
						endif;
					elseif (!in_array($key, array_keys($arr2))):
						$outputDiff[$key] = $val;
					endif;
				elseif (!in_array($key, array_keys($arr2))):
					$outputDiff[$key] = $val;
				endif;
			endforeach;
		endif;
		return $outputDiff;
	}

	public function diffValsRecursive($arr1 = NULL, $arr2 = NULL) {
		$outputDiff = [];
		if (isset($arr1) && is_array($arr1) && isset($arr2) && is_array($arr2)):
			foreach ($arr1 as $key => $val):
				if (array_key_exists($key, $arr2)):
					if (is_array($val)):
						$recursiveDiff = $this->diffValsRecursive($val, $arr2[$key]);
						if (count($recursiveDiff)):
							$outputDiff[$key] = $recursiveDiff;
						endif;
					elseif (!in_array($val, $arr2)):
						$outputDiff[$key] = $val;
					endif;
				elseif (!in_array($val, $arr2)):
					$outputDiff[$key] = $val;
				endif;
			endforeach;
		endif;
		return $outputDiff;
	}

	public function display($array = NULL, $echo = TRUE, $level = 0) {
		if (isset($array)):
			$output = '';
			if ($this->isJudy($array)):
				$output .= "\n";
				$tab = str_repeat("\t", $level);
				foreach ($array as $key => $val):
					$output .= $tab.htmlentities("[$key] = ");
					if (J::isArray($val)):
						$output .= "Array (\n";
						$output .= $tab.$this->display($val, $echo, ($level + 1));
						$output .= ")\n";
					else:
						if (is_bool($val)):
							$val = ($val) ? 'TRUE' : 'FALSE';
						elseif (is_numeric($val)):
						elseif (is_string($val)):
							$val = "'".$val."'";
						elseif (is_null($val)):
							$val = 'NULL';
						endif;
						$output .= htmlentities($val)."\n";
					endif;
				endforeach;
				$output .= "\n";
				echo ($echo && $level === 0) ? '<pre>'.$output.'</pre>' : ''; 
			else:
				$output = htmlentities(print_r($array, TRUE));
				echo ($echo) ? '<pre>'.$output.'</pre>' : ''; 
			endif;
		endif;
		return $output;
	}
	
	/** 
	 * Get the last value in an array or comma separated string
	 *
	 * @param	string|array	$value			Array or CSV string
	 * @param	array			$delim			Delimiter used to seperate the values (if in a string format)
	 * @return	mixed							Returns last value
	 * @access	public
	 * @since	5.0
	 */
	public function end($value = NULL, $delim = ',') {
		if (isset($value)):
			$value = $this->toArray($value, TRUE, $delim);
			$value = array_filter($value);
			$value = array_pop($value);
		endif;
		return $value;	
	}

	public function filter($array = array()) {
		return array_diff(array_map('trim', $array), array(''));		
	}

	/** 
	 * Searches array haystack for a needle
	 *
	 * @uses 	STR::mbstripos()
	 *
	 * @param	mixed			$needles		Comma separated string or array of needles to find
	 * @param	mixed			$haystack		Comma separated string or array to search
	 * @return	boolean							Returns TRUE or FALSE depending on search results
	 * @access	public
	 * @since	5.0
	 */
	public function find($needle = NULL, $haystack = NULL) {
		if (isset($needle) && $needle && isset($haystack) && is_array($haystack)):
			foreach ($haystack as $key => $val):
				if (FALSE !== STR::mbstripos($needle, $val)):
					return $key;
				endif;
			endforeach;
		endif;
		return FALSE;
	}

	/** 
	 * Searches array haystack for one or more needles
	 *
	 * @param	mixed			$needles		Comma separated string or array of needles to find
	 * @param	mixed			$haystack		Comma separated string or array to search
	 * @return	boolean							Returns TRUE or FALSE depending on search results
	 * @access	public
	 * @since	5.0
	 */
	public function findAny($needles = NULL, $haystack = NULL) {
		if (isset($needles) && isset($haystack)):
			$needles = $this->toArray($needles, TRUE);
			$haystack = $this->toArray($haystack, TRUE);
			return !!array_intersect($needles, $haystack);
		endif;
		return NULL;
	}

	/** 
	 * Flatten multi-dimensional array
	 *
	 * @param	array			$array			Array to flatten
	 * @return	array							Returns a flattened array
	 * @access	public
	 * @since	5.0
	 */
	public function flatten(array $array) {
		$return = array();
		array_walk_recursive($array, function($a) use (&$return) { $return[] = $a; });
		return $return;
	}

	/** 
	 * Create standard HTML UL > LI list format from Admin Nav Menu items (see app/Providers/TemplateServiceProvider for complete menu)
	 *
	 * @param	array			$arr 			Admin menu item array
	 * @param	array			$attribs		Various attributes to assign to the HTML element
	 * @param	string			$active			Current page url if selected
	 * @param	int				$level			Current hierchical level
	 * @return	string							Returns an HTML string containing UL with LI elements
	 * @access	public
	 * @since	5.0
	 */
	public function fromAdminNavToUL($arr = NULL, $attribs = [], $active = '', $level = 0) {
		
		if (isset($arr)):
			
			$defaults = ['class' => 'sidebar-nav'];
			$attribs = array_merge($defaults, $attribs);
			$baseUrl = url('/');
			$list = '';

			foreach ($arr as $key => $val):

				if (!empty($val)):
				
					if (is_array($val) && is_int($key)): 
						
						$list .= $this->fromAdminNavToUL($val, $attribs, $active, $level + 1);
					
					elseif ($key === 'name'):

						$itemName = $arr['name'];
						$itemUrl = (!empty($arr['url'])) ? $arr['url'] : FALSE;
						$itemSub = (!empty($arr['sub'])) ? $arr['sub'] : FALSE;
						$itemOpt = (!empty($arr['opt'])) ? $arr['opt'] : FALSE;
						$itemIcon = (!empty($arr['icon'])) ? $arr['icon'] : FALSE;
						$itemNA = (!empty($arr['never_active'])) ? $arr['never_active'] : FALSE; 
						$classMiniHide = ($level < 2) ? 'sidebar-nav-mini-hide' : '';

						$itemIsHeader = ($itemUrl && $itemUrl === 'header');
						$itemActive = ($itemUrl && $itemUrl != $baseUrl && strpos($active, $itemUrl) !== FALSE); 
						$itemClasses = [];
						$itemClasses[] = ($itemActive) ? 'active' : '';
						$itemClasses[] = ($itemIsHeader) ? 'sidebar-header' : '';
						$itemClasses = array_filter($itemClasses);
						$itemAttribs = [
							'class' => (!empty($itemClasses)) ? implode(' ', $itemClasses) : NULL,
							'close' => FALSE,
						];
						$item = H::li($itemAttribs);

						$headerSpans = '';
						$headerSpans .= ($itemOpt) ? H::span(['class' => 'sidebar-header-options clearfix', 'text' => $itemOpt]) : '';
						$headerSpans .= H::span(['class' => 'sidebar-header-title', 'text' => $itemName]);
						
						$linkHref = $itemUrl ?: '#';
						$linkClasses = [];
						$linkClasses[] = ($itemActive && !$itemNA) ? 'active' : '';
						$linkClasses[] = ($itemSub) ? (($level > 1) ? 'sidebar-nav-submenu' : 'sidebar-nav-menu') : '';
						$linkClasses = array_filter($linkClasses);

						$linkTarget = ($itemNA) ? '_blank' : '';
						$linkCaret = ($itemSub) ? H::i(['class' => 'fa fa-angle-left sidebar-nav-indicator '.$classMiniHide]) : '';
						$linkIcon = ($itemIcon) ? H::i(['class' => $itemIcon.' sidebar-nav-icon']) : '';
						$linkText = $linkCaret.$linkIcon.H::span(['class' => $classMiniHide, 'text' => $itemName]);
						
						$linkAttribs = [
							'class' => (!empty($linkClasses)) ? implode(' ', $linkClasses) : NULL,
							'target' => $linkTarget ?: NULL,
							'href' => $linkHref, 
							'text' => $linkText,
						];
						
						$list .= $item;
						$list .= ($itemIsHeader) ? $headerSpans : H::a($linkAttribs);
						
						if ($itemSub):
							$list .= H::ul($this->fromAdminNavToUL($itemSub, $attribs, $active, $level + 1));
						endif;
						
						$list .= H::close('li');
					
					endif;

				endif;

			endforeach;

			if ($level === 0): 
				$list = H::ul($list, $attribs);
			endif;
			
			return $list;
		
		endif;
	}

	/** 
	 * Create array from a file filled with comma separated values
	 *
	 * @param	array			$file			CSV source file
	 * @return	array							Returns an array
	 * @access	public
	 * @since	5.0
	 */
	public function fromCSV($file = NULL) {
		$array = array();
		$output = '';
		if ($output = DF::read($file)):
			$rows = preg_split('/\n/', $output);
			foreach ($rows as $rowKey => $rowVal):
				$cols = explode(',', $rowVal);
				$array[$rowKey] = (count($cols)) ? $cols : array();
			endforeach;
		endif;
		return $array;
	}

	/**
	 * Recursive function to convert an array or Judy array object to a JSON formatted string
	 *
	 * Latest versions of PHP already have similar function in json_(encode|decode)
	 * however this functionality expects a PHP array to work properly. When serializing
	 * a Judy array, these built-in functions will not work correctly so this method
	 * was added to address the issue.
	 * 
	 * @param	string			$json			JSON string that will be used as a source for building PHP array or Judy array object
	 * @return	string							Returns modified value
	 * @access 	public
	 * @since	5.0
	 */
	public function fromJSON($json = '') {
		if (isset($json) && function_exists('json_decode')):
			return json_decode($json, TRUE);
		endif;
		return FALSE;
	} 

	/** 
	 * Create array from a file filled with tab separated values
	 *
	 * @param	array			$file			TSV source file
	 * @return	array							Returns an array
	 * @access	public
	 * @since	5.0
	 */
	public function fromTSV($file = NULL) {
		$array = array();
		$output = '';
		if ($output = DF::read($file)):
			$rows = preg_split('/\n/', $output);
			foreach ($rows as $rowKey => $rowVal):
				$cols = preg_split('/\t', $rowVal);
				$array[$rowKey] = (count($cols)) ? $cols : array();
			endforeach;
		endif;
		return $array;
	}

	/** 
	 * Create one or more parent breadcrumb links from Laravel collection 
	 *
	 * @param	object			$item 			Laravel collection
	 * @param	int				$level			Current hierchical level within Nestable array
	 * @return	string							Returns an HTML string containing SELECT with OPTION elements
	 * @access	public
	 * @since	5.0
	 */
	public function fromNestableToCrumbs($item = NULL, $level = 0) {
		$crumbs = '';
		if (!empty($item)):
			if (!empty($item->parent_id)): 
				$crumbs .= $this->fromNestableToCrumbs(\App\KBD::findOrFail($item->parent_id), $level + 1);
			endif;
			$crumbs .= H::a([
				'class' => 'exp-list-kb-search-result-crumb',
				'data-id' => $item->id,
				'data-slug' => $item->slug,
				'href' => 'javascript:void(0)', 
				'target' => '_self',
				'text' => $item->title,
			]);
			$crumbs .= ($level > 0) ? ' '.H::span(['class' => 'exp-breadcrumb-link-arrow color-darkblue', 'text' => '›']).' ' : '';
			return $crumbs;
		endif;
	}

	/** 
	 * Create standard HTML SELECT > OPTION drop list format from Laravel Nestable array
	 *
	 * @param	array			$arr 			Laravel Nestable array
	 * @param	array			$attribs		Various attributes to assign to the HTML element
	 * @param	int				$level			Current hierchical level within Nestable array
	 * @return	string							Returns an HTML string containing SELECT with OPTION elements
	 * @access	public
	 * @since	5.0
	 */
	public function fromNestableToSELECT($arr = NULL, $attribs = [], $level = 0) {
		if (isset($arr)):
			$list = '';
			// Because of the way the NestableService structures the array, we have to double-jump every time we move from a parent to child.
			$types = [
				1 => 'category',
				3 => 'group',
				5 => 'topic',
				7 => 'subtopic'
			];
			$type = (!empty($types[$level])) ? $types[$level] : '';
			foreach ($arr as $key => $val):
				if (!empty($val)):
					if (is_array($val) && is_int($key)): 
						$list .= $this->fromNestableToSELECT($val, $attribs, $level + 1);
					elseif ($key === 'id' && !empty($arr['is_active'])):
						$list .= H::option(['value' => $arr['id'], 'data-type' => $type, 'text' => str_repeat('&nbsp;', $level).$arr['title']]);
						if (!empty($arr['child'])):
							$list .= $this->fromNestableToSELECT($arr['child'], $attribs, $level + 1);
						endif;
					endif;
				endif;
			endforeach;
			$list = ($level === 0) ? H::select($list, $attribs) : $list;
			return $list;
		endif;
	}

	/** 
	 * Create standard HTML UL > LI list format from Laravel Nestable array
	 *
	 * @param	array			$arr 			Laravel Nestable array
	 * @param	array			$attribs		Various attributes to assign to the HTML element
	 * @param	int				$level			Current hierchical level within Nestable array
	 * @return	string							Returns an HTML string containing UL with LI elements
	 * @access	public
	 * @since	5.0
	 */
	public function fromNestableToUL($arr = NULL, $attribs = [], $level = 0) {
		if (isset($arr)):
			$defaults = ['class' => 'exp-list-nestable select-nested', 'static' => FALSE];
			$attribs = array_merge($defaults, $attribs);
			if ($attribs['static']): 
				$attribs['class'] = 'exp-list-nestable-static select-nested hide';
			endif;
			$list = '';
			// Because of the way the NestableService structures the array, we have to double-jump every time we move from a parent to child.
			$types = [
				1 => 'category',
				3 => 'group',
				5 => 'topic',
				7 => 'subtopic'
			];
			$type = (!empty($types[$level])) ? $types[$level] : '';
			foreach ($arr as $key => $val):
				if (!empty($val)):
					if (is_array($val) && is_int($key)): 
						$list .= $this->fromNestableToUL($val, $attribs, $level + 1);
					elseif ($key === 'id' && !empty($arr['is_active'])):
						$listItem = H::li(['class' => 'exp-list-nestable-item'.(($attribs['static']) ? '-static' : ''), 'close' => FALSE]);
						$linkText = H::span(['class' => 'bracket hide']).H::span(['class' => 'text', 'text' => $arr['title']]);
						$linkAttribs = [
							'data-id' => $arr['id'],
							'data-type' => $type,
							'data-slug' => $arr['slug'],
							'data-content-length' => $arr['content_length'],
							'href' => '#', 
							'target' => '_self',
							'text' => $linkText,
						];
						if (!empty($arr['content_length'])):
							$linkAttribs = array_merge($linkAttribs, ['href' => 'javascript:void(0)']);
						elseif (!empty($arr['file'])):
							$linkAttribs = array_merge($linkAttribs, ['href' => asset($arr['file']), 'target' => '_blank']);
						elseif (!empty($arr['link'])):
							$linkAttribs = array_merge($linkAttribs, ['href' => $arr['link'], 'target' => '_blank']);
						endif;
						$bullet = ''; //($level > 1) ? H::i(['class' => 'fa fa-long-arrow-right']).' ' : '';
						$list .= $listItem.$bullet.(($attribs['static']) ? $linkText : H::a($linkAttribs));
						if (!empty($arr['child'])):
							$list .= H::ul($this->fromNestableToUL($arr['child'], $attribs, $level + 1));
						endif;
						$list .= H::close('li');
					endif;
				endif;
			endforeach;
			$list = ($level === 0) ? H::ul($list, $attribs) : $list;
			return $list;
		endif;
	}

	/**
	 * Recursive intersection of two or more associative arrays
	 * 
	 * @return	array							Returns an array consisting of keys (and respective values) that are common to all arrays
	 * @access 	public
	 * @since	5.0
	 */
	public function intersectKeysRecursive($arr1 = NULL, $arr2 = NULL) {
		if (isset($arr1) && is_array($arr1) && isset($arr2) && is_array($arr2)):
			$arr1 = array_intersect_key($arr1, $arr2);
			foreach ($arr1 as $key => &$value):
				if (is_array($value)):
					$value = $this->intersectKeysRecursive($value, $arr2[$key]);
				endif;
			endforeach;
			return $arr1;
		endif;
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
	
	public function joinRecursive($join, $value, $lvl = 0) {
		if (!is_array($join)):
			return $this->joinRecursive(array($join), $value, $lvl);
		endif;
		$res = array();
		if (is_array($value) && sizeof($value) && is_array(current($value))):
			foreach ($value as $val):
				$res[] = $this->joinRecursive($join, $val, number_format($lvl + 1));
			endforeach;
		elseif (is_array($value)):
			$res = $value;
		else:
			$res[] = $value;
		endif;
		return join(isset($join[$lvl]) ? $join[$lvl] : '', $res);
	}

	public function keyExists($key, $array) {
		if (array_key_exists($key, $array)):
			return $key;
		endif;
		if (!(is_string($key) && is_array($array) && count($array))):
			return FALSE;
		endif;
		$key = STR::mbstrtolower($key);
		foreach ($array as $k => $v):
			if (STR::mbstrtolower($k) === $key):
				return $k;
			endif;
		endforeach;
		return FALSE;
	}
	
	public function keysRecursive($array) {
		$keys = array_keys($array);
		foreach ($array as $a):
			if (is_array($a)):
				$keys = array_merge($keys, $this->keysRecursive($a));
			endif;
		endforeach;
		return $keys;
	}
	
	/**
	 * Merge a single parent array containing multiple child arrays into a single
	 * array where the child keys become the new top level array keys. 
	 * 
	 * @param	array|object	$parents		The parent array
	 * @return	string							Returns modified value
	 * @access 	public
	 * @since	5.0
	 */
	public function mergeChildren($array = NULL) {
		if (isset($array)):
			$isJudy = (J::isJudy($array));
			$children = ($isJudy) ? J::a() : array(); 
			foreach($array as $child): 
				if ($isJudy):
					$children = J::merge($children, $child); 
				elseif (is_array($child)):
					$children = array_merge($children, $child); 
				endif;
			endforeach;
			return (count($children)) ? $children : $array;
		endif;
		return $array;
	}
		
	public function orderByArrayOfKeys($array, $keys) {
		return array_merge(array_flip(array_keys($keys)), $array);		
	}
	
	public function replace($array1, $array2) {
		$array = array();
		if (is_array($array1) && is_array($array2)):
			$array = $array1;
			foreach ($array1 as $key1 => $val1):
				if (array_key_exists($key1, $array2)):
					$array[$key1] = $array2[$key1];
				endif;
			endforeach;
			foreach ($array2 as $key2 => $val2):
				if (!array_key_exists($key2, $array1)):
					$array[$key2] = $val2;
				endif;
			endforeach;
		endif;
		return $array;
	}
	
	/* This function uses array_replace which requires PHP version 5.3 or greater */
	public function replaceVal($array, $search, $replace) {
		return array_replace($array, array_fill_keys(array_keys($array, $search), $replace));		
	}
	
	public function serialize64($content = NULL) {
		if (isset($content)):
			if (function_exists('igbinary_serialize')):
				$content = igbinary_serialize($content);
			else:
				$content = base64_encode(serialize($content));
			endif;
			return $content;
		endif;
		return FALSE;
	}
	
	public function serializeCallback($value = NULL) {
		if (isset($value)):
			if (is_object($value) && ($value instanceof \Closure)):
				$serializer = new \SuperClosure\Serializer();
				return $serializer->serialize($value);
			else:
				return $this->serialize64($value);
			endif;
		endif;
		return NULL;
	}
	
	public function sortByElm($array, $sortElm, $sortType = 'string', $sortOrder = 'asc') {
		$sortArray = array();
		foreach ($array as $key => $row):
			$sortArray[$key] = $row[$sortElm];
		endforeach;
		$sortOrder = (STR::mbstrtolower($sortOrder) === 'asc') ? SORT_ASC : SORT_DESC;
		$sortType = (STR::mbstrtolower($sortType) === 'string') ? SORT_STRING : SORT_NUMERIC;
		array_multisort($sortArray, $sortOrder, $sortType, $array);
		return $array;
	}

	public function spliceAssoc($array, $values, $offset) {
		return array_slice($array, 0, $offset, TRUE) + $values + array_slice($array, $offset, NULL, TRUE);  
	}
	
	public function toArray($value = NULL, $convert = FALSE, $delim = ',') {
		$return = array();
		if (isset($value)):
			if (J::isJudy($value)):
				foreach ($value as $key => $val):
					if (J::isArray($val)):
						$return[$key] = $this->toArray($val);
					else:
						$return[$key] = $val;
					endif;
				endforeach;
			elseif (is_array($value)):
				$return = $value;
			elseif (is_string($value)):
				$return = ($convert) ? explode($delim, $value) : array($value);
			elseif (is_object($value)):
				$return = ($convert) ? (array) $value : array($value);
			else:
				$return = array($value);
			endif;
		endif;
		return $return;
	}

	public function toCSV($headers, $array) {
		$fp = fopen('php://memory', 'rw'); 
		fputcsv($fp, $headers, ';', '"'); 
		foreach ($csv as $items):
			fputcsv($fp, $items, ';', '"');
		endforeach;
		fclose($fp);
	}
	
	public function toFields($array) {
		$output = '';
		$parentLast = '';
		$count = 1;
		$entries = explode('&', http_build_query($array));
		foreach ($entries as $entry):
			list($key, $value) = explode('=', $entry);
			$key = urldecode($key);
			$ptn = '/\[([^\]]+?)\]$/i';
			$arrow = ' &nbsp;&rsaquo;&nbsp; ';
			preg_match($ptn, $key, $children);
			$child = (isset($children)) ? $children[1] : $key;
			$parent = preg_replace($ptn, '', $key);
			if ($parent !== $parentLast):
				$rows .= H::tr(H::td(array('colspan' => '3', 'text' => str_replace(']', '', str_replace('[', $arrow, $parent)).$arrow)));
			endif;
			$rows .= 
				"\n".		
				H::tr(
					H::td('&nbsp;').
					H::td($child).
					H::td(H::text(array('name' => urldecode($key), 'value' => urldecode($value))))
				).
				"\n"
			;		
			$parentLast = $parent;
		endforeach;
		if ($rows):
			$output .= 
				H::div(array('class' => 'table-responsive'))->inject(
					H::table(array('class' => 'table table-striped table-condensed table-hover table-bordered'))->inject(
						H::thead(
							H::tr(
								H::th('Parent Key(s)').
								H::th('Child Key').
								H::th('Value')
							)
						).
						H::tbody($rows)
					)
				)
			;
		endif;
		return $output;
	}
	
	/**
	 * Recursive function to convert an array or Judy array object to an HTML unordered list
	 *
	 * @param	array|object	$arr			Either a standard PHP array or a Judy array object
	 * @return	string							Returns modified value
	 * @access 	public
	 * @since	5.0
	 */
	public function toHTML($arr = NULL) {
		if (isset($arr)):
			$list = '<ul>';
			foreach ($arr as $key => $val):
				$val = (is_null($val)) ? 'NULL' : ((empty($val)) ? "''" : $val);
				$list .= '<li>'.(J::isArray($val) ? $key.$this->toHTML($val) : $key.' ||| '.$val).'</li>';
			endforeach;
			$list .= '</ul>';
			return $list;
		endif;
	}

	/**
	 * Recursive function to convert an array or Judy array object to a JSON formatted string
	 *
	 * Latest versions of PHP already have similar function in json_(encode|decode)
	 * however this functionality expects a PHP array to work properly. When serializing
	 * a Judy array, these built-in functions will not work correctly so this method
	 * was added to address the issue.
	 * 
	 * @param	array|object	$arr			Either a standard PHP array or a Judy array object
	 * @param	boolean			$prettyprint	Whether results will be formatted (TRUE) or not (FALSE) 
	 *											NOTE: This option requires json_encode function and PHP 5.4 or later
	 * @return	string							Returns modified value
	 * @access 	public
	 * @since	5.0
	 */
	public function toJSON($array = NULL, $prettyprint = NULL) {
		if (isset($array)):
			/*
			 	NOTE: Do not simply convert the array argument to a PHP array here as it may 
				actually be a very large Judy array object instead which could blow the memory
				limit cap. Instead, if it's a PHP array, use json_encode, otherwise step through 
				the Judy array object and generate the JSON below. Also note, there is currently
				no prettyprint option for Judy array object results but it will no doubt be added
				in the future.
			*/ 
			$pp = (!empty($_POST['prettyprint'])) ? $_POST['prettyprint'] : ((!empty($_GET['prettyprint'])) ? $_GET['prettyprint'] : FALSE);
			if (is_array($array) && function_exists('json_encode')):
				$prettyprint = (isset($prettyprint)) ? $prettyprint : $pp;
				$prettyprint = ($prettyprint && COM::isPHP('5.4')) ? JSON_PRETTY_PRINT : NULL;
				return json_encode($array, $prettyprint);
			endif;
			$parts = array();
			$isList = FALSE;
		
			//Find out if the given array is a numerical array
			if (is_array($array)):
				$keys = array_keys($array);
			elseif (J::isJudy($array)):
				$keys = J::keys($array);
			endif;
			$maxlen = count($array)-1;
			/* See if the first key is 0 and last key is length - 1 */
			if ($keys[0] === 0 && $keys[$maxlen] == $maxlen): 
				$keylen = count($keys);
				$isList = TRUE;
				/* See if each key correspondes to its position */
				for ($i = 0; $i < $keylen; $i++):
					/* A key fails at position check */
					if ($i !== $keys[$i]): 
						/* It is an associative array */
						$isList = FALSE; 
						break;
					endif;
				endfor;
			endif;
		
			foreach($array as $key => $val):
				/* Custom handling for arrays */
				if (is_array($val) || J::isJudy($val)):
					if ($isList):
						$parts[] = $this->toJSON($val);
					else:
						$parts[] = '"'.$key.'":'.$this->toJSON($val);
					endif;
				else:
					$str = '';
					if (!$isList):
						$str = '"'.$key.'":';
					endif;
					/* Custom handling for multiple data types */
					if (is_null($val)):
						$str .= 'null';
					elseif ($val === FALSE):
						$str .= 'false';
					elseif ($val === TRUE):
						$str .= 'true';
					else:
						$str .= '"'.addslashes($val).'"';
					endif;
					$parts[] = $str;
				endif;
			endforeach;
			$json = implode(',', $parts);
			return ($isList) ? '['.$json.']' : '{'.$json.'}';
		endif;
		return $array;
	} 

	/**
	 * Recursive function to convert values in an array to all lowercase
	 *
	 * @uses 	STR::mbstrtolower()
	 *
	 * @param	array|object	$array			Either a standard PHP array or a Judy array object
	 * @return	array							Returns modified array
	 * @access 	public
	 * @since	5.0
	 */
	public function toLower($array) {
		return array_change_key_case(unserialize(STR::mbstrtolower(serialize($array))), CASE_LOWER);
	}
	
	public function trim($value) {
		if (!is_array($value)):
			if (!is_object($value)):
				return trim($value);
			else:
				return NULL;
			endif;
		endif;
		return array_map(array($this, 'trim'), $value);
	}
	
	public function uniqueMultiDim($array = array()) {
		$array = array_map('unserialize', array_unique(array_map('serialize', $array)));
	}
	
	public function unserialize64($content = NULL, $default = FALSE) {
		if (isset($content)):
			if ($content):
				if (function_exists('igbinary_unserialize')):
					$content = igbinary_unserialize($content);
				else:
					$content = unserialize(base64_decode($content));
				endif;
			elseif ($default):
				$content = array();
			endif;
			return $content;
		endif;
		return FALSE;
	}

	public function unsetVal($array = array(), $val = NULL) {
		if (isset($array) && is_array($array) && isset($val)):
			$arrayTemp = $array;
			$arrayValues = $this->toArray($val, TRUE);
			foreach ($arrayValues as $value):
				foreach ($arrayTemp as $k => $v):
					if ($v === $value):
						unset($array[$k]);
					endif;
				endforeach;
			endforeach;
		endif;
		return $array;
	}

	public function valsByKeys($array = array(), $keys = FALSE) {
		$vals = array();
		foreach ($array as $key => $val):
			if (is_array($keys)):
				if (in_array($key, $keys)):
					array_push($vals, $val);
				endif;
			else:
				array_push($vals, $val);
			endif;
		endforeach;
		return $vals;
	}
	
} 

