var request = require('request')
var fs = require('fs')
var async = require('async')
var data = require('./data.js')

var eyeUrl = "http://api.eyekey.com/face/Check/checking";
var options = {
	"app_id": "f89ae61fd63d4a63842277e9144a6bd2",
	"app_key": "af1cd33549c54b27ae24aeb041865da2",
	"url": "https://pic4.zhimg.com/43fda2d268bd17c561ab94d3cb8c80eb.jpg"
}
function face(item) {
	options.url = item.img;
	request.post({
		url: eyeUrl,
		form: options
	}, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			try {
				if(data.face[0].attribute.gender == 'Female') {
					console.log(`正在下载${item.img}`);
					downLoadImg(item)
				}
			} catch(e) {
				console.log(`验证失败${item.img}~`);
			}
		}
	})
}
var only = {}
function downLoadImg(image) {
	request(image.img).pipe(fs.createWriteStream('./image/' + image.name + Date.now() + '.' + image.img.substring(image.img.lastIndexOf(".") + 1, image.img.length)))
}


function startDownLoad(imgdata){
	async.eachLimit(imgdata, 1, function (item, callback) {
		face(item)
		callback()
	})
}
startDownLoad(data)