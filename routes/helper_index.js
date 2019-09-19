module.exports = {

	getWemen: function (exclude) {
		if (exclude == '!hetro'){	//	get bi and gay men 
			var searchCriteria = {
				'gender' : req.session.gender,
				'oriantation' : 'req.session.oriantation'
			};
		} else if (exclude == '!homo') {	//	get bi and straight men
			var searchCriteria = {
				'gender' : req.session.gender,
				'oriantation' : req.session.oriantation
			};
		}
	},
	getMen: function (exclude) {
		if (exclude == '!hetro'){	//	get bi and gay Wemen 
			var searchCriteria = {
				'gender' : req.session.gender,
				'oriantation' : 'req.session.oriantation'
			};
		} else if (exclude == '!homo') {	//	get bi and straight Wemen
			var searchCriteria = {
				'gender' : req.session.gender,
				'oriantation' : req.session.oriantation
			};
		}
	}
};