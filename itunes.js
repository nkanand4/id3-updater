var http = require('http'),
	out = require('./log4js');

itunes = function() {
	var results, noresults,
		words;
	this.search = function(title) {
		//do search
		var url = encodeURIComponent(title),
		searchItunes = {
			host:'itunes.apple.com',
			path:'/search?entity=song&term='+url
		};
		http.request(searchItunes, function(response) {
			var str = '';
			out.log.debug('Asking itunes about ', title);
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function() {
				var json = JSON.parse(str),
					replies = json.resultCount;
				if(replies > 0) {
					out.log.debug(title,'::',replies);
					results(json);
				}else{
					// try with fewer words.
					// and give up with when
					// less than 2 words with "noresults(last_tried_title)"
					words = title.split(/\s/);
					if(words.length >= 2) {
						words.pop();
						title = words.join(' ');
						this.search(title);
					}else {
						noresults(title);
					}
				}
			});
		}).end();
		return this;
	};
	this.results = function(fn) {
		results = fn;
		return this;
	};
	this.noresults = function(fn) {
		noresults = fn;
		return this;
	};
};
module.exports = itunes;
