import { Coap_Message } from "./coap_message";
interface propdesc{
	name:string;
	id:number;
}
interface prop_holder {
	[propid:number]:propdesc;
}
interface blkprops {
	blkname:string;
	blkid:number;
	pcount:number;
	p:prop_holder;
}
interface blkprops_holder {
	[blkid:number]:blkprops;
}
const id_forbid_re=/[^A-Za-z0-9_]/g;

function name_to_id(name:string):string{
	let res=name.trim().replace(id_forbid_re,'_');
	if (!isNaN(Number(res.charAt(0)))) res='_'+res;
	return res;
}
export function generate_from_strings(dev:string,pl:string):string|undefined{
	let d;
	try {
		d=JSON.parse(pl);
	} catch (e) {
		return undefined;
	}
	if (d==undefined) return undefined;
	if (d==null) return undefined;
	if (typeof d!='object' || Array.isArray(d)) return undefined
	let blks=d.blk;
	let sens=d.sen;
	if (!Array.isArray(blks)) return undefined;
	if (!Array.isArray(sens)) return undefined;
	let rootprops:blkprops={
		blkname:"root", blkid:-1,
		pcount:0,
		p:{} 
	}
	
	let last_blkprops:blkprops=rootprops; //we keep this around  if we can do lvel removal latter on
	// the assignment itself is not really needed but it makes the compiler happy



	let blkprops:blkprops_holder={};
	let nblk=0; 
	for (let b of blks) {
		if (typeof b.I!='number' ||  typeof b.D!='string') continue;
		last_blkprops={blkid:b.I,blkname:name_to_id(b.D),pcount:0,p:{}};
		blkprops[b.I]=last_blkprops; nblk++;
	}
	for (let s of sens) {
		if (s.D==undefined) {
			if (typeof s.T=='string') s.D=s.T; //quirk to handle "Type as description" situation
		}
		if (typeof s.I!='number' ||  typeof s.D!='string') continue;
		let p:propdesc={
			id:s.I,name:name_to_id(s.D),
		}
		let l=s.L;
		let b:blkprops;
		if (typeof l=='number'){
			if (blkprops[l]==undefined){
				b=rootprops;
			} else {
				b=blkprops[l];
			}
		} else {
			 b=rootprops;
		}
		b.pcount++;
		b.p[p.id]=p;
	}

	//check if we can remove a level as we have single block with all properties in it
	if (nblk==1 && rootprops.pcount==0) {
		//yes we do we ubstitute root block with it and empty the blocks list
		rootprops=last_blkprops;//last and only
		blkprops={};//reset  so it appears that we have root-properties only
	}


	console.log("root props:",rootprops);
	console.log("block props:",blkprops);
	return undefined;

}

export function generate_from_descriptor(m:Coap_Message):string|undefined{
	if (m.pl==undefined || m.coiot_dev==undefined) return undefined;
	return generate_from_strings(m.coiot_dev,m.pl.toString('utf8'));
}

console.log("===== SHSEN-1 =====");
console.log(generate_from_strings('SHSEN-1','{"blk":[{"I":1, "D":"sensors"}],"sen":[{"I":11, "D":"motion", "T":"S", "R":"0/1", "L":1},{"I":22, "D":"charger", "T":"S", "R":"0/1", "L":1},{"I":33, "D":"temperature", "T":"T", "R":"-40/125", "L":1},{"I":44, "D":"humidity", "T":"H", "R":"0/100", "L":1},{"I":66, "D":"lux", "T":"L", "R":"0/1", "L":1},{"I":77, "D":"battery", "T":"H", "R":"0/100", "L":1}]}'));
console.log("===== SHSW-44 =====");
console.log(generate_from_strings('SHSW-44','{"blk":[{"I":0,"D":"Relay0"},{"I":1,"D":"Relay1"},{"I":2,"D":"Relay2"},{"I":3,"D":"Relay3"}],"sen":[{"I":111,"T":"W","R":"0/2650","L":0},{"I":112,"T":"Switch","R":"0/1","L":0},{"I":121,"T":"W","R":"0/2650","L":1},{"I":122,"T":"Switch","R":"0/1","L":1},{"I":131,"T":"W","R":"0/2650","L":2},{"I":132,"T":"Switch","R":"0/1","L":2},{"I":141,"T":"W","R":"0/2650","L":3},{"I":142,"T":"Switch","R":"0/1","L":3}],"act":[{"I":211,"D":"Switch","L":0,"P":[{"I":2011,"D":"ToState","R":"0/1"}]},{"I":221,"D":"Switch","L":1,"P":[{"I":2021,"D":"ToState","R":"0/1"}]},{"I":231,"D":"Switch","L":2,"P":[{"I":2031,"D":"ToState","R":"0/1"}]},{"I":241,"D":"Switch","L":3,"P":[{"I":2041,"D":"ToState","R":"0/1"}]}]}'));