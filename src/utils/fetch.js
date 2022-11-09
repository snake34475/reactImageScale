import fetch from 'node-fetch';
import { getCookie } from './utilFunc';
let allSucceed = true;
let apiTokenFn = null;
// if (__SERVER__) {
//     apiTokenFn = require('../../server/utils/createToken').createAPIToken;
// }
//默认超时10秒
let FETCH_TIMEOUT = 15 * 1000;
/**
 * 请求接口通用方法 如果成功返回数据为类似:@TODO 完善请求数据注释
 */

/**
 * 区分server端与client端
 * @param {string|object} 请求的url 'api.com' 或 option{ url:'api.com',option:{ method:'post'},callback:'回调函数' }
 * @param {Boolean} 区分server与client端 生成header不同
 */
function createHeader(params) {
    let promiseList = [];
    params.map((opt) => {
        let body = {};
        // if (__SERVER__) {
        //     body.sn = apiTokenFn ? apiTokenFn(opt.data) : '';
        // } else {
            body.sn = window._ajaxToken;
        // }
        body.params = opt.data;
            if (!body.params) {
                body.params = {};
            }
            //新项目防刷去掉ajax=1
            // body.params.ajax = 1;
            //防刷需要channel_source 6位随机字符串 + uid + 3随机字符串
            let str = Math.random().toString(36).substr(2);
            let ck = getCookie('XIN_UID_CK');
            body.params.channel_source = window.btoa(encodeURIComponent(`${str.substr(0, 6)}${ck}${str.substr(6, 3)}`));
        opt.options = {
            method: 'POST',
            body: JSON.stringify(body),
            //omit: 默认值，忽略cookie的发送
            // same-origin: 表示cookie只能同域发送，不能跨域发送
            // include: cookie既可以同域发送，也可以跨域发送
            credentials: "include"
        };
        // if (__SERVER__ && opt.header) {
        //     //client路由加入空 headers:'' 会导致fetch错误
        //     opt.options.headers = opt.header;
        // }
        promiseList.push(setFetch(opt.url, opt.options, opt.callback));
    })
    return promiseList;
}
/**
 *
 * @param {string|object} 请求的url 'api.com' 或 option{ url:'api.com',option:{ method:'post'},callback:'回调函数' }
 * @returns {Array} fetchData 请求数据的数组
 * @returns {Boolean} allSucceed是否全部请求成功
 */
export function PostFetchHelper(...params) {
    let promiseList = [];
    allSucceed = true;
    if (params.length > 0) {
        promiseList = createHeader(params);
    }
    return Promise.all(promiseList).then((data) => {
        return {
            fetchData: data,
            allSucceed: allSucceed
        }
    });
}

/**
 *
 * @param {string|object} 请求的url 'api.com' 或 option{ url:'api.com',option:{ method:'post', body:{}},callback:'回调函数' }
 * @returns {Array} fetchData 请求数据的数组
 * @returns {Boolean} allSucceed是否全部请求成功
 */
function fetchHelper(...params) {
    let promiseList = [];
    //2018-7-2每次发起fetch请求都应当初始化allSucceed为true
    //否则第一页allSucceed false之后 第二页发起请求其仍为false 会导致bug
    allSucceed = true;
    if (params.length > 0) {
        params.map((opt) => {
            if (typeof opt === 'string') {
                promiseList.push(setFetch(opt));
            } else {
                promiseList.push(setFetch(opt.url, opt.options, opt.callback));
            }
        })
    }
    return Promise.all(promiseList).then((data) => {
        return {
            fetchData: data,
            allSucceed: allSucceed
        }
    });
}
/**
 *
 * @param {string} url 地址
 * @param {object} options 配置
 * @param {function} callback 请求成功之后的回调函数
 * 2021-05-27 为了满足接收不同格式数据，增加了_responseText配置，通过options传参，值为 json、arrayBuffer、text、formData、text，不传则默认response.json()
 */
function setFetch(url, options, callback) {
    if (!options) {
        options = {
            timeout: FETCH_TIMEOUT
        };
    } else if (options && !options.timeout) {
        options.timeout = FETCH_TIMEOUT;
    }
    var promise = fetch(url, options)
        .then((response) => {
            return options._responseText ? response[options._responseText]() : response.json();
        })
        .then(respData => {
            // alert(respData)
            //可以设置回调函数 处理返回的数据;
            callback && callback(respData);
            const {
                error_code,
                error_msg,
                data,
                code
            } = respData;
            if ((error_code === 200 || code === 2 || code === 200)) {
                //如果是返回的空数组 按错误数据处理
                if (Array.isArray(data) && data.length === 0) {
                    allSucceed = false;
                    return {
                        error: {
                            msg: '接口返回空数组'
                        }
                    }
                }
                // 成功返回内容
                return data;
            } else if (error_code === 600 || error_code === 301) {
                //首页汽车列表接口无数据的情况
                return data;
            } else if (error_code === 1404) {
                //触发防刷接口
                // if (__CLIENT__) {
                    //在referer参数中的值必须是以斜杠（“/”）开始
                    let referer = '';
                    let pathname = window.location.pathname;
                    referer = `?referer=${pathname}${encodeURIComponent(window.location.search)}`;
                    window.location.href = process.env.NODE_ENV === "production" ? `https://coop.xin.com/opt/checker${referer}` : `/opt/checker${referer}`;
                // }
            } else {
                // @TODO 失败处理
                allSucceed = false;
                return {
                    code: error_code,
                    msg: error_msg || '接口返回失败'
                }
            }
        }).catch(err => {
            allSucceed = false;
            return {
                //服务器异常错误
                code: -1,
                msg: err.stack || err.message || '接口返回失败'
            }
        });
    return promise;
}
export default fetchHelper;
