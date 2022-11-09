import React from 'react';
import PropTypes from 'prop-types';
// import { CAR_DEFAULT_URL, XPLAN_DEFAULT } from '../../../../utils/urlConfig';
import { CAR_DEFAULT_URL, XPLAN_DEFAULT } from '../../utils/urlConfig';

import { getUrlParam } from '../../utils/utilFunc';
import {PointPannel } from "../SpotImage/SwiperItems"
import PicZoom from '../PicZoom/PicZoom';
import Hammer from 'react-hammerjs';

/**
 * @description
 * @author 邱
 * @date 2018-12-09
 * @class SwiperItems
 * @extends {React.Component}
 */
class SwiperItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnLoad: false,
            isShowPointPannel: true,
        };
        this.imgObj = null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.isLoad !== nextProps.isLoad ||
            (!!this.props.styleObj &&
                this.props.styleObj.left !== nextProps.styleObj.left) ||
            this.state.isOnLoad !== nextState.isOnLoad ||
            nextState.isShowPointPannel !== this.state.isShowPointPannel ||
            nextProps.item.showNum !== nextProps.currentIndex
        );
    }
    componentDidMount() {
        //解决img对象上， 图片缓存不触发onload事件。此处进行加载，触发onload
        if (this.imgObj === null) {
            this.imgObj = new Image();
        }
    }

    getImgUrl(imgUrl) {
        //重复获得，一直刷新
        if (this.imgObj === null) {
            this.imgObj = new Image();
        }
        if (this.state.isOnLoad !== true && this.imgObj) {
            //dom和Image都进行加载，浏览器会做处理，只加载一个
            this.imgObj.onload = () => {
                this.setState({ isOnLoad: true });
            };
            this.imgObj.src = imgUrl;
        }
        return imgUrl;
    }

    //图片异常
    imgOnError(e) {
        e.target.src =
            getUrlParam('xinfrom') === 'xplan' ? XPLAN_DEFAULT : CAR_DEFAULT_URL;
    }

    //显示隐藏瑕疵点
    hidePointPannel = (bool) => {
        this.setState({ isShowPointPannel: bool });
    };
    //双击瑕疵点时获取li的点击位置传给image，解决点击瑕疵点时图片不能放大的问题
    onRef = (ref) => {
        this.child = ref;
    };

    //双击瑕疵点的点击位置
    // 由于安卓QQ浏览器自带浏览器，无法获取recat的event.target返回的dom对象，用转字符串（[obj HtmlSpanElement]）的方式判断该对象为span对象
    //仅点击的位置是瑕疵点时调用此方法，点击图片时调用图片自己的双击事件
    // doubleClick = (e) => {
    //     let clickDomStr = e.target.toString();
    //     if (/span/gi.test(clickDomStr)) {
    //         let x = e.center.x;
    //         let y = e.center.y;
    //         this.child.getLiPosition(x, y);
    //     }
    // };

    render() {
        const { index = 0, styleObj, currentIndex, item } = this.props;
        const {
            imgHolder,
            imgUrl,
            flaw_on_img: flawPoint,
            showNum,
        } = this.props.item;
        return (
            // onDoubleTap={this.doubleClick}
            <Hammer >
                <li
                    style={styleObj}
                    key={`banner${index}`}
                    className="detail-swiper-item"
                >
                    {this.props.isLoad ? (
                        <PicZoom
                            className="carousel-img"
                            key="carousel"
                            isCurrent={currentIndex === showNum}
                            onError={this.imgOnError}
                            // src={imgUrl}
                            src={this.getImgUrl(imgUrl)}
                            callBackFn={this.hidePointPannel}
                            onRef={this.onRef}
                            scrollOpen={this.props.scrollOpen}
                            scrollStop={this.props.scrollStop}
                        />
                    ) : (
                        <img className="carousel-img" src={imgHolder} key="holder" />
                    )}


                    {this.state.isOnLoad && this.state.isShowPointPannel && flawPoint ? (
                        <PointPannel
                            items={flawPoint}
                            isLoad={this.props.isLoad}
                        ></PointPannel>
                    ) : null}
                </li>
            </Hammer>
        );
    }
}

SwiperItems.propTypes = {
    item: PropTypes.object,
    styleObj: PropTypes.object,
    currentIndex: PropTypes.number,
};

export default SwiperItems;
