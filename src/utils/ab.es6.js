import { getCookie, getUrlParam } from './utilFunc';
import deviceModel from './deviceModel';
import URLCONFIG from './urlConfig';
import COOKIE_CONFIG from './cookieConfig';
let urlSearch = window.location.search;



/**
 * 从cookie中获取用户id
 */
let getUserId = () => {
    let userId = getCookie('XIN_UID');
    return userId;
}

/**
 * 从cookie中获取城市id 老版本是放在cookie @TODO 放在全局或localStroage
 */
let getCityId = () => {
    let cityData = getCookie('XIN_LOCATION_CITY');
    let cityid = '';
    if (cityData) {
        try {
            cityid = JSON.parse(decodeURIComponent(cityData)).cityid
        } catch (e) {
            cityid = cityData;
        }
    }
    return cityid;
}
/**
 * 从url中获取当前的host  m.xin.com
 * @param {String} url 传入地址
 * @return {String} host (返回的应当是当前的host地址)
 */
let getSource = (url) => {
    let result = /.?:\/\/([^\/]+)\/.*/.exec(url);
    return result && result.length > 1 ? result[1] : '';
};

/**
 * 获取url参数值,为空不添加
 */
let addUrlVal = (key) => {
    let val = getUrlParam(key, urlSearch);
    return val;
}
//自增计数
let totalIndex = 1;
//@TODO is_zg_list//判断是否本地车源 应当从接口中获取
let is_zg_list = 1;
/**
 *  获得汽车列表中曝光打点的字符串
 * @param {Object} data 列表数据
 */
export let getExposureStr = (data) => {
    if (!data) {
        return;
    }
    let list = [];
    let carList = data.cars;
    if (carList && data.other_city_cars) {
        carList = carList.concat(data.other_city_cars);
    }
    if (carList) {
        carList.map((item, index) => {
            let str = "p#" + (totalIndex++) + "," + "c#" + (item.carid) + "," + "type#" + (item.is_zg || 0) + "," + "mold#" + (is_zg_list === 1 ? 0 : 1) + "," + "icon#" + (item.lefttop_label === 4 ? 1 : 0) + "," + "label#" + (item.supervalu == 1 ? 1 : 0) + "," + "video#" + (item.show_video_icon);
            list.push(str);
        });
    }
    return list.join(';');
}
/**
 * 各个打点通用的数据放在base
 * 参数为空则不传递
 */
let getBaseParams = (optoken) => {
    let params = [];
    params.push('app=' + deviceModel.appVersion);
    params.push('uid=' + getUserId());
    params.push('cid=' + getUniqueId());
    params.push('cityid=' + getCityId());
    params.push('platform=' + deviceModel.from);
    params.push('source=' + getSource(document.referrer));
    params.push('sc=' + window.screen.width + '*' + window.screen.height);
    params.push('url=' + encodeURIComponent(document.location.href));
    params.push('ref=' + encodeURIComponent(document.referrer));
    //借用之前打点中的获取地址栏参数方法，获取appid
    //如果地址栏存在app_id，则使用地址栏的值
    //如果地址栏不存在app_id，使用“u2_0”
    let appId = getUrlParam('app_id', urlSearch);
    if (!appId) {
        appId = "u2_0";
    }
    params.push('app_id=' + appId);
    //每个页面不同 首页u2_1 城市选择页u2_10 品牌筛选页 u2_23

    params.push('pid=' + window.pid);
    params.push('ts=' + (new Date()).getTime());
    if (optoken) {
        params.push('optoken=' + optoken);
    }

    //TODO:暂时这样修改，等整理数据结构时，统一管理全局变量，预计在12月份调整
    let ab = addUrlVal('abversion');
    if (!ab) {
        ab = getCookie(COOKIE_CONFIG.XIN_AB_TEST);
    }
    params.push(`abversion=${ab}`);

    let urlKeys = ['source', 'channel', 'xdid', 'net', 'location', 'keywordid', 'mediaid'];
    urlKeys.map((key, index) => {
        let val = addUrlVal(key);
        if (val) {
            params.push(`${key}=${val}`);
        }
    });

    return params;
}

/**
 *
 * @param {String} orginParams 初始参数
 * @param {String} type 不同类型的打点添加不同的参数
 * @param {String} optoken 通过context全局传递 不推荐从url获取
 */
