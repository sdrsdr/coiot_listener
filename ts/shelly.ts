/****************************************************************************************
 * Auto generated from device descriptons by Stoian Ivanov at 2018-08-30T00:41:57.370Z
*****************************************************************************************/


import { CoIoT_Device, Property } from "./device";
import { Listener } from "./listener";

//===== SHSEN-1 =====
export class SHSEN_1 extends CoIoT_Device {
	motion:Property=new Property(11);
	charger:Property=new Property(22);
	temperature:Property=new Property(33);
	humidity:Property=new Property(44);
	lux:Property=new Property(66);
	battery:Property=new Property(77);
	constructor(listener:Listener,serial:string){
		super(listener,"SHSEN-1#"+serial);
		this._all_props[11]=this.motion;
		this._all_props[22]=this.charger;
		this._all_props[33]=this.temperature;
		this._all_props[44]=this.humidity;
		this._all_props[66]=this.lux;
		this._all_props[77]=this.battery;
	};
}


//===== SHSW-44 =====
export class SHSW_44 extends CoIoT_Device {
	Relay0={
		W:new Property(111),
		Switch:new Property(112),
	};

	Relay1={
		W:new Property(121),
		Switch:new Property(122),
	};

	Relay2={
		W:new Property(131),
		Switch:new Property(132),
	};

	Relay3={
		W:new Property(141),
		Switch:new Property(142),
	};
	constructor(listener:Listener,serial:string){
		super(listener,"SHSW-44#"+serial);
		this._all_props[111]=this.Relay0.W;
		this._all_props[112]=this.Relay0.Switch;
		this._all_props[121]=this.Relay1.W;
		this._all_props[122]=this.Relay1.Switch;
		this._all_props[131]=this.Relay2.W;
		this._all_props[132]=this.Relay2.Switch;
		this._all_props[141]=this.Relay3.W;
		this._all_props[142]=this.Relay3.Switch;
	};
}

