//全站cookie放在此处统一管理

const COOKIE_CONFIG = {
    /**单独点击保存的key */
    XIN_SUGGEST_HISTORY_DOT: 'XIN_SUGGEST_HISTORY_DOT',
    /**存放车辆所有搜索记录的key */
    XIN_SUGGEST_HISTORY: 'XIN_SUGGEST_HISTORY',
    /**列表页顶部下载条显示状态*/
    ISHIDDEN_OPENAPPBAR: "ISHIDDEN_OPENAPPBAR_LIST",
    /** 用户标记XIN_UID_CK*/
    XIN_UID_CK: "XIN_UID_CK",
    /**设置页面中的ab */
    XIN_AB_TEST: 'XIN_AB_TEST',
    /** 详情页对比清单保存carId至cookie中 */
    XIN_CARBROWSE_IDS: "XIN_CARBROWSE_IDS",
    /**
     * cookie里存放的城市信息
     * {
     *   "cityid": "2401",                  //城市id
     *   "areaid": "6",                     
     *   "big_areaid": "1",                 //大区
     *   "provinceid": "24",                //省
     *   "cityname": "\u4e0a\u6d77",        //城市中文名称
     *   "ename": "shanghai",               //城市英文名称
     *   "shortname": "SH",                 //城市缩写
     *   "service": "1",
     *   "near": "1501,1502,1503,1508,3001",//周边城市
     *   "tianrun_code": "021",
     *   "zhigou": "1",                     //是否直购城市
     *   "longitude": "121.4737010",        //经度
     *   "latitude": "31.2304160",          //纬度
     *   "city_rank": "1",
     *   "direct_rent_support": "1",
     *   "salvaged_support": "1",
     *   "isshow_c": "1",
     *   "is_lease_back": "0",
     *   "mortgage_service_fee": "0",
     *   "is_small_pub_house": "0"
     * }
     */
    XIN_LOCATION_CITY: 'XIN_LOCATION_CITY',
    /**
     * 列表页心愿单提交次数，提交3次之后需要输入验证码
     */
    XIN_CARLIST_WISH_SUBMIT_COUNT: 'XIN_CWSC',
    /**
     * 详情页询底价提交次数
     */
    XIN_ENQUIRY_SUBMIT_COUNT: 'XIN_ESC',
    /**
     * 保存每个手机号以及提交次数
     * 示例：18111111111,18111111112
     */
    XIN_ENQUIRY_PHONE_LIST: 'XIN_EPL',
    /**
     * 详情页用户操作次数
     */
    XIN_DETAIL_BHV_OP_COUNT : 'XIN_bhv_oc',
    /**
     * 详情页用户访问页面次数
     */
    XIN_DETAIL_BHV_PAGE_COUNT : 'XIN_bhv_pc',

    // 金融落地页面保存信息提交的手机号
    FINANCIAL_SAVE_INFO:'XIN_FINANCIAL_INFO'
}
export default COOKIE_CONFIG;