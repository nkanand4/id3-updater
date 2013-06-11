var fs = require('fs'),
	walk = require('walkdir'),
	spawn = require('child_process').spawn,
	mp3ninja = require('./mp3ninja');
	bp = require('./boilerplate'),
	out = require('./log4js'),
	deferred = new bp.construct(),
	path = require('path'),
	dir = '';
	
	
deferred.onDone(function () {
	var finder, files = [],
	finder = walk(dir);
	finder.on('file', function(file, stat) {
		if(/.mp3$/i.test(file)) {
			files.push(file);			
			new mp3ninja.YOGI(file);			
		}
	});
	finder.on('end', function() {
		out.log.debug('Working on ' + files.length + ' files');
	});
});

function prepareArtWorkDirectory() {
	var artworkDirectory = '/tmp'
	fs.exists(artworkDirectory, function(exists) {
		if(exists) {
			out.log.debug(artworkDirectory, ' Directory pre-existing.');
			mp3ninja.YOGI.setTMPDir(artworkDirectory);
			deferred.success();
		}else {
			fs.mkdir(artworkDirectory, '0777', function() {
				out.log.debug('Created ' +artworkDirectory+ ' directory!');
				deferred.success();
			});
		}
		mp3ninja.YOGI.setTMPDir(artworkDirectory);
	})
}
function checkMP3Directory() {
	fs.exists(dir, function(exists) {
		if(exists) {
			out.log.debug('mp3 directory located.');
			deferred.success();
		}else {
			out.log.debug('Unable to locate mp3 directory.');
		}
	});
}

function checkJarFile() {
	var jarFile = path.dirname(process.argv[1]) + path.sep +'id3-editor.jar';
	fs.exists(jarFile, function(exists) {
		if(exists) {
			out.log.debug('jar file located.');
			mp3ninja.YOGI.setjar(jarFile);
			deferred.success();
		}else {
			out.log.debug('Unable to locate jarfile directory.');
		}
	})
}

(function() {
	if(process.argv.length < 3) {
		// mp3 directory not provided, assuming current
		// working directory.
		dir = process.cwd();
	}else {
		// accept the provided path as music directory
		dir = process.argv[2];
	}
	checkMP3Directory();
	prepareArtWorkDirectory();
	checkJarFile();
}());