let getParamsWithType = (orginParams, type, optoken) => {
    if (!optoken) {
        optoken = getUrlParam('optoken') || window.optoken || '';
    }
    let params = [];
    switch (type) {
        case 'track':
            //click打点type=c 独有ev属性
            params.push('type=c');
            params.push('ev=' + encodeURIComponent(orginParams));
            break;
        case 'pageview':
            //pageview  type=w
            params.push('type=w');
            break;
        case 'exposure':
            //曝光打点  type=e
            params.push('type=e');
            break;
        case 'performance':
            //性能数据打点  type=p
            params.push('type=p');
            break;
        default:
            break;
    }
    params = params.concat(getBaseParams(optoken));

    return params;
}
/**
 * react-router路由加载 性能记录
 * @param {Number} loadTime 加载时间
 * @param {Number} requestTime 请求接口时间
 */
export let performanceLogForReact = (loadTime, requestTime = 0) => {
    let initParams = getParamsWithType('', 'performance');
    //性能打点 request dom load 顺序必须一致
    //前端路由dom 时间为1 后端会判断>0才会生效,所以大于1
    initParams.push('request=' + requestTime);
    initParams.push('dom=1');
    initParams.push('load=' + loadTime);
    //是否允许cookie
    initParams.push('ce=' + (window.navigator.cookieEnabled ? '1' : '0'));
    //是否允许localStorage
    initParams.push('ls=' + (window.localStorage ? '1' : '0'));
    //返回当前浏览器的语言
    initParams.push('lg=' + (window.navigator.language || window.navigator.browserLanguage || window.navigator.systemLanguage || window.navigator.userLanguage || ''));
    //标设备或缓冲器上的调色板的比特深度
    initParams.push('cd=' + (window.screen.colorDepth || 0));
    //获取主机名+端口
    initParams.push('hostname=' + window.location.hostname);
    //获取路径命
    initParams.push('uri=' + window.location.pathname);
    //获取页面title
    initParams.push('title=' + window.document.title);
    //获取前一个页面的url
    let referrer = document.referrer;
    if (referrer && referrer.indexOf('?') != -1) {
        referrer = referrer.replace(/=/g, ":");
    }

    initParams.push('refer=' + referrer);
    //获取页面url，不带查询字符串
    initParams.push('url=' + window.location.href.split("?")[0])
    var search = window.location.search;
    if (search && search.indexOf('?') != -1) {
        //获取查询字符串，替换=号为：
        search = search.slice(1).split('/').toString().replace(/=/g, ":")
    }
    initParams.push('params=' + search);
    let query = '?' + initParams.join('&');
    sendLog(query);
}
/**
 * 页面加载性能数据打点
 */
