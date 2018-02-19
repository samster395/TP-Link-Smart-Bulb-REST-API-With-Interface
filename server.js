var express = require('express');
const TPLSmartDevice = require('tplink-lightbulb')
var colorsys = require('colorsys')
var moment = require("moment");
var app = express();

var interport = 8080; // Enter the port to run the API on.

app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', function(req, res){
var cmd = req.query.cmd;

var now = moment();
var formatted = now.format('HH:mm:ss DD-MM-YYYY  Z');

console.log(''); 
console.log("Time: " + formatted);
console.log("Command Given: " + cmd);

if (cmd == "scan") {

const scan = TPLSmartDevice.scan()
  .on('light', light => {
	 console.log(light.host); 
	 rresponse = light.host;
	 res.end(JSON.stringify(rresponse));
  })

} else if (cmd == "power") {

var temp = parseInt(req.query.ct, 10);
var hue = req.query.hue;
var st = req.query.st;
var bbrightness = parseInt(req.query.bri, 10);
var trans = parseInt(req.query.trans, 10);
var bip = req.query.ip;
if(!bip) {
	rresponse = 'No IP Given';
	res.end(JSON.stringify(rresponse));
} else {
	
if (st == "off") {
	
const bulb = new TPLSmartDevice(bip);
console.log('');
	bulb.power(false)
      .then(status => {
        console.log(status)
      })
rresponse = "Bulb Turned Off";  
res.end(JSON.stringify(rresponse));
	
} else if (st == "on") {
	
const bulb = new TPLSmartDevice(bip);
console.log('');
	bulb.power(true)
      .then(status => {
        console.log(status)
      })
rresponse = "Bulb Turned On";  
res.end(JSON.stringify(rresponse));
	
} else {

if (!temp & !hue) {
	rresponse = 'No Colour Temp or Hex Given';
	res.end(JSON.stringify(rresponse));
} else {
	
if(temp) {

if (temp < 2500) {
var	ctmp = 2500;

} else if (temp > 6500){
var	ctmp = 6500;
		
} else {
var ctmp = temp;
	
}

if (bbrightness < 0) {
var	bbrightness = 1;

} else if (bbrightness > 100){
var	bbrightness = 100;
		
} else if (isNaN(bbrightness)){
var	bbrightness = 100;	
}

if (trans == null){
var	trans = 0;
}

var brightnum = Number(bbrightness);

console.log('IP Given: ' + bip);
console.log('Brightness: ' + brightnum);
console.log('Transition in secs: ' + trans / 1000);
console.log('Given Temp: ' + req.query.ct);
const bulb = new TPLSmartDevice(bip);
console.log('Bulb Temp: ' + ctmp);
console.log('');
bulb.power(true, trans, {hue: 0, saturation: 0, brightness: brightnum, color_temp: ctmp})
.then(status => {
	console.log(status)
})
.catch(err => console.error(err))  

rresponse = "Bulb State Updated";  
res.end(JSON.stringify(rresponse));

} else if (hue) {
	
if (bbrightness < 0) {
var	bbrightness = 1;

} else if (bbrightness > 100){
var	bbrightness = 100;
		
} else if (isNaN(bbrightness)){
var	bbrightness = 100;	
}

if (trans == null){
var	trans = 0;
}

var brightnum = Number(bbrightness);

hue = "#" + hue;

var color = colorsys.hexToHsl(hue)

console.log('IP Given: ' + bip);
console.log('Hex: ' + hue);
console.log('Brightness: ' + brightnum);
console.log('Transition in secs: ' + trans / 1000);
console.log('');

const bulb = new TPLSmartDevice(bip);
bulb.power(true, trans,{hue: color.h, saturation: color.s, brightness: brightnum, color_temp: 0})
.then(status => {
	console.log(status)
})
.catch(err => console.error(err))  

rresponse = "Bulb State Updated";  
res.end(JSON.stringify(rresponse));

}

}

}

}

} else if (cmd == "info") {

var bip = req.query.ip;
if(!bip) {
	rresponse = 'No IP Given';
	res.end(JSON.stringify(rresponse));
} else {

const bulb = new TPLSmartDevice(bip);
bulb.info()
  .then(info => {
	res.end(JSON.stringify(info));
  })
}

} else if (cmd == "cinfo") {

var bip = req.query.ip;
if(!bip) {
	rresponse = 'No IP Given';
	res.end(JSON.stringify(rresponse));
} else {

const bulb = new TPLSmartDevice(bip);
bulb.cloud()
  .then(info => {
	res.end(JSON.stringify(info));
  })
}

} else if (cmd == "details") {

var bip = req.query.ip;
if(!bip) {
	rresponse = 'No IP Given';
	res.end(JSON.stringify(rresponse));
} else {

const bulb = new TPLSmartDevice(bip);
bulb.details()
  .then(details => {
	res.end(JSON.stringify(details));
  })
}

} else if (cmd == "schedule") {

var bip = req.query.ip;
if(!bip) {
	rresponse = 'No IP Given';
	res.end(JSON.stringify(rresponse));
} else {

const bulb = new TPLSmartDevice(bip);
bulb.schedule()
  .then(schedule => {
	res.end(JSON.stringify(schedule));
  })
}

} else {
rresponse = "No CMD Given";
res.end(JSON.stringify(rresponse));
}

});

app.listen(interport);
console.log("Server listening on port " + interport);