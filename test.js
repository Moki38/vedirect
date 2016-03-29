var serialport = require('serialport');
var term = require( 'terminal-kit' ).terminal;

//
// Check and Load config.js
//
try {
  var config = require('./config');
} catch (err) {
  serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      if (String(port.pnpId) !== 'undefined') {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
      }
    });
}

//
// Scan the serial ports
//
});

