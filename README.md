# CoIoT Listener and Shelly device helpers

This project aims to provide a basis for simple DIY home automation scripts that run on nodejs and automate CoIoT devices like the Shelly family from https://shelly.cloud/

## How to use

As we don't have a npm package you should install it directly from github:

```
npm install http://github.com...
```

the project is developed in TypeScript but the repo also include pretranspiled JavaScript if you don'e need all the code hints and type safety from TypeScript (you're missing alot)

To use it in plain-old-JavaScript:

```
const coiot_listener = require("coiot_listener");
let l = new coiot_listener.Listener();
let s = new coiot_listener.shelly.SHSEN_1(l, "123456");
s.on("newip", () => {
    console.log("sensor is at " + s.device_ip + " temp is " + s.temperature.value);
});
s.temperature.on("change", () => {
    console.log("sensor got temp change: to " + s.temperature.value);
});
```

We recommend using typescript:

```
import {Listener, shelly} from "coiot_listener"

let l=new Listener();
let s=new shelly.SHSEN_1(l,"123456");
s.on("newip",()=>{
        console.log("sensor is at "+s.device_ip+" temp is "+s.temperature.value);
}); 
s.temperature.on("change",()=>{
        console.log("sensor got temp change: to "+s.temperature.value);
});

```

As you can see the code is almost the same but the hints from the IDE are **MUCH** better :)

## Contributions

The package is LGPL3 you're free to use it in commercial apps, but you have to contribute back the changes you made to the package. Your code is yours, the package  and it's changes should benefit all users.

Only *.ts files should be mentioned in PR-s: all else is futile 
