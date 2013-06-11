var level = 'info'; // possible values: info/debug
function log(){
	var level = false,
		args = [];
	
	if(!debug) {
		//console.log('Absorbing...');
		return;
	}else {
		for(var i = 0; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		console.log.apply(this, args);		
	}
	
}

function debug() {
	if (level === 'debug')
		log.apply(this, arguments);
}

function info() {
	if(level === 'info' || level === 'debug') {
		log.apply(this, arguments);
	}
}
module.exports.log = {
		debug: debug,
		info: info
};