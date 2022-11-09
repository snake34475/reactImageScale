import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Carousel.scss';
/**
 * 2018年8月31日
 *
 * 轮播图组件
 * @todo 将this中定义的属性移植到this.state中
 *       重构该组件，循环播放的逻辑有些混乱
 */
export default class NoneItemsCarousel extends Component {
    /**
     * 初始化状态
     */
    constructor(props) {
        super(props);
        // 使用Es6语法时，直接在构造函数中设置this.state和this.props即可
        // 无须覆盖getDefaultProps和getInitialState方法,否则会有warning提示
        this.state = {
            /** @type {String} 容器的样式 */
            wrapStyle: {},
            pageOffsetX: 0,
            dataNow: 0, //发生移动时的时间

            // currentIndex: 0
            offsetWidth: 0
        };
        // 控制移动的开关，如果正在移动，则禁止滑动功能
        this.isScrolling = false;

            /**首次load 懒加载图片 全部加载之后为true*/
            this.allImgLoaded = false;
        this.curCount = props.currentIndex;
        this.offsetVal = 0;
        this.wrapRef = React.createRef();
        this.setTransform = this.setTransform.bind(this);
        this.ulWrapRef = React.createRef();
    }
    static defaultProps = {
        /* 是否需要循环，默认为false */
        bCirculate: false,
        /* 自动滚动方向，选项：left/right 非right均认为是left */
        dir: 'left',
        /** @type {Number} 滑动间隔时间 */
        delay: 3000,
        /** @type {Number} 滑动时间 */
        duration: 200,  //250
        /** @type {String} 滑动的曲线 */
        timeFunc: 'ease-in-out'    //'ease-in-out'
    }
    componentDidMount() {
        let dom = this.ulWrapRef.current;
        if (dom && this.props.items) {
            dom.addEventListener('touchstart', this.touchStartHandler);
            dom.addEventListener('touchmove', this.touchMoveHandler);
            dom.addEventListener('touchend', this.touchEndHandler);
        }
        // 控制移动的开关，如果正在移动，则禁止滑动功能
        this.isScrolling = false;
        // 自动滚动方向，默认为1
        this.incNum = 1;
        // 缓存的touch id
        this.touchId = null;
        // 当前展示区域的宽度
        this.state.winWidth = this.wrapRef.current.offsetWidth || document.documentElement.clientWidth;
        // 记录touchstart点的位置，用于计算是否触发slide
        this.offset = {}
        /**当前页面已经向左滑动的距离 */

        /** @type {Number} 当前滚动的次数 */
        this.curCount = this.props.currentIndex || 0; //第二页，currentIndex=1,从0 滚动到1

        this.timeId = null;
        // this.itemLength = this.props.list && this.props.list.length;
        if (this.props.bCirculate) {
            this.runAuto();
        }

        if (this.props.currentIndex !== 0) {
            //滑动到指定位置 无需动画 必须是0 因为它会回调一次再更改 @TODO应当优化
            this.move(0, 'spotClick')
        }
    }
    scrollOpen = () => {
        this.isScrolling = true

    }
    scrollStop = () => {
        this.isScrolling = false

    }
    componentWillUnmount() {
        this.stopAuto();
        let dom = this.ulWrapRef.current;
        if (dom) {
            dom.removeEventListener('touchstart', this.touchStartHandler);
            dom.removeEventListener('touchmove', this.touchMoveHandler);
            dom.removeEventListener('touchend', this.touchEndHandler);
        }
    }
    //属性改变,滑动滑块
    componentWillReceiveProps(nextProp, nextContext) {
        if (nextProp.currentIndex != this.curCount) {
            this.curCount = nextProp.currentIndex;
            //瑕疵图点击去掉动画效果
            this.setTransform('spotClick');
        }
    }
    componentDidUpdate() {
        if (this.state.winWidth !== this.wrapRef.current.offsetWidth) {
            this.setState({ winWidth: this.wrapRef.current.offsetWidth })
            // this.state.winWidth = this.wrapRef.current.offsetWidth;
        }
    }

    /**
     * touchstart事件监听
     * @param  {EventObject} e
     * @return {}
     */
    touchStartHandler = (e) => {
        if (this.props.items.length > 1) {  // 简单处理
            this.stopAuto();
            var touch = e.touches[0];
            this.touchId = touch.identifier;
            this.offset.x = touch.pageX;
            this.offset.y = touch.pageY;
        }
    }

