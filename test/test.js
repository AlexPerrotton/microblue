ar microblue = require('../lib/microblue.js');

console.log('--- microblue ---');

microblue.connect(function(){

microblue.read(function(data){});
var interval = setInterval(function(){
        microblue.accelerometer(function(data){
                console.log('accel = ' + JSON.stringify(data));
        });
        microblue.compass(function(data){
                console.log('compass = ' + JSON.stringify(data));
        });

}, 1000);

});

