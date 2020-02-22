var express = require('express');
const {
    Client
} = require('tplink-smarthome-api');

const client = new Client();

var colorsys = require('colorsys')
var moment = require("moment");
var app = express();

var interport = 81; // Enter the port to run the API on.

app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', function(req, res) {
    var cmd = req.query.cmd;

    var now = moment();
    var formatted = now.format('HH:mm:ss DD-MM-YYYY  Z');

    console.log('');
    console.log("Time: " + formatted);
    console.log("Command Given: " + cmd);
		
	
    if (cmd == "scan") {

        var array = [];
		
        client.startDiscovery({ discoveryTimeout: 250 });
		
		client.on('device-online', (device) => {
            var feed = {
                name: device.alias,
                ip: device.host
            };
            array.push(feed);
        });
		
		client.on('device-new', (device) => {
            var feed = {
                name: device.alias,
                ip: device.host
            };
            array.push(feed);
        });
		//client.stopDiscovery();

        function function1() {
            console.log(array);
            res.end(JSON.stringify(array));
        }

        setTimeout(function1, 250);
		
		function function2() {
			array = [];
			//console.log(array);
        }

        setTimeout(function2, 500);

    } else if (cmd == "power") {

        var temp = parseInt(req.query.ct, 10);
        var hue = req.query.hue;
        var st = req.query.st;
        var bbrightness = parseInt(req.query.bri, 10);
        var trans = parseInt(req.query.trans, 10);
        var bip = req.query.ip;
        if (!bip) {
            rresponse = 'No IP Given';
            res.end(JSON.stringify(rresponse));
        } else {

            if (st == "off") {

                console.log('');
                client.getDevice({
                    host: bip
                }).then(device => {
                    device.lighting.setLightState({
                        on_off: false,
                    });
                });
                rresponse = "Bulb Turned Off";
                res.end(JSON.stringify(rresponse));

            } else if (st == "on") {

                console.log('');
                client.getDevice({host: bip}).then(device => {
                    device.lighting.setLightState({
                        on_off: true,
                    });
                });
                rresponse = "Bulb Turned On";
                res.end(JSON.stringify(rresponse));

            } else {

                if (!temp & !hue) {
                    rresponse = 'No Colour Temp or Hex Given';
                    res.end(JSON.stringify(rresponse));
                } else {

                    if (temp) {

                        if (temp < 2500) {
                            var ctmp = 2500;

                        } else if (temp > 6500) {
                            var ctmp = 6500;

                        } else {
                            var ctmp = temp;

                        }

                        if (bbrightness < 0) {
                            var bbrightness = 1;

                        } else if (bbrightness > 100) {
                            var bbrightness = 100;

                        } else if (isNaN(bbrightness)) {
                            var bbrightness = 100;
                        }

                        if (trans == null) {
                            var trans = 0;
                        }

                        var brightnum = Number(bbrightness);

                        console.log('IP Given: ' + bip);
                        console.log('Brightness: ' + brightnum);
                        console.log('Transition in secs: ' + trans / 1000);
                        console.log('Given Temp: ' + req.query.ct);
                        console.log('Bulb Temp: ' + ctmp);
                        console.log('');
						client.getDevice({ host: bip }).then(device => {
							device.lighting.setLightState({
								on_off: true,
								transition_period: trans,
                                hue: 0,
                                saturation: 0,
                                brightness: brightnum,
                                color_temp: ctmp
							});;
						});

                        rresponse = "Bulb State Updated";
                        res.end(JSON.stringify(rresponse));

                    } else if (hue) {

                        if (bbrightness < 0) {
                            var bbrightness = 1;

                        } else if (bbrightness > 100) {
                            var bbrightness = 100;

                        } else if (isNaN(bbrightness)) {
                            var bbrightness = 100;
                        }

                        if (trans == null) {
                            var trans = 0;
                        }

                        var brightnum = Number(bbrightness);

                        hue = "#" + hue;

                        var color = colorsys.hexToHsl(hue)

                        console.log('IP Given: ' + bip);
                        console.log('Hex: ' + hue);
                        console.log('Brightness: ' + brightnum);
                        console.log('Transition in secs: ' + trans / 1000);
                        console.log('');
						client.getDevice({ host: bip }).then(device => {
							device.lighting.setLightState({
								on_off: true,
								transition_period: trans,
                                hue: color.h,
                                saturation: color.s,
                                brightness: brightnum,
                                color_temp: 0
							});;
						});
                        //const bulb = new TPLSmartDevice(bip);
                        //bulb.power(true, trans, {
                        //        hue: color.h,
                        //        saturation: color.s,
                        //        brightness: brightnum,
                        //        color_temp: 0
                        //    })
                        //    .then(status => {
                        //        console.log(status)
                        //    })
                        //    .catch(err => console.error(err))

                        rresponse = "Bulb State Updated";
                        res.end(JSON.stringify(rresponse));

                    }

                }

            }

        }
		console.log("Secondary Command Given: " + st);
    } else if (cmd == "info") {

        var bip = req.query.ip;
        if (!bip) {
            rresponse = 'No IP Given';
            res.end(JSON.stringify(rresponse));
        } else {
			client.getDevice({ host: bip }).then(device => {
				device.getSysInfo().then(info => {
                    res.end(JSON.stringify(info));
                })
			});
			
            //const bulb = new TPLSmartDevice(bip);
            //bulb.info()
            //    .then(info => {
            //        res.end(JSON.stringify(info));
            //    })
        }

    } else if (cmd == "cinfo") {

        var bip = req.query.ip;
        if (!bip) {
            rresponse = 'No IP Given';
            res.end(JSON.stringify(rresponse));
        } else {
			client.getDevice({ host: bip }).then(device => {
				device.cloud.getInfo().then(info => {
                    res.end(JSON.stringify(info));
                })
			});
            //const bulb = new TPLSmartDevice(bip);
            //bulb.cloud()
            //    .then(info => {
            //        res.end(JSON.stringify(info));
            //    })
        }

    //} else if (cmd == "details") {
	//
    //    var bip = req.query.ip;
    //    if (!bip) {
    //        rresponse = 'No IP Given';
    //        res.end(JSON.stringify(rresponse));
    //    } else {
	//
    //        const bulb = new TPLSmartDevice(bip);
    //        bulb.details()
    //            .then(details => {
    //                res.end(JSON.stringify(details));
    //            })
    //    }

    } else if (cmd == "schedule") {

        var bip = req.query.ip;
        if (!bip) {
            rresponse = 'No IP Given';
            res.end(JSON.stringify(rresponse));
        } else {

			client.getDevice({ host: bip }).then(device => {
				device.schedule.getRules().then(info => {
                    res.end(JSON.stringify(info));
                })
			});

            //const bulb = new TPLSmartDevice(bip);
            //bulb.schedule()
            //    .then(schedule => {
            //        res.end(JSON.stringify(schedule));
            //    })
        }

    } else {
        rresponse = "No CMD Given";
        res.end(JSON.stringify(rresponse));
    }

});

app.listen(interport);
console.log("Server listening on port " + interport);