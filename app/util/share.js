// 分享
// =====================================

import {storeWithExpiration} from './store.js';

//let title = '看凤凰新闻还有钱拿，';
// let title2 = '来凤凰新闻做首席福利官，代表凤凰给你发现金红包啦！';
// let desc = '点我看看你能拿多少钱吧?';

let title2 = '在凤凰新闻送你1~200元现金，看新闻就能赚钱';
let desc = '不是优惠，是真的现金';

/**
 * 点击分享
 * @param {*} name
 * @param {*} images
 * @param {*} url
 */
export function clickShare(name, thumb, url) {
    window.ground.openShare(url, name + title2 , desc, thumb, '');
}

/**
 * 页脚分享
 * @param {*} name
 * @param {*} thumb
 * @param {*} url
 */
export function ifengplanFooterShare() {
    let user;
    let options = {
        //title:  title + '好友' + title2,
        title:  '好友' + title2,
        desc,
        url: 'http://share.iclient.ifeng.com/ifengplan_rule',
        thumb: ''
    };

    // 登录
    if (window.ground.userIsLogin()) {
        user = storeWithExpiration.get(`user${window.ground.getUserInfo().getGuid()}`);
        if (user) {
            options = {
                title: user.nickname + title2,
                desc,
                url: 'http://share.iclient.ifeng.com/employee2?guid=' + window.ground.getUserInfo().getGuid(),
                thumb: user.userimg
            };
        }
    }

    footerShare(options);
}


export let weiboTitle = `#集凤凰令#`;
export let shareWords = [
    `${weiboTitle}有缘千里来相会，送我一张凤凰令可好！`,
    `${weiboTitle}高颜值的人都已送我凤凰令，就差你了！`,
    `${weiboTitle}据说，送我凤凰令的朋友近期人品爆发！`,
    `${weiboTitle}凤凰好友如相问，带我收集凤凰令！`,
    `${weiboTitle}莫愁前路无知己，送我一张凤凰令！`,
    `${weiboTitle}抢到凤凰令赠送给好友，手气更旺哦！`,
    `${weiboTitle}山无棱，天地合，也要送张凤凰令！`,
    `${weiboTitle}快来送我凤凰令，离300万只差1个字！`,
    `${weiboTitle}请赐我一张凤凰令，你若安好，便是晴天~`,
    `${weiboTitle}赐我一张张张张张张张张张张凤凰令吧！`
];

/**
 * token 所有页面 footer share
 * @export
 * http://share.iclient.ifeng.com/luckybag_love
 * http://share.iclient.ifeng.com/fhlshare
 */
export function tokenPageShare(url = 'http://share.iclient.ifeng.com/fhlshare') {
    let options = {
        title: shareWords[parseInt(10*Math.random())],
        desc: '凤凰新闻客户端每周派送300万，集齐凤凰令即可平分！快来试试吧！',
        url: url,
        thumb: 'https://p2.ifengimg.com/a80c2beeeff78280/2017/23/250.png'
    };

    footerShare(options);
}

/**
 *
 * @param {* object} options
 * title: 分享 title
 * url: 分享 url
 * desc: 分享 简介
 * thumb: 分享 缩略图
 */
export function footerShare(options) {
    if (!options) return;
    let node = document.createElement('div');
    let shareBody = document.querySelector('.ifeng_share');
    if (shareBody) {
        node = shareBody;
    }

    let template = `
        <div id="ifeng_share_thumbnail">${options.thumb}</div>
        <div id="ifeng_share_title">${options.title}</div>
        <div id="ifeng_share_description">${options.desc}</div>
        <div id="ifeng_share_url">${options.url}</div>
    `;

    node.className = 'ifeng_share';
    node.style.display = 'none';
    node.innerHTML = template;
    document.body.appendChild(node);
}
