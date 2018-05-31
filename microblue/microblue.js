var noble = require('noble');

        var uartServiceUuid = '6e400001b5a3f393e0a9e50e24dcca9e';
        var uartReadCharacteristicUuid = '6e400002b5a3f393e0a9e50e24dcca9e';
        var uartWriteCharacteristicUuid = '6e400003b5a3f393e0a9e50e24dcca9e';

	var uartService = null;
        var uartReadCharacteristic = null;
        var uartWriteCharacteristic = null;

var connect = function(callback){

        noble.on('stateChange', function(state){

                if(state === 'poweredOn'){
                        noble.startScanning();
                }
                else{
                        noble.stopScanning();
                }

        });

        noble.on('discover', function(peripheral){
                noble.stopScanning();
                peripheral.connect(function(err){
			if(err){
                                console.log('microblue warning: unknown peripheral');
				console.log('microblue warning: please check if your device is paired with a micro:bit');
				console.log('microblue help: if you are already paired try to restart the bluetooth with the command "sudo service bluetooth restart"');
                                return;
                        }
                        peripheral.discoverServices([uartServiceUuid], function(err,services){
                                services.forEach(function(service){
                                        service.discoverCharacteristics([], function(err, characteristics){
                                                characteristics.forEach(function(characteristic){
                                                        if(uartReadCharacteristicUuid == characteristic.uuid){
                                                                uartReadCharacteristic = characteristic;
                                                        }else if (uartWriteCharacteristicUuid == characteristic.uuid){
                                                                uartWriteCharacteristic = characteristic;
							}
                                                });
						if(uartReadCharacteristic && uartWriteCharacteristic){
                                                	callback();
                                        	}
                                        });
                                });
                        });
                });
        });
}

var read = function(callback){
        uartReadCharacteristic.subscribe(function(err){
                uartReadCharacteristic.read(function(error, data){
                        uartReadCharacteristic.unsubscribe();
			callback(data.toString());
                });
        });
}

var write = function(buffer){
	var LF = new Buffer(1);
	LF[0] = 0x0A;
        uartWriteCharacteristic.write(buffer, true);
	uartWriteCharacteristic.write(LF, true);
}

exports.connect = connect;
exports.read = read;
exports.write = write;
