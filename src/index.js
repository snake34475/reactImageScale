import React from 'react';
import Tabs from "./components/Tabs/Tabs"
import SpotImage from './components/SpotImage/SpotImage';
import SwiperItems from "./components/SwiperItems/SwiperItems"
import './index.scss';
import "./components/NavBar/NavBar.scss"
export default class ImageTest extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.dom = null;
        this.state = {
            imgArr: [
                2, 2, 3
            ],
            page: 1,
            // currentIndex: this.props.currentIndex | 1,
            carName: "蔚来汽车",
            tabId: 1,  //当前tab
            spotImageItems: [], //重新处理的图片数据
            tagFlag: {  //tab的的类型和问题对象
            },
            tagArry: [],
            carouselRef: null
        };
    }
    componentWillMount() {
        //真正的mounted

        //暂时模拟接口成功
        let tagFlag = {}
        let tagArry = []
        let imgData = this.props.imgData
        imgData.forEach(item => {
            tagFlag[item.type] = item.type_name
            tagArry.push({ id: item.type, name: item.type_name })
        });
        let spotImageItems = this.getSpotImageData(imgData)
        console.log("spotImageItems",spotImageItems)
        let tabId = spotImageItems[this.props.currentIndex - 1].id
        this.setState({
            tagFlag,
            spotImageItems,
            tagArry,
            tabId,
        })
        this.changeTab(1)
    }
    // componentWillReceiveProps(newProps) {
    //     let currentIndex = newProps.currentIndex
    //     this.setState({ currentIndex })
    //     console.log("执行了新的props更新")
    // }
    //获得SpotImage组件的数据。此处进行加工
    getSpotImageData(data) {
        let imgList = data.reduce((prev, next) => {
            let list = next.type_list;
            let type = next.type;
            let tag = next.type_name
            return prev.concat(
                list.map((item) => {
                    item.type = type;
                    item.tag = tag;
                    item.id = type;
                    return item;
                }),
            );
        }, []);

        imgList = imgList.map((item, index) => {
            item.imgUrl = item.pic_src_big;
            item.flaw_desc = item.flaw_descs ? item.flaw_descs.flaw_type : '';
            item.href = 'javascript:void(0);';
            item.showNum = ++index; //显示的编码
            item.onClick = () => {
                this.setState({
                    showOther: !this.state.showOther,
                });
            };
            return item;
        });
        return imgList;
    }
    //更改顶部的tab
    changeTab = (itemId) => {
        this.setState({
            tabId: itemId,
            // currentIndex: this.findSpotImgageItem(itemId).showNum,
        });

        this.props.changeCurrent(this.findSpotImgageItem(itemId).showNum)

    };
    //获得图片描述
    getCurrentPicDesc() {
        const currentItem = this.state.spotImageItems[this.props.currentIndex - 1];
        return (currentItem && currentItem.pic_desc) || '';
    }
    //滑动swiper
    changeSwiper = (currentIndex) => {
        const { spotImageItems } = this.state;
        //瑕疵点情况
        let isShowFlaw = spotImageItems.some((item) => item.type == 1006);
        if (isShowFlaw) {
            let flawFirstIndex = spotImageItems.findIndex(
                (item) => item.type == 1006,
            );
            isShowFlaw =
                flawFirstIndex >= 0 && currentIndex > flawFirstIndex ? true : false;
        }

        let setStateData = { currentIndex: this.props.currentIndex, isShowFlaw };

        //不出界的情况更新当前页和tabid
        if (currentIndex >= 1 && currentIndex <= this.state.spotImageItems.length) {
            const item = this.state.spotImageItems[currentIndex - 1];
            setStateData.currentIndex = currentIndex;
            setStateData.tabId = item.id;
        }
        console.log("setStateData",setStateData)
        this.setState({ ...setStateData });
        this.props.changeCurrent(setStateData.currentIndex)
    };
    //切换tab时，跳转到该项的第一张图片
    findSpotImgageItem(tag) {
        const spotImageItems = this.state.spotImageItems;

        const index = spotImageItems.findIndex((item) => item.tag == this.state.tagFlag[tag]);
        let isShowFlaw = false;
        if (tag === '明显瑕疵') {
            isShowFlaw = true;
        }
        this.setState({
            isShowFlaw,
        });
        return spotImageItems[index] || { showNum: this.props.currentIndex };
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
    changeSwiperCurrent = (val) => {
        if (this.currentIndex !== val) {
            //防止不断更新
            this.props.moveCallBack(val);
        }
    }
    onRef = (ref) => {
        this.child = ref;
    };
    imgOnRef = (ref) => {
        this.imgRef = ref
        console.log("this.imgRef赋值:", this.imgRef)
    }
    // /**
    //  * @description 轮播图元素渲染
    //  */
    renderItem = (state) => {

        return (
            <SwiperItems
                {...state}
                key={state.index}
                currentIndex={this.props.currentIndex}
                scrollOpen={state.scrollOpen}
                scrollStop={state.scrollStop}
            ></SwiperItems>
        );
    };
    handleToRuleH5 = () => {
        window.location.href = 'https://coop.xin.com/opt/flawStandard';
    };
    getPicDesc() {
        const currentItem = this.state.spotImageItems[this.props.currentIndex - 1];
        return (currentItem && currentItem.pic_desc) || '';
    }
    getImageInfo() {
        const currentItem = this.state.spotImageItems[this.props.currentIndex - 1];
        return (currentItem && currentItem.image_info) || '';
    }

    getPicCarCheckPlace() {
        const currentItem = this.state.spotImageItems[this.props.currentIndex - 1];
        return (currentItem && currentItem.pic_car_check_place) || '';
    }
    render() {
        //阻止浏览器默认事件
        this.imgRef && this.imgRef.addEventListener("touchstart", function (e) {
            e.preventDefault()
        }, { passive: false })
        console.log("this.props.index", this.props.currentIndex, "state", this.props.currentIndex)
        return (
            <div className='big-image-wrap'>
                <div className='maskLayer'>
                    <nav className={`nav-bar nav-bar-black`}>
                        <a href="javascript:void(0);" onClick={() => this.props.onBackFn()}></a>
                        {this.state.carName}
                    </nav>
                    {/* <Nav title={this.state.carName} className='nav-bar-black' /> */}
                    {this.state.tagArry && <Tabs
                        className='big-image-tabs-three'
                        // items={this.state.tabItems}
                        items={this.state.tagArry}

                        id={this.state.tabId}
                        changeTab={this.changeTab}
                    />}
                    {<div className="big-image-content">
                        <SpotImage
                            className="spot-image-wrap"
                            items={this.state.spotImageItems}
                            currentIndex={this.props.currentIndex}
                            renderItemFunc={this.renderItem}
                            islimitedSlip={true}
                            moveCallBack={this.changeSwiper}
                        >
                            {this.getCurrentPicDesc() && this.getCurrentPicDesc() !== '' && (<p
                                className="pic-desc"
                                dangerouslySetInnerHTML={{ __html: this.getCurrentPicDesc() }}
                            ></p>)}
                            {
                                this.state.spotImageItems.length > 0 && (
                                    <p className="image-info-current-number">
                                        {this.props.currentIndex}/{this.state.spotImageItems.length}
                                    </p>
                                )

                            }
                        </SpotImage>
                        <div className='flaw-image-wrap'>
                            <div className='flaw-left'>
                                {
                                    this.getPicDesc() && this.getPicDesc() !== '' && <span>{this.getPicDesc()}</span>
                                }
                                {
                                    this.getImageInfo() && this.getImageInfo() !== '' && <p>{this.getImageInfo()}</p>
                                }
                            </div>
                            {
                                this.getPicCarCheckPlace() && this.getPicCarCheckPlace() !== '' && <div className='flaw-right'><img ref={this.imgOnRef} src={this.getPicCarCheckPlace()} /></div>
                            }
                        </div>

                    </div>}
                </div>
            </div>
        );
    }
}
