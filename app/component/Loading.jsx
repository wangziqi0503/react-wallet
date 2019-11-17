// Loading
// props
// ===================================

import React from 'react';
import './Loading.less';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '加载中',
            dot: '...'
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
    }

    componentDidMount() {
        let _this = this;

        clearInterval(this.timer);
        this.timer = setInterval(()=> {
            let dot = _this.state.dot;

            if (dot == '...') {
                dot = '.';
            } else {
                dot += '.';
            }

            this.setState({
                dot: dot
            });
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);        
    }

    render() {
        return (
            <div onTouchMove={this.handleTouchMove} className="loading">
                {this.state.text}{this.state.dot}
            </div>
        );
    }
}
