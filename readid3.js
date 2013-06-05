/*
 * Unit module that reads the metadata(id3) of an mp3/song file.
 */
var fs = require('fs');
var mm = require('musicmetadata');

//create a new parser from a node ReadStream
var parser = new mm(fs.createReadStream(function() {
	if(undefined !== process.argv[2]) {
		return process.argv[2];
	}else {
		console.log('Media not provided. I will use my own..');
		return 'Humma.mp3';
	}
}()));
parser.on('metadata', function (result) {
  console.log(result);
});