export let performanceLog = (optoken) => {

    let initParams = getParamsWithType('', 'performance', optoken);
    //是否允许cookie
    initParams.push('ce=' + (window.navigator.cookieEnabled ? '1' : '0'));
    //是否允许localStorage
    initParams.push('ls=' + (window.localStorage ? '1' : '0'));
    //返回当前浏览器的语言
    initParams.push('lg=' + (window.navigator.language || window.navigator.browserLanguage || window.navigator.systemLanguage || window.navigator.userLanguage || ''));
    //标设备或缓冲器上的调色板的比特深度
    initParams.push('cd=' + (window.screen.colorDepth || 0));
    if (window.performance) {
        let perf = window.performance;
        if (perf.navigation) {
            initParams.push('nt=' + perf.navigation.type);
            initParams.push('nr=' + perf.navigation.redirectCount);
        }

        if (perf.timing) {
            initParams.push('pce=' + perf.timing.connectEnd);
            initParams.push('pcs=' + perf.timing.connectStart);
            initParams.push('pdc=' + perf.timing.domComplete);
            initParams.push('pdclee=' + perf.timing.domContentLoadedEventEnd);
            initParams.push('pdcles=' + perf.timing.domContentLoadedEventStart);
            initParams.push('pdi=' + perf.timing.domInteractive);
            initParams.push('pdl=' + perf.timing.domLoading);
            initParams.push('pdle=' + perf.timing.domainLookupEnd);
            initParams.push('pdls=' + perf.timing.domainLookupStart);
            initParams.push('pfs=' + perf.timing.fetchStart);
            initParams.push('plee=' + perf.timing.loadEventEnd);
            initParams.push('ples=' + perf.timing.loadEventStart);
            initParams.push('pns=' + perf.timing.navigationStart);
            initParams.push('pre=' + perf.timing.redirectEnd);
            initParams.push('prs=' + perf.timing.redirectStart);
            initParams.push('preqs=' + perf.timing.requestStart);
            initParams.push('prese=' + perf.timing.responseEnd);
            initParams.push('press=' + perf.timing.responseStart);
            initParams.push('pscs=' + perf.timing.secureConnectionStart);
            initParams.push('puee=' + perf.timing.unloadEventEnd);
            initParams.push('pues=' + perf.timing.unloadEventStart);
            // 新增更多参数 by lishuliang
            var readyStart = perf.timing.fetchStart - perf.timing.navigationStart;
            var redirectTime = perf.timing.redirectEnd - perf.timing.redirectStart;
            var appcacheTime = perf.timing.domainLookupStart - perf.timing.fetchStart;
            var lookupDomainTime = perf.timing.domainLookupEnd - perf.timing.domainLookupStart;
            var connectTime = perf.timing.connectEnd - perf.timing.connectStart;
            var requestTime = perf.timing.responseEnd - perf.timing.fetchStart;
            var domReadyTime = perf.timing.domContentLoadedEventEnd - perf.timing.responseEnd;
            var loadTime = perf.timing.domComplete - perf.timing.fetchStart;

            initParams.push('ready=' + readyStart);
            initParams.push('redirect=' + redirectTime);
            initParams.push('cache=' + appcacheTime);
            initParams.push('unload=' + redirectTime);
            initParams.push('dns=' + lookupDomainTime);
            initParams.push('tcp=' + connectTime);
            initParams.push('request=' + requestTime);
            initParams.push('dom=' + domReadyTime);
            initParams.push('load=' + loadTime);

            //添加白屏时间
            if (window.__json4fe__ && window.__json4fe__.performance && window.__json4fe__.performance.whiteScreen) {
                var whiteTime = window.__json4fe__.performance.whiteScreen - perf.timing.navigationStart;
                initParams.push('white=' + whiteTime);
            }
            //获取主机名+端口
            initParams.push('hostname=' + window.location.hostname);
            //获取路径命
            initParams.push('uri=' + window.location.pathname);
            //获取页面title
            initParams.push('title=' + window.document.title);
            //获取前一个页面的url
            let referrer = document.referrer;
            if (referrer && referrer.indexOf('?') != -1) {
                referrer = referrer.replace(/=/g, ":");
            }

            initParams.push('refer=' + referrer);
            //获取页面url，不带查询字符串
            initParams.push('url=' + window.location.href.split("?")[0])
            var search = window.location.search;
            if (search && search.indexOf('?') != -1) {
                //获取查询字符串，替换=号为：
                search = search.slice(1).split('/').toString().replace(/=/g, ":")
            }
            initParams.push('params=' + search);
        }
        if (perf.memory) {
            initParams.push('pjshsl=' + perf.memory.jsHeapSizeLimit);
            initParams.push('ptjshs=' + perf.memory.totalJSHeapSize);
            initParams.push('pujshs=' + perf.memory.usedJSHeapSize);
        }
    }
    let query = '?' + initParams.join('&');
    sendLog(query);
}
/**
 * 曝光打点
 * @param {String} pl 标识
 * @param {String} ds 打点内容
 */
export let exposureLog = (pl, ds, optoken) => {
    let initParams = getParamsWithType('', 'exposure', optoken);
    //biAddAttributes 暂未发现用处 先注释
    // if (window.biAddAttributes) {
    //     initParams.push('pl=' + window.biAddAttributes.pl);
    //     let va = "";
    //     for (var key in window.biAddAttributes.ds) {
    //         va += key + "#" + window.biAddAttributes.ds[key] + ",";
    //     }
    //     va = va.substring(0, va.length - 1);
    //     initParams.push('ds=' + encodeURIComponent(va));
    // }
    if (pl && ds) {
        initParams.push('pl=' + encodeURIComponent(pl));
        initParams.push('ds=' + encodeURIComponent(ds));
    } else if (pl) {
        initParams.push('pl=' + encodeURIComponent(pl));
    }
    let query = '?' + initParams.join('&');
    sendLog(query);
}
/**
 * click打点方法
 */
export let trackLog = (params, optoken) => {
    if (!params) {
        console.error('the params is not defined');
        return null;
    }
    let initParams = getParamsWithType(params, 'track', optoken);
    let query = '?' + initParams.join('&');
    sendLog(query);
}
/**
 * 每次加载页面的时候都应当触发 @TODO client路由跳转 应当如何打点
 */
export let pageviewLog = (optoken) => {
    let initParams = getParamsWithType('', 'pageview', optoken);
    let query = '?' + initParams.join('&');
    sendLog(query);
}
/**
 * 发送打点请求
 * @param {String} query get请求参数
 */
export let sendLog = (query) => {
    //打点地址
    let ab2Url = URLCONFIG.ab2Url + query;
    var img = new Image();
    img.src = ab2Url;
    img.onload = function () {
    };
    img.onerror = function () {
    };
    img.onabort = function () {
    };
}

//
export default {
    trackLog,
    pageviewLog,
    exposureLog,
    performanceLog,
    performanceLogForReact
}

