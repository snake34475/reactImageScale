import React from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'react-hammerjs';
//查看大图页面，双击图片放大动作时触发（一个用户一天内无论在多辆车触发多次此动作，均只打1次）
let isZoomed = false;
export default class PicZoom extends React.Component {
    constructor(props) {
        super(props);
        this.oldTranslate = { x: 0, y: 0 };
        this.parentDomArr = [];
        this.lengthOfImgToBody = 0;
        this.state = {
            className: '',
            isPinchPic: false,
            transform: '',
            scale: 1,
            panEnable: true,
            //父级的属性
            ParCli: {
                // 父级的宽高
                w: 0,
                h: 0,
            },
            // 父级中心和触摸点的位移，用于缩放变大
            startDirX: 0,
            startDirY: 0,
            //暂存的位移，用于缩放恢复
            preStartDirX: 0,
            preStartDirY: 0
        };
        // pinchStatus = ''//out是放大 in是缩小
    }
    /**
     * @description 监听touchstart事件 获取初始位置
     */
    moveStart = (e) => {
        if (!this.state.isPinchPic) {
            return;
        }
        this.setState({ className: '' });
        // // 拖拽前获取上一次的定位
        let translateStr = e.target.style.transform;
        let translateArr = translateStr.match(/-?\d+\.?\d+px/g);
        this.oldTranslate.x = parseFloat(translateArr[0], 10) || this.oldTranslate.x;
        this.oldTranslate.y = parseFloat(translateArr[1], 10) || this.oldTranslate.y;
        // setTimeout(() => {
        //     this.PropToParent();
        // }, 0);
    }

    /**
     * @description 监听touchmove事件 获取移动中的位置,计算拖拽距离
     */
    moving = (e) => {
        if (!this.state.isPinchPic) {
            return;
        }

        // 获取拖拽的距离
        let transX = this.oldTranslate.x + e.deltaX;
        let transY = this.oldTranslate.y + e.deltaY;

        //图片移动，暂存的位移也更改
        this.setState({
            preStartDirX: transX + e.deltaX,
            preStartDirY: transY + e.deltaY
        })
        transX = this.lintFN(transX, transY).x
        transY = this.lintFN(transX, transY).y

        if (this.state.scale !== 1 || 2) {
            this.setState({ transform: `scale(${this.state.scale}) translate(${transX}px, ${transY}px)` });
        } else {
            this.setState({ transform: `scale(2) translate(${transX}px, ${transY}px)` });

        }
    }

    /**
     * @description 缩放变小
     */
    pinchIn = (e) => {
        if (isZoomed) return;
        // this.pinchStatus = 'in'
        if (this.state.scale - 0.02 < 1) {
            this.setState({
                scale: 1,
                transform: `scale(1)`,
                isPinchPic: false
            });
            this.props.callBackFn(true);
        } else {
            const { scale, ParCli, startDirX, startDirY } = this.state
            let x = startDirX * (scale - 1)
            let y = startDirY * (scale - 1)
            x = this.lintFN(x, y).x
            y = this.lintFN(x, y).y
            this.setState({
                scale: scale - 0.02,
                transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                isPinchPic: true

            });
            this.props.callBackFn(false);
            this.props.scrollOpen()
        }
    }
    /**
     * @description 缩放放大，只在大图状态下生效
     */
    pinchOut = (e) => {
        if (isZoomed) return;
        // this.pinchStatus = 'out'
        this.props.callBackFn(false);
        if (this.state.scale + 0.02 > 2) {
            this.setState({
                scale: 2,
            })

        } else {
            const { scale, startDirX, startDirY } = this.state
            let x = startDirX * (scale - 1)
            let y = startDirY * (scale - 1)

            x = this.lintFN(x, y).x
            y = this.lintFN(x, y).y

            this.setState({
                scale: scale + 0.02,
                isPinchPic: true,
                // className: 'piczoom-double',
                transform: `scale(${scale}) translate(${x}px,${y}px)`,
                preStartDirX: this.state.startDirX,
                preStartDirY: this.state.startDirY,
            });
            this.props.scrollOpen()
        }
    }
    pinchMove = (e) => {
        console.log("scale", e.scale)
        if (e.scale > 1) {
            this.pinchOut()
        } else {
            this.pinchIn()
        }
    }
    /**
     * @description 缩放开始，获取双指中心与图片中心距离
     */
    pinchStart = (e) => {
        this.setState({
            panEnable: false,
            isPinchPic: true,
            startDirX: this.state.scale == 1 ? this.state.ParCli.w / 2 - e.center.x : this.state.preStartDirX,
            startDirY: this.state.scale == 1 ? this.state.ParCli.h / 2 - e.center.y : this.state.preStartDirY
        });
        this.props.scrollOpen()
    }
    pinchEnd = () => {
        // this.pinchStatus = ''
        setTimeout(() => {
            this.setState({
                panEnable: true
            });
            if (!this.state.isPinchPic) this.props.scrollStop()
        }, 200);
    }
    /**
     * @description xy坐标转化，简单说传入xy值，如果你的xy值过大，会直接转化规定的最大值，防止拖拽或放大有黑边，目前这个函数在2倍以内可以
     */
    lintFN = (x, y) => {
        const { scale, ParCli } = this.state
        let Xn = (scale - 1) * 1 / 4
        let Yn = (scale - 1) * 1 / 4


        if (x > ParCli.w * Xn) {
            x = ParCli.w * Xn
        } else if (x < -ParCli.w * Xn) {
            x = -ParCli.w * Xn
        }

        if (y > ParCli.h * Yn) {
            y = ParCli.h * Yn
        } else if (y < -ParCli.h * Yn) {
            y = -ParCli.h * Yn
        }

        return {
            x: x,
            y: y
        }
    }
    /**
     * @description 拖拽浏览图片时，阻止冒泡避免触发父组件的touch事件；图片还原时，父节点恢复swiper功能
     */
    PropToParent = () => {

        if (!this.state.isPinchPic) {
            this.addEventListenerToParentNode();

        } else {
            this.removeEventListenerToParentNode();

        }
    }

