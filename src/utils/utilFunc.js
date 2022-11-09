/*
 *存放一些公共的方法
*/

/**
 * 异步加载对应的脚本
* @param  {String} name 加载的脚本名称
* @param  {String} url  script地址
* @param  {Function} callback 回调
* @return {[type]}
*/
const getScript = (name, url, callback) => {
    if (document.getElementById(name)) {
        callback();
        return;
    }
    var script = document.createElement("script");
    script.id = name;
    script.src = url;
    script.onload = callback;
    document.body.appendChild(script);
};

/**
 * 拼接参数
 * @param {Array} paramArray 参数数组
 * @param {String} search 地址
 * @param {Boolean} isTransfromNull 是否转换空值
 */
const generateUrlQueryStr = (paramArray, search, isTransfromNull) => {
    let result = '';
    search = search ? search : window.location.search;
    if (paramArray) {
        paramArray.map((item, index) => {
            let val = getUrlParam(item, search);
            if (val) {
                result += `&${item}=${val}`;
            }
        });
        if (result && result[0] === '&') {
            result = '?' + result.substring(1, result.length);
        }
    }
    return result;
}
/**
 * 添加地址栏的query参数
* @param  {String} url 地址
* @param  {String} key key
* @param  {String} value value
* @return  {String} 地址
*/
const addUrlParam = (url, key, value) => {
    if (!value) {
        return url;
    }
    if (url.indexOf('?') > -1) {
        url = `${url}&${key}=${value}`;
    } else {
        url = `${url}?${key}=${value}`;
    }
    return url;
};
/**
 * 获取地址栏的query参数
* @param  {String} key query key
* @param  {String} url 地址
* @return  {String || ''} value 值或''
*/
const getUrlParam = (key, url) => {
    try {
        if (!url) {
            url = window.location.search;
        }
    } catch (e) {
    }

    let result = '';
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let match = decodeURI(url).substr(1).match(reg);  //匹配目标参数
    if (match && match[2]) {
        result = match[2];
    }
    return result; //返回参数值
};
let domain = process.env.NODE_ENV === 'development' ? '' : '.xin.com';

/**
 * 设置cookie
 * @param {String} key cookie key
 * @param {String} value  value
 * @param {Int/Date} time time可以是Integer类型，也可以是Date类型
 * @param {Object} obj 扩展参数，
 * {
 *      usePrivateDomain,//是否使用私有域名
 *      privateDomain,//私有域名
 * }
 */
const setCookie = (key, value, time, obj) => {
    let expires;
    if (Object.prototype.toString.call(time) === "[object Date]") {
        expires = `; expires=${time.toGMTString()}`;
    } else if (Object.prototype.toString.call(time) === "[object Number]") {
        let date = new Date();
        date.setTime(date.getTime() + time * 1000);
        expires = `; expires=${date.toGMTString()}`;
    } else {
        expires = '';
    }
    document.cookie = `${key}=${value}${expires};domain=${obj && obj.usePrivateDomain ? obj.privateDomain : domain};path=/`;
};
/**
 * 获取cookie
* @param  {String} key cookie key
* @return {String} 存在返回对应value 不存在则返回''
*/
const getCookie = key => {
    let reg = new RegExp(key + '\s*=\s*([^\;]+)\;*');
    let result = reg.exec(document.cookie);
    return result && result.length > 1 ? result[1] : '';
};

let scroll = 0
/**
 * 蒙层弹出后阻止页面滑动
 * 思路大概是这样，当点击出现罩层时，将body设为fixed，并将top值记录下来
 * ，以便显示罩层出现前显示的内容。
 * 当点击关闭罩层时，将body恢复，并滚动到记录的TOP位置。
 */
const stopBodyScroll = () => {
    // if (__CLIENT__) {
        let root = document.getElementById('root');
        //已经滚动的距离
        if (root.style.position !== 'fixed') {
            scroll = document.body.scrollTop;
            root.style.position = 'fixed';
            root.style.top = -scroll + 'px';
            root.style.width = '100%';
        }
    // }

}
const activeBodyScroll = (action) => {
    // if (__CLIENT__) {
        let bodyEl = document.getElementById('root');
        if (!action) {
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            //scroll > 0再定位 解决跳页前滚动至顶部问题
            scroll > 0 && window.scrollTo(0, scroll);
        } else if (action == 'unmount') {
            //组件被卸载时调用
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            window.scrollTo(0, 0);
        }

    // }
}

/**
 * 检测当前点击的对象
 * @param {ele}  事件
 */
