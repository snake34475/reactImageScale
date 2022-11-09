import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import Link from 'react-router/lib/Link';
import { trackLog } from '../../utils/ab.es6';
import { zhugeTrack } from '../../utils/zhuge.es6';
import { fixHref } from '../../utils/utilFunc';
export default class CustomLink extends React.Component {
    constructor(props) {
        super(props);
        //如果是生成Link标签
        //to属性修改成一个function
        //这样react-router在跳转前会执行此时添加透传参数即可
        this.state = {
            // 获取全局数据
            to: props.to
        }
    }
    /**
     * CustomLink支持a标签(server路由)以及Link(client路由)
     * @param {String} url 跳转地址
     */
    fixLinkPath = () => {
        let path = this.props.to;
        let blackfilter = this.props.blackfilter;
        return fixHref(path, blackfilter);
    }
    /**
     * 添加透传参数
     * 针对a标签事件拦截即可
     */
    addParam = (e) => {
        let { onClick, href, blackfilter } = this.props;
        //如果传入了事件调用即可
        if (onClick) {
            onClick(e);
        } else if (href) {
            e.preventDefault();
            //无事件绑定直接跳转即可
            window.location.href = fixHref(href, blackfilter);
        }
    }
    componentDidMount() {
        let { abevent, uxevent, zhuge, href, to } = this.props;
        if (!href && !to) {
            return;
        }
        if (to) {
            this.setState({ to: this.fixLinkPath });
        }
        let abeventStr = abevent || uxevent;
        if (abeventStr || zhuge) {
            this.domNode = ReactDOM.findDOMNode(this)
            if (this.domNode) {
                // console.log('this.domNode',this.domNode)
                this.domNode.addEventListener('click', this.trackClick);
            }
        }
    }
    componentWillUnmount() {
        if (this.domNode) {
            this.domNode.removeEventListener('click', this.trackClick);
            this.domNode = null;
        }
    }
    /**
    * 埋点方法
    */
    trackClick = () => {
        let { abevent, uxevent, zhuge } = this.props;
        let abeventStr = abevent || uxevent;
        abeventStr && trackLog(abeventStr, window.optoken);
        if (zhuge) {
            let params = {};
            try {
                params = JSON.parse(zhuge);
            } catch (error) {
                //@TODO log
            }
            zhugeTrack(params.key, params.opt);
        }
    }
    render() {
        let { children, href } = this.props;
        //指定a标签 或者有href属性
        if (href) {
            return <a {...this.props} onClick={this.addParam} >{children}</a>
        }
        // else {
        //     return <Link {...this.props} to={this.state.to} >{children}</Link>
        // }
    }
}
CustomLink.propTypes = {
    href: PropTypes.string,
    to: PropTypes.string,
    className: PropTypes.string,
    /**ab打点 */
    abevent: PropTypes.string,
    uxevent: PropTypes.string,
    /**诸葛打点 */
    zhuge: PropTypes.string,
    onClick: PropTypes.func,
    /**透传时 过滤参数 */
    blackfilter: PropTypes.string,
}

// 获取全局数据
// CustomLink.contextTypes = {
//     globalData: PropTypes.object,
//     changeContext: PropTypes.func
// }
