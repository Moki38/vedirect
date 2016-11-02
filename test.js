var term = require( 'terminal-kit' ).terminal;
var vedirect = require( './index.js' );

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

var bmvdata = {};

if (config.vedirect.device[0]) {
}
if (config.vedirect.device[1]) {
}
if (config.vedirect.device[2]) {
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
    bmvdata = vedirect.update();
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


