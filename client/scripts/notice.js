/*jshint esversion: 6 */

// --------------------------------------------------
// IMPORT
// --------------------------------------------------
import {
    EventObject,
    GetCookie,
    SetCookie,
    parseUrlSearch,
    getUrlParams
} from './subscribe_api';
import {
    addTransaction
} from './track';

import {
    addTransactionGA4
} from './track_ga4';
// ##################################################


// ------ (tradeNo)
let randomVal = Math.round(Math.random() * 89999) + 10000;
let tradeNo = GetCookie('trade_no') || randomVal;

var memberType = paravalue(window.location.href, 'memberType');
memberType = decodeURIComponent(memberType);
var memberTitle = '',
    membership = '';
if (memberType === 'Standard') {
    memberTitle = '标准会员';
    membership = 'standard';
} else if (memberType === 'Premium') {
    memberTitle = '高端会员';
    membership = 'premium';
} else if (memberType === 'Standard Monthly') {
    memberTitle = '月度标准会员';
    membership = 'standardmonthly';
}

// ------ (eventAction)
// var eventAction = '';
// var paraArr = parseUrlSearch();
// if (paraArr && paraArr.length>0){
//     var arr = paraArr[0].split('=');
//     eventAction = arr[1] ;
// }
var eventAction = memberType;
var SELabel = GetCookie('SELabel') || 'other from web';
if (SELabel.indexOf('/IOSCL/') > -1) {
    var clParaArr = SELabel.split('/IOSCL/');
    ga('send', 'event', clParaArr[0], 'Buy Success:' + eventAction, clParaArr[1], {
        'nonInteraction': 1
    });
    gtag("event", "buy_success", {
        send_to: "G-2MCQJHGE8J",
        event_category: clParaArr[0],
        event_label: clParaArr[1],
        buy_item: "Buy Success:" + eventAction,
        non_interaction: true
    });
} else {
    // var ccode = SELabel.replace(/From:/g,'').replace(/\/.*$/g,'');
    // if (SELabel.indexOf('From:') === 0 && ccode !== '') {
    //     ga('set', 'AllowAnchor', true);
    //     ga('set', 'campaignName', ccode);
    //     ga('set', 'campaignSource', 'marketing');
    //     ga('set', 'campaignMedium', 'campaign');
    // }
    ga('send', 'event', 'Web Privileges', 'Buy Success:' + eventAction, SELabel, {
        'nonInteraction': 1
    });
    gtag("event", "buy_success", {
        send_to: "G-2MCQJHGE8J",
        event_category: "Web Privileges",
        event_label: SELabel,
        buy_item: "Buy Success:" + eventAction,
        non_interaction: true
    });
}

// ------ (price)
// MARK: get actual price from url parameter
var price = paravalue(window.location.href, 'price');
if (price === '') {
    price = (eventAction === 'Premium') ? '1998' : '298';
}


// -------- (affiliation)
let affiliation = SELabel;



// 放入交易成功页面
var ccode = getUrlParams('ccode') ||
    getUrlParams('utm_code') ||
    getUrlParams('utm_campaign') ||
    getUrlParams('campaign_code') ||
    GetCookie('ccode') ||
    '';
addTransaction(tradeNo, eventAction, price, affiliation);
addTransactionGA4(tradeNo, eventAction, price, affiliation, ccode);

