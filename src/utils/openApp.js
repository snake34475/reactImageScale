/**
 * 使用node-modules发布的包会直接上线，后期更改与维护不方便测试与维护。
 * 将使用Schema 唤起app相关的逻辑将集中到这处理。
 * 使用webpack移除不用的js代码。
 * 2018-6-13
 */
import deviceModel from './deviceModel';
import { getScript, getCookie, getUrlParam, fixHref } from './utilFunc';
/*
 * 默认配置文件
 * @param {object} android
 * @param {string} android.url 未安装时的下载地址
 * @param {string} android.schema 安装app时要打开的协议
 * @param {object} ios
 * @param {string} ios.url 未安装时的下载地址
 * @param {string} ios.schema 安装app时要打开的协议
 * @param {object} weixin
 * @param {string} weixin.url 未安装时的下载地址
 * @param {string} weixin.schema 安装app时要打开的协议
 * @param {string} weixin.params 微信中打开app时，需要注册微信sdk
 * @param {object} ipad
 * @param {string} ipad.url 未安装时的下载地址
 * @param {string} ipad.schema 安装app时要打开的协议
 * @param {boolean} onlyDown
 */
export let defaultConfig = {
	android: {
		url: "//m.xin.com/download/show_dl_page/",
		schema: "uxin://uxin.app/openWith"
	},
	ios: {
		url: "//m.xin.com/download/show_dl_page/",
		schema: "//itunes.apple.com/cn/app/id1138302879/"
	},
	weixin: {
		url: "//m.xin.com/download/show_dl_page/",
		iosSchema: "yxused://",
		androidSchema: "openWith",
		sdkSrc: "//res.wx.qq.com/open/js/jweixin-1.2.0.js",
		sdkIsNeed: false, //默认配置设置此属性为false时，认为调用方已经注入wxsdk，并且设置了launchApplication权限
		wxConfig: {
			beta: true,
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: 'wx9d5898393d262d2c', // 必填，公众号的唯一标识
			timestamp: '1528883881', // 必填，生成签名的时间戳
			nonceStr: 'cjCCdEeBnOiHkMvV', // 必填，生成签名的随机串
			signature: '214e6bf1a45cadeaf98c8d43a78c3dc705ac9dfb',// 必填，签名，见附录1
			jsApiList: ['launchApplication', 'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		},
		appArgs: {
			appId: "wx272e252af4ac7924",
			extInfo: "openWith",
			messageExt: "yxused://",
			parameter: "yxused://",
		},
		isOnlyDown: false
	},
	ipad: {
		url: "//m.xin.com/download/show_dl_page/",
		schema: "yxused://"
	},
	downloadUrl: "//m.xin.com/download/show_dl_page/"
}

/**
 * 在微信里打开微信
 * 唤起微信里面有一个回调
 * @return {[type]}
 */
function openAppInWeiXin(callBackFn) {
	var wx = window.wx;
	if (defaultConfig.weixin.isOnlyDown) {
		onlyOpenDownLoadPage()
	}

	if (!defaultConfig.weixin.sdkIsNeed && !wx) { //未引入微信sdk
		getScript("wxsdk", defaultConfig.weixin.sdkSrc, initWeiXinConfig);
	} else {
		_openAppInWeiXin();
	}


	function initWeiXinConfig() {
		if (!wx) {
			// alert("未能成功加载微信");
			window.location.href = defaultConfig.weixin.url;
			return;
		}
		wx.config(defaultConfig.weixin.wxConfig);
		_openAppInWeiXin();
	}


	function _openAppInWeiXin() {
		let appArgs = defaultConfig.weixin.appArgs;
		// 唤起app时，url中追加的参数
		let openAppStr = getOpenAppStr();
		appArgs.extInfo += openAppStr;
		appArgs.messageExt += openAppStr;
		appArgs.parameter += openAppStr;

		wx.ready(function () {
			wx.invoke("launchApplication", {
				//这里appID必须用大写，用小写的话，会报一个lanchApplication:fail_appid nil的错误
				appID: appArgs.appId,
				extInfo: appArgs.extInfo,
				messageExt: appArgs.messageExt,
				parameter: appArgs.parameter
			}, openWeixinCallBack)
		});

		//唤起微信回调
		function openWeixinCallBack(res) {
			if (res && res.err_msg === 'launchApplication:ok') {
				//成功调起之后的回调函数
				if (callBackFn && typeof callBackFn === 'function') callBackFn(res);
			} else {
				let weixinUrl = '';
				if (deviceModel.isAndroid) {
					weixinUrl = defaultConfig.weixin.androidUrl
				} else {
					weixinUrl = defaultConfig.weixin.iosUrl;
				}
				var url = weixinUrl || defaultConfig.downloadUrl || "javascript:void(0)";
				//微信唤起失败后， 跳转到这个url
				window.location.href = url;
			}
		}
	}
}

/**
 * 只打开下载app的下载页
 * @return {[type]}
 */
export function onlyOpenDownLoadPage(url = "", countNum = 0) {
	let _url = defaultConfig.downloadUrl;

	if (!url) {
		if (deviceModel.isChrome || deviceModel.isAndroid) {
			_url = defaultConfig.android.url;
		} else if (deviceModel.isIPad) {
			_url = defaultConfig.ipad.url;
		} else if ((deviceModel.isMSafari && deviceModel.MSafariVersion >= 9) || deviceModel.isMacOs || deviceModel.isIPhone) {
			_url = defaultConfig.ios.url;
		}
	}
	setTimeout(function () {
		window.location.href = fixHref(url) || fixHref(_url) || "javascript:void(0)";
	}, countNum);
}

/**
 * @param  { openWeixinSuccess: function }
 * @return {[type]}
 */
export function onlyOpenApp({ callBackFn = () => { },
	androidSchema = defaultConfig.android.schema,
	iosSchema = defaultConfig.ios.schema,
	ipadSchema = defaultConfig.ipad.schema }) {
	if (deviceModel.isWeiXin) {
		openAppInWeiXin(callBackFn);
	} else {
		if (deviceModel.isChrome || deviceModel.isAndroid) {
			openAppInAndroid(androidSchema);
		} else if (deviceModel.isIPad) {
			openAppUseCreateATag(ipadSchema);
		} else if ((deviceModel.isMSafari && deviceModel.MSafariVersion >= 9) || deviceModel.isMacOs || deviceModel.isIPhone) {
			openAppUseCreateATag(iosSchema);
		} else {
			openAppUseIFrame(androidSchema);
		}
	}
}

/**
 * 打开app并跳转到下载页
 * @return {[type]}
 */
export function openAppAndOpenDownLoad({ url = "", countNum = 3000, openSuccess = () => { } }) {
	openAppAndAddFromUrl(openSuccess);
	//微信不需要在这里打开默认下载页,IOS系统目前也不需要打开默认的引导下载页
	if (!deviceModel.isWeiXin && !deviceModel.isIPhone && !(deviceModel.isMSafari && deviceModel.MSafariVersion >= 9)) {
		onlyOpenDownLoadPage(url, countNum);
	}
}

/*
* 详情页 唤起app和打开详情页
 */
export function detail_OpenAppAndOpenDownloadPage(configObj = {}) {
	const openAppParam = getOpenAppStr();
	const appendUrl = openAppParam === "" ? "?" : openAppParam + "&";

	const detail = {
		iosSchema: `yxused://mobile/YXUCarDetailVC2${appendUrl}carID=${configObj.carid}`,
		// ios_wx:'',
		androidSchema: `uxin://uxin.app/openVehicleDetailsActivity${appendUrl}from=wap&car_id=${configObj.carid}`,
		// android_wx:'openVehicleDetailsActivity/carid='
	}
	onlyOpenApp(detail);
	onlyOpenDownLoadPage(configObj.url, 3000);
}

/**
 * 打开app和从哪个页面打开url
 * url为传入参数
 * */
export function openAppAndAddFromUrl(fun = () => { }) {
	let openAppStr = getOpenAppStr();
	let androidSchema = defaultConfig.android.schema + openAppStr;
	onlyOpenApp({ androidSchema: androidSchema, callBackFn: fun });
}

/*
 *唤起app时，给app传递参数，用于app打点;便于监控APP用户来源，统计APP用户行为路径
 * cid,M站用于唯一标识，去cookie中XIN_UID_Ck的值
 * optoken，url中optoken参数的值
 * url,唤起app的页面url
 */
function getOpenAppStr() {
	// if (__CLIENT__) {
		let urlHref = window.encodeURIComponent(window.location.href);
		let cid = getCookie('XIN_UID_CK');
		let optoken = getUrlParam('optoken') || window.optoken || '';
		let openAppStr = `?cid=${cid}&optoken=${optoken}&url=${urlHref}`;
		return openAppStr;
	// }
}

/*
 * 从chrome或android机中打开app
 */
function openAppInAndroid(schema) {
	setTimeout(function () {
		window.location.href = schema;
	}, 50);
}

/*
 * 在ios的safari中打开app
 */
function openAppUseCreateATag(schema) {
	setTimeout(function () {
		var Y = document.createElement("a");
		Y.setAttribute("href", schema);
		Y.setAttribute("target", "_top");
		Y.style.display = "none";
		document.body.appendChild(Y);
		var Z = document.createEvent("HTMLEvents");
		Z.initEvent("click", !1, !1), Y.dispatchEvent(Z)
	}, 0);
}

/*
 * 使用iframe打开app
 */
function openAppUseIFrame(schema) {
	var iframe = document.createElement("iframe");
	document.body.appendChild(iframe);
	iframe.style.display = "none";
	iframe.style.width = "0px";
	iframe.style.height = "0px";
	iframe.src = schema;
}

