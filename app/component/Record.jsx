import React from 'react';
import {Link} from 'react-router';

import {PAGEST, ACTST, REQUEST, convertMoney, addLoginParams, formatTime } from '../util/utils.js';
import './Record.less';
import CONFIG from '../util/CONFIG.js';

//no recrod
export class NoRecord extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="no-record">               
                {this.props.noData}     
            </div>
        )
    }
}

//record item 
//no abstract item data 
export class RecordItem extends React.Component {
    constructor(props) {
        super(props);    
        
        // this.state = {
        //     active: true
        // }
        // this.handleClick = this.handleClick.bind(this);
    }
  
    render() {  
        return (        
            <li>
                <div className="record-item">
                    <div className="record-dec-wrap">
                        <h3 className="record-tt">{this.props.recordItem.desc}</h3>
                        <p className="subscript">{formatTime(this.props.recordItem.ctime)}</p>
                    </div>
                    <div className="record-num-wrap">
                        <p className="state">+{convertMoney(this.props.recordItem.fee,2)}</p>
                        <p className="subscript">{convertMoney(this.props.recordItem.current_total_income,2)}</p>
                    </div>
                </div>
            </li>                  
        )
    }
}

export class RecordList extends React.Component {
    constructor(props) {
        super(props);       
    }

    render() { 
        return (
            <ul className="record-list">
                {this.props.data.map((el, index)=> {                    
                    return (<RecordItem key = {index} recordItem = {el} />)
                })}
            </ul>
        )       
    }
}
