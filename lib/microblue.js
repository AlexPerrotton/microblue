var noble = require('noble');

        var uartServiceUuid = '6e400001b5a3f393e0a9e50e24dcca9e';
        var uartReadCharacteristicUuid = '6e400002b5a3f393e0a9e50e24dcca9e';
        var uartWriteCharacteristicUuid = '6e400003b5a3f393e0a9e50e24dcca9e';
        var accelerometerServiceUuid = 'e95d0753251d470aa062fa1922dfa9a8';
        var accelerometerDataCharacteristicUuid = 'e95dca4b251d470aa062fa1922dfa9a8';
	var magnetometerServiceUuid = 'e95df2d8251d470aa062fa1922dfa9a8';
	var magnetometerDataCharacteristicUuid = 'e95dfb11251d470aa062fa1922dfa9a8';

        var serviceUUIDs = [uartServiceUuid, accelerometerServiceUuid, magnetometerServiceUuid];
        var characteristicUUIDs = [uartReadCharacteristicUuid, uartWriteCharacteristicUuid, accelerometerDataCharacteristicUuid, magnetometerDataCharacteristicUuid];

        var uartService = null;
        var uartReadCharacteristic = null;
        var uartWriteCharacteristic = null;
        var accelerometerService = null;
        var accelerometerDataCharacteristic = null;
	var magnetometerService = null;
	var magnetometerDataCharacteristic = null;

var connect = function(callback){

        noble.on('stateChange', function(state){

                if(state === 'poweredOn'){
                        noble.startScanning();
                }
                else{
                        noble.stopScanning();
                }

        });

	//console.log("microblue: try to discover micro:bit...");

        noble.on('discover', function(peripheral){
		//console.log("microblue find: " + peripheral.address + " " + peripheral.advertisement.localName);
                if(peripheral.advertisement.localName != undefined){
		    if(peripheral.advertisement.localName.indexOf("BBC micro:bit") > -1){
			noble.stopScanning();
	                peripheral.connect(function(err){
				if(err){
	                                console.log('microblue warning: please check if your device is paired with a micro:bit');
					console.log('microblue help: if you are already paired try to restart the bluetooth with the command "sudo service bluetooth restart" && "sudo systemctl daemon-reload"');
	                                process.exit();
	                        }
				peripheral.discoverServices(serviceUUIDs, function(err,services){
	                                if(err){
	                                        console.log('microblue error: Discover Services failed');
	                                }
	                                services.forEach(function(service){
	                                        service.discoverCharacteristics(characteristicUUIDs, function(err, characteristics){
	                                                if(err){
	                                                        console.log('microblue error: Discover characteristics failed');
	                                                }
	                                                characteristics.forEach(function(characteristic){
								//console.log(characteristic.uuid);
								if(uartReadCharacteristicUuid == characteristic.uuid){
	                                                                uartReadCharacteristic = characteristic;
	                                                        }else if(uartWriteCharacteristicUuid == characteristic.uuid){
	                                                                uartWriteCharacteristic = characteristic;
	                                                        }else if(accelerometerDataCharacteristicUuid == characteristic.uuid){
	                                                                accelerometerDataCharacteristic = characteristic;
	                                                        }else if(magnetometerDataCharacteristicUuid == characteristic.uuid){
									magnetometerDataCharacteristic = characteristic;
								}
	                                                });
	                                        });
					});
	                        });

				setTimeout(function(){
	                                //console.log("callback");
        	                        callback();
                                }, 500);

				process.on('SIGINT', function(){
	        			console.log("Caught interrupt signal");
					console.log("microblue warning: disconnect..");
	        			peripheral.disconnect(function(err){
	                			if(err){
	                			        console.log('microblue error: failed to disconnect the microbit');
	                			}else{
	                				process.exit();
	                			}
	        			});
				});
			});
		    }
		}
        });
}

var read = function(callback){
	if(uartReadCharacteristic == null){
		console.log("microblue error: uart service not open");
	}else{
        	uartReadCharacteristic.subscribe(function(err){
               	 	uartReadCharacteristic.read(function(err, data){
                        	uartReadCharacteristic.unsubscribe();
				callback(data.toString());
                	});
        	});
	}
}

var write = function(buffer){
	if(uartWriteCharacteristic == null){
		console.log("microblue error: uart service not open");
	}else{
		var LF = new Buffer(1);
		LF[0] = 0x0A;
        	uartWriteCharacteristic.write(buffer, true);
		uartWriteCharacteristic.write(LF, true);
	}
}

var accelerometer = function(callback){
	if(accelerometerDataCharacteristic == null){
                console.log("microblue error: accelerometer service not open");
        }else{
        	accelerometerDataCharacteristic.subscribe(function(err){
        	        accelerometerDataCharacteristic.read(function(err, data){
        	                accelerometerDataCharacteristic.unsubscribe();
        	                x = data[0] | (data[1] << 8);
		                y = data[2] | (data[3] << 8);
        		        z = data[4] | (data[5] << 8);

        	    		if(x & (1 << 16 - 1)){    x = x - (1<<16); }
        	   		if(y & (1 << 16 - 1)){    y = y - (1<<16); }
        	   		if(z & (1 << 16 - 1)){    z = z - (1<<16); }

				callback({'x':x,'y':y,'z':z});
        	        });
        	});
	}
}

var compass = function(callback){
	if(magnetometerDataCharacteristic == null){
                console.log("microblue error: magnetometer service not open");
        }else{
		magnetometerDataCharacteristic.subscribe(function(err){
			magnetometerDataCharacteristic.read(function(err, data){
				magnetometerDataCharacteristic.unsubscribe();
				x = data[0] | (data[1] << 8);
        	                y = data[2] | (data[3] << 8);
				z = data[4] | (data[5] << 8);

				if(x & (1 << 16 - 1)){    x = x - (1<<16); }
        	                if(y & (1 << 16 - 1)){    y = y - (1<<16); }
				if(z & (1 << 16 - 1)){    z = z - (1<<16); }

				x = x / 1000;
				y = y / 1000;
				z = z / 1000;

				callback({'x':x,'y':y, 'z':z});
			});
		});
	}
}

exports.connect = connect;
exports.read = read;
exports.write = write;
exports.accelerometer = accelerometer;
exports.compass = compass;
