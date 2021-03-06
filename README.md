# microblue

An easy solution to communicate with your micro:bit by bluetooth

__Note:__ Raspbian/linux are currently the only tested OSes. The other platforms as Windows, Mac OS X, FreeBSD should also work.

## Status

This library is in the early stages so things might change and break. Apologies in advance! If the version you use is not stable please try with a previous version.

## Prerequisites

It is necessary to paire your device (PC/raspberry/mobile) to the micro:bit without connect it.

### Linux

* Kernel version 3.6 or above
* ```sh libbluetooth-dev```

#### Ubuntu/Debian/Raspbian

```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

Make sure ```node``` is on your path, if it's not, some options:
 * symlink ```nodejs``` to ```node```: ```sudo ln -s /usr/bin/nodejs /usr/bin/node```
 * [install Node.js using the NodeSource package](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

#### Paire the micro:bit (without graphic solution)

```sh
bluetoothctl

scan on
```

Went your micro:bit is discover

```sh
scan off

pair xx:xx:xx:xx:xx:xx

exit
```

## Install

```sh
npm install microblue
```

## Usage

```javascript
var microblue = require('microblue');
```

### Actions

#### Connect to your micro:bit

```javascript
microblue.connect(callback());
```

#### Uart

##### Read

```javascript
microblue.read(callback(data));
```

##### Write

```javascript
var data = Buffer.from('...');

microblue.write(data); //data is a Buffer
```

#### Accelerometer

##### Read

```javascript
microblue.accelerometer(callback(data)); //data is a JSON which contains measurements for X, Y and Z axes
```

#### Magnetometer

##### Read

```javascript
microblue.compass(callback(data)); //data is a JSON which contains measurements for X, Y and Z axes
```

### Create at
<a href="https://www.listic.univ-smb.fr/en/home/" target="_blank"><img src="assets/logo_listic.png" width="20%" height="20%"></a>

### To Do

- ~~Create function to Read/Write (Uart)~~
- ~~Create function to Read data from accelerometer~~
- ~~Create function to Read data from magnetometer~~
- Create function to Read input from the buttons
- Create function to Read/Write input from the IO pins
- Create function to Read/Write on the LED matrix
- Create function to Read temperature
