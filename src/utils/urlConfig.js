let IS_PROD = process.env.NODE_ENV === 'production';
let IS_DEV = process.env.NODE_ENV === 'development';

//node-fetch只支持绝对地址 所以在server端不能'/'相对路径
//node端 本机ip作为host地址  在client端打包的时候用当前window.location.host即可
let PATH = '';
// if (__SERVER__) {
//   //server端
//   PATH = `http://${process.env.HOST}:3000`;
// } else {
  //client端
  PATH = `${window.location.protocol}//${window.location.host}`;
// }

// #常量列表
const XIN_TITLE_NAME = '优信二手车';

let URL_PREFIX = PATH;
let WX_SDK_URL = '//res.wx.qq.com/open/js/jweixin-1.2.0.js';
let ROUTER_INLINE = '//statres.quickapp.cn/quickapp/js/routerinline.min.js'; //调起快应用js地址
let XCX_WX_SDK = '//res.wx.qq.com/open/js/jweixin-1.3.2.js'; //小程序sdk
let JD_SDK = 'https://s.xinstatic.com/fe_upload/20210419_0/jd_jssdk.js'; // 京东sdk

/** 汽车列表默认图片地址 */
let CAR_DEFAULT_URL = '//s1.xinstatic.com/uxinui/img/m/place.jpg';
/** xplan图片占位符地址 */
let XPLAN_DEFAULT = '//s1.xinstatic.com/m/img/quanguogou-default.png';
/** 品牌列表默认图片地址 */
let BRAND_DEFAULT_URL = '//s1.xinstatic.com/m/img/brandS.png';
/** 车系列表默认图片地址 */
let SERIES_DEFAULT_URL =
  '//s5.xinstatic.com/www/img/default_car.png?v=17120712';

/** 搜索是www.xin.com*/
let SUGGEST_PREFIX = PATH;
/** 跳转地址前缀 */
let HOST_PREFIX = '//m.fat.xin.com';
let H5_PREFIX = '//h5.fat.xin.com';
let COOP_PREFIX = '//coop.fat.xin.com';
/** 收银台地址前缀 */
let CASH_PREFIX = '//basicservice.test.youxinjinrong.com:8210';
let CASH_PREFIX1 = '//trade.fat.xin.com';
/**列表页IM介绍入口 */
let IM_ENTER_URL = '/im';
/** 生成optoken 的地址 */
let optokenUrl = 'http://apis.fat.xin.com/ab_cache/get_key';
/** ab打点地址 */
let ab2Url = '//ab.test.xin.com/hitlog.gif';
let CLOSE_BTN = '//s2.xinstatic.com/m/img/biz/wish/close.png';
let RIGHT_BTN = '//s3.xinstatic.com/m/img/biz/wish/right.jpg';
let FAIL_ICON = '//s4.xinstatic.com/m/img/biz/wish/car-details-fail.png';
// 电子签pdf地址
let signaturePDFUrl = 'http://esign.fat.xin.com';
/**
 * 刷新按钮URL地址
 */
let REFRESH_ICON = '//s2.xinstatic.com/m/img/biz/wish/refresh.png';
/** ip定位接口 */
let getIP = 'http://openapix.fat.xin.com/city/get_location/?source=m';

let pandaUrl = '//panda.ceshi.xin.com/web/resource/get_resource';

// 58SDK
let WUBASDK = 'http://a.58cdn.com.cn/app58/rms/app/js/app_30805.js';

if (IS_PROD) {
  URL_PREFIX = '//m.xin.com';
  HOST_PREFIX = '//m.xin.com';
  H5_PREFIX = '//h5.xin.com';
  SUGGEST_PREFIX = '//www.xin.com';
  pandaUrl = '//panda.xin.com/web/resource/get_resource';
  optokenUrl = 'https://apis.xin.com/ab_cache/get_key';
  ab2Url = '//ab.xin.com/hitlog.gif';
  getIP = 'https://openapix.xin.com/city/get_location/?source=m';
  CASH_PREFIX = '//basicservice.youxinjinrong.com';
  CASH_PREFIX1 = '//trade.xin.com';
  COOP_PREFIX = '//coop.xin.com';
}
// if (process.env.branch === 'pre') {
  H5_PREFIX = '//h5.uat.xin.com';
  APIS_DOMAIN = 'http://apis.uat.xin.com';