const checkNode = (ele, targetNode, attribute) => {
    let targetId = '';
    let nodeName = ele.target.nodeName;
    if (nodeName && nodeName !== targetNode) {
        let parentNode = ele.target.parentNode;
        targetId = parentNode.nodeName === targetNode ? parentNode.getAttribute(attribute) : '';
    } else {
        targetId = ele.target.getAttribute(attribute);
    }
    return targetId;
}

/**
 * js去除字符串空格的方法 类似于 $.trim()
 * @param {string}  str 需要去除空格的目标值
 */
let trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 指定透传参数
 */
let tranQuerys = [
    'u',
    'x',
    'from',
    'xinfrom',
    'channel',
    'abversion',
    'case',
    'lpopt',
    'platform',
    'app',
    'appver',
    'source_type',
    'keywordid',
    'creative',
    'mediaid',
    'optoken',
    'qz_gdt',
    'app_id',
    'xdid',
    'net',
    'imei',
    'mac',
    'is_local',
    'location',
    'vr_status'];
/**
 * 参数透传
 * @param {String} url 要跳转的地址
 */
let fixHref = (url, suggestSearch) => {
    if (!url) {
        return '';
    }

    let targetTranQuerys = [];
    //过滤对应参数 不透传
    let blackQuerys = [];
    // 针对搜索弹层 搜索词的特殊处理
    if (suggestSearch) {
        //blackBrand
        switch (suggestSearch) {
            case 'searchSuggest':
                //搜索页 点击推荐词 uxin_recom不能丢 searchSuggest
                targetTranQuerys = ['uxin_recom'];
                break;
            case 'highFilter':
                //高筛页透传参数
                targetTranQuerys = ['generation_info', 'stwly', 'engine_type', 'driver_type', 'sp_points', 'uxin_recom', 'g_scid', 'group_id', 'g_year', 'is_tpg', 'is_authentication', 'vr_status'];
                break;
            case 'carDetail':
                //详情页跳转至详情页 需要把cityid参数过滤
                blackQuerys = ['cityid'];
                break;
            case 'blackBrand':
                // 列表页跳转至品牌页 需要把年代款相关参数过滤
                //  否则会导致切换车系时请求接口错误
                blackQuerys = ['generation_info', 'group_id', 'g_scid', 'g_year', 'uxin_recom'];
                //列表页跳品牌页 is_authentication vr_status这两个参数不能丢
                targetTranQuerys = ['is_authentication', 'vr_status'];
                break;
        }

        tranQuerys.map((key) => {
            if (blackQuerys.indexOf(key) > -1) {
                return;
            } else {
                targetTranQuerys.push(key);
            }
        });
    } else {
        targetTranQuerys = tranQuerys;
    }
    let search = window.location.search;
    if (search) {
        let params = [];
        let originKey = '';
        targetTranQuerys.map((key, index) => {
            let val = getUrlParam(key, search);
            originKey = getUrlParam(key, url.substr(url.indexOf('?')));
            if (val && !originKey) {
                params.push(`${key}=${val}`);
            }
        });
        if (params.length === 0) {
            return url;
        } else {
            let query = params.join('&');
            if (url.indexOf('?') > -1) {
                url = `${url}&${query}`;
            } else {
                url = `${url}?${query}`;
            }
        }
    }
    return url;
}

/**
* 替换地址栏参数
* @param {String} url url
* @param {String} arg 要替换的key值
* @param {String} val  目标value值
*/
let changeUrlArg = (url, arg, val) => {
    var pattern = arg + '=([^&]*)';
    var replaceText = val ? `${arg}=${val}` : '';
    return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
}
/**
* 判断是否支持sticky
*/
let isSupportSticky = () => {
    //判断是否支持sticky
    var prefixTestList = ['', '-webkit-'];
    var stickyText = '';
    for (var i = 0; i < prefixTestList.length; i++) {
        stickyText += 'position:' + prefixTestList[i] + 'sticky;';
    }
    // 创建一个dom来检查
    var div = document.createElement('div');
    div.style.cssText = stickyText;
    document.body.appendChild(div);
    var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
    document.body.removeChild(div);
    div = null;
    return isSupport;
}
let timer = null;
/**
 * 参数透传
 * @param {object} node 当前的节点
 * @param {String} type 区分当前的模式
 * @param {String} parNode 心愿单时是根据传入dom来定位
 */
