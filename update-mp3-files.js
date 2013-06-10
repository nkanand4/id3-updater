var spawn = require('child_process').spawn,
	cmd = require('child_process').exec,
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	mm = require('musicmetadata'),
	http = require('http'),
	search    = spawn('find', ['.', '-name', '*.mp3']),
	cwd   = process.cwd(),
	jarFile = '/home/nitesh/Developer/workspace/nodejs/id3-updater/id3-editor.jar';



search.stdout.on('data', function (data) {
  var i, songs = data.toString().replace(/\n+$/,'').split("\n"), stream;
  fs.exists(jarFile, function(exists) {
    if(exists) {
      for(i=0; i<songs.length; i++) {
    	  new YOGI(songs[i]);
      } 
    }else {
      console.log('\nPlease resolve the path of id3-editor.jar file. This file is required to update your mp3 files. Currently its set to "' + jarFile + '" in update-mp3-files.js. Once done, please try again, Thank you.\n');
    }
  });
});

function YOGI(file) {
	var me = this;
		me.setTitle(path.basename(file));
		me.file = cwd + '/' +file;
		
		me.askItunes = function(fail) {
			var url = encodeURIComponent(me.title),
			searchItunes = {
				host:'itunes.apple.com',
				path:'/search?entity=song&term='+url
			},
			handleItunesResponse = function(response) {
				var str = '';
				console.log('Asking itunes about ', me.title);
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function() {
					var json = JSON.parse(str),
						replies = json.resultCount;
					if(replies == 0 && fail === undefined) {
						me.askGoogle();
					}else{
						if(replies != 0) {
							me.guesses = json.results;
							me.handleMultiInfo();
						}else {
							fs.appendFileSync('unable-locate-info.log', me.file);
						}
					}
				});
			};
			http.request(searchItunes, handleItunesResponse).end();
		};

		me.askGoogle = function() {
			var url = encodeURIComponent(me.title),
				searchGoogle = {
					host:'ajax.googleapis.com',
					path:'/ajax/services/search/web?v=1.0&q='+url
				},
				handleGoogleResponse = function(response) {
					var str = '';
					console.log('Asked google '+this.path);
					response.on('data', function (chunk) {
						str += chunk;
					});
					response.on('end', function() {
						var json = JSON.parse(str),
							replies = json.responseData && json.responseData.results ? json.responseData.results : [];
						if(replies.length == 0) {
							console.log('Google does not know about', this.path);
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
							str = str.replace(/hq|mp3|download/ig,'');
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
			me.guesses[index].artworkUrl100 = me.guesses[index].artworkUrl100.replace(/100x100/,'600x600')
			hostinfo = url.parse(me.guesses[index].artworkUrl100);
			http.request(hostinfo, function(res) {
				var artwork;
				//me.artwork = (me.file).replace(/\/\./g,'').replace(/\s/g,'')+'.jpg';
				me.artwork = '/tmp/'+path.basename(me.file)+'.jpg';
				artwork = fs.createWriteStream(me.artwork, {'flags': 'a'});
				res.on('data', function (chunk) {
					artwork.write(chunk, encoding='binary');
				});
				res.on('end', function () {
					var update;
					artwork.end();
					cmdarg.push(wrapQuotes(me.artwork));
					update = cmd(['java', '-jar', jarFile].concat(cmdarg).join(' '));
					//console.log('Executing ', update);
					update.stdout.on('data', function(u) {
						console.log('File update says', u);
						cmd('rm -rf ' + me.artwork);
					});
				});
			}).end();
			//cmdarg.push(wrapQuotes(me.file+'.jpg'));
			//search = spawn('wget', [me.guesses[0].artworkUrl100, '-O', me.file+'.jpg']);
		}


	try {
		if(process.argv.length < 3) {
			// assume filename is the title of the song
			me.askItunes();
		}else {
			// read the id3 for the title of the song
			// if id3 does not have title info, fall back
			// to filename as the title of the songs.
			stream = fs.createReadStream(me.file);
			new mm(stream).on('metadata', function (result) {
				if(process.argv.length == 2) {
					me.title = result.title || me.title;
				}
				me.album = result.album.replace(/^\s+|\s+$/g,'');
			  	me.askItunes();
			});
		}
		
		
  	}catch(e) {
  		console.log('Error here', e);
  	}
}

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
}