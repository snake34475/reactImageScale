
import React from 'react';
import Carousel from '../NoneItemsCarousel/NoneItemsCarousel'; // 轮播图
import SwiperItems from './SwiperItems';
import PropTypes from 'prop-types';
import './SpotImage.scss';
/**
 * @ 在这个组件中进行联动 ==> 名为：瑕疵图
 * @ 一张图 + 瑕疵点 为瑕疵项(SwiperItems)。一个瑕疵点可以有多个瑕疵项。
 * @ 瑕疵图可以左右滑动和点击左右切换瑕疵项，点击瑕疵点（车辆瑕疵图上的点）可以切换瑕疵项。
 * @ 组件中拼接瑕疵图组件，并在组件中控制切换到指定项 和 切换后将结果返回上级。
 * @author 安李恩
 * @date 2018-11-14
 * @class SpotImage
 * @extends {React.Component}
 */
class SpotImage extends React.Component {
    constructor(props) {
        super(props);
        this.wrapRef = React.createRef(); //创建组件的引用，在DefectRepair 计算使用
        this.currentIndex = props.currentIndex;
        this.changeSwiperCurrent = this.changeSwiperCurrent.bind(this);
        this.ref = null
    }
    //导致无法正确判断是左还是右
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.currentIndex != this.props.currentIndex) {
            this.currentIndex = nextProps.currentIndex;
        }
    }

    changeSwiperCurrent(val) {
        if (this.currentIndex !== val) { //防止不断更新
            this.props.moveCallBack(val);
        }
    }

    /**
     * @description 默认轮播图渲染方法
     * @param {object} state 当前对象的值
     */
    defaultRenderItem = (state) => {
        return (<SwiperItems {...state} isNeedJump={false} key={state.index}></SwiperItems>);
    }
    onRef = (ref) => {
        this.ref = ref;
    };
    render() {
        const { items = [], renderItemFunc } = this.props;
        if (items.length === 0) {
            return null;
        }

        let renderItem = this.defaultRenderItem;
        if (renderItemFunc) {
            renderItem = renderItemFunc;
        }

        const currentIndex = this.props.currentIndex - 1; //此处是减一的，需要注意
        return (
            <div ref={this.wrapRef} className={`car-detail-spot-image ${this.props.className}`} >



                <Carousel
                    className="detail-carousel-wrap"
                    currentIndex={currentIndex}  /*控制显示第几页,0是第一页*/
                    moveCallBack={(currentIndex) => { this.changeSwiperCurrent(currentIndex + 1) }}
                    items={items}
                    islimitedSlip={this.props.islimitedSlip || false}
                    onRef={this.onRef}
                    renderItem={renderItem}>

                    {items.length > 1 ? <div className="arrow-left-icon" onClick={() => this.changeSwiperCurrent(this.props.currentIndex - 1)}></div> : null}
                    {items.length > 1 ? <div className="arrow-right-icon" onClick={() => this.changeSwiperCurrent(this.props.currentIndex + 1)}></div> : null}
                </Carousel>
                {this.props.children}{/* 瑕疵点的内容及当前的下标 */}
            </div>
        )
    }
}
SpotImage.propTypes = {
    items: PropTypes.array, //数据源
    currentIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),//当先显示的项
    islimitedSlip: PropTypes.bool,/**是否限制左右滑动，默认值为false */
    moveCallBack: PropTypes.func, // 回调方法
    className: PropTypes.string, // 指定其他类
    /**
     * 使用外部的渲染方法显示轮播图元素
     */
    renderItemFunc: PropTypes.func,
}
export default SpotImage