let scrollAnimate = (node, type, appTop, parNode, page) => {
    let target = 0;
    //元素距顶部的距离
    const top = node && node.getBoundingClientRect().top;
    const nav = document.querySelector('.nav');
    //视窗左上角距顶部的距离
    const offset = parNode ? parNode.scrollTop : window.pageYOffset;
    target = type === 1 && page !== 'orderNow' ? offset + top - appTop - nav.clientHeight : type === 2 ? offset + top - 46 : offset + top; //44是页面距离上面的padding值 + border todo需要动态获取
    /**!important 心愿单时是根据传入dom来定位 更改此方法前请查看scrollAnimate调用位置并确保各个情况功能 */
    if (parNode) {
        //todo 兼容qq浏览器，已知 8.8.0.4420   https://codereview.chromium.org/2938373003
        try {
            parNode.scrollTo(0, target)
        } catch (e) {
            parNode.scrollTop = target;
        }
    }
    window.scrollTo(0, target);
    // 滚动动画
    //要用定时器，先清除定时器
    /*clearInterval(timer);
    //3.利用缓动动画原理实现屏幕滑动
    let step = 0;
    let leader = parNode ? parNode.scrollTop : document.body.scrollTop;
    timer = setInterval(function () {
        //获取步长
        step = (target - leader) / 10;
        //二次处理步长
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        //屏幕滑动
        leader = leader + step;
        if (parNode) {
            //todo 兼容qq浏览器，已知 8.8.0.4420   https://codereview.chromium.org/2938373003
            try {
                parNode.scrollTo(0, leader)
            } catch (e) {
                parNode.scrollTop = leader;
            }
        }
        window.scrollTo(0, leader);
        //清除定时器
        if (Math.abs(target - leader) <= Math.abs(step)) {
            if (parNode) {
                try {
                    parNode.scrollTo(0, target);
                } catch (e) {
                    parNode.scrollTop = target;
                }
            }

            clearInterval(timer);
        }
    }, 25);*/
}
/**
 * 修改页面title
 *
 * @param  {boolean} isClient 判断是否为客户端路由
 * @param  {String} value 要修改的值
 */
let setTitleName = (isClient, value) => {
    if (isClient) {
        //使用前端路由跳转到下级页面，在点击浏览器的返回，相当于只更新了didupdate，
        //所以页面还是下级页面的title,但是在浏览器标签上显示的是第一个页面的title，
        //重置title时，需要先将title置空，在设置成对应的值
        document.title = "";
        document.title = value;
    }
}

/**
 * 数字转换为货币格式
 * 例如： 1000 => 1,000.00
 * @param {Number} number 传入的数值
 */
export function formatMoney(number) {
    var a = 0;
    number = number || 0;
    var thousand = ',';
    var negative = number < 0 ? '-' : '',
        i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + "",
        j = (a = i.length) > 3 ? a % 3 : 0;
    return negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + '.' + Math.abs(number - i).toFixed(2).slice(2);
}

/**
 * 判断当前版本不小于给定的版本号
 * @todo 需要做其他的类型判断，如何封装？
 * @param {String} version 传入需要对比的version
 * @param {String} appVersion 获取的version
 **/
export function isNoLessThan(version, appVersion) {
    if (!version) {
        return true;
    }
    const compareVersions = version.split('.');
    if (!appVersion) {
        return false;
    }
    const versions = appVersion.split('.');
    // 从高位往地位进行比较，如果为null，对比为最小值
    for (let i = 0; i < 3; i++) {
        // 发现当前版本比对比版本同一位高的时候，直接返回true，如果都相等则为true，如果低，直接返回false
        // 只有在相等的时候再继续比较下去
        // @todo 是否可以使用while语法来实现？
        if (compareVersions[i] === null || typeof compareVersions[i] === 'undefined') {
            return true;
        }
        if ((+ versions[i]) > (+ compareVersions[i])) {
            return true;
        }
        if ((+ versions[i]) < (+ compareVersions[i])) {
            return false;
        }
    }
    return false;
}

/**
 * url query转{} 如?a=1&b=2 转 {a:1, b:2}
 * @param {String} query 需要转的query即window.loaction.search
 */
export const urlQuery2Object = query => {
    let oQuery = {};
    query.replace(/([^?&]+)=([^?&]+)/g, (s, k, v) => oQuery[k] = v);
    return oQuery;
}



export {
    getScript,
    setCookie,
    getCookie,
    getUrlParam,
    addUrlParam,
    generateUrlQueryStr,
    checkNode,
    fixHref,
    stopBodyScroll,
    activeBodyScroll,
    setTitleName,
    scrollAnimate,
    trim,
    changeUrlArg,
    isSupportSticky,
}
