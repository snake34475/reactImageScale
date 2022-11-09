import React from 'react';
import PropTypes from 'prop-types';
import { CAR_DEFAULT_URL, XPLAN_DEFAULT } from '../../utils/urlConfig';
import { getUrlParam } from '../../utils/utilFunc';
import CustomLink from "../CustomLink/CustomLink"


//瑕疵点
export function PointPannel(props) {
    if (props.length === 0 || !props.isLoad) return null;
    return props.items.map(function (item, index) {
        let descClassName = item.point === "L" ? 'r' : 'l';
        const pointName = item.type === 2 ? 'point-pannel-repair' : 'point-pannel';
        let leftVal, topVal
        if (item.detectitemmapid) {
            leftVal = item.detectitemmapid.split(',')[0]
            topVal = item.detectitemmapid.split(',')[1]
        } else {
            leftVal = item.flaw_mapid.split(',')[0]
            topVal = item.flaw_mapid.split(',')[1]
        }


        let styleObj = { left: (leftVal * 100 + '%'), top: (topVal * 100 + '%') };

        return (<span className={pointName} style={styleObj} key={index}>
            <span className={`text-pannel ${descClassName}`} dangerouslySetInnerHTML={{ __html: item.flaw }}>
            </span>
        </span>)
    })
}
/**
 * @ 瑕疵项
 * @author 安李恩
 * @date 2018-11-14
 * @class SwiperItems
 * @extends {React.Component}
 */
class SwiperItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isOnLoad: false
            isOnLoad: true

        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isLoad !== nextProps.isLoad || !!this.props.styleObj && this.props.styleObj.left !== nextProps.styleObj.left || this.state.isOnLoad !== nextState.isOnLoad || false;
    }
    componentDidMount() {
        //解决img对象上， 图片缓存不触发onload事件。此处进行加载，触发onload
        var img = new Image();
        img.onload = () => {
            this.setState({ isOnLoad: true })
        }
        img.src = this.props.item && this.props.item.imgUrl;
    }
    //图片异常
    imgOnError(e) {
        e.target.src = getUrlParam('xinfrom') === 'xplan' ? XPLAN_DEFAULT : CAR_DEFAULT_URL;
    }

    render() {
        const { index, styleObj } = this.props;
        const { imgHolder, imgUrl, flaw_point, url, abevent, href = "javascript:void(0);", onClick } = this.props.item;
        let linkObj = {};
        if (url) {
            linkObj.to = url;
        } else {
            linkObj.href = href;
        }
        if (onClick) {
            linkObj.onClick = onClick;
        }
        if (abevent) { linkObj.abevent = abevent; }
        return (
            <li style={styleObj} key={`banner${index}`} className="detail-swiper-item">
                <CustomLink {...linkObj}>
                    {
                        this.props.isLoad ? <img className="carousel-img" key="carousel" onError={this.imgOnError} src={imgUrl} /> :
                            <img className="carousel-img" src={imgHolder} key="holder" />
                    }
                </CustomLink>
                {this.state.isOnLoad === true ? <PointPannel items={flaw_point} isLoad={this.props.isLoad}></PointPannel> : null}
            </li>)
    }
}

SwiperItems.propsType = {
    items: PropTypes.Array,
    styleObj: PropTypes.object,
    isLoad: PropTypes.bool,
    index: PropTypes.arrayOf[PropTypes.number, PropTypes.string]
}

export default SwiperItems;
