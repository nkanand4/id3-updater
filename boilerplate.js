function boilerplate() {
	// different statuses
	// 1. /tmp directory checkpoint
	// 2. mp3 directory checkpoint
	// 3. jar file checkpoint
	// TODO: 4. java availability checkpoint
	
	var dep = 3, state = 'pending',
		done = [];
	
	this.onDone = function(fn) {
		done.push(fn);
	}
	
	this.success = function() {
		dep -= 1;
		if(dep === 0) {
			// all dependencies complete
			done.forEach(function(i) {
				i();
			});
			done = [];
		}
	}
}

module.exports.construct = boilerplate;