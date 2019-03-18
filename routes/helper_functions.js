module.exports = {
	// Finds ireq.body.psswds string is empty
	is_empty: function (str) {
		ret = str.trim();
		if (ret.length == 0) {
			return (true);
		}
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