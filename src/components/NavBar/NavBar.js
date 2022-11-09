import React from 'react';
import PropTypes from 'prop-types';
// import './NavBar.scss';
import "./NavBar.scss"
export default class NavBar extends React.PureComponent {

    onBackClick = () => {
        window.history.go(-1);
    }
    render() {
        return (
            <nav className={`nav-bar ${this.props.className}`}>
                <a href="javascript:void(0);" onClick={this.onBackClick}></a>
                {this.props.title}
            </nav>
        )
    }
}
NavBar.propTypes = {
    //title
    title: PropTypes.string,
    leftClick: PropTypes.func
}
