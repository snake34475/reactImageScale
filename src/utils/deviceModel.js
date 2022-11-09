/**
 * 判断手机运行的环境
 * 2018-6-13
 */
let ua =  window.navigator.userAgent;

const deviceModel = {
	//微信
	isWeiXin: ua.indexOf("MicroMessenger") >= 0,
	//chrome
	isChrome: ua.match(/Chrome/i) != null && ua.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ? true : false,
	//android
	isAndroid: (ua.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false,
	//ipad
	isIPad: (ua.match(/(iPad).*OS\s([\d_]+)/)) ? true : false,
	//mac os
	isMacOs: (ua.match(/(Mac\sOS)\sX\s([\d_]+)/)) ? true : false,
	//是不是懂车帝 懂车帝极速版为autoprice
	isDCD: /auto(mobile|price)/i.test(ua),
	//是否是App
	isApp: /XINAPP*[\/,=]*/i.test(ua),
	//判断是否为手机百度
	isShouJiBaiDu: /baiduboxapp/gi.test(ua),
	/**
	 * 判断是ios系统
	 */
	isIOS: (/iphone|ipad|ipod/gi).test(ua),
	/**
	 * Windows Phone 手机
	 */
	isWP: ua.indexOf('Windows Phone') > -1,
	/**
	 * QQ浏览器
	 */
	isQQ: ua.indexOf('MQQBrowser') > -1,
	/**
	 * UC浏览器
	 */
	isUC: ua.indexOf('UCBrowser') > -1
};

//iphone
deviceModel.isIPhone = (!deviceModel.isIPad && ua.match(/(iPhone\sOS)\s([\d_]+)/)) ? true : false;
//ipad和iphone上的safari
deviceModel.isMSafari = (deviceModel.isIPad || deviceModel.isIPhone) && ua.match(/Safari/) ? true : false;

/**如果是App 获取App版本 */
let appVersion = '';
/**
 * 是APP或者m端或者是PC端
 * @param {Bool} 是否是APP
 */
let getFrom = (isApp) => {
	let from = '';
	let uav = ua.toUpperCase();
	var version = /XINAPP*[\/,=]\s*([^\s]+)/.exec(uav);
	let matchFrom = uav.match(/XINAPP\[(\w+)\]/i);
	if (isApp) {
		if (matchFrom && matchFrom[1]) {
			from = matchFrom[1];
		} else if (deviceModel.isAndroid) {
			from = 'm-android';
		} else if (deviceModel.isIPhone || deviceModel.isIPad) {
			from = 'm-ios';
		}
		if (version && version.length > 1) {
			appVersion = version[1];
		}
	} else {
		from = deviceModel.isAndroid || deviceModel.isIPhone || deviceModel.isIPad ? 'm' : 'www';
	}
	return from;
}

//Android|IOS App | m |PC
deviceModel.from = getFrom(deviceModel.isApp);
/**如果是App 获取App版本 */
deviceModel.appVersion = appVersion;

deviceModel.MSafariVersion = (function () {
	var safari_v = [0, 0], mSafariVersion = 0;
	if (deviceModel.isMSafari) {
		safari_v = ua.match(/Version\/([\d\.]+)/)
	}
	try {
		mSafariVersion = parseFloat(safari_v[1], 10)
	} catch (e) { mSafariVersion = 0; }
	return mSafariVersion;
})();

let isAndroidShouJiBaiDu = () => {
	return deviceModel.isAndroid && deviceModel.isShouJiBaiDu;
}

export default deviceModel;

export {
	isAndroidShouJiBaiDu
}