    /**
     * @description 给父节点绑定touch事件
     */
    addEventListenerToParentNode = () => {
        this.parentDom.addEventListener('touchstart', this.eventListener);
        this.parentDom.addEventListener('touchmove', this.eventListener);
        this.parentDom.addEventListener('touchend', this.eventListener);
    }

    /**
     * @description 给父节点解绑touch事件
     */
    removeEventListenerToParentNode = () => {
        this.parentDom.removeEventListener('touchstart', this.eventListener);
        this.parentDom.removeEventListener('touchmove', this.eventListener);
        this.parentDom.removeEventListener('touchend', this.eventListener);
    }

    /**
     * @description 阻止冒泡，阻止默认事件
     */
    eventListener = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @description 获取img及其所有父节点
     */
    getParentDom = (dom) => {
        if (dom === document.body) return;
        this.parentDomArr.push(dom);
        let pDom = dom.parentNode;
        if (pDom) {
            this.getParentDom(pDom);
            return pDom;
        }
    }

    /**
     * @description 获取img距离页面顶部的距离imgOffsetyToBody，e.center.y-imgOffsetyToBody=e.offsetY
     * 解决安卓个别浏览器无法获取到e.srcEvent.offsetY,导致图片只能居中放大的问题
     */
    imgOffsetyToBody = () => {
        this.parentDomArr.map((item) => {
            this.lengthOfImgToBody += item.offsetTop;
        });
    }

    componentDidMount() {
        this.props.onRef(this);
        this.domNode = ReactDOM.findDOMNode(this);
        //图片渲染过程中，存在高度获取不到的情况，图片div已设置固定高度，避免双击时图片展示不居中
        this.parentDom = this.domNode.parentNode;
        this.domNode.parentNode.style.overflow = "hidden";
        this.pic = {
            w: this.parentDom.clientWidth,
            h: this.parentDom.clientHeight,
        };
        this.setState({
            ParCli: {
                w: this.parentDom.clientWidth,
                h: this.parentDom.clientHeight
            }
        })

        //获取父节点dom
        this.getParentDom(this.domNode);
        this.imgOffsetyToBody();
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.isCurrent === false && this.state.isPinchPic === true) {
            this.setState({
                scale: 1,
                transform: `scale(1)`,
                isPinchPic: false
            });
            this.props.callBackFn(true);
        }
    }
    componentWillUnmount() {
        this.removeEventListenerToParentNode();
    }
    resetImage = function () {
        this.setState({ className: 'piczoom-reset', transform: 'scale(1) translate(0px, 0px)', scale: 1 });
        this.setState({
            isPinchPic: false
        });
    }
    render() {
        return (
            <Hammer onPanStart={this.moveStart} onPan={this.moving} onTap={this.onTap}
                // onPinchIn={this.pinchIn} onPinchOut={this.pinchOut}
                onPinchStart={this.pinchStart} onPinchEnd={this.pinchEnd} onPinch={this.pinchMove}
                options={{ recognizers: { pan: { enable: this.state.panEnable }, pinch: { enable: true } } }}
            >
                <img className={this.props.className ? `${this.props.className} ${this.state.className}` : `${this.state.className}`} src={this.props.src} onError={this.props.onError} style={{
                    transform: `${this.state.transform} `
                }} />
            </Hammer>
        );
    }
}


