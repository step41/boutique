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
 * Directories and Files Helper Class
 *
 * @package		Helpers
 * @author		Jeff Todnem
 * @since 		1.0  
 */
class DirFileHelper {
	
	/** 
	 * String to hold current action status
	 *
	 * This property maintains an overall status in the event of recursive
	 * actions that may return TRUE or FALSE depending on the individual results
	 * of a single iteration. If any iteration fails, for example, the status
	 * will be set to FALSE and will remain in a failed state for the duration
	 * of the action until completion. 
	 * 
	 * @var		boolean
	 */
	protected $_status = TRUE;
	
	/** 
	 * Array of file size/unit acronyms
	 * 
	 * @var		array
	 */
	protected $_units = array('', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y');
	
	/** 
	 * Array of standard file mime types
	 * 
	 * @var		array
	 */
	protected $_mimes = array();
	
	/**
	 * Constructor
	 *
	 * @return	void
	 */
	public function __construct() {
		$this->_errActionFailed = T::_('The method %s() failed because the item could not be %s');
		$this->_errInvalidDir = T::_('The method %s() failed because the dir \'%s\' could not be located or created.');
		if (defined('APP_DIR') && $mimes = $this->read(APP_DIR.'/config/mimes.php')):
			$this->_mimes = $mimes;
		endif;
	}
		
	/**
	 * Returns the full directory path for static content based on type, account and date
	 *
	 * @return	string					The full directory path of the stored media
	 * @access 	public
	 * @since 	5.0
	 */
	public function atPathToDir($path = NULL) {
		$ptnSearch = '#^/@([a-z0-9]+)/'.CONTENT_CONTENTTYPES.'/([0-9]{4})/([0-9]{2})/(.+\.'.FILE_EXTENSIONS_ALLOWED.')(\?.+)*$#';
		$ptnReplace = BASE_DIR.'/content/$2/$1/$3/$4/$5';
		if (!empty($path)):
			$path = preg_replace($ptnSearch, $ptnReplace, $path);
		endif;
		return $path;
	}
	
	/** 
	 * Compile an array of files (paths only) from an array of directories
	 * or individual files.
	 *
	 * @param	array		$sources		Array of files or directories
	 * @param	array		$types			One or more specific file extensions to search for
	 * @return	void
	 * @access 	public
	 * @since  	5.0
	 */	
	public function compile($sources = array(), $types = array()) {
		$sources = (is_array($sources)) ? $sources : array($sources);
		$types = (is_array($types)) ? $types : array($types); 
		$list = array();
		$exts = (count($types)) ? '.{'.implode(',', $types).'}' : FALSE;
		foreach ($sources as $source):
			if (is_readable($source)):
				if (is_file($source)):
					if ($types):
						$fileinfo = $this->info($source);
						$ext = $fileinfo['extension'];
						if (in_array($ext, $types)):
							$list[] = $source;
						endif;
					else:
						$list[] = $source;
					endif;
				elseif (is_dir($source)):
					$source = rtrim($source,'/').'/';
					$search = $source.'*'.(($exts) ? $exts : '');
					$files = glob($search, GLOB_BRACE);
					foreach ($files as $file):
						$list[] = $file;
					endforeach;
				endif;
			else:
				$errMissingFile = T::_('The resource requested at \'%s\' is either missing or invalid. Check permissions and ensure this resource exists.');
				Log::error(sprintf($errMissingFile, $source));
			endif;
		endforeach;
		return $list;
	}
	
	/**
	 * Returns the full directory path for static content based on type, account and date
	 *
	 * @return	string					The full directory path of the stored media
	 * @access 	public
	 * @since 	5.0
	 */
	public function contentDir($contentType = FALSE, $contentAccount = FALSE, $contentDate = FALSE) {
		$contentDir = '';
		if ($contentType && $contentAccount && DT::isDate($contentDate)): 
			$contentType = INF::pluralize($contentType);
			$contentDate = (is_numeric($contentDate)) ? $contentDate : strtotime($contentDate); 
			$contentDir = $contentType.'/'.$contentAccount.'/'.date('Y', $contentDate).'/'.date('m', $contentDate); 
		endif;
		return $contentDir;
	}
	
	/**
	 * Get contents of a file via CURL
	 *
	 * @access	public
	 * @param	string	path to source
	 * @param	bool	Look only at the top level directory specified?
	 * @param	bool	internal variable to determine recursion status - do not use in calls
	 * @return	array
	 */
	public function contents($url, $sslCert = FALSE, $header = FALSE, $verbose = FALSE) {
		// $sslCert needs to point to path of a valid CA cert if not set to FALSE
		$c = curl_init();
		curl_setopt($c, CURLOPT_URL, $url);
		curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($c, CURLOPT_HEADER, $header);
		curl_setopt($c, CURLOPT_VERBOSE, $verbose);
		if ($sslCert):
			curl_setopt($c, CURLOPT_SSL_VERIFYPEER, TRUE);
			curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 2);
			curl_setopt($c, CURLOPT_CAINFO, $sslCert);
		endif;
		$contents = curl_exec($c);
		if (curl_errno($c)):
			trigger_error(sprintf(T::_('The following error occurred when calling the method %s() in the class %s: %s'),__METHOD__, __CLASS__, curl_error($c)), E_USER_ERROR);
		endif;
		curl_close($c);
		if ($contents): 
			return $contents;
		endif;
		return FALSE;
	}
	
