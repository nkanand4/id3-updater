var fs = require('fs'),
	walk = require('walkdir'),
	spawn = require('child_process').spawn,
	mp3ninja = require('./mp3ninja'),
	finder = walk(process.cwd());

(function() {
	var files = [];
	finder.on('file', function(file, stat) {
		if(/.mp3$/i.test(file)) {
			files.push(file);			
			new mp3ninja.YOGI(file);			
		}
	});
	finder.on('end', function() {
		console.log('Working on ' + files.length + ' files');
	});
}());