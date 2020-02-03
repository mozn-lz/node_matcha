// Finds is string is empty
function is_empty(str) {
	if (str.trim().length == 0) {
		return(true);
	}
	return(false);
}

// finds if param1 is equal to param 2
function is_match(str1, str2) { 
	if ((is_empty(str1) && is_empty(str2)) || (str1 !== str2)) {
		return (false);
	}
	return(true);
}

// Find needle in haystack from database
function matches_db(needle, haystack) {
}