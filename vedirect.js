var serialport = require('serialport');
var term = require( 'terminal-kit' ).terminal;

//
// BMV
//
var port = new serialport.SerialPort('/dev/ttyS0', {
                baudrate: 19200,
                parser: serialport.parsers.readline('\r\n')});

var bmvdata = {
        V: 0,
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
        H13:0,
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


port.on('data', function(line) {
//    console.log(line);
    var res = line.split("\t");
//    console.log(res[0]+" = "+res[1]);
        switch(res[0]) {
        case    'V':
                        bmvdata.V = res[1];
//                console.log("V = "+bmv0data.V);
                        break;
        case    'VS':
                        bmvdata.VS = res[1];
//                console.log("VS = "+bmv0data.VS);
                        break;
        case    'I':
                        bmvdata.I = res[1];
                        break;
        case    'CE':
                        bmvdata.CE = res[1];
                        break;
        case    'SOC':
                        bmvdata.SOC = res[1];
                        break;
                default:
        //                console.log(line);
                        break;
        }
});

function terminate()
{
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
}

term.clear();

function vedirect_display() {
     if (bmvdata.AR != 0) {
         term.moveTo( 24 , 6 , "Accu Alarm: %f") ;
         term.brightRed( bmvdata.AR ) ;
//Low Voltage 1 High Voltage 2 Low SOC 4 Low Starter Voltage 8 High Starter Voltage 16 Low Temperature 32 High Temperature 64 Mid Voltage 128 E
     } else {
         term.moveTo( 24 , 6 , "                  ") ;
     }
     term.moveTo( 24 , 7 , "                  ") ;
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
     term.moveTo( 24 , 8 , "Start Accu: %f  " , bmvdata.VS ) ;
     term.moveTo( 24 , 9 , "BoegS Accu: %f  " , bmvdata.VB ) ;

     term.moveTo( 24 ,11 , "Panel Volt: %f  " , bmvdata.VPV ) ;
     term.moveTo( 24 ,12 , "Panel Watt: %f  " , bmvdata.PPV ) ;
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


