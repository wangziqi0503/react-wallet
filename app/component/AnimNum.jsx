import React from 'react';
import {Link} from 'react-router';

import {PAGEST, ACTST, REQUEST, convertMoney} from '../util/utils.js';
import {rem2px} from '../util/rem.js';

// Page
export default class Page extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        // 滚动到顶部
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        class PaintNum {
            constructor(value, w, h, font) {
                this.canvas = document.getElementById('canvasNum');
                this.ctx = this.canvas.getContext('2d');

                this.valueTemp = 0;
                this.value = value;
                this.width = w;
                this.height = h;
                this.font = font;

                // this.timer = setInterval(() => {
                //     this.init(); //此时this.value开始赋值未成功
                // }, 10);

                let pixelTatio = window.devicePixelRatio;
                // 解决 锯齿问题
                if (pixelTatio) {
                    this.canvas.style.width = this.width + 'px';
                    this.canvas.style.height = this.height + 'px';
                    this.canvas.width = this.width * pixelTatio;
                    this.canvas.height = this.height * pixelTatio;
                    this.ctx.scale(pixelTatio, pixelTatio);
                }
            }

            fillText(opt) {
                let ctx = this.ctx;
                ctx.font = this.font + 'px Helvetica';
                ctx.fillStyle = opt.color || '#fff';
                ctx.textAlign = opt.align || 'left';
                ctx.textBaseline = opt.vertical || 'middle';
                ctx.moveTo(0, Math.floor(this.height/2));
                ctx.fillText(opt.val, 0, Math.round(this.height/2));
            }

            init() {
                this.ctx.clearRect(0, 0, this.width, this.height);

                if (this.valueTemp === this.value) {
                    clearInterval(this.timer);
                }
                // this.valueTemp = this.valueTemp + (this.value - this.valueTemp) /100 > this.value ? this.value: this.valueTemp + (this.value - this.valueTemp) /100; //
                this.valueTemp = this.valueTemp + 2 > this.value ? this.value : this.valueTemp + 2;

                this.fillText({
                    //    val: convertMoney(this.valueTemp, 2)
                    val: parseFloat(this.valueTemp).toFixed(2)
                });

                return this;
            }

            refresh(value) {
                clearInterval(this.timer);
                this.value = value;

                this.timer = setInterval(() => {
                    this.init();
                }, 10);
            }
        }

        this.canvas = new PaintNum(this.props.value, this.props.width, this.props.height, this.props.font);
    }

    componentWillUpdate(nextProps, nextState) {
        this.canvas.refresh(nextProps.value);
    }

    render() {
        return (
            <canvas id="canvasNum" width={this.props.width} height={this.props.height}>
                Your browser does not support the html5 canvas tag.
            </canvas>
        );
    }
}