// }
/**
 * apis地址前缀  https://apis.xin.com app端后端接口,测试环境地址在此配置
 * 测试环境 apis.fat.xin.com
 * 分支环境 c108.apis.fat.xin.com
 */
let APIS_DOMAIN = 'http://apis.fat.xin.com';
let OPENAPI_DOMAIN = 'http://openapi.fat.xin.com';
let API_LIFE = 'http://lifeapi.fat.xin.com';

let UPLOAD_DOMAIN = 'http://upload.xin.com/upload.php';

let API_CZ = 'http://cz.fat.xin.com';

let API_CJB = 'http://sales.fat.xin.com';
let API_ED = 'http://ed.fat.xin.com';

/**
 * api地址前缀  https://openapix.xin.com
 */
// let API_PREFIX = `http://openapix.fat.xin.com${__SERVER__ ? '' : '/ajax'}`;
let API_PREFIX = `http://openapix.fat.xin.com/ajax`

if (IS_PROD) {
  //正式环境无api前缀
  API_PREFIX = `https://openapix.xin.com/ajax`;
  API_PREFIX = `https://openapix.xin.com/ajax`;

  APIS_DOMAIN = 'https://apis.xin.com';
  OPENAPI_DOMAIN = 'https://openapi.xin.com';
  UPLOAD_DOMAIN = 'https://upload.xin.com/upload.php';
  API_LIFE = 'https://lifeapi.xin.com';
  API_CZ = 'https://cz.xin.com';
  signaturePDFUrl = 'https://esign.xin.com';
  API_CJB = 'https://sales.xin.com';
  API_ED = 'https://ed.xin.com';
}
//本地开发环境 测试预上线地址
if ( global.env_prod) {
  API_PREFIX = `http://openapix.uat.xin.com/ajax`;
  COOP_PREFIX = '//coop.uat.xin.com';
  getIP = 'http://openapix.uat.xin.com/city/get_location/?source=m';
  APIS_DOMAIN = 'http://apis.uat.xin.com';
  OPENAPI_DOMAIN = 'http://openapi.uat.xin.com';
  API_LIFE = 'http://lifeapi.uta.xin.com';
  API_CZ = 'http://cz.uta.xin.com';
}
// if (IS_DEV && __CLIENT__) {
  //开发环境 走代理
  API_PREFIX = `${PATH}/ajax`;
  APIS_DOMAIN = `${PATH}/store_proxy`;
  API_ED = `${PATH}/ed`;
// }

/**
 * 诸葛打点地址
 */
let zhugeUrl = window.location.protocol === 'http:'
  ? 'http://sdk.zhugeio.com/zhuge.min.js'
  : 'https://zgsdk.zhugeio.com/zhuge.min.js';
/**
 * 所有的api地址原则上都放在这里  debug参数&ddebug=gjbtest
 */