function paravalue(theurl, thep) {
    var k, thev;
    if (theurl.indexOf(thep + '=') > 1) {
        k = theurl.indexOf(thep + '=') + thep.length + 1;
        thev = theurl.substring(k, theurl.length);
        thev = thev.replace(/[\&\#].*/g, '');
    } else {
        thev = '';
    }
    return thev;
}

function addClientIdPar(clientId, url) {
    var clientIdPar = '';
    var connector = (url.indexOf('?') > 0) ? '&' : '?';
    if (clientId && clientId !== '') {
        clientIdPar = connector + 'clientId=' + clientId;
    } else {
        clientIdPar = '';
    }
    return url + clientIdPar;
}

// 5秒自动跳转
function jump() {
    // Mark: 5秒自动跳转
    var productBenefitsEle = document.querySelector('.product-benefits-container');
    if (productBenefitsEle) {
        var memberClass = memberType.replace(' ', '');
        productBenefitsEle.className += ' ' + memberClass;
    }
    var orderEle = document.getElementById('order-number');
    if (orderEle) {
        orderEle.innerHTML = paravalue(window.location.href, 'trade');
    }
    var paymentAmountEle = document.getElementById('payment-amount');
    if (paymentAmountEle) {
        paymentAmountEle.innerHTML = paravalue(window.location.href, 'price');
    }
    var memberTypeEle = document.getElementById('member-type-name');
    if (memberTypeEle) {
        memberTypeEle.innerHTML = memberTitle;
    }
    var expireEle = document.getElementById('expire-date');
    if (expireEle) {
        var expireDateString = paravalue(window.location.href, 'expire');
        if (expireDateString !== '') {
            var date = new Date(expireDateString * 1000);
            var years = date.getFullYear();
            var months = date.getMonth() + 1;
            var days = date.getDate();
            var exprireDateFinal = years + '年' + months + '月' + days + '日';
            expireEle.innerHTML = exprireDateFinal;
        }
    }

    //http://www.ftacademy.cn/subscribenotice.html?notice=Successful%20Payment!&memberType=Standard%20Monthly&trade=FT0100411540551472&price=0.01&expire=1543161600&platfrom=alipay

    // MARK: - no need to jump as the success page has important information.

    /*
    let s = window.setInterval(function(){
        var objTime = document.getElementById("time");//获得time的对象
        var time = objTime.innerText;//获得time的值
        time = time-1;
        objTime.innerText = time;//把新time赋给objTime里面
        if (time == 0) {
            var rCookie = GetCookie('R') || '';
            if (rCookie.indexOf('&') >=0 && rCookie.indexOf('?') < 0) {
                rCookie = rCookie.replace(/&/, '?');
            }
            var jumpUrl = '';
            // 当跳转的时候获取客户端 ID
            ga(function(tracker) {
                var clientId = tracker.get('clientId');
                var clientIdPar = '';
                if(rCookie && rCookie !== '') {
                    var referUrl = decodeURIComponent(rCookie);
                    if(referUrl.indexOf('tapPara')>-1){
                        jumpUrl = referUrl + '&buy=success';
                    }else{
                        jumpUrl = referUrl;
                    }
                } else {
                    jumpUrl = 'https://www.chineseft.live';
                }
                jumpUrl = addClientIdPar(clientId, jumpUrl);
                window.location.href = jumpUrl;
            });
            window.clear(s);//清空s，防止再次调用a()。即防止time减为负数
        }
     },1000);
     */
}

function returnTo() {
    var jumpUrl = '';
    var rCookie = GetCookie('R');
    ga(function(tracker) {
        var clientId = tracker.get('clientId');
        var clientIdPar = '';
        if (rCookie) {
            jumpUrl = decodeURIComponent(rCookie);
        } else {
            jumpUrl = "http://user.chineseft.live/?uide=" + paravalue(window.location.href, "uide");
        }
        jumpUrl = addClientIdPar(clientId, jumpUrl);
        // MARK: Fix the problem brought by ealier bugs which are not related to this page
        jumpUrl = jumpUrl.replace(/(&)(.*)(\?)/g, '$3$2$1');
        window.open(jumpUrl, '_self');
    });
    gtag('config', 'G-2MCQJHGE8J', function() {
        var clientId = gtag('get', 'G-2MCQJHGE8J', 'client_id');
        var jumpUrl = '';
        var rCookie = GetCookie('R');
        if (rCookie) {
            jumpUrl = decodeURIComponent(rCookie);
        } else {
            jumpUrl = "http://user.chineseft.live/?uide=" + paravalue(window.location.href, "uide");
        }
        jumpUrl = addClientIdPar(clientId, jumpUrl);
        // MARK: Fix the problem brought by ealier bugs which are not related to this page
        jumpUrl = jumpUrl.replace(/(&)(.*)(\?)/g, '$3$2$1');
        gtag('event', 'page_view', {
            send_to: 'G-2MCQJHGE8J',
            page_title: 'Return',
            page_location: jumpUrl,
            page_path: '/return'
        });
        window.open(jumpUrl, '_self');
    });
}

// 【返回】按钮
let returnToId = document.getElementById("returnTo");
if (returnToId) {
    EventObject.addHandler(returnToId, "click", function() {
        returnTo();
    });
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (document.cookie.match(reg)) {
        arr = document.cookie.match(reg);
        return unescape(arr[2]);
    } else {
        return null;
    }
}

let action;
if (getCookie('action') === 'buy') {
    action = 'buy';
} else if (getCookie('action') === 'renew') {
    action = 'renew';
} else if (getCookie('action') === 'winback') {
    action = 'winback';
} else {
    action = '';
}

// 【确认信息】按钮
let infoConfirmId = document.getElementById("infoConfirm");
// TODO: - If a user comes from a site such "ftchinese.com", no need to redirect to "chineseft.live". You should only use "chineseft.live" when you can't be sure where the user come from.
if (infoConfirmId) {
    EventObject.addHandler(infoConfirmId, "click", function() {
        window.location = 'https://www.chineseft.live/m/corp/preview.html?pageid=subscriptioninfoconfirm&membership=' + membership + '&action=' + action;
    });
}
// TODO: - Please think about the use of domain name here as well, referring to the TODO above.
document.getElementById('vip_url').href = 'http://user.chineseft.live/?uide=' + paravalue(window.location.href, "uide");
//console.log(paravalue(window.location.href, "uide"));

window.onload = function() {
    jump();
}
// ##################################################

// --------------------------------------------------
// LOG
// --------------------------------------------------

// [./js/log.js] -> [Domain + PHP] -> [200] -- [Enabled]
// [./js/log.js] -> [Only PHP] -> [404] -- [Disable]
var today = new Date();
var y = today.getFullYear();
var m = zeroFix(today.getMonth() + 1);
var d = zeroFix(today.getDate());
var logDomain = 'https://static.ftacademy.cn';

function zeroFix(n) {
    return (n < 10) ? '0' + n : n;
}

/*
if (window.gAutoStart === undefined) {
    (function(d, s, u, j, x) {
        j = d.createElement(s), x = d.getElementsByTagName(s)[0];
        j.async = true;
        j.src = u;
        x.parentNode.insertBefore(j, x);
    })(document, 'script', logDomain + '/js/log.js?' + y + m + d);
}
*/

// --------------------------------------------------
// FIX
// --------------------------------------------------

var ticketYear;
if (today.getMonth() >= 8) {
    ticketYear = today.getFullYear() + 1;
} else {
    ticketYear = today.getFullYear();
}
document.getElementsByClassName("product-container Premium")[0].children[1].innerHTML += '<li>FT中文网' + ticketYear + '年度论坛门票2张</li>'
document.getElementsByClassName('note')[0].innerText = '';