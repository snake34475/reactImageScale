import React from 'react';
import PropTypes from 'prop-types';

class Tabs extends React.Component {
    render() {
        if (!this.props.items) {
            console.error("Tabs中需要传入数据");
            return null;
        }
        const propId = this.props.id;
        return (
            <ul className={this.props.className}>
                {
                    this.props.items.map(({ id, name, style = {}, domClass = '', tabId = 0 }) => {
                        let className = propId === id ? 'tab-type-active' : '';
                        return (<li className={`tab-type-li ${className} ${domClass}`}
                            style={style}
                            key={id}
                            onClick={() => this.props.changeTab && this.props.changeTab(id, tabId)} >{name}</li>)
                    })
                }
            </ul>
        )
    }
}

Tabs.propTypes = {
    className: PropTypes.string,//tabs外层使用的类名
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //选中的tab
    items: PropTypes.array,//tab 的数据
    changeTab: PropTypes.func //切换的回调
}

/***
 * 样式使用 this.props.className 命名空间下面的(scss)。命名空间下 tab-type-active控制选中tab的样式。
 * 
 * id：选中tab的id。
 * 
 * items 是传入的tab数据。数据结构如下
 * {
 *   id：tab的id,
 *   name: tab的名称，
 *   style： 设置tab的styl样式，
 *   domClass：设置tab的class样式,
 *   tabId: tab的打点使用标识 ---可选传
 * }

 */
export default Tabs;