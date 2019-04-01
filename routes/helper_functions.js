module.exports = {
	// Finds ireq.body.psswds string is empty
	is_empty: function (str) {
		ret = str.trim();
		
		if (ret.length == 0) {
			console.log('\t\tis_empty: Returning true for ' + str + ' of length ' + ret.length);
			return (true);
		}
		console.log('\t\tis_empty: Returning false for ' + str + ' of length ' + ret.length);
		return (false);
	},

	// finds if param1 is equal to param 2
	is_match: function (str1, str2) {
		if ((is_empty(str1) && is_empty(str2)) || (str1 !== str2)) {
			return (false);
		}
		return (true);
	}
};