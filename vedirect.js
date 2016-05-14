var serialport = require('serialport');
var term = require( 'terminal-kit' ).terminal;

//
// Fetch configuration
//
try {
    var config = require('./config');
} catch (err) {
    console.log("Missing or corrupted config file.");
    console.log("Have a look at config.js.example if you need an example.");
    console.log("Error: "+err);
    process.exit(-1);
}

//
// BMV
//
var serialport = require('serialport');

var bmvdata = {
        V: 0,
        V2: 0,
        VS: 0,
        VM: 0,
        DM: 0,
        VPV: 0,
        PPV: 0,
        I: 0,
        IL: 0,
        LOAD: 0,
        T: 0,
        P: 0,
        CE: 0,
        SOC: 0,
        SOC2: 0,
        TTG: 0,
        Alarm:   'OFF',
        Relay:   'OFF',
        AR:      0,
        H1: 0,
        H2: 0,
        H3: 0,
        H4: 0,
        H5: 0,
        H6: 0,
        H7: 0,
        H8: 0,
        H9: 0,
        H10: 0,
        H11: 0,
        H12: 0,
        H13: 0,
        H14: 0,
        H15: 0,
        H16: 0,
        H17: 0,
        H18: 0,
        H19: 0,
        H20: 0,
        H21: 0,
        H22: 0,
        H23: 0,
        ERR: 0,
        CS: 0,
        BMV:     '602S',
        FW:      '212',
        PID: 0,
        SER: 0,
        HSDS: 0,
        };

function get_product_longname(pid) {
    var product_longname;

    if (pid == "0x203") product_longname = "BMV-700";
    if (pid == "0x204") product_longname = "BMV-702";
    if (pid == "0x205") product_longname = "BMV-700H";
    if (pid == "0x300") product_longname = "MPPT 70/15";
    if (pid == "0xA042") product_longname = "MPPT 75/15";
    if (pid == "0xA043") product_longname = "MPPT 100/15";
    if (pid == "0xA044") product_longname = "MPPT 100/30";
    if (pid == "0xA041") product_longname = "MPPT 150/35";
    if (pid == "0xA040") product_longname = "MPPT 75/50";
    if (pid == "0xA045") product_longname = "MPPT 100/50";

    return product_longname;
};

function parse_serial(serport, line) {
    var res = line.split("\t");

    if (config.vedirect.type[serport] == "unknown") {
        switch(res[0]) {
              case  'BMV':
                        config.vedirect.type[serport] = "BMV-"+res[1];
                        break;
              case  'PID':
                        config.vedirect.type[serport] = get_product_longname(res[1]);    
                        break;
        }
    };

    if (config.vedirect.fw[serport] == "unknown") {
        switch(res[0]) {
              case  'FW':
                        config.vedirect.fw[serport] = res[1];    
                        break;
        }
    };

    switch(res[0]) {
        case    'V':
                        if (serport == 0) bmvdata.V = Math.floor(res[1]/10)/100;
                        if (serport == 2) bmvdata.V2 = Math.floor(res[1]/10)/100;
                        break;
        case    'VS':
                        bmvdata.VS = Math.floor(res[1]/10)/100;
                        break;
        case    'I':
                        if (serport == 0) bmvdata.I = res[1];
                        if (serport == 2) bmvdata.I2 = res[1];
                        break;
        case    'CE':
                        bmvdata.CE = res[1];
                        break;
        case    'VPV':
                        bmvdata.VPV = Math.floor(res[1]/10)/100;
                        break;
        case    'PPV':
                        bmvdata.PPV = res[1];
                        break;
        case    'CS':
                        bmvdata.CS = res[1];
                        break;
        case    'SOC':
                        if (serport == 0) bmvdata.SOC = res[1]/10;
                        if (serport == 2) bmvdata.SOC2 = res[1]/10;
                        break;
        case    'H20':
                        bmvdata.YT = res[1];
                        break;
        case    'H22':
                        bmvdata.YY = res[1];
                        break;
        default:
//            console.log(line);
              break;
        }
}


if (config.vedirect.device[0]) {
    var port0 = new serialport.SerialPort(config.vedirect.device[0], {
                baudrate: 19200,
                parser: serialport.parsers.readline('\r\n')});
    port0.on('data', function(line) {
        parse_serial(0, line);
    });
}
if (config.vedirect.device[1]) {
  var port1 = new serialport.SerialPort(config.vedirect.device[1], {
                baudrate: 19200,
                parser: serialport.parsers.readline('\r\n')});
    port1.on('data', function(line) {
        parse_serial(1, line);
    });
}
if (config.vedirect.device[2]) {
  var port2 = new serialport.SerialPort(config.vedirect.device[2], {
                baudrate: 19200,
                parser: serialport.parsers.readline('\r\n')});
    port2.on('data', function(line) {
        parse_serial(2, line);
    });
}

