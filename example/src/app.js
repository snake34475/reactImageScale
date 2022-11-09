/*
 * Author  rhys.zhao
 * Date  2022-01-28 15:36:55
 * LastEditors  rhys.zhao
 * LastEditTime  2022-06-22 13:39:43
 * Description
 */
import React from 'react';
import { render } from 'react-dom';
import BigImgView from '../../src';
import {dataArr} from "../../src/utils/data"
import "./app.scss"
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
        }
    }

    changeCurrent = (page) => {
        this.setState({currentIndex: page})
    }
    //返回函数
    onBackFn = () => {
        window.history.go(-1);
    }

    render() {
        const {currentIndex, toURL} = this.state
        console.log("currentIndex", currentIndex)
        return (
            <div className="App">
                <BigImgView imgData={dataArr()} currentIndex={currentIndex} changeCurrent={this.changeCurrent}
                            onBackFn={this.onBackFn}></BigImgView>
            </div>
        )
    }
}
render(<App />, document.getElementById('root'));