const URLCONFIG = {
  /**搜索汽车接口 */
  suggestCar: `${API_PREFIX}/search/suggest?source=m`,
  /**搜索店铺接口 */
  // suggestShop: `${SUGGEST_PREFIX}/apis/apis_suggest/shop`,
  ab2Url: ab2Url,
  zhugeUrl: zhugeUrl,
  optokenUrl: optokenUrl,
  /**获取汽车品牌接口 */ //@TODO 品牌与车系的接口需要加api  接口token 接口预上线
  getBrands: `${API_PREFIX}/brand/get_brand_list/?source=m`,
  /**根据品牌id 获取车系接口 */
  getSeries: `${API_PREFIX}/series/get_sminfo/?source=m`,
  /** 微信分享接口 */
  getWxConfig: `${API_PREFIX}/operation/get_wx_share_infos/?source=m`,
  /**获取所有城市的接口 */
  getAllCity: `${API_PREFIX}/city/get_city_all/?source=m`,
  /**获取热门城市的接口 */
  getHotCity: `${API_PREFIX}/city/get_hot_city/?source=m`,
  /**获取车辆列表接口 */
  getCarList: `${API_PREFIX}/search/get_carlist?source=m`,
  /**获取报价单列表接口 */
  getQuotationList: `${APIS_DOMAIN}/shop/shop_order/quotation_list/?source=m`,
  /**清除无效报价单列表接口 */
  deleteQuotations: `${APIS_DOMAIN}/shop/shop_order/delete_quotations/?source=m`,
  /**获取列表页基础数据接口 */
  getListCommon: `${API_PREFIX}/search/list_more?source=m`,
  /**热门搜索词接口 */
  getHotSuggest: `${API_PREFIX}/search/hot_suggest/?source=m`,
  /**seo-url接口 */
  getSeoUrl: `${API_PREFIX}/seo/get_car_list_seo_url/?source=m`,
  /**首页基础数据接口 */
  getOperation: `${API_PREFIX}/operation/get_home_common/?source=m`,
  /*首页轮播图数据接口*/
  getBannerList: `${API_PREFIX}/operation/get_home_banner?source=m`,
  /*首页新卖车 - 是否首页弹框提示*/
  getSalePop: `${API_PREFIX}/c2b_car/is_home_popup?source=m`,
  /**获取列表页TDK数据 */
  TDKApi: `${API_PREFIX}/search/get_tdk?source=m`,
  /**server端ip定位接口 node端不需要代理直接发送请求即可 改接口node端不可代理 否则无法await*/
  getIp: `${API_PREFIX}/city/get_location/?source=m`,
  /** 广告接口 */
  pandaUrl: pandaUrl,
  /**
   * 图片验证码url
   * Server端调用此接口，这个接口只允许server/routers/apir.js中使用
   */
  wishImgCodeUrl: `${API_PREFIX}/common/get_vcode?source=m`,
  /**防刷页面提交验证码接口  */
  checkerLimitUrl: `${API_PREFIX}/firewall/remove_user_limit/?source=m`,
  financialSaveData: `${API_PREFIX}/loan_landing/save_data?source=m`,
  /**
   * 获取短信验证码url
   * Server端调用此接口，这个接口只允许server/routers/apir.js中使用
   */
  smsCodeUrl: `${API_PREFIX}/send/send_sms?source=m`,
  /**
   * 列表页心愿单提交数据url
   * Server端调用此接口，这个接口只允许server/routers/apir.js中使用
   */
  wishSubmitUrl: `${API_PREFIX}/b2c_car/save_wish_data?source=m`,
  /**
   * 询底价按钮提交数据url
   * Server端调用此接口，这个接口只允许server/routers/apir.js中使用
   */
  enquirySubmitUrl: `${API_PREFIX}/${
    IS_PROD ? 'b' : 'B'
  }2c/add_enquiry?source=m`, //测试环境 b2c运维改成B2c还不支持修改,智能我们这兼容下
  /**
   * 一键询底价url
   * Server端调用此接口，这个接口只允许server/routers/apir.js中使用
   */
  enquiryOneKeyUrl: `${API_PREFIX}/${
    IS_PROD ? 'b' : 'B'
  }2c/add_enquiry_one_key?source=m`,
  /**
   * 获取防刷图片验证码，前端调用
   */
  checkerImgCode: '/apir/checker_imgcode',
  /**
   * 防刷图片验证码提交，前端调用
   */
  checkerImgCodeSubmit: '/apir/checker_submit',
  /**
   * 获取图片验证码，前端调用
   */
  wishImgCode: '/apir/wish_imgcode',
  /**
   * 提交心愿单数据，前端调用
   */
  wishSubmit: '/apir/wish_submit',
  /**
   * 询底价获取图片验证码
   */
  enquiryImgCode: '/apir/enquiry_imgcode',
  /**
   * 询底价获取短信验证码
   */
  enquirySmsCode: '/apir/enquiry_smscode',
  /**
   * 提交询底价数据，前端调用
   */
  enquirySubmit: '/apir/enquiry_submit',
  /**
   * 金融贷款落地页获取token
   */
  financialSaveInfo: '/apir/financial_save_info',
  /**
   * 一键询底价，前端调用
   */
  enquiryOneKey: '/apir/enquiry_onekey',
  /*首页砍价活动入口接口*/
  getBargainEnter: `${API_PREFIX}/bargain/show_index?source=m`,
  /**server端ip定位接口 node端不需要代理直接发送请求即可 改接口node端不可代理 否则无法await*/
  getIp:  `${API_PREFIX}/city/get_location/?source=m`,
  getFlawPics: `${API_PREFIX}/report/get_flaw_pics?source=m`, //  /** 老版的瑕疵以及漆面修复图 */
  getCarInfo: `${API_PREFIX}/car/get_car_basic_info?source=m`, //详情页基数数据
  getTel400: `${API_PREFIX}/car/get_tel_400/?source=m`, //获得400电话
  getReportType: `${API_PREFIX}/report/report_type/?source=m`, //查课检测判断检测报告是否存在
  getBigImage: `${API_PREFIX}/car/big_image/?source=m`, //详情页的banner大图
  getReportMain: `${API_PREFIX}/report/report_main/?source=m`, //详情页检测项接口
  getCarMaintenanceData: `${API_PREFIX}/report/get_new_maintenance_data?source=m`, //详情页维保记录(原车辆历史)
  getSimilarRecommendCarlist: `${API_PREFIX}/car/get_similar_recommend_carlist/?source=m`, //相似推荐
  getSimilarRecommendSemCarlist: `${API_PREFIX}/car/get_recommend_sem_carlist/?source=m`, //智能落地页相似推荐
  getCheckBaicheng: `${API_PREFIX}/city/check_baicheng/?source=m`, //百城与非百城
  getCarImgs: `${API_PREFIX}/car_imgs/big_image/?source=m`, //大图页的图册接口
  getSeoBottomLinks: `${API_PREFIX}/car/get_seo_bottom_links/?source=m`, //页面SEO底链
  /**首页广告位abtest 接口地址 */
  ab2IM: `${API_PREFIX}/common/get_abtest?source=m`,
  /**首页地址 */
  homeUrl: '//m.xin.com',

  /**获取vr图册 */
  getVrImg: `${API_PREFIX}/car/vr_pics/?source=m`,
  /**城市搜索接口 */
  getCityTips: `${API_PREFIX}/city/city_tips/?source=m`,
  /**金融方案页接口 */
  getFinancePlan: `${API_PREFIX}/finance/detail/?source=m`,
  /**订单详情页接口 */
  getPaymentInfo: `${APIS_DOMAIN}/shop/shop_order/order_details/?source=m`,
  /**支付按钮接口 */
  getCashInfo: `${APIS_DOMAIN}/shop/shop_order/order_pay?source=m`,
  /**支付尾款按钮接口 */
  getCashWKInfo: `${APIS_DOMAIN}/shop/shop_order/balance_pay?source=m`,
  /**订单详情请求电话 */
  getTelInfo: `${APIS_DOMAIN}/shop/shop_order/get_tel?source=m`,
  /**订单详情 申请退款 */
  getRefundH5: `${APIS_DOMAIN}/order_new/refund_h5?source=m`,
  /**车辆详情 */
  getCarDetailInfo: `${APIS_DOMAIN}/shop/shop_order/quotation_details?source=m`,
  /**确认方案 */
  confirmPlan: `${APIS_DOMAIN}/shop/shop_order/confirm_plan?source=m`,
  /**金融车支付详情 */
  getFinancePrice: `${APIS_DOMAIN}/shop/shop_order/get_finance_price?source=m`,
  /**分享报价单 */
  shareReportPrice: `${APIS_DOMAIN}/shop/shop_order/quotation_details_share?source=m`,
  /**确认支付 */
  payConfirm: `${APIS_DOMAIN}/shop/shop_order/order_pay?source=m`,
  /**获取电话 */
  getPhoneNumber: `${APIS_DOMAIN}/shop/shop_order/get_tel?source=m`,
  /**获取最新报价单 */
  getLatest: `${APIS_DOMAIN}/shop/shop_order/get_quotation_new_price?source=m`,
  /**预支付接口 */
  prePay: `${APIS_DOMAIN}/shop/shop_order/pre_payment?source=m`,
  /** 订单进度小调查提交接口*/
  saveInvestigation: `${APIS_DOMAIN}/order_new/save_investigation?source=m`,
  /** 订单进度小调查回显接口*/
  getInvestigation: `${APIS_DOMAIN}/order_new/get_investigation?source=m`,
  /*二手车产权办理说明 页面接口*/
  getPrepareData: `${APIS_DOMAIN}/shop/shop_order/get_trans_istr?source=m`,
  /*h5成色标准， 获取车辆名称，综合成色，上牌，里程， 瑕疵等数据的接接口*/
  getDetailDetectionQuality: `${APIS_DOMAIN}/detail/detection/quality?source=m`,
  /*获取验证码*/
  getYzmCode: `${API_LIFE}/bindcard/get_msg`,
  /*获取验证码*/
  bindCard: `${API_LIFE}/bindcard/bind_card`,
  /*权益中心*/
  getQyList: `${OPENAPI_DOMAIN}/ajax/qy/qy_list`,
  /**获取我买的车列表接口 */
  getMyCarList: `${APIS_DOMAIN}/shop/shop_order/my_car?source=m`,
  /*分享图片合成*/
  sharePic: `${OPENAPI_DOMAIN}/ajax/qy/share/pic_list`,
  /*权益分享回调*/
  qyShareCallback: `${OPENAPI_DOMAIN}/ajax/qy/share/notice`,
  /*推荐落地页*/
  recommend: `${OPENAPI_DOMAIN}/ajax/qy/recommend/landing`,
  /*途虎中转页*/
  getTuHuJumpUrl: `${OPENAPI_DOMAIN}/ajax/qy/get_outside_jump_url`,
  // 获取验证码
  bindCard: `${API_LIFE}/bindcard/bind_card`,
  commitData: `${API_LIFE}/guaranty/commit_data`,
  schedule: `${API_LIFE}/guaranty/schedule`,
  guarantyData: `${API_LIFE}/guaranty/get_data`,
  // 还款卡授权-获取验证码
  paymentAuthorizeCode: `${API_LIFE}/api/u2appbindcard/send_msg`,
  // 还款卡授权-根据身份证获取姓名银行卡
  paymentAuthorizeUserInfo: `${API_LIFE}/api/u2appbindcard/get_user_info`,
  // 还款卡授权-提交绑卡
  paymentAuthorizeSumit: `${API_LIFE}/bindcard/yx_bind`,
  /*智能榜单车辆列表数据*/
  bangdanList: `${APIS_DOMAIN}/bangdan/bangdan_list`,
  /*智能榜单筛选数据*/
  bangdanDictList: `${APIS_DOMAIN}/bangdan/bangdan_dict_list`,
  /**我的推荐明细 */ /*我的保养券*/
  getMaintenanceCoupon: `${OPENAPI_DOMAIN}/ajax/qy/recommend/details`,
  // 查客检测报告(库存提供)
  reportInfo: `${API_CZ}/api/weiXin/getCarInfo`,
  // 解抵押立即支付
  getPayprepare: `${API_LIFE}/retentionguaranty/retention/get_payprepare_param`,
  /**借款活动列表页数据 */
  productList: `${OPENAPI_DOMAIN}/ajax/iw/product/list`,
  /**借款活动兑奖接口 */
  addExchange: `${OPENAPI_DOMAIN}/ajax/iw/add/exchange`,
  // 获取京东合同
  getJdContract: `${APIS_DOMAIN}/signature/my_contract_v2_h5`,
  /**西安到店投放 */
  getZyInfo: `${APIS_DOMAIN}/activity/get_zy_info`,
  /**西安到店提交 */
  saveZyAdInfo: `${APIS_DOMAIN}/activity/save_zy_ad_info`,
  /**确认订购选择购车方案 */
  getBuycarPlan: `${APIS_DOMAIN}/shop/shop_order/get_buycar_plan`,
  /**确认订购提交 */
  saveBuycarPlan: `${APIS_DOMAIN}/shop/shop_order/save_buycar_plan`,
  /**确认订购400电话 */
  getCrmTele: `${APIS_DOMAIN}/telephone/get_crm_tele?source=m`,
  /**店铺详情页推荐车辆 */
  shopRecommend: `${APIS_DOMAIN}/car_search/shop_recommend`,
  /**优信自营介绍页 */
  getZyIntroduce: `${APIS_DOMAIN}/activity/get_zy_introduce`,
  /**买家秀列表页 */
  getOrdersList: `${APIS_DOMAIN}/orders/comment/comments_list_v1186`,
  /**买家秀详情页 */
  getOrdersDetail: `${APIS_DOMAIN}/orders/comment/comments_detail_v1186`,
  /**买家秀点赞 */
  getOrdersPraiseChange: `${APIS_DOMAIN}/orders/comment/praise_change`,
  /**商超引流是否绑定 */
  getBusinessSuper: `${APIS_DOMAIN}/business_super/check_binding`,
  /**商超引流提交 */
  saveBusinessSuper: `${APIS_DOMAIN}/business_super/do_binding`,
  /**下载安卓客户端包 */
  getTyStoreApp: `${API_PREFIX}/ty_store/get_ty_store_app?source=m`,
  /**商超引流：问卷调查状态 */
  getStatus: `${APIS_DOMAIN}/qrcode/get_status`,
  /**商超引流：问卷调查保存 */
  saveQuestion: `${APIS_DOMAIN}/qrcode/save_question`,
  /**产权办理 */
  getDelivery: `${API_PREFIX}/shop/delivery/detail?source=m`,
  /**保存城市 */
  saveUserAddress: `${API_PREFIX}/shop/delivery/save_user_address?source=m`,
  /**运营页面 */
  getList: `${APIS_DOMAIN}/operation/get_list`,
  /**店铺菜单页面 */
  supermarketGetList: `${APIS_DOMAIN}/supermarket/get_list?source=m`,
  /**315项检测标准 */
  getChakeCategoryTree: `${APIS_DOMAIN}/detail/detection/chake_category_tree?source=m`,
  /**车辆检测报告 */
  getChakeNew: `${APIS_DOMAIN}/detail/detection/chake_new?source=m`,
  /**全款支付 */
  fullPriceOrderPay: `${APIS_DOMAIN}/shop/shop_order/full_price_order_pay?source=m`,
  /**取消订单 */
  cancelOrder: `${APIS_DOMAIN}/order_new/cancel_order?source=m`,
  /**超级宝-获取城市政策 */
  getCityPolicy: `${API_CJB}/h5/get_city_policy`,
  /**超级宝-获取城市列表 */
  getCityList: `${API_CJB}/h5/get_init`,
  /**超级宝-获取车辆详情 */
  getCjbCarDetail: `${API_CJB}/h5/get_car_detail`,
  /**超级宝-获取检测报告 */
  getCjbPreReport: `${API_CJB}/h5/get_car_report`,
  /**超级宝-获取加密参数 */
  getCjbPortrai: `${API_CJB}/h5/get_portrait`,
  /**超级宝-用户偏好 */
  getCjbUserPreference: `${API_ED}/fe/portrait/base_info`,
  /**超级宝-用户偏好 */
  getCjbSaledCars: `${API_ED}/fe/portrait/maybe_saled_cars`,
  /**超级宝-用户偏好 */
  getCjbInterested: `${API_ED}/fe/portrait/interested`,
  /**极速提车 */
  getTopspeed: `${API_PREFIX}/shop/delivery/topspeed?source=m`,
  /**报价单获取购车人姓名和身份证号 */
  getUserPayInfo: `${APIS_DOMAIN}/shop/shop_order/get_user_pay_info`,
  /**订单详情 申请退款 */
  getCancelRefundH5: `${APIS_DOMAIN}/order_new/cancel_refund_h5?source=m`,
  /**截图检测报告入口 */
  reportGbCoverImage: `${APIS_DOMAIN}/report_gb/report_h5/report_gb_cover_image?source=m`,
  /**国标检测报告详情 */
  reportGbDetail: `${APIS_DOMAIN}/report_gb/report_h5/report_gb_detail?source=m`,
  /**增值延保服务 */
  getAppreciation: `${APIS_DOMAIN}/extend_yb/extend_yb/appreciation?source=m`,
  /**增值延保订单详情 */
  getWarrantyOrderDetails: `${APIS_DOMAIN}/extend_yb/extend_yb/warranty_order_details?source=m`,
  /**增值延保订单详情支付 */
  orderPay: `${APIS_DOMAIN}/extend_yb/extend_yb/order_pay?source=m`,
  /**检测报告问卷 */
  saveReportQuestionnaire: `${APIS_DOMAIN}/report_gb/report_h5/report_questionnaire?source=m`,
  /**检测报告 push */
  pushReportGbQuestionnaire: `${APIS_DOMAIN}/report_gb/report_h5/report_gb_questionnaire_push?source=m`,
  /**写日志接口 */
  reportGbAddLogH5: `${APIS_DOMAIN}/report_gb/report_h5/report_gb_add_log_h5?source=m`,
  /**投放 产品郭旭 */
  affClueAdvertise: `${API_PREFIX}/clue/add_clue_advertise?source=m`
};

