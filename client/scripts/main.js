/*jshint esversion: 6 */
/*esversion: 6 */

// --------------------------------------------------
// -- [data.json] -- Default Price
// --------------------------------------------------

// --------------------------------------------------
// IMPORT
// --------------------------------------------------
import {
    EventObject,
    GetCookie,
    SetCookie,
    DeleteCookie,
    isWeiXin,
    parseUrlSearch,
    getUrlParams,
    isEmptyObj,
    getDeviceType
} from './subscribe_api';

import {
    productImpression,
    addPromotion,
    onPromoClick,
    onProductClick
} from './track';

import './QandA';
// ##################################################

// --------------------------------------------------
// BASIC
// --------------------------------------------------
var today = new Date();

// -- today -- Get Cookie [Function]
var todayCookie = GetCookie('today');
/*
// -- today -- Get Cookie [JS]
var start = document.cookie.indexOf('today=');
var end = (start > 0) ? document.cookie.indexOf(';', start + 'today='.length) : 0;
if (end === -1) {
    end = document.cookie.length;
}
var todayCookie = (start && end) ? decodeURIComponent(document.cookie.substring(start + 'today='.length, end)) : null;
*/
if (todayCookie) {
    var t = Date.parse(todayCookie);
    today = new Date(t);
    //console.log(today);
}

const ShowHeadline = (data) => {
    //console.log(data);
    var headline = document.getElementsByClassName('content_headline')[0];
    var br = (data.cHeadline && data.eHeadline) ? '<br>' : '';
    headline.children[1].innerHTML = data.cHeadline + br + data.eHeadline;
    // -- [HEIGHT]
    /*
    var cHeight = Math.ceil(data.cHeadline.length / 25);
    var eHeight = Math.ceil(data.eHeadline.length / 35);
    var lineHeight = 30;
    headline.children[1].style.height = (cHeight + eHeight) * lineHeight + 'px';
    */
    headline.children[1].style.maxHeight = '800px';
    // -- [OPACITY]
    headline.children[1].style.opacity = 1;
}

let isReqSuccess = false;

// -- Ajax -- Get
const getData = (url, f = '', retry = 0) => {
    let dataObj = {};
    if (!isReqSuccess && retry < 3) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('get', url);
        xmlHttp.onload = function () {
            if (xmlHttp.status == 200) {
                isReqSuccess = true;
                var data = xmlHttp.responseText;
                dataObj = JSON.parse(data);
                //console.log(dataObj);
                if (f) {
                    f(dataObj);
                } else {
                    if (url.indexOf('paywall') > 0) {
                        updateUI(dataObj);
                        // -- If [fromUpdate] is used here, [memberType] and [price] will be reset.
                        //fromUpdate();
                        OriginPrice();
                    }
                }
                //console.log('Get');
            } else {
                isReqSuccess = false;
                retry++;
                setTimeout(function () {
                    getData(url, f, retry);
                }, 500);
            }
        };
        xmlHttp.send(null);
    }
    isReqSuccess = false;
    return dataObj;
};

// -- Ajax -- Post
const postData = (url, f = '', retry = 0) => {
    let dataObj = {};
    if (!isReqSuccess && retry < 3) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('post', url);
        xmlHttp.onload = function () {
            if (xmlHttp.status == 200) {
                isReqSuccess = true;
                var data = xmlHttp.responseText;
                dataObj = JSON.parse(data);
                //console.log(dataObj);
                if (f) {
                    f(dataObj);
                }
                //console.log('Post');
                if (url.indexOf('paywall') > 0) {
                    updateUI(dataObj);
                    // -- If [fromUpdate] is used here, [memberType] and [price] will be reset.
                    //fromUpdate();
                    OriginPrice();
                }
            } else {
                isReqSuccess = false;
                retry++;
                setTimeout(function () {
                    postData(url, f, retry);
                }, 500);
            }
        };
        let cookieVal = {
            uCookieVal: GetCookie('U'),
            eCookieVal: GetCookie('E')
        };
        xmlHttp.send(JSON.stringify(cookieVal));
    }
    isReqSuccess = false;
    return dataObj;
};

// -- Content Title
let headline, domain = '';
const storyId = getUrlParams('story');
const interactiveId = getUrlParams('interactive');
const contentId = (storyId) ? storyId : ((interactiveId) ? interactiveId : '');
if (contentId) {
    document.getElementsByClassName('content_headline')[0].style.display = 'block';
    if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('127.0') === 0 || window.location.hostname.indexOf('192.168') === 0) {
        domain = 'https://www.ftacademy.cn/';
    }
    getData(domain + 'index.php/jsapi/headline/' + contentId, ShowHeadline);
}

// ####################

// @@@@@@@@@@
// PricePolicy
// @@@@@@@@@@

var PricePolicy = [];
PricePolicy["monthly"] = {
    "100%": 35,
    "intro": 1,
};
PricePolicy["standard"] = {
    "100%": 298,
    "85%": 258,
    "75%": 218,
    "50%": 148,
};
PricePolicy["premium"] = {
    "100%": 1998,
    "85%": 1698,
    "75%": 1498,
    "50%": 998,
};

// @@@@@@@@@@
// PRICE
// @@@@@@@@@@

var monthlyPrice = PricePolicy['monthly'];
var standardPrice = PricePolicy['standard'];
var premiumPrice = PricePolicy['premium'];

// ########## PRICE -- [Default] ########## //
var PRICE = [];
PRICE['standard'] = standardPrice['100%'];
PRICE['premium'] = premiumPrice['100%'];
PRICE['monthly'] = monthlyPrice['100%'];

// ########## PRICE -- [Range] ########## //
var rangeStart = 0;
var rangeEnd = 0;

