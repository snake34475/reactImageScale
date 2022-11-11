<!--
 * Author  wangtengyao
 * Date  2022-11-11 13:23:39
 * LastEditors  wangtengyao
 * LastEditTime  2022-11-11 13:23:39
 * Description 拖拽、缩放容器组件
-->

## 描述

reactimagescale 是一个 React 图片组件，传入规定的数据类型后，展示图片轮播和支持双指缩放。

## 安装

```
npm install reactimagescale --save
```

## 使用

1. 引入

```
import reactimagescale from 'reactimagescale';
```

2. 使用

```
具体参考example
```

其中，`DragZoomContainer`内的 div 即为要拖拽、缩放的内容。

## 属性

| 属性             | 描述                 | 类型     | 默认值  |
|:-----------------|:-------------------|:-------|:-----|
| imgData        | 图片数组               |        | []   |
| currentIndex      | 当前页数               | number | null |
| changeCurrent     | 改变当前页的操作           | fn     | null |
| onBackFn | 左上角返回的回调函数         | fn     | null |

## imgData格式

```javascript
 [{
    reminder: "", //可省略
    type: 1, //tab的id
    type_list: [{  //tab下的列表
        pic_index: 1, //可省略
        pic_mode: {title: "外观重点", list: ["全车360度影像", "车侧盲区影像", "自动头灯", "转向辅助灯", "大灯延时关闭"]},
        pic_note: "",
        pic_src: "https://c3.xinstatic.com/o/20220626/1835/62b8367277147486905_42.jpg",
        pic_src_big: "https://c3.xinstatic.com/o/20220626/1835/62b8367277147486905_20.jpg",
        pic_src_original: "https://c3.xinstatic.com/o/20220626/1835/62b8367277147486905_40.jpg",
        pic_src_small: "https://c3.xinstatic.com/o/20220626/1835/62b8367277147486905_50.jpg",
        pic_tag_list: [],
        pic_type: "1",
    }],
    type_name: "外观", //tab名称
    //以下有瑕疵的时候使用
    detectitemmapid_place: "",
    flaw_descs: [],
    flaw_on_img: [
        {
            flaw: "5CM以内凹坑",
            flaw_code: "3BX4",
            flaw_code_type: 1,
            flaw_color: "#F3D334",
            flaw_mapid: "0.40541667,0.4975",
            flaw_point: "L",
            flaw_type: "3BX4"
        }
    ],
    image_info: "",
    img_desc: "右后门外侧-5CM以内凹坑",
    pic_car_check_place: "https://c3.xinstatic.com/o/20220626/1836/62b836a81ab4a637554_20.jpg",
    pic_desc: "右后门外侧-5CM以内凹坑",
}]
```