	/** 
	 * Delete Files
	 *
	 * Deletes all files contained in the supplied directory path.
	 * Files must be writable or owned by the system in order to be deleted.
	 * If the second parameter is set to TRUE, any directories contained
	 * within the supplied base directory will be nuked as well.
	 *
	 * @uses 	STR::mbsubstr()
	 * 
	 * @param	string	path to file
	 * @param	bool	whether to delete any directories found in the path
	 * @return	bool
	 * @access	public
	 */
	public function delete($dirPath, $dirRemove = FALSE, $dirLevel = 0) {
		/* If path is for a specific file, just delete that particular file */
		if (is_file($dirPath)):
			return @unlink($dirPath);
		else:
			$dirPath = rtrim($dirPath, DIRECTORY_SEPARATOR);
			if (!$dirCurrent = @opendir($dirPath)):
				return FALSE;
			endif;
			while (FALSE !== ($fileName = @readdir($dirCurrent))):
				if ($fileName != '.' and $fileName != '..'):
					if (is_dir($dirPath.DIRECTORY_SEPARATOR.$fileName)):
						// Ignore empty folders
						if (STR::mbsubstr($fileName, 0, 1) != '.'):
							$this->delete($dirPath.DIRECTORY_SEPARATOR.$fileName, $dirRemove, $dirLevel + 1);
						endif;
					else:
						unlink($dirPath.DIRECTORY_SEPARATOR.$fileName);
					endif;
				endif;
			endwhile;
			@closedir($dirCurrent);
			if ($dirRemove == TRUE && $dirLevel > 0):
				return @rmdir($dirPath);
			endif;
			return TRUE;
		endif;
	}