// ########## PRICE -- [Parameters] ########## //
let fromPara = getUrlParams('from');
let ccodePara = getUrlParams('ccode');
// -- [Parameters -- Default]
if (fromPara === 'ft_win_back') {
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
} else if (fromPara === 'ft_renewal') {
    PRICE['standard'] = standardPrice['75%'];
    PRICE['premium'] = premiumPrice['75%'];
} else if (fromPara === 'ft_discount') {
    PRICE['standard'] = standardPrice['85%'];
    PRICE['premium'] = premiumPrice['85%'];
} else if (fromPara === 'ft_intro') {
    PRICE['monthly'] = monthlyPrice['intro'];
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// -- [Parameters -- Default -- Date range]
/*
// #### 2021 Annual Meeting
rangeStart = new Date('2021-11-15T08:00:00').getTime();
rangeEnd = new Date('2021-11-16T18:00:00').getTime();
if (fromPara === 'ft_discount' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    PRICE['standard'] = standardPrice['75%'];
    PRICE['premium'] = premiumPrice['75%'];
}
*/
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// -- [Parameters -- Promotion]
// #### SP (Special Price) > PROMO ---- [0] - Default | [1] - SP | [2] - SP + Trial
var SP = 0;
//----------
/*
if (fromPara === 'uibe' || fromPara === 'bimba') {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
*/
//----------
// -- Display discounted prices outside the PROMO date range.
/*
// #### 2022 Spring Festival
if (fromPara === '2022cny') {
    PRICE['standard'] = standardPrice['85%'];
    PRICE['premium'] = premiumPrice['85%'];
}
*/
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// -- [Parameters -- Promotion -- Date range]
/*
rangeStart = new Date('2021-11-08T00:00:00').getTime();
rangeEnd = new Date('2021-11-16T24:00:00').getTime();
if (fromPara === 'pbcsf' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 2;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
    PRICE['monthly'] = monthlyPrice['intro'];
}
//----------
rangeStart = new Date('2021-12-20T00:00:00').getTime();
rangeEnd = new Date('2021-12-26T24:00:00').getTime();
if (fromPara === 'pbcsf' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2021-12-22T00:00:00').getTime();
rangeEnd = new Date('2021-12-22T24:00:00').getTime();
if (fromPara === 'tsinghua' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2022-04-11T00:00:00').getTime();
rangeEnd = new Date('2022-04-17T24:00:00').getTime();
if (fromPara === 'alphalink' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
    document.getElementById('header-title').innerHTML = 'AlphaLink 会员专享';
}
//----------
rangeStart = new Date('2022-04-23T00:00:00').getTime();
rangeEnd = new Date('2022-04-29T24:00:00').getTime();
if (fromPara === 'whartonbj' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
    document.getElementById('header-title').innerHTML = '沃顿商学院北京校友会 会员专享';
    document.getElementById('header-title').style.fontSize = '1.1em';
}
//----------
//rangeStart = new Date('2022-05-09T00:00:00').getTime();
//rangeEnd = new Date('2022-05-09T24:00:00').getTime();
rangeStart = new Date('2022-10-12T00:00:00').getTime();
rangeEnd = new Date('2022-10-12T24:00:00').getTime();
if (fromPara === 'bjnhkbuic' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
    document.getElementById("header-title").innerHTML = "联合国际学院专享会员订阅";
    document.getElementById("header-title").style.fontSize = "1.1em";
}
*/
//----------
//rangeStart = new Date('2022-07-01T00:00:00').getTime();
rangeStart = new Date('2022-06-29T00:00:00').getTime();
rangeEnd = new Date('2023-06-30T24:00:00').getTime();
if (fromPara === 'mastercard2022' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['75%'];
    PRICE['premium'] = premiumPrice['75%'];
    document.getElementById("header-title").innerHTML = "FT中文网 × 万事达卡持卡会员专享优惠";
    document.getElementsByClassName("firstStrong")[0].innerText = "万事达卡®持卡会员，独家优惠！";
    document.getElementsByClassName("second")[0].innerHTML = "在这个充满不确定性的时代，信息冗杂，良莠互见，优质高品位的资讯稀缺。 在未来依旧难以清晰可见的时候，及时获取到权威、独立、可信的资讯至关重要！<br>FT中文网，特此为中国区万事达持卡用户提供专属75折年度会员订阅优惠，本活动仅适用于新会员。";
    document.getElementsByClassName("welcome-guide")[0].style.backgroundImage = "url('https://www.ftacademy.cn/subscription_mastercard.png')";
    document.getElementById("monthly").style.display = "none";
    if (document.body.scrollWidth > 980) {
        document.getElementById("standard").style.width = "50%";
        document.getElementById("premium").style.width = "50%";
        document.getElementById("header-title").style.fontSize = "1.5em";
    } else {
        document.getElementById("header-title").style.fontSize = "0.8em";
    }
}
//----------
rangeStart = new Date('2022-12-12T00:00:00').getTime();
rangeEnd = new Date('2023-05-10T24:00:00').getTime();
if ((ccodePara === '2cwbhppretrial2022w1' || ccodePara === '2cwbhppretrial2022w2' || ccodePara === '2cwbhppretrial2022w3') && today.getTime() >= rangeStart && today.getTime() <= rangeEnd) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2023-03-02T00:00:00').getTime();
rangeEnd = new Date('2023-03-25T24:00:00').getTime();
if (fromPara === 'ft_basel' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2023-04-01T00:00:00').getTime();
//rangeStart = new Date('2023-04-07T00:00:00').getTime();
rangeEnd = new Date('2023-04-07T24:00:00').getTime();
if (fromPara === 'ft_salon' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2023-04-01T00:00:00').getTime();
//rangeStart = new Date('2023-04-16T00:00:00').getTime();
rangeEnd = new Date('2023-04-17T24:00:00').getTime();
if (fromPara === 'ft_hsbc_202304' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['monthly'] = monthlyPrice['intro'];
}
//----------
rangeStart = new Date('2023-04-07T00:00:00').getTime();
//rangeStart = new Date('2023-04-17T00:00:00').getTime();
rangeEnd = new Date('2023-04-17T24:00:00').getTime();
if (fromPara === 'ft_hkbu' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
rangeStart = new Date('2023-04-01T00:00:00').getTime();
//rangeStart = new Date('2023-04-20T00:00:00').getTime();
rangeEnd = new Date('2023-04-20T24:00:00').getTime();
if (fromPara === 'ft_intro_20230420' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['monthly'] = monthlyPrice['intro'];
}
//----------
rangeStart = new Date('2023-04-19T00:00:00').getTime();
//rangeStart = new Date('2023-04-29T00:00:00').getTime();
rangeEnd = new Date('2023-05-03T24:00:00').getTime();
if (fromPara === 'ft_dxsz' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//----------
// WTCF -- World Tourism Cities Federation
rangeStart = new Date('2023-04-06T00:00:00').getTime();
//rangeStart = new Date('2023-05-10T00:00:00').getTime();
rangeEnd = new Date('2023-05-10T24:00:00').getTime();
if (fromPara === 'ft_wtcf' && (today.getTime() >= rangeStart && today.getTime() <= rangeEnd)) {
    SP = 1;
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// #### Hide Stripe
if (fromPara === 'alphalink' || fromPara === 'whartonbj' || fromPara === 'bjnhkbuic' || fromPara === 'mastercard2022') {
    document.getElementsByClassName('stripe-mode')[0].style.opacity = 0;
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// -- [Parameters -- Special]
if (ccodePara.indexOf('2023marwinb') >= 0) {
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
/*
if (ccodePara === '2C2021anniversarystage2renewEDM') {
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
// ########## PRICE -- [Cookie] ########## //
let sponsorCookie = GetCookie('sponsor');
if (sponsorCookie === '2554c6451503936545c625666555c63425658397d4449487d444b6d325c62566') {
    PRICE['standard'] = standardPrice['50%'];
    PRICE['premium'] = premiumPrice['50%'];
}
// ########## PRICE -- [Old] ########## //
var switchtTime = new Date('2021-02-18T00:00:00');
if (today.getTime() < switchtTime.getTime()) {
    var PRICE = {'standard': 258, 'premium': 1998, 'monthly': 28};
}
*/

//console.log(PRICE);

// @@@@@@@@@@
// PROMO
// @@@@@@@@@@

// ########## Promo Data ########## //
var promoName, promoDate, promoPrice;
var PROMO = [];
/*
promoName = {'name': 'FuNiuYingChun'};
promoDate = {'start': '2021-02-01T12:00:00', 'end': '2021-02-07T24:00:00'};
promoPrice = {'standard': 218, 'premium': 1698, 'monthly': 28};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': '2021-08-31_Preview'};
promoDate = {'start': '2021-08-09T00:00:00', 'end': '2021-08-22T24:00:00'};
promoPrice = {'standard': standardPrice['75%'], 'premium': premiumPrice['75%'], 'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

// -- Default Page Shows Default Prices -- 2021-08-23 [Alanna]
promoName = {'name': '2021-08-31'};
promoDate = {'start': '2021-08-23T00:00:00', 'end': '2021-09-02T24:00:00'};
promoPrice = {'standard': standardPrice['50%'], 'premium': premiumPrice['50%'], 'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': '2021D11'};
promoDate = {'start': '2021-11-09T00:00:00','end': '2021-11-15T24:00:00'};
promoPrice = {'standard': standardPrice['75%'],'premium': premiumPrice['75%'],'monthly': monthlyPrice['intro']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': 'JinHuHeSui'};
promoDate = {'start': '2022-01-10T00:00:00','end': '2022-01-16T24:00:00'};
promoPrice = {'standard': standardPrice['85%'],'premium': premiumPrice['85%'],'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': ''};
promoDate = {'start': '2022-05-23T00:00:00', 'end': '2022-06-02T24:00:00'};
promoPrice = {'standard': standardPrice['75%'], 'premium': premiumPrice['75%'], 'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': '2022-08-31'};
promoDate = {'start': '2022-08-15T00:00:00', 'end': '2022-09-04T24:00:00'};
promoPrice = {'standard': standardPrice['50%'], 'premium': premiumPrice['50%'], 'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

promoName = {'name': 'Thanksgiving'};
promoDate = {'start': '2022-11-16T00:00:00', 'end': '2022-11-30T24:00:00'};
promoPrice = {'standard': standardPrice['50%'], 'premium': premiumPrice['50%'], 'monthly': monthlyPrice['100%']};
PROMO.push(Object.assign(promoName, promoDate, promoPrice));
*/

promoName = { 'name': 'KaiGongNaJi' };
promoDate = { 'start': '2023-02-06T00:00:00', 'end': '2023-02-19T24:00:00' };
promoPrice = { 'standard': standardPrice['75%'], 'premium': premiumPrice['75%'], 'monthly': monthlyPrice['100%'] };
PROMO.push(Object.assign(promoName, promoDate, promoPrice));

var promoStart = 0;
var promoEnd = 0;
for (var x = 0; x < PROMO.length; x++) {
    promoStart = new Date(PROMO[x]['start']).getTime();
    promoEnd = new Date(PROMO[x]['end']).getTime();
    if (today.getTime() >= promoStart && today.getTime() <= promoEnd && !SP) {
        PRICE = {
            'standard': Math.min(PROMO[x]['standard'], PRICE['standard']),
            'premium': Math.min(PROMO[x]['premium'], PRICE['premium']),
            'monthly': Math.min(PROMO[x]['monthly'], PRICE['monthly'])
        };
        //console.log('['+ PRICE['monthly'] +'][' + PRICE['standard'] + ']['+ PRICE['premium'] +']');
        var Status = 'Promo';
        break;
    } else {
        var Status = 'Default';
    }
}
//console.log(Status);

// ########## Promo Description ########## //
var promoDesc = '';
/*
if (today.getTime() >= promoStart && today.getTime() <= promoEnd) {
    //document.getElementById("benefits_standard").innerHTML = '';
    //document.getElementById("benefits_premium").innerHTML = '';
    //document.getElementsByClassName('firstStrong')[0].innerHTML = '';
    //document.getElementsByClassName('second')[0].innerHTML = '';
    //promoDesc = '（福牛迎春）';
}
*/

// ####################

// -- Web Page Price
let standard_price = document.getElementById('standard_price');
let premium_price = document.getElementById('premium_price');
let standard_monthly_price = document.getElementById('standard_monthly_price');
standard_price.innerHTML = PriceShow(PRICE['standard']) + promoDesc;
premium_price.innerHTML = PriceShow(PRICE['premium']) + promoDesc;
standard_monthly_price.innerHTML = PriceShow(PRICE['monthly']) + promoDesc;

// -- Input Price (Hidden)
document.getElementById('price_standard').value = PriceShow(standardPrice['100%']);
document.getElementById('price_premium').value = PriceShow(premiumPrice['100%']);
document.getElementById('price_standard_monthly').value = PriceShow(monthlyPrice['100%']);

// -- Average Price
var priceAvg = {
    'standard': Math.round((PRICE['standard'] / 365) * 10) / 10,
    'premium': Math.round((PRICE['premium'] / 365) * 10) / 10,
    'monthly': Math.round((monthlyPrice['100%'] / 31) * 10) / 10
};

// ####################

const standardMonthlyType = '月度标准会员';
const standardType = '年度标准会员';
const premiumType = '高端会员';

const introType = '月度标准会员';
const trialType = '新会员试读';

// ########## Web Page Elements ########## //
document.getElementById('benefits_standard').innerHTML = '专享订阅内容每日仅需¥' + priceAvg['standard'] + '元';
document.getElementById('benefits_premium').innerHTML = '专享订阅内容每日仅需¥' + priceAvg['premium'] + '元';

var ticket = document.getElementById("ticket");
if (today.getMonth() >= 8) {
    ticket.innerHTML = ticket.innerHTML.replace("<!--year-->", today.getFullYear() + 1);
} else {
    ticket.innerHTML = ticket.innerHTML.replace("<!--year-->", today.getFullYear());
}

// ElementsType ==-- [0] - Default | [1] - Intro | [2] - Trial
var ElementsType = 0;
if (fromPara === 'ft_intro' || fromPara === 'ft_hsbc_202304' || fromPara === 'ft_intro_20230420') {
    ElementsType = 1;
    document.getElementsByClassName('o-member__benefits')[0].children[1].outerHTML = '<li>精选深度分析</li><li>每日一词</li>';
    document.getElementsByClassName('o-member__benefits')[2].children[1].outerHTML = '<li>精选深度分析</li><li>每日一词</li>';
} else if (fromPara === 'pbcsf' && SP === 2) {
    ElementsType = 2;
} else if (PRICE['monthly'] === 1) {
    ElementsType = 1;
}
monthlyElements(ElementsType);

function monthlyElements(ElementsType = 0) {
    if (ElementsType) {
        document.getElementsByClassName('o-member_standard_monthly')[0].childNodes[1].childNodes[1].innerText = (ElementsType === 1) ? introType : trialType;
        document.getElementById('benefits_standard_monthly').innerHTML = (ElementsType === 1) ? '新会员首月仅¥1元，原价续订¥35元' : '新会员试读仅¥1元，原价续订¥35元';
        document.getElementById('note_standard_monthly').style.display = 'block';
        document.getElementById('note_more_standard_monthly').style.display = 'block';
        document.getElementById('note_more_standard_monthly').innerHTML = '注意事项：<br>1、新会员即未曾购买过FT中文网订阅产品的用户；<br>2、登录后，如发现支付金额与促销金额不符，请确认您的登录账号是否正确或与客服联系；<br>3、本次活动的最终解释权归FT中文网所有。';
    } else {
        document.getElementsByClassName('o-member_standard_monthly')[0].childNodes[1].childNodes[1].innerText = standardMonthlyType;
        document.getElementById('benefits_standard_monthly').innerHTML = '专享订阅内容每日仅需¥' + priceAvg['monthly'] + '元';
        document.getElementById('note_standard_monthly').style.display = 'none';
        document.getElementById('note_more_standard_monthly').style.display = 'none';
        document.getElementById('note_more_standard_monthly').innerHTML = '';
        // -- Default Monthly Price
        standard_monthly_price.innerHTML = PriceShow(monthlyPrice['100%']);
        // -- Default Monthly Payment Box
        if (document.getElementById('payment-page').style.display === 'block') {
            document.getElementsByClassName("payment-type")[0].innerHTML = '<strong id="memberType">' + standardMonthlyType + '</strong>';
            document.getElementById('price').innerText = PriceShow(monthlyPrice['100%']);
        }
    }
}

// -- Cookie - Special Price [B2B] - (Monthly = 1)
// ftcEncrypt('PBCSF') - 550395d35554a444
if (fromPara === 'pbcsf' && SP) {
    SetCookie('SP', '550395d35554a444', 3600, null, null, false);
}
// ftcEncrypt('THU') - 65548665
if (fromPara === 'tsinghua' && SP) {
    SetCookie('SP', '65548665', 3600, null, null, false);
}
// ftcEncrypt('HSBC') - 1577d3d33564e434
if (fromPara === 'ft_hsbc_202304' && SP) {
    SetCookie('SP', '1577d3d33564e434', 3600, null, null, false);
}
// ftcEncrypt('INTRO') - 55b683d335555355
if (fromPara === 'ft_intro_20230420' && SP) {
    SetCookie('SP', '55b683d335555355', 3600, null, null, false);
}

// -- Cookie - Source [Campaign] - (Monthly = 1)
// ftcEncrypt('ft_intro') - 1675530336d683d3a5e62566
if (fromPara === 'ft_intro') {
    SetCookie('source', '1675530336d683d3a5e62566', 3600, null, null, false);
}

// -- Cookie - Campaign Code
if (ccodePara) {
    SetCookie('ccode', ccodePara, 3600, null, null, false);
}

// ####################

// ----- Prices displayed on the website. -- [BEGIN]

/*
// -- Old Price
var switchtTime = new Date('2021-02-18T00:00:00');
if (new Date().getTime() >= switchtTime.getTime()) {
    var monthlyPrice = '¥35/月';
    var standardPrice = '¥298/年';
    var premiumPrice = '¥1998/年';

    var standardPrice['85%'] = '¥258/年';
    var premiumPrice['85%'] = '¥1698/年';
    var standardPrice['75%'] = '¥218/年';
    var premiumPrice['75%'] = '¥1498/年';
    var standardPrice['50%'] = '¥148/年';
    var premiumPrice['50%'] = '¥998/年';
}
*/
// ----- Prices displayed on the website. -- [END]

// ####################

let paymentPage = document.getElementById('payment-page');
const closePayment = function () {
    paymentPage.style.display = 'none';
};
let paymentShadow = document.getElementById('payment-shadow');
if (paymentShadow) {
    EventObject.addHandler(paymentShadow, "click", closePayment);
}

let price = '';
let memberType = '';

function relevantDataInPayment(memberType, price) {
    let memberTypeId = document.getElementById('memberType')
    let priceId = document.getElementById('price');
    memberTypeId.innerHTML = memberType;
    priceId.innerHTML = price;
    //console.log('Payment-Box - ' + memberType + ' - ' + price);
}

function wxPayAction(memberType) {
    var URL;
    if (memberType === standardType) {
        URL = 'https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2';
    } else if (memberType === standardMonthlyType || memberType === introType || memberType === trialType) {
        URL = 'https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2&offerType=monthly';
    } else if (memberType === premiumType) {
        URL = 'https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=2';
    }

    var FROM, CCODE;
    FROM = (fromPara) ? '&from=' + fromPara : '';
    CCODE = (ccodePara) ? '&ccode=' + ccodePara : '';

    var CID, CONTENT;
    CID = (getUrlParams('story')) ? getUrlParams('story') : ((getUrlParams('interactive')) ? getUrlParams('interactive') : '');
    CONTENT = (CID) ? '&content=' + CID : '';

    window.location = URL + FROM + CCODE + CONTENT;
}

var isInApp = (window.location.href.indexOf('webview=ftcapp') >= 0);
var openPayment = function () {
    if (isInApp) {
        //console.log('Let the native app handle click!');
        return true;
    }
    var position = '';
    var attribute = this.getAttribute('id');
    var newAttribute = '';

    // @@@@@@@@@@
    // Get [memberType] and [price] from web page.
    // @@@@@@@@@@
    var memberTypeNode = this.parentNode.parentNode.parentNode.children;
    memberType = memberTypeNode[0].innerText;
    var priceNodes = this.parentNode.parentNode.children;
    price = priceNodes[1].innerText;

    //console.log(memberTypeNode);
    //console.log(priceNodes);
    //console.log('[[[ ' + memberType + '---' + price + ' ]]]');

    // -- Unlimited Renewal -- //
    isStandard = isPremium = false;
    // -- Unlimited Renewal -- //
    if (isPremium) {
        return;
    } else if (isStandard) {
        if (attribute === 'standard-btn') {
            return;
        }
    }

    if (isWeiXin()) {
        wxPayAction(memberType);
    } else {
        //console.log('openPayment - relevantDataInPayment');
        relevantDataInPayment(memberType, price);
        paymentPage.style.display = 'block';
    }

    /*
    // 使支付窗口除于页面正中央
    var winheight = window.innerHeight;
    var paymentBox = document.getElementById('payment-box');
    if (paymentBox) {
        var eleHeight = paymentBox.offsetHeight;
        var top = (winheight - eleHeight) / 2;
        paymentBox.style.top = top + "px";
    }
    */

    if (attribute === 'standard-btn') {
        newAttribute = 'Standard';
        position = 1;
    } else if (attribute === 'standard-monthly-btn') {
        newAttribute = 'StandardMonthly';
        position = 2
    } else if (attribute === 'premium-btn') {
        newAttribute = 'Premium';
        position = 3;
    }

    // ##### TRACK ##### //
    var SELabel = GetCookie('SELabel') || 'Direct';
    var eventAction = 'Buy: ' + newAttribute;

    // Mark: ios付费跟踪
    let cPara = isFromIos();
    if (cPara) {
        if (SELabel.indexOf('/IOSCL/') > -1) {
            let clParaArr = SELabel.split('/IOSCL/');
            gtag('event', eventAction, {
                'event_category': cPara,
                'event_label': clParaArr[1],
                'value': 1,
                'items': [
                    {
                        'item_name': newAttribute,
                        'quantity': 1
                    }
                ]
            });
        }
        //console.log('isFromIos:'+SELabel);
    } else {
        //console.log('isFromWeb');
        gtag('event', eventAction, {
            'event_category': 'Web Privileges',
            'event_label': SELabel,
            'value': 1,
            'item': [
                {
                    'item_name': newAttribute,
                    'quantity': 1
                }
            ],
            'event_callback': function () {
                // 在发送成功后添加其他操作
            }
        });
    }

    onProductClick(newAttribute, position);
};

const openExchange = function () {
    window.open('https://user.chineseft.live/?offerId=992374d8e2e24f17bebc50a6e57becd6&platform=8', '_self');
}

const toPayAction = function () {
    getMemberTypeFromUpdate();

    let payWay = '';
    let pays = document.getElementsByName('pay');
    for (let j = 0; j < pays.length; j++) {
        if (pays[j].checked) {
            payWay = pays[j].value;
        }
    }

    //var newmemberType = (memberType === premiumType) ? 'Premium' : 'Standard';

    //满足2个条件：1.支付方式  2.会员类型
    // if (memberType===premiumType && payWay==='alipay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=1','_self');
    // }else if (memberType===standardType && payWay==='alipay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=1','_self');
    // }else if (memberType===premiumType && payWay==='wxpay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=2','_blank');
    // }else if (memberType===standardType && payWay==='wxpay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2','_blank');
    // }

    var platform;
    var link, target;
    if (payWay === 'alipay') {
        platform = '1';
        target = '_self';
    } else if (payWay === 'wxpay') {
        platform = '2';
        target = '_blank';
    } else if (payWay === 'stripe') {
        platform = '';
        target = '_self';
    }
    memberType = document.getElementById('memberType').innerHTML;
    var offerId = (memberType === premiumType) ? '8d5e7e72f12067991186cdf3cb7d5d9d' : 'eb6d8ae6f20283755b339c0dc273988b';
    var offerType = (memberType === standardMonthlyType || memberType === introType || memberType === trialType) ? '&offerType=monthly' : '';
    var offerFrom = (fromPara) ? '&from=' + fromPara : '';
    var content = (getUrlParams('story') || getUrlParams('interactive')) ? '&content=' + getUrlParams('story') + getUrlParams('interactive') : '';
    console.log(platform);
    if (platform) {
        link = 'https://www.ftacademy.cn/index.php/pay?offerId=' + offerId + '&platform=' + platform + offerType + offerFrom + content;
        //console.log(link);
    } else {
        link = 'https://next.ftacademy.cn/reader/subscription';
    }
    window.open(link, target);

    // ##### TRACK ##### //
    let SELabel = GetCookie('SELabel');
    let eventAction = 'Buy way: ' + payWay;
    let cPara = isFromIos();

    if (cPara) {
        if (SELabel.indexOf('/IOSCL/') > -1) {
            let clParaArr = SELabel.split('/IOSCL/');
            gtag('event', eventAction, {
                'event_category': cPara,
                'event_label': clParaArr[1],
                'value': 1
            });
        }
    } else {
        gtag('event', eventAction, {
            'event_category': 'Web Privileges',
            'event_label': SELabel,
            'value': 1
        });
    }

    memberType = '';
    payWay = '';
};

let toPay = document.getElementById('to-pay');
if (toPay) {
    EventObject.addHandler(toPay, "click", toPayAction);
}

// 打开微信
const openWXCode = function () {
    var paymentBox = document.getElementById('payment-box');
    var wxQR = '<div id="wxQR"></div><div class="wxScan">微信扫码支付</div>';
    paymentBox.innerHTML = wxQR;
};

let headerTitle = document.getElementById('header-title');
let headingHint = document.getElementById('heading-hint');

let premiumBtn = document.getElementById('premium-btn');
let standardBtn = document.getElementById('standard-btn');
let standardMonthlyBtn = document.getElementById('standard-monthly-btn');

let isStandard = false;
let isPremium = false;

function updateUI(dataObj) {
    let fromPara = getUrlParams('from');
    let sponsorCookie = GetCookie('sponsor');

    let standardMonthlyBtnInnerText = '';
    let standardBtnInnerText = '';
    let premiumBtnInnerText = '';

    if ((dataObj.standard === 1 && dataObj.premium === 0)) {
        isStandard = true;
        standardBtnInnerText = '立即续订';
        premiumBtnInnerText = '现在升级';
        standardMonthlyBtnInnerText = '立即续订';
    } else if (dataObj.standard === 1 && dataObj.premium === 1) {
        isPremium = true;
        standardBtnInnerText = '立即续订';
        premiumBtnInnerText = '立即续订';
        standardMonthlyBtnInnerText = '立即续订';
    } else {
        isStandard = false;
        isPremium = false;
        standardBtnInnerText = '立即订阅';
        premiumBtnInnerText = '立即订阅';
        standardMonthlyBtnInnerText = '立即订阅';
    }
    if (fromPara === 'ft_exchange') {
        EventObject.addHandler(standardMonthlyBtn, "click", openExchange);
        EventObject.addHandler(standardBtn, "click", openExchange);
        EventObject.addHandler(premiumBtn, "click", openExchange);
    } else {
        if (fromPara === 'ft_intro' || fromPara === 'ft_hsbc_202304' || fromPara === 'ft_intro_20230420') {
            var standardHTML = document.getElementById('standard').outerHTML;
            var monthlyHTML = document.getElementById('monthly').outerHTML;
            document.getElementsByClassName('o-member-outer')[0].outerHTML = monthlyHTML;
            document.getElementsByClassName('o-member-outer')[2].outerHTML = standardHTML;
            // -- Redefine
            EventObject.addHandler(document.getElementById('standard-monthly-btn'), "click", openPayment);
            EventObject.addHandler(document.getElementById('standard-btn'), "click", openPayment);
        }
        EventObject.addHandler(standardMonthlyBtn, "click", openPayment);
        EventObject.addHandler(standardBtn, "click", openPayment);
        EventObject.addHandler(premiumBtn, "click", openPayment);
    }

    //let upgradePrice = '';

    // @@@@@@@@@@
    // Prices displayed on the web page.
    // @@@@@@@@@@
    // Mark: 不写在dataObj条件下，是因为显示默认价格
    // Mark: dataObj format: {paywall: 1, premium: 0, standard: 0}
    if (fromPara === 'ft_renewal') {
        // Mark: When there's from=ft_renewal in the url
        /*
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            // ##### Standard -> Premium ##### //

            // ---- Upgrade Price [Deprecated]
            //upgradePrice = '¥' + dataObj.v + '/年';
            //premium_price.innerHTML = upgradePrice + promoDesc;
            // -- [75]
            standardPriceShow = standardPrice['75%']; // ##[Renewal][Standard][dataObj]
            premiumPriceShow = premiumPrice['75%']; // ##[Renewal][Premium][dataObj]
        } else {
            // ##### Premium -> Premium ##### //

            // ---- Upgrade Price [Deprecated]
            //upgradePrice = premiumPrice['75%'];
            //premium_price.innerHTML = upgradePrice + promoDesc;
            // -- [75]
            standardPriceShow = standardPrice['75%']; // ##[Renewal][Standard]
            premiumPriceShow = premiumPrice['75%']; // ##[Renewal][Premium]
        }
        */
    } else if (fromPara === 'ft_discount') {
        // Mark: When there's from=ft_discount in the url
        /*
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            // ##### Standard -> Premium ##### //

            // -- [85]
            //standardPriceShow = standardPrice['85%']; // ##[Discount][Standard][dataObj]
            //premiumPriceShow = premiumPrice['85%']; // ##[Discount][Premium][dataObj]
        } else {
            // ##### Premium -> Premium ##### //

            // -- [85]
            //standardPriceShow = standardPrice['85%']; // ##[Discount][standard]
            //premiumPriceShow = premiumPrice['85%']; // ##[Discount][Premium]
        }
        */
    } else if (fromPara === 'ft_win_back' || fromPara === 'ft_big_sale') {
        /*
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            // ##### Standard -> Premium ##### //

            // -- [50]
            //standardPriceShow = standardPrice['50%'];
            //premiumPriceShow = premiumPrice['50%'];
            // -- [85]
            //standardPriceShow = standardPrice['85%']; // ##[Win Back][Standard][dataObj]
            //premiumPriceShow = premiumPrice['85%']; // ##[Win Back][Premium][dataObj]
        } else {
            // ##### Premium -> Premium ##### //

            // -- [50]
            //standardPriceShow = standardPrice['50%']; // ##[Win Back][standard]
            //premiumPriceShow = premiumPrice['50%']; // ##[Win Back][Premium]
            // -- [85]
            //standardPriceShow = standardPrice['85%']; // ##[Win Back][standard]
            //premiumPriceShow = premiumPrice['85%']; // ##[Win Back][Premium]
        }
        */
    } else if (fromPara === 'ft_intro' || fromPara === 'pbcsf' || fromPara === 'ft_hsbc_202304' || fromPara === 'ft_intro_20230420') {
        if (dataObj.standard === 1 || dataObj.premium === 1) {
            // [Member]
            monthlyElements(0);
        } else if (typeof (dataObj.standard) !== 'undefined' || typeof (dataObj.premium) !== 'undefined') {
            // [New User]
            monthlyElements(ElementsType);
        }
    }

    // 点击之后跟其它的行为也不一样
    if (fromPara === 'ft_exchange') {
        standardMonthlyBtnInnerText = '输入兑换码';
        standardBtnInnerText = '输入兑换码';
        premiumBtnInnerText = '输入兑换码';
        document.getElementById('standard_price_origin').style.display = 'none';
        standard_monthly_price.style.display = 'none';
        standard_price.style.display = 'none';
        premium_price.style.display = 'none';
        headingHint.innerHTML = '';
        headerTitle.innerHTML = '兑换中心';
        document.title = '兑换中心 - FT中文网';
        /* Change Elements */
        document.getElementsByClassName('second')[0].innerHTML = '欢迎使用FT中文网付费订阅会员兑换码/卡开通服务，为协助您快速开通权益，请参照兑换码/卡激活与账户绑定流程。';
        document.getElementsByClassName('o-member__title')[0].innerHTML = '兑换流程';
        document.getElementsByClassName('o-member__benefits')[0].innerHTML = '1、点击下方“输入兑换码”按钮；<br>2、根据页面提示，完成用户登录；如您还不是FT中文网注册会员，请先按提示完成注册并登录；<br>3、输入“兑换码”（如使用实体卡，请刮开“兑换码”涂层） ，确认兑换并绑定当前账号；<br>4、兑换成功后，即成功绑定账户；<br>5、请登录FT中文网会员专属网站，或下载App，开始使用订阅会员权益。';
        document.getElementsByClassName('o-member__benefits')[0].style.lineHeight = '2em';
        document.getElementsByClassName('o-member')[0].style.maxWidth = '500px';
        document.getElementsByClassName('o-member-outer')[0].style.width = '100%';
        document.getElementsByClassName('o-member-outer')[1].style.display = 'none';
        document.getElementsByClassName('o-member-outer')[2].style.display = 'none';
    }

    // -- Button Text
    standardMonthlyBtn.innerText = standardMonthlyBtnInnerText;
    standardBtn.innerText = standardBtnInnerText;
    premiumBtn.innerText = premiumBtnInnerText;

    if (isInApp) {
        var buyLinks = document.querySelectorAll('a[data-key]');
        for (var buyLink of buyLinks) {
            var key = buyLink.getAttribute('data-key');
            // Mark: The process of getting the ft_discount is quite convoluted. I can only get the price from its result.
            var priceEle = buyLink.parentNode.querySelector('.data-price');
            var price = '';
            if (priceEle) {
                price = priceEle.innerHTML.replace(/\.00.*$/g, '').replace(/\D/g, '');
            }
            //var ccode = (ccodePara) ? '?ccode=' + ccodePara : '';
            //var link = 'subscribe://' + key + '/' + price + ccode;
            var link = "https://www.ftacademy.cn/subscription.html?price=" + price + (ccodePara ? ("&ccode=" + ccodePara) : "") + "&tap=" + key;
            buyLink.setAttribute('href', link);
        }
    }
}

function OriginPrice() {
    if (document.getElementById('standard_monthly_price_origin').innerText !== document.getElementById('standard_monthly_price').innerText) {
        document.getElementById('standard_monthly_price_origin').innerText = '原价' + document.getElementById('standard_monthly_price_origin').innerText;
        document.getElementById('standard_monthly_price_origin').style.color = '#CCC';
    } else {
        document.getElementById('standard_monthly_price_origin').style.color = 'transparent';
    }
    if (document.getElementById('standard_price_origin').innerText !== document.getElementById('standard_price').innerText) {
        document.getElementById('standard_price_origin').innerText = '原价' + document.getElementById('standard_price_origin').innerText;
        document.getElementById('standard_price_origin').style.color = '#CCC';
    } else {
        document.getElementById('standard_price_origin').style.color = 'transparent';
    }
    if (document.getElementById('premium_price_origin').innerText !== document.getElementById('premium_price').innerText) {
        document.getElementById('premium_price_origin').innerText = '原价' + document.getElementById('premium_price_origin').innerText;
        document.getElementById('premium_price_origin').style.color = '#CCC';
    } else {
        document.getElementById('premium_price_origin').style.color = 'transparent';
    }
}

function PriceShow(p) {
    var price = (isNaN(p)) ? 0 : parseInt(p);
    var result = '¥' + price.toString().replace(/(?!^)(?=(\d{3})+$)/g, ',') + ((price > 50) ? '/年' : '/月');

    return result;
}

let dataObj = {};
if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('127.0') === 0 || window.location.hostname.indexOf('192.168') === 0) {
    dataObj = getData('api/paywall.json');
} else {
    dataObj = postData('/index.php/jsapi/paywall');
}
if (isEmptyObj(dataObj)) {
    updateUI(dataObj);
    fromUpdate();
}

// Mark: 从升级高端会员进入，url中带有tap参数，当购买成功之后跳转来源并附加上参数buy=success
// 第一次打开执行这里，当再次点击的时候，memberType为空
function fromUpdate() {
    let tapPara = getUrlParams('tap') || '';
    let fromPara = getUrlParams('from') || '';
    if (tapPara !== '') {
        var standardMonthlyPriceShow = PriceShow(PRICE['monthly']);
        var standardPriceShow = PriceShow(PRICE['standard']);
        var premiumPriceShow = PriceShow(PRICE['premium']);

        // Tap Pop-up
        if (tapPara === 'standard') {
            // ##[Tap] Standard -- Pop-up [FINAL]
            //console.log('fromUpdate - relevantDataInPayment - standard');
            relevantDataInPayment(standardType, standardPriceShow);
        } else if (tapPara === 'premium') {
            /*
            if (!isEmptyObj(dataObj) && (dataObj.standard === 1 && dataObj.premium === 0)) {
                upgradePrice = upgradePrice; // ##[Tap] [Premium] [Upgrade]
            } else {
                upgradePrice = premiumPrice;
            }
            //relevantDataInPayment(premiumType, upgradePrice);
            */
            // ##[Tap] Premium -- Pop-up [FINAL]
            //console.log('fromUpdate - relevantDataInPayment - premium');
            relevantDataInPayment(premiumType, premiumPriceShow);
        } else if (tapPara === 'monthly') {
            // ##[Tap] Monthly -- Pop-up [FINAL]
            //console.log('fromUpdate - relevantDataInPayment - monthly');
            memberType = (fromPara === 'ft_intro' || fromPara === 'ft_hsbc_202304' || fromPara === 'ft_intro_20230420') ? introType : standardMonthlyType;
            if (fromPara === 'pbcsf' && SP === 2) {
                memberType = trialType;
            }
            relevantDataInPayment(memberType, standardMonthlyPriceShow);
        }
        paymentPage.style.display = 'block';
    }

    // Mark: 如果没有R cookie，则在此页面设置，成功页面获取带有tap的cookie
    let rCookie = GetCookie('R') || '';
    let referrer = document.referrer;

    if (rCookie === '' && referrer && tapPara !== '') {
        const connector = (referrer.indexOf('?') >= 0) ? '&' : '?';
        let newReferrer = referrer + connector + 'tapPara=' + tapPara;
        SetCookie('R', newReferrer, '', null, '.ftacademy.cn', false);
    }
}

if (isEmptyObj(dataObj)) {
    fromUpdate();
}

function getMemberTypeFromUpdate() {
    let tapPara = getUrlParams('tap');
    if (tapPara) {
        if (tapPara === 'standard') {
            memberType = standardType;
        } else if (tapPara === 'premium') {
            memberType = premiumType;
        } else if (tapPara === 'monthly') {
            memberType = standardMonthlyType;
        }
    }
}

window.onunload = function () {
    DeleteCookie('U');
    DeleteCookie('E');
    DeleteCookie('R');
};
// ##################################################

// --------------------------------------------------
// TRACK
// --------------------------------------------------


function hasUtmCampaign() {
    if (window.location.search.indexOf('utm_campaign') >= 0) {

        var campaign = '';
        var paraArr = parseUrlSearch();
        if (paraArr && paraArr.length > 0) {
            for (let j = 0; j < paraArr.length; j++) {
                if (paraArr[j].indexOf('utm_campaign') >= 0) {
                    var arr = paraArr[j].split('=');
                    campaign = arr[1];
                    SetCookie('ccode', campaign, 86400, null, null, false);
                    // document.cookie = 'campaign_code = ' + campaign;
                }

            }
        }
    }
}
hasUtmCampaign();

function isFromIos() {
    let c = getUrlParams('c');
    if (!!c) {
        return c;
    } else {
        return undefined;
    }
}

function elabelToIos() {
    let lPara = getUrlParams('l');
    let elabel = '';
    if (lPara) {
        elabel = lPara;
    } else {
        elabel = 'no l value';
    }
    return elabel;
}

function hasLpara() {
    let l = getUrlParams('l');
    if (!!l) {
        return true;
    } else {
        return false;
    }
}

/**
 * // Mark: ios track section
 * cPara:判断来自ios设备
 * lPara:跟踪来源信息
 * 既在ios设备上打开，又在网页上打开，会出现2个cookie，怎么区分？
 * 当关闭时，重新进入，所以可以让cookie关闭浏览器即失效
 * 出现现象：当出现.ftacademy.cn  和 www.ftacademy.cn时，会读取www.ftacademy.cn的值。当直接在前端js文件中设置cookie，domian是包含www(子域)
 *
 * 发现，在php和js文件设置cookie，默认expire时间不一样
 *
 * 如果没有l，也设置SetCookie
 *
 * 支付成功，用什么来判断是否来自于ios
 */

function iosTrack() {
    let cPara = isFromIos();
    let lPara = getUrlParams('l');

    if (cPara) {

        let elabel = '';
        let eLabelCookie = cPara + '/IOSCL/';
        if (lPara) {
            eLabelCookie += lPara;
            elabel = lPara;
        } else {
            eLabelCookie += 'no l value';
            elabel = 'no l value';
        }
        SetCookie('SELabel', eLabelCookie, 86400, null, '.ftacademy.cn', false);
        gtag('event', 'Display', {
            'event_category': cPara,
            'event_label': elabel,
            'value': 1,
        });
    }
}
iosTrack();

// Mark: url参数中带有ccode和utm_code，设置cookie，因为这是从活动中直接链接过来的，所以在此页面设置来源。暂时不使用document.referrer
function ccodeTrack() {
    let ccode = getUrlParams('ccode') || getUrlParams('utm_code') || getUrlParams('utm_campaign') || getUrlParams('campaign_code');
    if (ccode) {
        var fromUrl = 'From:' + ccode;
        SetCookie('SELabel', fromUrl, 86400, null, '.ftacademy.cn', false);
        gtag('event', 'Tap', {
            'event_category': 'Web Privileges',
            'event_label': fromUrl,
            'value': 1,
            'non_interaction': true,
        });
    }
}
ccodeTrack();

const setCookieVal = () => {
    // Mark: check ccode
    var para = location.search.substring(1);
    var pattern = /ccode/g;
    if (pattern.test(para)) {
        var ccodeValue = getUrlParams('ccode');
        var SELabel = SetCookie('ccode', ccodeValue, '', null, '.ftacademy.cn', false);
    }
    if (/utm_code/g.test(para)) {
        var utmccodeValue = getUrlParams('utm_code');
        var SELabel = SetCookie('ccode', utmccodeValue, '', null, '.ftacademy.cn', false);
    }
};
setCookieVal();

/**
 * Mark: 加强版电子商务跟踪
 */
const trackEC = () => {
    let SELabel = GetCookie('SELabel') || 'Other';
    productImpression();
}
trackEC();

gtag('get', 'G-CGZ5MQE66Z', function (tracker) {
    var clientId = tracker['client_id'];
});

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
// UNKNOWN
// --------------------------------------------------

/*
function isMobile() {
    let deviceType = getDeviceType();
    if (deviceType == 'PC') {
        return false;
    } else {
        return true;
    }
}
*/