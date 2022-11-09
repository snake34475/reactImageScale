<!--
 * Author  rhys.zhao
 * Date  2021-09-16 13:23:39
 * LastEditors  rhys.zhao
 * LastEditTime  2022-06-07 10:31:10
 * Description 拖拽、缩放容器组件
-->

## 描述

react-image-scale 是一个 React 图片组件，传入规定的数据类型后，展示图片轮播和支持双指缩放。

## 安装

```
npm install reactImageScale --save
```

## 使用

1. 引入

```
import DragZoomContainer from 'drag-zoom-container';
```

2. 使用

```
<DragZoomContainer>
    <div style={{ width: 100, height: 150, background: 'red' }} />
</DragZoomContainer>
```

其中，`DragZoomContainer`内的 div 即为要拖拽、缩放的内容。

## 属性

| 属性           | 描述                                             | 类型    | 默认值               |
| :------------- | :----------------------------------------------- | :------ | :------------------- |
| zoomOnInner    | 鼠标是否放在缩放组件上才可滚动缩放               | boolean | false                |
| zoomRange      | 缩放倍数范围                                     | object  | { min: 0.5, max: 5 } |
| zoomOrigin     | 缩放源，具体参考 css 属性 transform-origin       | string  | "50% 50%"            |
| dragInDocument | 拖拽是否限制在整个文档。false 限制拖拽在父容器内 | boolean | true                 |
| outerStyle     | 容器组件的样式，默认宽、高等于父元素             | object  | {}                   |
| position       | 拖拽组件在容器中的位置。默认左上角               | object  | { top: 0, left: 0 }  |