    /**
     * 滑动事件监听
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    touchMoveHandler = (e) => {
        if (true === this.isScrolling) {
            return;
        }
        if (this.props.items.length > 1) {
            this.stopAuto();
            var touch = e.changedTouches[0];
            var offsetX = touch.pageX - this.offset.x;
            var offsetY = touch.pageY - this.offset.y;
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                e.preventDefault();
            }
            //增加限制左右滑动
            if (this.props.islimitedSlip) {
                const direction = this.swipeDirection(this.offset.x, touch.pageX, this.offset.y, touch.pageY);
                if ("Right" === direction) {
                    if (0 === this.props.currentIndex) {
                        return false;
                    }
                } else if ('Left' === direction) {
                    if (this.props.items && this.props.items.length - 1 === this.props.currentIndex) {
                        return false;
                    }
                }
            }

            if (Math.abs(offsetX) > 10) {
                e.stopPropagation();
                this.setState({
                    wrapStyle: {
                        transition: '0ms ' + this.props.timeFunc,
                        transform: 'translate3d(' + (-this.state.winWidth * (this.curCount) + offsetX) + 'px,0,0)',
                        dataNow: Date.now()
                    }
                });
            } else {
                //解决滑动距离太小 图片卡住的问题
                this.setState()
            }
        }
    }

    touchEndHandler = (e) => {
        if (true === this.isScrolling) {
            return;
        }
        if (this.props.items.length > 1) {
            var touch = e.changedTouches[0];
            var offsetX = touch.pageX - this.offset.x;
            // 防止click事件触发
            if (Math.abs(offsetX) > 5) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (this.touchId !== touch.identifier) {
                this.touchId = null;
                this.move(0);
                this.isScrolling = true;
                return;
            }
            var moveDir = 0;
            if (Math.abs(offsetX) > this.state.winWidth / 10) {
                if (offsetX > 0) {
                    moveDir = -1;
                } else {
                    moveDir = 1;
                }
            }
            //ios下touchMove中return false，仍然可以触发touchend:jira-20683
            if (this.props.islimitedSlip) {
                if ((0 === this.props.currentIndex && moveDir === -1) || (this.props.items && this.props.items.length - 1 === this.props.currentIndex && moveDir === 1)) {
                    return false;
                }
            }
            this.move(moveDir);

            //2018-7-26轮播图用户滑动后 不需要自动轮播
            // this.runAuto();
        }

    }

    /**
     * 移动方法
     * @param  {Number} dirNum 方向，1为左，-1为右
     * @return {[type]}        [description]
     */
    move(dirNum, from) {
        this.isScrolling = true;
        let num = typeof dirNum === 'number' ? dirNum : this.incNum;
        //记录滑动次数
        this.curCount += num;
        if (from && from === 'spotClick') {
            this.setTransform('spotClick');

        } else {
            this.setTransform();
        }
        if (this.props.moveCallBack) {
            this.props.moveCallBack(this.curCount)
        }
        this.isScrolling = false;
    }

    setTransform(from) {
        const { duration, timeFunc } = this.props;
        let pageOffsetX = this.curCount * this.state.winWidth;
        let newState = {
            pageOffsetX,
            wrapStyle: {
                transition: `${duration}ms ${timeFunc}`,
                transform: `translate3d(${-pageOffsetX}px,0,0`,
                dataNow: Date.now()
            },
        };
        //瑕疵图点击去掉动画效果
        if (from === 'spotClick') {
            newState.wrapStyle.transition = '';
        }
        this.setState(newState);

    }
    swipeDirection(startPointX, ednPointX, startPointY, ednPointY) {
        return Math.abs(startPointX - ednPointX) >= Math.abs(startPointY - ednPointY) ? (startPointX - ednPointX > 0 ? 'Left' : 'Right') : (startPointY - ednPointY > 0 ? 'Up' : 'Down')
    }

    /**
     * 自动播放
     * @param  {[type]} incNum [description]
     * @return {[type]}        [description]
     */
    runAuto() {
        if (this.itemLength === 1) {
            return;
        }
        if (!this.timeId) {
            this.timeId = setInterval(() => {
                this.move(1)
            }, this.props.delay);
        }
    }

    /**
     * 取消自动播放
     * @return {[type]} [description]
     */
    stopAuto() {
        if (this.timeId) {
            clearInterval(this.timeId);
            this.timeId = null;
        }
    }

    render() {
        return (
            <div className={this.props.className} ref={this.wrapRef}>
                <ul style={this.state.wrapStyle} className="detail-carousel-ct clearfix" ref={this.ulWrapRef}>
                    {/*  { this.getImgList(this.props.items) }         */}
                    <ImgList items={this.props.items}
                        winWidth={this.state.winWidth}
                        curCount={this.curCount}
                        currentIndex={this.props.currentIndex}
                        renderItem={this.props.renderItem}
                        scrollStop={this.scrollStop}
                        scrollOpen={this.scrollOpen}
                    />
                </ul>
                {this.props.children}
            </div>
        );
    }
}