const XIN_OP_DOMAIN_A = '//c1.xinstatic.com';
const XIN_OP_DOMAIN_B = '//c2.xinstatic.com';
const XIN_OP_DOMAIN_C = '//c3.xinstatic.com';
const XIN_OP_DOMAIN_D = '//c4.xinstatic.com';
const XIN_OP_DOMAIN_E = '//c5.xinstatic.com';
const XIN_OP_DOMAIN_F = '//c6.xinstatic.com';

const XIN_CDN_HTTP_DOMAIN = '//s1.xinstatic.com';
const XIN_CDN_HTTPS_DOMAIN = '//s.xinstatic.com';
//css
let XIN_STATIC_DOMAIN_A = '//m.ceshi.xin.com';
let XIN_STATIC_DOMAIN_B = '//m.ceshi.xin.com';
//js
let XIN_STATIC_DOMAIN_C = '//m.ceshi.xin.com';
let XIN_STATIC_DOMAIN_D = '//m.ceshi.xin.com';
//img
let XIN_STATIC_DOMAIN_E = '//m.ceshi.xin.com';
let XIN_STATIC_DOMAIN_F = '//m.ceshi.xin.com';
const RRC_STATIC_DOMAIN = '//smj.xinstatic.com';
if (IS_PROD) {
  //css
  XIN_STATIC_DOMAIN_A = '//s4.xinstatic.com';
  XIN_STATIC_DOMAIN_B = '//s5.xinstatic.com';
  //js
  XIN_STATIC_DOMAIN_C = '//s6.xinstatic.com';
  XIN_STATIC_DOMAIN_D = '//s4.xinstatic.com';
  //img
  XIN_STATIC_DOMAIN_E = '//s5.xinstatic.com';
  XIN_STATIC_DOMAIN_F = '//s6.xinstatic.com';
}
export {
  IS_PROD,
  XIN_TITLE_NAME,
  URL_PREFIX,
  WX_SDK_URL,
  CLOSE_BTN,
  ROUTER_INLINE,
  CAR_DEFAULT_URL,
  XPLAN_DEFAULT,
  BRAND_DEFAULT_URL,
  SERIES_DEFAULT_URL,
  HOST_PREFIX,
  IM_ENTER_URL,
  URLCONFIG,
  RIGHT_BTN,
  FAIL_ICON,
  REFRESH_ICON,
  XIN_OP_DOMAIN_A,
  XIN_OP_DOMAIN_B,
  XIN_OP_DOMAIN_C,
  XIN_OP_DOMAIN_D,
  XIN_OP_DOMAIN_E,
  XIN_OP_DOMAIN_F,
  XIN_CDN_HTTP_DOMAIN,
  XIN_CDN_HTTPS_DOMAIN,
  XIN_STATIC_DOMAIN_A,
  XIN_STATIC_DOMAIN_B,
  XIN_STATIC_DOMAIN_C,
  XIN_STATIC_DOMAIN_D,
  XIN_STATIC_DOMAIN_E,
  XIN_STATIC_DOMAIN_F,
  RRC_STATIC_DOMAIN,
  H5_PREFIX,
  CASH_PREFIX,
  CASH_PREFIX1,
  COOP_PREFIX,
  APIS_DOMAIN,
  WUBASDK,
  UPLOAD_DOMAIN,
  XCX_WX_SDK,
  JD_SDK,
  signaturePDFUrl,
};
export default URLCONFIG;
