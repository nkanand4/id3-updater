var fs = require('fs'),
	walk = require('walkdir'),
	spawn = require('child_process').spawn,
	mp3ninja = require('./mp3ninja');
	bp = require('./dependencymonitor'),
	out = require('./log4js'),
	deferred = new bp.construct(),
	path = require('path'),
	dir = '';
	
/**
 * Exposes the files to mp3Ninja.
 */	
function launch() {
	deferred.onDone(function () {
		var files = [],
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
}
/**
 * Creates temporary directory
 * for download artwork files for
 * the mp3 files.
 */
function prepareArtWorkDirectory() {
	var artworkDirectory = '/tmp';
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
	});
}
/**
 * verifies if the provided argument 
 * for mp3 directory exists or not.
 * Also detects if the argument provided
 * is itself an mp3 file.
 */
function checkMP3Directory() {
	fs.stat(dir, function(error, stats) {
		if(error === null) {
			// check if the argument is a file or directory
			if(stats.isFile()) {
				out.log.debug('Its a regular file.');
				deferred.success();
			}else if(stats.isDirectory()) {
				out.log.debug('provided mp3 directory exists.');
				deferred.success();
			}else {
				// its not a file and neither directory.
			}
		}else {
			out.log.debug('Unable to locate mp3 directory.');
		}
		
	});
}

/**
 * Verifies if the id3-editor jar exists
 * or not.
 */
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
	});
}

/**
 * This is where where it all begins.
 */
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
	launch();
}());