	/**
	 * Download a file
	 *
	 * Generates headers that force a download to happen
	 *
	 * @uses 	STR::mbstrlen()
	 * @uses 	STR::mbstrpos()
	 * @uses 	STR::mbstrtoupper()
	 *
	 * @param	string	filename
	 * @param	mixed	the data to be downloaded
	 * @param	bool	whether to try and send the actual file MIME type
	 * @return	void
	 * @access	public
	 */
	public function download($filename = '', $data = '', $setMime = FALSE) {
		if ($filename === '' || $data === ''):
			return FALSE;
		elseif ($data === NULL):
			if (@is_file($filename) && ($filesize = @filesize($filename)) !== FALSE):
				$filepath = $filename;
				$filename = explode('/', str_replace(DIRECTORY_SEPARATOR, '/', $filename));
				$filename = end($filename);
			else:
				return FALSE;
			endif;
		else:
			$filesize = STR::mbstrlen($data);
		endif;
		// Set the default MIME type to send
		$mime = 'application/octet-stream';
		$x = explode('.', $filename);
		$extension = end($x);
		if ($setMime === TRUE):
			if (count($x) === 1 || $extension === ''):
				return FALSE;
			endif;
			if (isset($this->_mimes[$extension])):
				$mime = is_array($mimes[$extension]) ? $mimes[$extension][0] : $mimes[$extension];
			endif;
		endif;
		if (count($x) !== 1 && isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/Android\s(1|2\.[01])/', $_SERVER['HTTP_USER_AGENT'])):
			$x[count($x) - 1] = STR::mbstrtoupper($extension);
			$filename = implode('.', $x);
		endif;
		if ($data === NULL && ($fp = @fopen($filepath, FOPEN_READ)) === FALSE):
			return FALSE;
		endif;
		if (ob_get_level() !== 0 && @ob_end_clean() === FALSE):
			ob_clean();
		endif;
		header('Content-Type: '.$mime);
		header('Content-Disposition: attachment; filename="'.$filename.'"');
		header('Expires: 0');
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: '.$filesize);
		if (isset($_SERVER['HTTP_USER_AGENT']) && STR::mbstrpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE):
			header('Cache-Control: no-cache, no-store, must-revalidate');
		endif;
		header('Pragma: no-cache');
		if ($data !== NULL):
			exit($data);
		endif;
		$this->readChunked(NULL, TRUE, $fp);
		exit;
	}

	/**
	 * Returns the MIME types array from config/mimes.php
	 *
	 * @return	array
	 * @access 	public
	 * @since 	5.0
	 */
	public function getMimes() {
		return $this->_mimes;
	}

	/**
	* Get File Info
	*
	* Given a file and path, returns the name, path, size, date modified
	* Second parameter allows you to explicitly declare what information you want returned
	* Options are: name, serverPath, size, date, readable, writable, executable, fileperms
	* Returns FALSE if the file cannot be found.
	* 
	* @uses 	STR::mbstrrchr()
	* @uses 	STR::mbsubstr()
	*
	* @access	public
	* @param	string	path to file
	* @param	mixed	array or comma separated string of information returned
	* @return	array
	*/
	public function info($file, $returnedValues = array('name', 'filename', 'extension', 'size', 'date')) {
		// Quick conversion for any at-path file refs
		$file = $this->atPathToDir($file);
		if (!is_readable($file)):
			return FALSE;
		endif;
		if (is_string($returnedValues)):
			$returnedValues = explode(',', $returnedValues);
		endif;
		$pathinfo = pathinfo($file);
		foreach ($returnedValues as $key):
			switch ($key):
				case 'name':
					$fileInfo['name'] = STR::mbsubstr(STR::mbstrrchr($file, DIRECTORY_SEPARATOR), 1);
					break;
				case 'filename':
					$fileInfo['filename'] = $pathinfo['filename'];
					break;
				case 'extension':
					$fileInfo['extension'] = $pathinfo['extension'];
					break;
				case 'serverpath':
					$fileInfo['serverpath'] = $file;
					break;
				case 'size':
					$fileInfo['size'] = filesize($file);
					break;
				case 'date':
					$fileInfo['date'] = filemtime($file);
					break;
				case 'readable':
					$fileInfo['readable'] = is_readable($file);
					break;
				case 'writable':
					$fileInfo['writable'] = is_writable($file);
					break;
				case 'executable':
					$fileInfo['executable'] = is_executable($file);
					break;
				case 'fileperms':
					$fileInfo['fileperms'] = fileperms($file);
					break;
			endswitch;
		endforeach;
		return $fileInfo;
	}

	/**
	 * Get Information on a Directory of Files
	 *
	 * Reads the specified directory and builds an array containing the filenames,
	 * filesize, dates, and permissions
	 *
	 * Any sub-folders contained within the specified path are read as well.
	 *
	 * @access	public
	 * @param	string	path to source
	 * @param	bool	Look only at the top level directory specified?
	 * @param	bool	internal variable to determine recursion status - do not use in calls
	 * @return	array
	 */
	public function infoByDir($dirPath, $topLevelOnly = TRUE, $recursion = FALSE) {
		static $arrFileData = array();
		$relativePath = $dirPath;
		if ($fp = @opendir($dirPath)):
			// reset the array and make sure $dirPath has a trailing slash on the initial call
			if ($recursion === FALSE):
				$arrFileData = array();
				$dirPath = rtrim(realpath($dirPath), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
			endif;
			// foreach (scandir($dirPath, 1) as $file) // In addition to being PHP5+, scandir() is simply not as fast
			while (FALSE !== ($file = readdir($fp))):
				if (@is_dir($dirPath.$file) && strncmp($file, '.', 1) !== 0 && $topLevelOnly === FALSE):
					$this->infoByDir($dirPath.$file.DIRECTORY_SEPARATOR, $topLevelOnly, TRUE);
				elseif (strncmp($file, '.', 1) !== 0):
					$arrFileData[$file] = $this->info($dirPath.$file);
					$arrFileData[$file]['relative_path'] = $relativePath;
				endif;
			endwhile;
			return $arrFileData;
		else:
			return FALSE;
		endif;
	}
	
	/**
	 * Tests for file writability
	 *
	 * is_writable() returns TRUE on Windows servers when you really can't write to
	 * the file, based on the read-only attribute. is_writable() is also unreliable
	 * on Unix servers if safe_mode is on.
	 *
	 * @access	public
	 * @return	void
	 */
	public function isWritable($file) {
		/* If we're on a Unix server with safe_mode off we call is_writable */
		if (DIRECTORY_SEPARATOR === '/' && (CHK::isPHP('5.4') || (bool) @ini_get('safe_mode') === FALSE)):
			return is_writable($file);
		endif;
		/* Test by actually writing a file and then attempt to read it. */
		if (is_dir($file)):
			$file = rtrim($file, '/').'/'.md5(mt_rand());
			if (($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE):
				return FALSE;
			endif;
			fclose($fp);
			@chmod($file, DIR_WRITE_MODE);
			@unlink($file);
			return TRUE;
		elseif (!is_file($file) || ($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE):
			return FALSE;
		endif;
		fclose($fp);
		return TRUE;
	}
	
	/**
	 * Load a file using PHP's built-in include function
	 *
	 * @param	string		$file		Absolute path of file to include
	 * @return	void
	 * @access	public
	 * @since	5.0
	 */
	public function load($file = NULL) {
		if (isset($file) && $this->read($file)):
			include($file);
		endif;
	}
	
	/**
	 * Create a Directory Map
	 *
	 * Reads the specified directory and builds an array
	 * representation of it.  Sub-folders contained with the
	 * directory will be mapped as well.
	 *
	 * @access	public
	 * @param	string	path to source
	 * @param	int		depth of directories to traverse (0 = fully recursive, 1 = current dir, etc)
	 * @return	array
	 */
	public function mapDir($dirPath, $depth=0, $hidden=FALSE) {
		if ($fp = @opendir($dirPath)):
			$fileData = array();
			$newDepth = $depth - 1;
			$dirPath = rtrim($dirPath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
			while (FALSE !== ($file = readdir($fp))):
				// Remove '.', '..', and hidden files [optional]
				if (!trim($file,'.') || ($hidden == FALSE && $file[0] == '.')):
					continue;
				endif;
				if (($depth < 1 || $newDepth > 0) && @is_dir($dirPath.$file)):
					$fileData[$file] = $this->mapDir($dirPath.$file.DIRECTORY_SEPARATOR, $newDepth, $hidden);
				else:
					$fileData[] = $file;
				endif;
			endwhile;
			closedir($fp);
			return $fileData;
		endif;
		return FALSE;
	}

	/**
	 * Get file names
	 *
	 * Reads the specified directory and builds an array containing the filenames.
	 * Any sub-folders contained within the specified path are read as well.
	 *
	 * @access	public
	 * @param	string	path to source
	 * @param	bool	whether to include the path as part of the filename
	 * @param	bool	internal variable to determine recursion status - do not use in calls
	 * @return	array
	 */
	public function names($dirPath, $includePath=FALSE, $recursion=FALSE) {
		static $arrFileData = array();
		if ($fp = @opendir($dirPath)):
			// reset the array and make sure $dirPath has a trailing slash on the initial call
			if ($recursion === FALSE):
				$arrFileData = array();
				$dirPath = rtrim(realpath($dirPath), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
			endif;
			while (FALSE !== ($file = readdir($fp))):
				if (@is_dir($dirPath.$file) && strncmp($file, '.', 1) !== 0 && $recursion === TRUE ):
					$this->names($dirPath.$file.DIRECTORY_SEPARATOR, $includePath, TRUE);
				elseif (strncmp($file, '.', 1) !== 0):
					$arrFileData[] = ($includePath == TRUE) ? $dirPath.$file : $file;
				endif;
			endwhile;
			return $arrFileData;
		else:
			return FALSE;
		endif;
	}

	/**
	 * Get File Permissions
	 *
	 * @access	public
	 * @param	int
	 * @return	string
	 */
	public function perms($pathToFile = NULL) {
		$perms = fileperms($pathToFile);
		if (($perms & 0xC000) == 0xC000): // Socket
			$info = 's';
		elseif (($perms & 0xA000) == 0xA000): // Symbolic Link
			$info = 'l';
		elseif (($perms & 0x8000) == 0x8000): // Regular
			$info = '-';
		elseif (($perms & 0x6000) == 0x6000): // Block special
			$info = 'b';
		elseif (($perms & 0x4000) == 0x4000): // Directory
			$info = 'd';
		elseif (($perms & 0x2000) == 0x2000): // Character special
			$info = 'c';
		elseif (($perms & 0x1000) == 0x1000): // FIFO pipe
			$info = 'p';
		else: // Unknown
			$info = 'u';
		endif;
		// Owner
		$info .= (($perms & 0x0100) ? 'r' : '-');
		$info .= (($perms & 0x0080) ? 'w' : '-');
		$info .= (($perms & 0x0040) ? (($perms & 0x0800) ? 's' : 'x' ) : (($perms & 0x0800) ? 'S' : '-'));
		// Group
		$info .= (($perms & 0x0020) ? 'r' : '-');
		$info .= (($perms & 0x0010) ? 'w' : '-');
		$info .= (($perms & 0x0008) ? (($perms & 0x0400) ? 's' : 'x' ) : (($perms & 0x0400) ? 'S' : '-'));
		// World
		$info .= (($perms & 0x0004) ? 'r' : '-');
		$info .= (($perms & 0x0002) ? 'w' : '-');
		$info .= (($perms & 0x0001) ? (($perms & 0x0200) ? 't' : 'x' ) : (($perms & 0x0200) ? 'T' : '-'));
		return $info;
	}
	
	/**
	 * Get Octal File Permissions
	 *
	 * Takes a numeric value representing a file's permissions and returns
	 * a three character string representing the file's octal permissions
	 *
	 * @uses 	STR::mbsubstr()
	 *
	 * @access	public
	 * @param	int
	 * @return	string
	 */
	public function permsOctal($perms) {
		return STR::mbsubstr(sprintf('%o', $perms), -3);
	}

	/** 
	 * Import and format CSV data for database import
	 *
	 * @param	string	$filename 	path to file
	 * @param	string	$delim 		delimiter used to separate the csv elements
	 * @return	array				combined header and records array if data present
	 * @access	public
	 */
    public function prepForSeed($filename, $delim = ',') {
        if (!file_exists($filename) || !is_readable($filename)):
            return FALSE;
        endif;
        $header = NULL;
        $data = [];
        if (($handle = fopen($filename, 'r')) !== FALSE):
            while (($row = fgetcsv($handle, 1000, $delim)) !== FALSE):
                if (!$header):
                    $header = $row;
                else:
					$cols = [];
					$keyvals = array_combine($header, $row);
					foreach ($keyvals as $k => $v):
						if ($v !== 'NULL'):
							$cols[$k] = $v;
						endif;
					endforeach;
					$data[] = $cols;
                endif;
            endwhile;
            fclose($handle);
        endif;
        return $data;
    }

	/**
	 * Read a File
	 *
	 * Opens the file specfied in the path and returns it as a string.
	 *
	 * @access	public
	 * @param	string	path to file
	 * @return	string
	 */
	public function read($file) {
		if (!is_readable($file)):
			return FALSE;
		endif;
		if (function_exists('file_get_contents')):
			return file_get_contents($file);
		endif;
		if (!$fp = @fopen($file, FOPEN_READ)):
			return FALSE;
		endif;
		flock($fp, LOCK_SH);
		$data = '';
		if (filesize($file) > 0):
			$data =& fread($fp, filesize($file));
		endif;
		flock($fp, LOCK_UN);
		fclose($fp);
		return $data;
	}

	/**
	 * Read a File in Chunks
	 *
	 * @uses 	STR::mbstrlen()
	 *
	 * @param	string				Absolute path to file
	 * @param	boolean				Whether to return number of bytes like native function readfile()
	 * @param	resource			Link to open file resource if exists
	 * @access	public
	 * @return	string
	 */
	public function readChunked($fileName = '', $returnBytes = TRUE, $fileHandle = FALSE) {
		$chunkSize = 1*(1024*1024); // Bytes per chunk = 1MB
		$buffer = '';
		$cnt =0;
		$fileHandle = ($fileHandle) ? $fileHandle : fopen($fileName, FOPEN_READ);
		if ($fileHandle === FALSE):
			return FALSE;
		endif;
		while (!feof($fileHandle)):
			set_time_limit(0);
			$buffer = fread($fileHandle, $chunkSize);
			echo $buffer;
			ob_flush();
			flush();
			if ($returnBytes):
				$cnt += STR::mbstrlen($buffer);
			endif;
		endwhile;
		$status = fclose($fileHandle);
		if ($returnBytes && $status):
			return $cnt; // return num. bytes delivered like readfile() does.
		endif;
		return $status;		
	} 		
		
	/**
	 * Recursively copy or move files from one directory to another
	 *
	 * @uses	Log::warning()
	 *
	 * @param	string 			$src				Source of files being moved
	 * @param 	string 			$dst				Destination of files being moved
	 * @param 	string 			$action				Action while iterating. Options: (copy|move)
	 * @return	boolean								Returns TRUE if action was successful, otherwise FALSE
	 * @access	public
	 * @since	5.0
	 */
	public function rcopy($src = NULL, $dst = NULL, $action = 'copy') {
		if (isset($src) && $src && isset($dst) && $dst):
			$action = STR::mbstrtolower($action);
			/* If source is not a directory then stop processing */
			if (!is_dir($src)):
				Log::warning(sprintf($this->_errInvalidDir, __METHOD__, $src));
				$this->_status = FALSE;
			endif;
			/* If the destination directory does not exist then create it */
			if (!is_dir($dst)):
				if (!mkdir($dst)):
					/* If the destination directory does not exist and cannot be created, then stop processing */
					Log::warning(sprintf($this->_errInvalidDir, __METHOD__, $dst));
					$this->_status = FALSE;
				endif;
			endif;
			/* Open the source directory to read in files */
			$di = new \DirectoryIterator($src);
			foreach ($di as $obj):
				if ($obj->isFile()):
					if ($action === 'move'):
						if (!rename($obj->getRealPath(), $dst.'/'.$obj->getFilename())):
							Log::warning(sprintf($this->_errActionFailed, __METHOD__, 'renamed'));
							$this->_status = FALSE;
						endif;
					else:
						if (!copy($obj->getRealPath(), $dst.'/'.$obj->getFilename())):
							Log::warning(sprintf($this->_errActionFailed, __METHOD__, 'copied'));
							$this->_status = FALSE;
						endif;
					endif;
				elseif (!$obj->isDot() && $obj->isDir()):
					$rp = $obj->getRealPath();
					$this->rcopy($rp, $dst.'/'.$obj, $action);
					if ($action === 'move' && is_readable($rp)):
						rmdir($rp);
					endif;
				endif;
			endforeach;
			if ($action === 'move' && is_readable($src)):
				if (is_dir($src)):
					rmdir($src);
				else:
					unlink($src);
				endif;
			endif;
		endif;
		return $this->_status;
	}	
	
	/**
	 * Recursively move files from one directory to another
	 *
	 * @param	string 			$src				Source of files being moved
	 * @param 	string 			$dst				Destination of files being moved
	 * @return	boolean								Returns TRUE if action was successful, otherwise FALSE
	 * @access	public
	 * @since	5.0
	 */
	public function rmove($src = NULL, $dst = NULL) {
		return $this->rcopy($src, $dst, 'move');
	}	
	
	/**
	 * Get file size in standardized units 
	 *
	 * Returns a file's size in the largest whole number units 
	 *
	 * @uses 	STR::mbsubstr()
	 *
	 * @param	int			$filesize		The original file size in bytes
	 * @param	int			$decimals		Number of places to hold if value is float
	 * @return	string						Returns the modified size as a string
	 * @access	public
	 */
	public function units($fileSize, $places = 2) {
		$mbin = 1024;
		$ptnUnits = '((?:'.implode('|', $this->_units).')B*)';
		if (is_numeric($fileSize)):
			$i = 0;
			while (($fileSize / $mbin) > 1):
				$fileSize = $fileSize / $mbin;
				$i++;
			endwhile;
			$fileSize = number_format($fileSize, $places);
			$decimals = STR::mbsubstr($fileSize, -$places);
			$fileSize = ((int)$decimals) ? $fileSize : number_format(ceil((float)$fileSize), $places);;
			$fileSize = $fileSize.' '.H::span(array('class' => 'file-units-small', 'text' => $this->_units[$i].'B'));
		elseif (preg_match('/^([0-9]+)'.$ptnUnits.'$/i', $fileSize, $matches)):
			if (count($matches) === 3 && preg_match('/^'.$ptnUnits.'$/i', $matches[2])):
				$fileSize = $matches[1];
				foreach ($this->_units as $unitKey => $unit):
					$fileSize = ($unitKey) ? ceil($fileSize * $mbin) : $fileSize;
					if (preg_match('/^'.$unit.'(B)*/', $matches[2])):
						break;
					endif;
				endforeach;
				$fileSize = $this->units($fileSize);
			endif;
		endif;
		return $fileSize;
	}
	
	/**
	 * Write to a File
	 *
	 * Writes data to the file specified in the path.
	 * Creates a new file if non-existent.
	 *
	 * @access	public
	 * @param	string	path to file
	 * @param	string	file data
	 * @return	bool
	 */
	public function write($filePath, $fileData, $fileMode = FOPEN_WRITE_CREATE_DESTRUCTIVE) {
		$hasDir = (strrpos($filePath, DIRECTORY_SEPARATOR));
		$dirPath = substr($filePath, 0, $hasDir);
		if (!is_dir($dirPath)):
			mkdir($dirPath, 0755, TRUE);
		endif;
		if (!$fp = @fopen($filePath, $fileMode)):
			return FALSE;
		endif;
		flock($fp, LOCK_EX);
		fwrite($fp, $fileData);
		flock($fp, LOCK_UN);
		fclose($fp);
		return TRUE;
	}

} 