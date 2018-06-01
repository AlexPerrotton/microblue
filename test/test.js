var microblue = require('../lib/microblue.js');

console.log('microblue');

var buffer = Buffer.from('test');
microblue.connect(function(){
	microblue.write(buffer);

	microblue.read(function(data){
		console.log(data);
	});
});
