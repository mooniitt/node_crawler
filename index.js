var request = require('request')
var fs = require('fs')
var async = require('async')
const MAX = 1000

var url = "https://www.zhihu.com/api/v4/members/ni-ba-tie-ren/followees?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20"
var zurl = "https://www.zhihu.com/api/v4/members/demouser/followees?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20"

var options = {
	url: url,
	headers: {
		"authorization": "Bearer Mi4wQUJETTJlanBOQWtBVU1LcDk2QVlDeGNBQUFCaEFsVk5neWJhV0FCWXJueEs2bjJwcUYwdzBTdmVpYmxVS1hmWkl3|1488100019|625fed8bf4dee0970f731c7ecfba9f1886ca4a5b"
	}
}
var users = [],i=0
function getDataList(url) {
	options.url = url
	request.get(options, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var response = JSON.parse(response.body)	
			var zhList = response.data
			zhList.forEach(function(item) {
				if(item.gender == 0) {
					console.log(`正在抓取${item.avatar_url}`)
					users.push({
						"name": item.name,
						"img": item.avatar_url.replace("_is", ""),
						"url_token": item.url_token
					})
				}
			})
			if(response.paging.is_end) {
				if(users.length >= MAX) {
					console.log(`抓取完成`)
					downLoadContent(JSON.stringify(users))
					return
				} else {
					console.log(`第${i+1}个用户的数据`);
					getDataList(zurl.replace("demouser", users[i].url_token))
					i++;
				}
			}else {
				if(users.length >= MAX) {
					console.log(`抓取完成`);
					downLoadContent(JSON.stringify(users));
					return;
				}
				getDataList(response.paging.next)
			}
		}
	})
}
function downLoadContent(cont) {
	fs.appendFile('./' + 'data.js', "module.exports =" + cont, 'utf-8', function(err) {
	if(err) {
		console.log(err)
	} else
		console.log('success')
	})
}
getDataList(url)
