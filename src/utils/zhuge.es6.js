import URLCONFIG from './urlConfig';
import { getUrlParam } from './utilFunc';
let urlSearch = window.location.search;

/**
 *点击打点：调用zhugeTrack方法
 *@param {String} event 打点的名称
 *@param {Object} properties 一个对象，传入自定义属性及属性值，埋点文档中会提供；
 */
export let zhugeTrack = (event, properties) => {
    if (typeof (event) === 'string' && event.length > 0 && event.length <= 20) {
        if (properties && typeof (properties) === 'object') {
            window.zhuge.track(event, properties);
        } else {
            window.zhuge.track(event);
        }
    }
}
/**
 *进入页面打点调用enterPage方法
 *@param {String} pagename 页面名
 *@param {Object}，对象中可以添加属性及属性值，给页面打点时添加一些自定义的监测属性；本次添加了一个渠道属性，属性值为channel中获取到的对应渠道
 */
export let enterPage = (pagename, option = {}) => {
    // 获取channel参数，渠道打点
    var fromWhere = getUrlParam("channel");
    // 获取自定义参数fromzhuge,跳转页面入口打点
    var fromZhuge = getUrlParam("fromzhuge");
    let channel = "渠道";
    let entry = "跳转入口";

    if (fromZhuge) {
        let referrName;
        if (fromZhuge === "home") {
            referrName = "首页";
        } else if (fromZhuge === "carlist") {
            referrName = "列表页";
        } else if (fromZhuge === "thesame") {
            referrName = "相似推荐";
        } else {
            referrName = "未知";
        }
        if (fromWhere) {
            option[channel] = fromWhere;
            option[entry] = referrName;
            window.zhuge.track(pagename, option);
        } else {
            option[entry] = referrName;
            window.zhuge.track(pagename, option);
        }
    } else if (fromWhere) {
        option[channel] = fromWhere;
        window.zhuge.track(pagename, option);
    } else if (option && typeof (option) == 'object') {
        window.zhuge.track(pagename, option);
    } else {
        window.zhuge.track(pagename);
    }
}

/**
 * load('此处填写您在诸葛申请的APP KEY', {
 *      superProperty: { //全局的事件属性(选填)
 *                   '应用名称': '诸葛io'
 *          },
 *      autoTrack: false,
 *      //启用全埋点采集（选填，默认false）
 *      singlePage: false //是否是单页面应用（SPA），启用autoTrack后生效（选填，默认false）
 *      });
 * @param {String} key  在诸葛申请的APP KEY
 * @param {*} option 诸葛配置
 */
let load = (key, option) => {
    window.zhuge = window.zhuge || [];
    window.zhuge.methods = "_init identify track getDid getSid getKey setSuperProperty setUserProperties setPlatform".split(" ");
    window.zhuge.factory = function (b) {
        return function () {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(b);
            window.zhuge.push(a);
            return window.zhuge;
        }
    };
    for (var i = 0; i < window.zhuge.methods.length; i++) {
        let funKey = window.zhuge.methods[i];
        window.zhuge[funKey] = window.zhuge.factory(funKey);
    }
    if (!document.getElementById("zhuge-js")) {
        let a = document.createElement("script");
        let verDate = new Date();
        let verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

        a.type = "text/javascript";
        a.id = "zhuge-js";
        a.async = !0;
        a.src = `${URLCONFIG.zhugeUrl}?v=${verStr}`;
        a.onerror = function () {
            window.zhuge.identify = window.zhuge.track = function (ename, props, callback) {
                if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
                    callback();
                } else if (Object.prototype.toString.call(props) === '[object Function]') {
                    props();
                }
            };
        };
        let c = document.getElementsByTagName("script")[0];
        c && c.parentNode.insertBefore(a, c);
        window.zhuge._init(key, option);
    }
}
/*  首页的诸葛打点
    window.zhuge.load:
    你可以使用实时调试功能实时看到所有的操作信息，
    以辅助开发者确认打点是否正确（实时调试过程中的数据仅用于调试，
    不影响正式数据，调试完成后请关闭debug）。调用zhuge.load()时，
    加入debug参数，以开启实时调试：

    方法1:  enterPage 进入页面获取入口渠道打点
            目前打点的渠道：百度/360/搜狗;
            如果新加渠道，在if中添加判断条件;
            获取所有去掉，去掉if判断直接zhuge.track
    方法2:  zhugeTrack 页面中的点击埋点
*/
// if (__CLIENT__) {
    load('0544721a5f2d480b8160ab5fe80435ef', { debug: false });
// }
//server端不需要load
export default {
    load,
    enterPage,
    zhugeTrack
}

