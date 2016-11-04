# vedirect
Nodejs Victron Ve.Direct
- BMV-600
- BMV-700
- MPPT

### Install

```
$ npm install 
```

### Example
Don't forget to configure the correct serialport for your BMV in test.js
```
$ nodejs test.js
```

### Usage

```
var vedirect = require( 'vedirect' );
var bmvdata = {};
vedirect.open('/dev/ttyBMV0');
forever {
  bmvdata = vedirect.update();
  console.log(bmvdata.V);
}
vedirect.close('/dev/ttyBMV0');
```

### Restrictions

This version only can currently handle 1 Ve.Direct interface, as i haven't found a way to create udev rules for the 
new Ve.Direct devices (something about a missing \%{Serial id}

This version has been build/tested with Node v6
$curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