function terminate()
{
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
}

term.clear();

function vedirect_display() {
     term.moveTo( 24 , 2 , "                                                                                                       ") ;
     term.moveTo( 24 , 2 , "Port0 type: ") ;
         term.blue( config.vedirect.type[0] ) ;
     term.moveTo( 50 , 2 , "fw: ") ;
         term.blue( config.vedirect.fw[0] ) ;
     term.moveTo( 24 , 3 , "                                                                                                       ") ;
     term.moveTo( 24 , 3 , "Port1 type: ") ;
         term.blue( config.vedirect.type[1] ) ;
     term.moveTo( 50 , 3 , "fw: ") ;
         term.blue( config.vedirect.fw[1] ) ;
     term.moveTo( 24 , 4 , "                                                                                                       ") ;
     term.moveTo( 24 , 4 , "Port2 type: ") ;
         term.blue( config.vedirect.type[2] ) ;
     term.moveTo( 50 , 4 , "fw: ") ;
         term.blue( config.vedirect.fw[2] ) ;

     if (bmvdata.AR != 0) {
         term.moveTo( 24 , 6 , "Accu Alarm: %f") ;
         term.brightRed( bmvdata.AR ) ;
//Low Voltage 1 High Voltage 2 Low SOC 4 Low Starter Voltage 8 High Starter Voltage 16 Low Temperature 32 High Temperature 64 Mid Voltage 128 E
     } else {
         term.moveTo( 24 , 6 , "                  ") ;
     }
     term.moveTo( 24 , 7 , "                             ") ;
     term.moveTo( 24 , 7 , "House Accu: ") ;
     if (bmvdata.I == 0) {
         term.blue( bmvdata.V ) ;
     }
     if (bmvdata.I < 0) {
         term.yellow( bmvdata.V ) ;
     }
     if (bmvdata.I > 0) {
         term.green( bmvdata.V ) ;
     }
     term.moveTo( 45 , 7 , "SOC: %f   " , bmvdata.SOC ) ;
     term.moveTo( 24 , 8 , "Start Accu: %f   " , bmvdata.VS ) ;
     term.moveTo( 24 , 9 , "                             ") ;
     term.moveTo( 24 , 9 , "BowTr Accu: ") ;
     if (bmvdata.I2 == 0) {
         term.blue( bmvdata.V2 ) ;
     }
     if (bmvdata.I2 < 0) {
         term.yellow( bmvdata.V2 ) ;
     }
     if (bmvdata.I2 > 0) {
         term.green( bmvdata.V2 ) ;
     }
     term.moveTo( 45 , 9 , "SOC: %f   " , bmvdata.SOC2 ) ;

     term.moveTo( 24 ,11 , "Panel Volt: %f   " , bmvdata.VPV ) ;
     term.moveTo( 24 ,12 , "Panel Watt: %f   " , bmvdata.PPV ) ;
     term.moveTo( 24 ,13 , "Panel CS  : ") ;
     switch(bmvdata.CS) {
     case    '0':
         term.blue( "OFF  " ) ;
         break;
     case    '2':
         term.red( "Fault" ) ;
         break;
     case    '3':
         term.green( "Bulk " ) ;
         break;
     case    '4':
         term.green( "Absob" ) ;
         break;
     case    '5':
         term.green( "Float" ) ;
         break;
        }
//     term.moveTo( 24 ,13 , "Panel CS  : %f  " , bmvdata.CS ) ;
     term.moveTo( 24 ,14 , "Yield Tday: %f  " , bmvdata.YT ) ;
     term.moveTo( 24 ,15 , "Yield Yday: %f  " , bmvdata.YY ) ;

     term.moveTo( 0 , 0 , "") ;
}


var displayinterval = setInterval(function () {
     vedirect_display();
  }, 500);

term.on( 'key' , function( name , matches , data ) {
    term.moveTo( 1 , 15 , "Keyboard event %s, %s.\n" , name , data ) ;
//    console.log( "'key' event:" , name ) ;
    if ( matches.indexOf( 'CTRL_C' ) >= 0 ) {
      term.green( 'CTRL-C received...\n' ) ;
      terminate() ;
    }
} ) ;


