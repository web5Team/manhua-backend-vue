var paramB = ''
var name = ''
var versioncode = ''
var appid = ''
var platformid = ''
var assign = ''
var img = ''

// 从原生URL获取token
if (getQueryVariable('token')) {
	localStorage.setItem('token', getQueryVariable('token'));
}

// 错误提示
function tips(msg) {
	if ($('.mask').length <= 0) {
		var html =
			`
            <div class="mask">
                <div class="tipsBox">
                    <img src="img/tips.png" />
                    <p class="prompt"></p>
                </div>
            </div>
        `;
		$('body').prepend(html);
	}
	$('.prompt').text(msg)
	$('.mask').show()
	$('.tipsBox').show()
	var timer = setTimeout(function() {
		$('.tipsBox').fadeOut('slow', function() {
			$('.mask').hide()
			clearTimeout(timer)
		});
	}, 1000)
}

// 余额不足
function insufficientBalance(cash) {
	if ($('.insufficient').length <= 0) {
		var title = ''
		var content = ''
		if (cash) {
			title = '您的余额不足'
			content = '去邀请好友赚取更多现金'
		} else {
			title = '您的金币不足'
			content = '快去赚取更多金币吧'
		}
		var html = `
            <div class="insufficient">
                <p>` + title + `</p>
                <span>` +
			content +
			`</span>
                <div class="iftBtn">
                    <div>确认</div>
                </div>
            </div>
        `;
		$('.maskMain').prepend(html);
	}
	$('.maskMain').show();
	$('.insufficient').show();
}

// 关闭余额不足提示
$('body').delegate('.iftBtn', 'click', function() {
	$('.maskMain').hide();
	$('.insufficient').hide();
})

//编写一个插件叫做goToTop
jQuery.fn.goToTop = function(settings) {
	settings = jQuery.extend({
		min: 1, //设置距离顶部的最小值为1
		fadeSpeed: 200, //设置一个淡出淡入的速度
		ieOffset: 50 //处理IE的兼容问题
	}, settings);
	return this.each(function() {
		//listen for scroll
		var el = $(this);
		el.css("display", "none"); //in case the user forgot
		$(window).scroll(function() {
			//stupid IE hack
			if (!jQuery.support.hrefNormalized) { //设置这个按钮的css属性
				el.css({
					"position": "absolute",
					"top": $(window).scrollTop() + $(window).height() - settings.ieOffset
				});
			}
			if ($(window).scrollTop() >= settings.min) {
				el.fadeIn(settings.fadeSpeed);
			} else {
				el.fadeOut(settings.fadeSpeed);
			}
		});
	});
};

// 时间戳格式化
function timestampToTime(timestamp) {
	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds();
	return Y + M + D + h + m + s;
}

// 获取url参数
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

// 判断安卓或IOS
function checkPhone() {
	let self = this
	let agent = (navigator.userAgent || navigator.vendor || window.opera)
	if (agent != null) {
		let agentName = agent.toLowerCase()
		if (/android/i.test(agentName)) {
			return true
		} else if (/iphone/i.test(agentName)) {
			return false
		}
	}
}

function getBase() {
	const b = getQueryString('b')
	paramB = b
	let location = window.location
	if (b) {
	  const data = Base64.decode(b)
	  name = getUrlQueryVariable('appname', data) || '影视'
	  versioncode = getUrlQueryVariable('versioncode', data) || 'false'
	  appid = getUrlQueryVariable('appid', data) || ''
	  assign = getUrlQueryVariable('assign', data)
	  platformid = getUrlQueryVariable('platformid', data) || ''
	}
	if (assign === 'lw_appstore') {
		// 写死icon
		img = require('./img/shareLogo.png')
	  } else if (
		subject[appid] &&
		subject[appid][platformid] &&
		subject[appid][platformid]['img']
	  ) {
		img = subject[appid][platformid]['img']
	  } else if (appid) {
		img = `./img/launcher_${appid}.png`
	  } else {
		img = ''
	  }
}

function getBaseOther() {
	const b = getQueryString('b')
	if (b) {
	  const data = Base64.decode(b)
	  name = getUrlQueryVariable('n', data) || '本应用'
	  appid = getUrlQueryVariable('a', data) || ''
	  platformid = getUrlQueryVariable('p', data) || ''
	}
}

function getBaseImg() {
	const b = getQueryString('b')
	paramB = b
	let location = window.location
	if (b) {
	  const data = Base64.decode(b)
	  name = getUrlQueryVariable('n', data) || '影视'
	  versioncode = getUrlQueryVariable('versioncode', data) || 'false'
	  appid = getUrlQueryVariable('a', data) || ''
	  assign = getUrlQueryVariable('assign', data)
	  platformid = getUrlQueryVariable('p', data) || ''
	}
	if (assign === 'lw_appstore') {
		// 写死icon
		img = require('./img/shareLogo.png')
	  } else if (
		subject[appid] &&
		subject[appid][platformid] &&
		subject[appid][platformid]['img']
	  ) {
		img = subject[appid][platformid]['img']
	  } else if (appid) {
		img = `${location.origin}/static/launcher/launcher_${appid}.png`
	  } else {
		img = ''
	  }
}
