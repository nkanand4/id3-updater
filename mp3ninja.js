var cmd = require('child_process').exec,
	url = require('url'),
	path = require('path'),
	mm = require('musicmetadata'),
	http = require('http'),
	fs = require('fs'),
	jarFile = '',
	out = require('./log4js'),
	itunes = require('./itunes'),
	artworkDir = '',
	
YOGI = function(file) {
	var me = this;
		me.setTitle(path.basename(file));
		me.file = file;
		
		me.askGoogle = function() {
			var url = encodeURIComponent(me.title),
				searchGoogle = {
					host:'ajax.googleapis.com',
					path:'/ajax/services/search/web?v=1.0&q='+url
				},
				handleGoogleResponse = function(response) {
					var str = '';
					out.log.debug('Asked google '+this.path);
					response.on('data', function (chunk) {
						str += chunk;
					});
					response.on('end', function() {
						var json = JSON.parse(str),
							replies = json.responseData && json.responseData.results ? json.responseData.results : [];
						if(replies.length == 0) {
							out.log.debug('Google does not know about', this.path);
						}else {
							//makeBetterGuess(replies);
							me.title = makeBetterGuess(replies).replace(/\s+?\(.*/, '');
							me.askItunes(true);
						}
					});
				},
				makeBetterGuess = function(results) {
					var i=0, x=0, ww = {}, tmp,
						query = '',
						filter = function(str) {
						str = str.replace(/-/g,' ');
						str = str.replace(/youtube|dailymotion/ig,'');
						str = str.replace(/free|song|lyrics/ig,'');
						str = str.replace(/mp3|download/ig,'');
						str = str.replace(/\bhq\b/ig,'');
						str = str.replace(/\s{2,}/g,' ');
							return str;
						};
					for(; i<results.length; i++) {
						tmp = filter(results[i].titleNoFormatting.toLowerCase()).split(/\s/);
						for(x=0; x<tmp.length; x++) {
							ww[tmp[x]] = ww[tmp[x]] ? ww[tmp[x]] + 1 : 1;
						}
					}
					tmp = results[0].titleNoFormatting.toLowerCase().split(/\s/);
					for(x=0; x<tmp.length; x++) {
						query += ww[tmp[x]] > 1 && tmp[x] != '-' ? tmp[x] + ' ' : '';
					}
					 return query;
				};
			http.request(searchGoogle, handleGoogleResponse).end();
		};

		me.handleMultiInfo = function () {
			var i = 0, cmdarg = [],
				hostinfo = [],
				iResp = me.guesses,
			wrapQuotes = function(str) {
				str = typeof str === 'string' ? str.replace(/"/g, '') : str;
				return '"'+str+'"';
			},
			album, index = 0;
			cmdarg.push(wrapQuotes(me.file));
			if(me.album) {
				for(i=0; i<iResp.length; i++) {
					album = iResp[i].collectionName.replace(/\(.*/,'');
					album = album.replace(/^\s+|\s+$/g,'');
					if(album.toLowerCase() === me.album.toLowerCase()) {
						index = i;
						break;
					}
				}
			}
			cmdarg.push(wrapQuotes(me.guesses[index].trackName));
			cmdarg.push(wrapQuotes(me.guesses[index].artistName));
			cmdarg.push(wrapQuotes(me.guesses[index].collectionName.replace(/\s+?\(.*/, '')));
			cmdarg.push(wrapQuotes((function() {
				var year = me.guesses[index].releaseDate ? 
							new Date(me.guesses[index].releaseDate).getFullYear()
								: 1970;
					return year;
			}())));
			cmdarg.push(wrapQuotes(me.guesses[index].trackNumber));
			cmdarg.push(wrapQuotes(me.guesses[index].primaryGenreName));
			me.guesses[index].artworkUrl100 = me.guesses[index].artworkUrl100.replace(/100x100/,'600x600');
			hostinfo = url.parse(me.guesses[index].artworkUrl100);
			http.request(hostinfo, function(res) {
				var artwork;
				//TODO: Add capability to create /tmp, if not exists
				out.log.debug('tmp dir is ', artworkDir + path.sep +path.basename(me.file)+'.jpg');
				me.artwork = artworkDir + path.sep +path.basename(me.file)+'.jpg';
				artwork = fs.createWriteStream(me.artwork, {'flags': 'a'});
				res.on('data', function (chunk) {
					artwork.write(chunk, encoding='binary');
				});
				res.on('end', function () {
					var update,
						javaCmd = '';
					artwork.end();
					cmdarg.push(wrapQuotes(me.artwork));
					// TODO: check java capabilities
					javaCmd = ['java', '-jar', jarFile, 'update'].concat(cmdarg).join(' ');
					out.log.debug('Executing:', javaCmd);
					update = cmd(javaCmd);
					update.on('close', function(u) {
						out.log.info('Updating', me.file, u === 0 ? 'succeeded' : 'failed');
					});
				});
			}).end();
		};


	try {
		new itunes().search(me.title)
			.results(function(a) {
				me.guesses = a.results;
				me.handleMultiInfo();
			})
			.noresults(function(a) {
				out.log.debug('No results for ', me.title);
			});
  	}catch(e) {
  		out.log.debug('some error:', e);
  	}
};

YOGI.prototype.setTitle = function(title) {
	// remove any preceding digits. usually songs do not start with numbers. 
	// even though it did, smart search will resolve it.
	title = title.replace(/^\d+\s/g, '');
	// remove any dash separated string. usually its junk from different sites
	// where the song has been downloaded from
	title = title.replace(/\s?-\s+?(.*)/g, '');
	// remove the any underscores (yet another junk. why would 
	// song name have underscore???)
	title = title.replace(/_+/g, ' ');
	title = title.replace(/\s+/g, ' ');
	// remove .mp3 extension
	title = title.replace(/.mp3$/, '');
	this.title = title;
};

YOGI.setjar = function(path) {
	jarFile = path;
};

YOGI.setTMPDir = function(path) {
	artworkDir = path;
};

module.exports.YOGI = YOGI;