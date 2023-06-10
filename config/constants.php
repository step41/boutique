<?php

/* Constants Array */
return array(

	/* File Permission Constants */
	'FOPEN_READ' 							=> 'rb',
	'FOPEN_READ_WRITE' 						=> 'r+b',
	'FOPEN_WRITE_CREATE' 					=> 'w',
	'FOPEN_APPEND_CREATE' 					=> 'ab',
	'FOPEN_READ_WRITE_CREATE' 				=> 'a+b',
	'FOPEN_WRITE_CREATE_STRICT' 			=> 'xb',
	'FOPEN_READ_WRITE_CREATE_STRICT' 		=> 'x+b',
	'FOPEN_WRITE_CREATE_DESTRUCTIVE' 		=> 'wb', // Truncates existing file data so use with caution
	'FOPEN_READ_WRITE_CREATE_DESTRUCTIVE' 	=> 'w+b', // Truncates existing file data so use with caution
	
	/* Date and Time Constants */
	'DATETIME_DEFAULT_COUNTRY' 				=> 'US',
	'DATETIME_DEFAULT_TIMEZONE' 			=> 'America/Los_Angeles',
	'DATETIME_PATTERN_YMDHIS'				=> '(\d{4})-(\d{2})-(\d{2}) ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])',
	'DATETIME_PATTERN_YMD' 					=> '((\d{4})-(\d{2})-(\d{2}))',
	'DATETIME_FORMAT_DATE_YMD'				=> 'Y-m-d',
	'DATETIME_FORMAT_DATE_MJY'				=> 'M j, Y',
	'DATETIME_FORMAT_TIME_HIS'				=> 'H:i:s',
	'DATETIME_FORMAT_YMDHIS'				=> 'Y-m-d H:i:s',
	'DATETIME_FORMAT_DMJY'					=> 'D, M j, Y',
	'DATETIME_FORMAT_DMJYGIA'				=> 'D, M j, Y g:i A',
	'DATETIME_FORMAT_DMDYATGIA'				=> 'D, m d, Y @ g:i a',
	'DATETIME_FORMAT_LFDYATHIA'				=> 'l, F d, Y @ h:i a',
	'DATETIME_FORMAT_GIA'					=> 'g:i a',
	'DATETIME_FORMAT_HIA'					=> 'h:i a',
	'DATETIME_FORMAT_YMDURL'				=> 'Y/m/d',
	'DATETIME_FORMAT_YMURL'					=> 'Y/m',
	'DATETIME_FORMAT_YURL'					=> 'Y',
	'DATETIME_FORMAT_MURL'					=> 'm',
	'DATETIME_FORMAT_DURL'					=> 'd',

	/* General Framework and Application Constants */
	'ACRONYMS_UCASE_NOSPLIT'				=> 'HTML,PHP,ISBN,PDF',
	'VALIDATION_PWD_LENGTHMIN'				=> 8,
	'VALIDATION_PWD_LENGTHMAX'				=> 32,

);
