var fs = require('fs'),
	spawn = require('child_process').spawn,
	mp3ninja = require('./mp3ninja'),
	finder = require('findit').find(process.cwd());

(function() {
	var files = [];
	finder.on('file', function(file, stat) {
		if(/.mp3$/.test(file)) {
			files.push(file);			
			new mp3ninja.YOGI(file);			
		}
	});
	finder.on('end', function() {
		console.log('Working on ' + files.length + ' files');
	});
}());