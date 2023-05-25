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
	
	/* General Framework and Application Constants */
	'ACRONYMS_UCASE_NOSPLIT'				=> 'HTML,PHP,ISBN,PDF',

);
