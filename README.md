# microblue

An easy solution to communicate with your micro:bit by bluetooth

__Note:__ Raspbian/linux are currently the only tested OSes. The other platforms as Windows, Mac OS X, FreeBSD should also work.

## Prerequisites

### Ubuntu/Debian/Raspbian

```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

Make sure ```node``` is on your path, if it's not, some options:
 * symlink ```nodejs``` to ```node```: ```sudo ln -s /usr/bin/nodejs /usr/bin/node```
 * [install Node.js using the NodeSource package](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
 
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

#### Read 

```javascript
microblue.read(callback(data));
```

#### Write

```javascript
var data = Buffer.from('...');

microblue.write(data); //data is a Buffer
```