NoneItemsCarousel.propTypes = {
    /* 是否需要循环，默认为false */
    bCirculate: PropTypes.bool,
    /* 自动滚动方向，选项：left/right 非right均认为是left */
    dir: PropTypes.string,
    /** @type {Number} 滑动间隔时间 */
    delay: PropTypes.number,
    /** @type {Number} 滑动时间 */
    duration: PropTypes.number,
    /** @type {String} 滑动的曲线 */
    timeFunc: PropTypes.string,

    currentIndex: PropTypes.number, /** 当前的位置 0 是第一位 */
    moveCallBack: PropTypes.func,
    items: PropTypes.array,
    renderItem: PropTypes.func,/*** 渲染li单项 */
    islimitedSlip: PropTypes.bool /* 滑到头时，禁止滑动 */
}


// NoneItemsCarousel 更新state后，会导致list的重绘
// 由于重绘的量较多，添加这个类，为了阻止更新
class ImgList extends Component {
    constructor(props) {
        super(props)
        this.getImgList = this.getImgList.bind(this);
        /**@type {String} 懒加载图片占位图片*/
        this.imgHolder = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
        this.loadedIndex = {};
        this.offsetVal = null;
        this.lazyLoadCount = 0;
    }
    /**
     * loadCount != this.props.items.length 图片没有加载完
     * this.props.winWidth !== nextProps.winWidth  宽度需要适配，适配后不更新
     * this.offsetVal !== Math.floor(nextProps.curCount / nextProps.items.length) // 图片加载完成后，方向不变，不跟新
     * 渲染的子项里面，有一层防止重复渲染
     * * */
    shouldComponentUpdate(nextProps, nextContext) {
        const loadCount = Object.keys(this.loadedIndex);
        return loadCount != this.props.items.length ||
            this.props.winWidth !== nextProps.winWidth ||
            this.offsetVal !== Math.floor(nextProps.curCount / nextProps.items.length) ||
            this.props.currentIndex !== nextProps.currentIndex
    }

    /**
     * 图片懒加载
     * @param {String} 图片地址
     * @param {Number} 当前页数
     */
    islazyLoadImg(index, currentIndex, length) {
        const curr = Math.floor((currentIndex < 0 ? currentIndex + length : currentIndex) % length) + 1; //当前的图片
        const nextCurr = curr + 1 > length ? length + 1 : curr + 1;//下一张图片
        const prvCurr = curr - 1 < 0 ? length : curr - 1;//上一张图片
        if (index === curr || index === prvCurr || index === nextCurr) {
            this.loadedIndex[index] = true;
            return true;
        }
        return this.loadedIndex[index];
    }
    /**
    * 轮播图
    * @param {Array} list 轮播图列表
    */
    getImgList(itmes = []) {
        let list = itmes.map(item => item);// 复制数据
        let result = null;
        let length = list.length;
        let offsetVal = Math.floor(this.props.curCount / length); // 偏移量
        this.offsetVal = offsetVal; //判断是否更新
        let winWidth = this.props.winWidth;
        const { scrollOpen, scrollStop } = this.props
        if (list.length <= 1) { //只有一张时，直接显示
            result = list.map((item, index) => {
                let styleObj = {};
                if (!item.imgHolder) {
                    item.imgHolder = this.imgHolder;
                }
                return this.props.renderItem && this.props.renderItem({ item, index, styleObj, isLoad: true, scrollOpen, scrollStop })
            })
        } else {
            //左右各加一张处理,防止滑动过程中出现白底
            list.unshift(list[length - 1]); //左侧最后一张
            list.push(list[1]); //push进去的对象，引用相同，修改里面的参数时需要注意

            result = list.map((item, index) => {
                let leftVal = offsetVal * winWidth * length + (index - 1) * winWidth;
                if (index === 0) { leftVal = offsetVal * winWidth * length - winWidth; }

                let styleObj = { position: 'absolute', left: `${leftVal}px` };
                const isLoad = this.islazyLoadImg(index, this.props.curCount, length); // 传进去懒加载
                if (!item.imgHolder) {
                    item.imgHolder = this.imgHolder;
                }
                return this.props.renderItem && this.props.renderItem({ item, index, styleObj, isLoad, scrollOpen, scrollStop }) || null;
            });
        }

        return result;
    }
    render() {
        return this.getImgList(this.props.items)
    }
}

/*****
 * 使用示例：
 *      <Carousel
            className="detail-carousel-wrap"
            currentIndex = { currentIndex }  // 控制显示第几页,0是第一页
            moveCallBack = { (currentIndex) => { this.changeSwiperCurrent(currentIndex+1) } }
            items = { convertData }
            renderItem= {(state) =>{ return  (<SwiperItems {...state } key={ state.index }></SwiperItems>) }}>
                    { this.props.children } // 滑动上的其他内容，不受滑动影响
            </Carousel>
 */
