/*jshint esversion: 6 */
/*esversion: 6 */
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

var firstGuide = document.querySelector('.firstStrong');
var attention = document.querySelector('.attention');
var secondGuide = document.querySelector('.second');
var showImage = document.querySelector('.show-image');
var words = document.querySelector('.words');

const standardMonthType = '月度标准会员';
const standardType = '年度标准会员';
const premiumType = '高端会员';

let dataObj = {};
let isStandard = false;
let isPremium = false;

// ----- Prices displayed on the website.
//let upgradePrice = '';

var standardMonthlyPriceValue = []
standardMonthlyPriceValue['100%'] = '¥35/月';

var standardPriceValue = [];
standardPriceValue['100%'] = '¥298/年';
standardPriceValue['85%'] = '¥258/年';
standardPriceValue['75%'] = '¥218/年';
standardPriceValue['50%'] = '¥148/年';

var premiumPriceValue = [];
premiumPriceValue['100%'] = '¥1,998/年';
premiumPriceValue['85%'] = '¥1,698/年';
premiumPriceValue['75%'] = '¥1,498/年';
premiumPriceValue['50%'] = '¥998/年';

var policy;

// -- Different parameters use different pricing policies.
if (getUrlParams('from') === 'ft_win_back') {
    policy = '50%';
} else if (getUrlParams('from') === 'ft_renewal') {
    policy = '75%';
} else if (getUrlParams('from') === 'ft_discount') {
    policy = '85%';
} else if (getUrlParams('from') === 'uibe' || getUrlParams('from') === 'bimba') {
    policy = '50%';
} else if (getUrlParams('ccode') === '2C2021anniversarystage2renewEDM') {
    policy = '50%';
} else {
    policy = '100%';
}
// -- Different cookies use different pricing policies.
if (GetCookie('sponsor') === '2554c6451503936545c625666555c63425658397d4449487d444b6d325c62566') {
    policy = '50%';
}

console.log(policy);

var pricePolicy = {
    'standard': standardPriceValue[policy],
    'premium': premiumPriceValue[policy],
    'monthly': standardMonthlyPriceValue['100%'],
};

/*
// -- Old Price
var switchtTime = new Date('2021/02/18 00:00:00');
if (new Date().getTime() >= switchtTime.getTime()) {
    var standardMonthlyPriceValue = '¥35/月';
    var standardPriceValue = '¥298/年';
    var premiumPriceValue = '¥1998/年';

    var standardPriceValue['85%'] = '¥258/年';
    var premiumPriceValue['85%'] = '¥1698/年';
    var standardPriceValue['75%'] = '¥218/年';
    var premiumPriceValue['75%'] = '¥1498/年';
    var standardPriceValue['50%'] = '¥148/年';
    var premiumPriceValue['50%'] = '¥998/年';
}
*/
// ----- Prices displayed on the website.

// ----- Promo Policy
if (typeof(promo) !== 'undefined' && typeof(today) !== 'undefined') {
    for (i = 0; i < promo.length; i++) {
        SD = new Date(promo[i]['start']);
        ED = new Date(promo[i]['end']);
        //console.log("[" + today.toString() + "][" + i + "][From Promo]");
        //console.log("[" + SD.toString() + "][" + ED.toString() + "]");
        if (today.getTime() >= SD.getTime() && today.getTime() <= ED.getTime()) {
            pricePolicy = {
                'standard': '¥' + promo[i]['standard'] + '/年',
                'premium': '¥' + promo[i]['premium'] + '/年',
                'monthly': '¥' + promo[i]['monthly'] + '/月',
            };
            //console.log('[' + pricePolicy['standard'] + ']['+ pricePolicy['premium'] +']');
            //console.log('Promo');
            break;
        } else {
            //console.log('Default');
        }
    }
} else {
    // @@@@@@@@@@
    // -- Set Promo -- [subscription.html]
    // -- Set Policy -- [main.js]
    // @@@@@@@@@@
    var now = new Date();
    var policy = [{
            "SD": "2021/02/01 12:00:00",
            "ED": "2021/02/07 23:59:59",
            "SP": "85%",
            "PP": "85%",
            "MP": "100%",
        },
        {
            "SD": "2021/08/09 00:00:00",
            "ED": "2021/08/22 23:59:59",
            "SP": "75%",
            "PP": "75%",
            "MP": "100%",
        },
        // -- Default Page Shows Default Prices -- 2021-08-23 [Alanna]
        /*
        {
            "SD": "2021/08/23 00:00:00",
            "ED": "2021/09/02 23:59:59",
            "SP": "50%",
            "PP": "50%",
            "MP": "100%",
        },
        */
    ];
    for (i = 0; i < policy.length; i++) {
        var SD = new Date(policy[i]["SD"]);
        var ED = new Date(policy[i]["ED"]);
        var standardPolicy = policy[i]["SP"];
        var premiumPolicy = policy[i]["PP"];
        var standardMonthlyPolicy = policy[i]["MP"];
        //console.log("[" + now.toString() + "][" + i + "][From Policy]");
        //console.log("[" + SD.toString() + "][" + ED.toString() + "]);
        if (now.getTime() >= SD.getTime() && now.getTime() <= ED.getTime()) {
            pricePolicy = {
                'standard': standardPriceValue[standardPolicy],
                'premium': premiumPriceValue[premiumPolicy],
                'monthly': standardMonthlyPriceValue[standardMonthlyPolicy],
            };
            //console.log('[' + pricePolicy['standard'] + ']['+ pricePolicy['premium'] +']');
            //console.log('Promo');
            break;
        } else {
            //console.log('Default');
        }
    }
}
// ----- Promo Policy

var isInApp = (window.location.href.indexOf('webview=ftcapp') >= 0);

const setCookieVal = () => {
    // Mark:check ccode
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



let toPay = document.getElementById('to-pay');
let paymentShadow = document.getElementById('payment-shadow');
let paymentPage = document.getElementById('payment-page');
let price = '';
let memberType = '';

const closePayment = function(event) {
    paymentPage.style.display = 'none';
};

if (paymentShadow) {
    EventObject.addHandler(paymentShadow, "click", closePayment);
}

function relevantDataInPayment(memberType, price) {
    let memberTypeId = document.getElementById('memberType');
    let priceId = document.getElementById('price');
    memberTypeId.innerHTML = memberType;
    priceId.innerHTML = price;
    console.log('Payment-Box - ' + price);
}

function selectPayWay(memberType) {
    // offerType == 'monthly';
    // console.log (memberType);
    // return;
    if (memberType === standardType) {
        window.location = 'https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2';
    } else if (memberType === standardMonthType) {
        window.location = 'https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2&offerType=monthly';
    } else if (memberType === premiumType) {
        window.location = 'https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=2';
    }
}

var openPayment = function(event) {
    if (isInApp) {
        console.log('Let the native app handle click!');
        return true;
    }
    var position = '';
    var attribute = this.getAttribute('id');
    var childNodes = this.parentNode.parentNode.children;
    price = childNodes[2].value;
    var parentsNode = this.parentNode.parentNode.parentNode.children;
    memberType = parentsNode[0].innerHTML;
    var newAttribute = '';

    // -- Unlimited Renewal -- //
    isStandard = isPremium = false;
    // -- Unlimited Renewal -- //
    if (isPremium) {
        return;
    } else if (isStandard) {
        if (attribute === 'standard-btn') {
            return;
        }
        //price = upgradePrice;
    }

    let fPara = getUrlParams('from');
    let sponsorCookie = GetCookie('sponsor');
    // ----- PriceParameters ----- //
    let PriceParameters = false;
    if (fPara === 'ft_discount' || fPara === 'ft_renewal' || fPara === 'ft_win_back') {
        PriceParameters = true;
    } else if (fPara === 'ft_big_sale' || fPara === 'uibe' || fPara === 'bimba') {
        PriceParameters = true;
    } else if (getUrlParams('ccode') === '2C2021anniversarystage2renewEDM') {
        PriceParameters = true;
    } else if (sponsorCookie) {
        PriceParameters = true;
    }
    // ----- PriceParameters ----- //
    if (PriceParameters) {
        // ----- Price of pop-up window after clicking button. [With Parameters]
        // Button Pop-up [With Parameters] [FINAL]
        if (attribute === 'standard-btn') {
            price = pricePolicy['standard']; // ##[Button] [Standard] [With Parameters]
        } else if (attribute === 'premium-btn') {
            //price = upgradePrice;
            price = pricePolicy['premium']; // ##[Button] [Premium] [With Parameters]
        } else if (attribute === 'standard-btn-monthly') {
            price = pricePolicy['monthly']; // ##[Button] [Standard Monthly] [With Parameters]
        }
    } else {
        // ----- Price of pop-up window after clicking button. [No Parameters]
        // Button Pop-up [No Parameters] [FINAL]
        if (attribute === 'standard-btn') {
            if (today.getTime() >= SD.getTime() && today.getTime() <= ED.getTime()) {
                //console.log('[Button] [Standard] [No Parameters] [Time Limit]');
                price = pricePolicy['standard']; // ##[Button] [Standard] [No Parameters] [Time Limit]
            } else {
                price = pricePolicy['standard']; // ##[Button] [Standard] [No Parameters]
            }
        } else if (attribute === 'premium-btn') {
            if (today.getTime() >= SD.getTime() && today.getTime() <= ED.getTime()) {
                //console.log('[Button] [Premium] [No Parameters] [Time Limit]');
                price = pricePolicy['premium']; // ##[Button] [Premium] [No Parameters] [Time Limit]
            } else {
                price = pricePolicy['premium']; // ##[Button] [Premium] [No Parameters]
            }
        } else if (attribute === 'standard-btn-monthly') {
            price = pricePolicy['monthly']; // ##[Button] [Standard Monthly] [No Parameters]
        }
    }

    if (isWeiXin()) {
        selectPayWay(memberType);
    } else {
        relevantDataInPayment(memberType, price);
        paymentPage.style.display = 'block';
    }

    // 使支付窗口除于页面正中央
    var winheight = window.innerHeight;
    var paymentBox = document.getElementById('payment-box');
    if (paymentBox) {
        var eleHeight = paymentBox.offsetHeight;
        var top = (winheight - eleHeight) / 2;
        paymentBox.style.top = top + "px";
    }

    if (attribute === 'standard-btn') {
        newAttribute = 'Standard';
        position = 1;
    } else if (attribute === 'standard-btn-monthly') {
        newAttribute = 'StandardMonthly';
        position = 2
    } else if (attribute === 'premium-btn') {
        newAttribute = 'Premium';
        position = 3;
    }

    var SELabel = GetCookie('SELabel') || 'Direct';
    var eventAction = 'Buy: ' + newAttribute;

    // Mark:ios付费跟踪
    let cPara = isFromIos();
    if (cPara) {
        if (SELabel.indexOf('/IOSCL/') > -1) {
            let clParaArr = SELabel.split('/IOSCL/');
            ga('send', 'event', cPara, eventAction, clParaArr[1]);
        }
        // console.log('isFromIos:'+SELabel);
    } else {
        // console.log('isFromWeb');
        ga('send', 'event', 'Web Privileges', eventAction, SELabel);
    }

    onProductClick(newAttribute, position);
};

const openExchange = function(event) {
    window.open('https://user.chineseft.com/?offerId=992374d8e2e24f17bebc50a6e57becd6&platform=8', '_self');
}

function isMobile() {
    let deviceType = getDeviceType();
    if (deviceType == 'PC') {
        return false;
    } else {
        return true;
    }
}

let payWay = '';
let pays = document.getElementsByName('pay');

const toPayAction = function(event) {
    getMemberTypeFromUpdate();


    for (let j = 0; j < pays.length; j++) {
        if (pays[j].checked) {
            payWay = pays[j].value;
        }
    }


    //var newmemberType = (memberType === premiumType) ? 'Premium' : 'Standard';


    //满足2个条件：1.支付方式  2.会员类型
    // if (memberType===premiumType && payWay==='ali') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=1','_self');
    // }else if (memberType===standardType && payWay==='ali') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=1','_self');
    // }else if (memberType===premiumType && payWay==='wxpay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=8d5e7e72f12067991186cdf3cb7d5d9d&platform=2','_blank');
    // }else if (memberType===standardType && payWay==='wxpay') {
    //     window.open('https://www.ftacademy.cn/index.php/pay?offerId=eb6d8ae6f20283755b339c0dc273988b&platform=2','_blank');
    // }

    var payWayNumber;
    var payWayOpen;
    if (payWay === 'ali') {
        payWayNumber = '1';
        payWayOpen = '_self';
    } else if (payWay === 'wxpay') {
        payWayNumber = '2';
        payWayOpen = '_blank';
    }
    memberType = document.getElementById('memberType').innerHTML;
    var offerId = (memberType === premiumType) ? '8d5e7e72f12067991186cdf3cb7d5d9d' : 'eb6d8ae6f20283755b339c0dc273988b';
    var offerType = (memberType === standardMonthType) ? '&offerType=monthly' : '';
    if (payWayNumber) {
        const link = 'https://www.ftacademy.cn/index.php/pay?offerId=' + offerId + '&platform=' + payWayNumber + offerType;
        //console.log(link);
        window.open(link, payWayOpen);
    }
    let SELabel = GetCookie('SELabel');
    let eventAction = 'Buy way: ' + payWay;
    let cPara = isFromIos();

    if (cPara) {
        if (SELabel.indexOf('/IOSCL/') > -1) {
            let clParaArr = SELabel.split('/IOSCL/');
            ga('send', 'event', cPara, eventAction, clParaArr[1]);
        }
    } else {
        ga('send', 'event', 'Web Privileges', eventAction, SELabel);
    }

    memberType = '';
    payWay = '';

};

if (toPay) {
    EventObject.addHandler(toPay, "click", toPayAction);
}

// 打开微信
const openWXCode = function() {
    var paymentBox = document.getElementById('payment-box');
    var wxImg = '<div id="wxImg"></div><div class="wxScanHint">微信扫码支付</div>';
    paymentBox.innerHTML = wxImg;
};

let isReqSuccess = false;
let i = 0;
const postUE = (url) => {
    if (!isReqSuccess && i < 3) {
        let cookieVal = {
            uCookieVal: GetCookie('U'),
            eCookieVal: GetCookie('E')
        };
        let xhrpw = new XMLHttpRequest();
        xhrpw.open('post', url);
        xhrpw.onload = function() {
            if (xhrpw.status == 200) {
                var data = xhrpw.responseText;
                dataObj = JSON.parse(data);
                isReqSuccess = true;
                updateUI(dataObj);
                fromUpdate();
            } else {
                isReqSuccess = false;
                i++;
                setTimeout(function() {
                    postUE();
                }, 500);
            }
        };
        xhrpw.send(JSON.stringify(cookieVal));
    }

};

let headerTitle = document.getElementById('header-title');
let headingHint = document.getElementById('heading-hint');

let premiumBtn = document.getElementById('premium-btn');
let standardBtn = document.getElementById('standard-btn');
let standardBtnMonthly = document.getElementById('standard-btn-monthly');

let premiumPrice = document.getElementById('premium_price');
let standardPrice = document.getElementById('standard_price');
let standardPriceMonthly = document.getElementById('standard_price_monthly');

function updateUI(dataObj) {
    let fPara = getUrlParams('from');
    let sponsorCookie = GetCookie('sponsor');

    let standardBtnMonthlyInnerText = '';
    let standardBtnInnerText = '';
    let premiumBtnInnerText = '';
    /*
    let standardPriceMonthlyInnerText = '';
    let standardPriceInnerText = '';
    let premiumPriceInnerText = '';
    */

    /*
    console.log('>>>>>');
    console.log(standardMonthlyPriceValue);
    console.log(standardPriceValue);
    console.log(premiumPriceValue);
    console.log('>>>>>');
    */
    var standardMonthlyPriceShow = standardMonthlyPriceValue['100%'];
    var standardPriceShow = standardPriceValue['100%'];
    var premiumPriceShow = premiumPriceValue['100%'];
    /*
    console.log('>>>>>');
    console.log(standardMonthlyPriceShow);
    console.log(standardPriceShow);
    console.log(premiumPriceShow);
    console.log('>>>>>');
    */

    if ((dataObj.standard === 1 && dataObj.premium === 0)) {
        isStandard = true;
        standardBtnMonthlyInnerText = '已订阅';
        standardBtnInnerText = '已订阅';
        premiumBtnInnerText = '现在升级';
        /*
        if (fPara === 'ft_exchange') {
            EventObject.addHandler(standardBtnMonthly, "click", openExchange);
            EventObject.addHandler(standardBtn, "click", openExchange);
            EventObject.addHandler(premiumBtn, "click", openExchange);
        } else {
            EventObject.addHandler(premiumBtn, "click", openPayment);
        }
        */
    } else if (dataObj.standard === 1 && dataObj.premium === 1) {
        isPremium = true;
        standardBtnMonthlyInnerText = '已订阅';
        standardBtnInnerText = '已订阅';
        premiumBtnInnerText = '已订阅';
    } else {
        isStandard = false;
        isPremium = false;
        standardBtnMonthlyInnerText = '立即订阅';
        standardBtnInnerText = '立即订阅';
        premiumBtnInnerText = '立即订阅';
        /*
        if (fPara === 'ft_exchange') {
            EventObject.addHandler(standardBtnMonthly, "click", openExchange);
            EventObject.addHandler(standardBtn, "click", openExchange);
            EventObject.addHandler(premiumBtn, "click", openExchange);
        } else {
            EventObject.addHandler(standardBtnMonthly, "click", openPayment);
            EventObject.addHandler(standardBtn, "click", openPayment);
            EventObject.addHandler(premiumBtn, "click", openPayment);
        }
        */
    }
    if (fPara === 'ft_exchange') {
        EventObject.addHandler(standardBtnMonthly, "click", openExchange);
        EventObject.addHandler(standardBtn, "click", openExchange);
        EventObject.addHandler(premiumBtn, "click", openExchange);
    } else {
        EventObject.addHandler(standardBtnMonthly, "click", openPayment);
        EventObject.addHandler(standardBtn, "click", openPayment);
        EventObject.addHandler(premiumBtn, "click", openPayment);
    }

    // Mark:不写在dataObj条件下，是因为显示默认价格
    // MARK: dataObj format: {paywall: 1, premium: 0, standard: 0}
    if (typeof(PriceDesc) == 'undefined'){
        PriceDesc = '';
    }
    if (fPara === 'ft_renewal') {
        // MARK: When there's from=ft_renewal in the url
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            //console.log('-----[1]' + standardPriceValue + '-----');
            //console.log('-----[1]' + premiumPriceValue + '-----');
            //upgradePrice = '¥' + dataObj.v + '/年';
            //premiumPrice.innerHTML = upgradePrice + PriceDesc;
            // -- [75]
            standardPriceShow = standardPriceValue['75%']; // ##[Renewal][Standard][dataObj]
            premiumPriceShow = premiumPriceValue['75%'];
        } else {
            //console.log('-----[2]' + standardPriceValue + '-----');
            //console.log('-----[2]' + premiumPriceValue + '-----');
            //upgradePrice = premiumPriceValue['75%'];
            //premiumPrice.innerHTML = upgradePrice + PriceDesc;
            // -- [75]
            standardPriceShow = standardPriceValue['75%']; // ##[Renewal][Standard]
            premiumPriceShow = premiumPriceValue['75%']; // ##[Renewal][Premium]
        }
        standardPrice.innerHTML = standardPriceShow + PriceDesc;
        premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
    } else if (fPara === 'ft_discount') {
        // MARK: When there's from=ft_discount in the url
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            //upgradePrice = '¥' + dataObj.v + '/年';
            // -- [85]
            premiumPriceShow = premiumPriceValue['85%']; // ##[Discount][Premium][dataObj]
            standardPriceShow = standardPriceValue['85%']; // ##[Discount][Standard][dataObj]
        } else {
            //upgradePrice = premiumPriceValue['85%'];
            // -- [85]
            premiumPriceShow = premiumPriceValue['85%']; // ##[Discount][Premium] -> Webpage [FINAL]
            standardPriceShow = standardPriceValue['85%']; // ##[Discount][standard] -> Webpage [FINAL] || -> Button Pop-up
        }
        standardPrice.innerHTML = standardPriceShow + PriceDesc;
        premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
    } else if (fPara === 'ft_win_back' || fPara === 'ft_big_sale' || fPara === 'uibe'  || fPara === 'bimba' || getUrlParams('ccode') === '2C2021anniversarystage2renewEDM' || sponsorCookie == '2554c6451503936545c625666555c63425658397d4449487d444b6d325c62566' || sponsorCookie == '2554c6451503936545c6256615b6c6e415b66466d4a61497d445145325c62566') {
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            //upgradePrice = '¥' + dataObj.v + '/年';
            // -- [50]
            standardPriceShow = standardPriceValue['50%'];
            premiumPriceShow = premiumPriceValue['50%'];
            // -- [85]
            //standardPriceShow = standardPriceValue['85%']; // ##[Win Back][Standard][dataObj]
        } else {
            // -- [50]
            //upgradePrice = premiumPriceValue['50%'];
            //premiumPrice.innerHTML = upgradePrice + PriceDesc;
            premiumPriceShow = premiumPriceValue['50%']; // ##[Win Back][Premium]
            standardPriceShow = standardPriceValue['50%']; // ##[Win Back][standard]
            // -- [85]
            //upgradePrice = premiumPriceValue['85%'];
            //premiumPrice.innerHTML = upgradePrice + PriceDesc;
            //premiumPriceShow = premiumPriceValue['85%']; // ##[Win Back][Premium]
            //standardPriceShow = standardPriceValue['85%']; // ##[Win Back][standard]
        }
        standardPrice.innerHTML = standardPriceShow + PriceDesc;
        premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
    } else if (typeof(SD) !== 'undefined' && typeof(ED) !== 'undefined' && today.getTime() >= SD.getTime() && today.getTime() <= ED.getTime()) {
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            //upgradePrice = '¥' + dataObj.v + '/年';
            premiumPriceShow = pricePolicy['premium']; // ##[Time Limit][Premium][dataObj]
            standardPriceShow = pricePolicy['standard']; // ##[Time Limit][Standard][dataObj]
        } else {
            //upgradePrice = premiumPriceValue['50%'];
            //standardPriceShow = standardPriceValue['50%'];
            premiumPriceShow = pricePolicy['premium']; // ##[Time Limit][Premium][!dataObj]
            standardPriceShow = pricePolicy['standard']; // ##[Time Limit][Standard][!dataObj]
        }
        standardPrice.innerHTML = standardPriceShow + PriceDesc;
        premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
        //premiumPrice.innerHTML = upgradePrice + PriceDesc;
    } else {
        if ((dataObj.standard === 1 && dataObj.premium === 0)) {
            //upgradePrice = '¥' + dataObj.v + '/年';
            //premiumPrice.innerHTML = upgradePrice + PriceDesc;
            standardPrice.innerHTML = standardPriceShow + PriceDesc;
            premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
        } else {
            standardPrice.innerHTML = standardPriceShow + PriceDesc;
            premiumPrice.innerHTML = premiumPriceShow + PriceDesc;
        }
    }
    standardPriceMonthly.innerHTML = standardMonthlyPriceShow;

    // 点击之后跟其它的行为也不一样
    if (fPara === 'ft_exchange') {
        standardBtnMonthlyInnerText = '输入兑换码';
        standardBtnInnerText = '输入兑换码';
        premiumBtnInnerText = '输入兑换码';
        standardPriceMonthly.style.display = 'none';
        standardPrice.style.display = 'none';
        premiumPrice.style.display = 'none';
        headingHint.innerHTML = '';
        headerTitle.innerHTML = '兑换中心';
        document.title = '兑换中心 - FT中文网';
        /* Change Elements */
        document.getElementsByClassName('second')[0].innerHTML = '欢迎使用FT中文网付费订阅会员兑换码/卡开通服务，为协助您快速开通权益，请参照兑换码/卡激活与账户绑定流程。';
        document.getElementsByClassName('o-member__title')[0].innerHTML = '兑换流程';
        document.getElementsByClassName('o-member__benefits')[0].innerHTML = '1. 点击下方“输入兑换码”按钮；<br>2. 根据页面提示，完成用户登录；如您还不是FT中文网注册会员，请先按提示完成注册并登录；<br>3. 输入“兑换码”（如使用实体卡，请刮开“兑换码”涂层） ，确认兑换并绑定当前账号；<br>4. 兑换成功后，即成功绑定账户；<br>5. 请登录FT中文网会员专属网站，或下载App，开始使用订阅会员权益。';
        document.getElementsByClassName('o-member__benefits')[0].style.lineHeight = '2em';
        document.getElementsByClassName('o-member')[0].style.maxWidth = '500px';
        document.getElementsByClassName('o-member-outer')[0].style.width = '100%';
        document.getElementsByClassName('o-member-outer')[1].style.display = 'none';
        document.getElementsByClassName('o-member-outer')[2].style.display = 'none';
    }

    standardBtnMonthly.innerText = standardBtnMonthlyInnerText;
    standardBtn.innerText = standardBtnInnerText;
    premiumBtn.innerText = premiumBtnInnerText;

    if (isInApp) {
        var buyLinks = document.querySelectorAll('a[data-key]');
        var ccodeValue = getUrlParams('ccode');
        for (var buyLink of buyLinks) {
            var key = buyLink.getAttribute('data-key');
            // MARK: The process of getting the ft_discount is quite convoluted. I can only get the price from its result.
            var priceEle = buyLink.parentNode.querySelector('.data-price');
            var price = '';
            if (priceEle) {
                price = priceEle.innerHTML.replace(/\.00.*$/g, '').replace(/\D/g, '');
            }
            var ccodePara = '';
            if (ccodeValue && ccodeValue !== '') {
                ccodePara = '?ccode=' + ccodeValue;
            }
            var link = 'subscribe://' + key + '/' + price + ccodePara;
            buyLink.setAttribute('href', link);
        }
    }
}

window.onunload = function closeWindow() {
    DeleteCookie('U');
    DeleteCookie('E');
    DeleteCookie('R');
};

if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('192.168') === 0 || window.location.hostname.indexOf('10.113') === 0 || window.location.hostname.indexOf('127.0') === 0) {
    var xhrpw1 = new XMLHttpRequest();
    xhrpw1.open('get', 'api/paywall.json');
    xhrpw1.onload = function() {
        if (xhrpw1.status == 200) {
            var data = xhrpw1.responseText;
            dataObj = JSON.parse(data);
            updateUI(dataObj);
            fromUpdate();
        }
    };
    xhrpw1.send(null);
    if (isEmptyObj(dataObj)) {
        updateUI(dataObj);
    }
} else {
    postUE('/index.php/jsapi/paywall');
    if (isEmptyObj(dataObj)) {
        updateUI(dataObj);
    }
}

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
        ga('send', 'event', cPara, 'Display', elabel);
    }
}
iosTrack();

// Mark:url参数中带有ccode和utm_code，设置cookie，因为这是从活动中直接链接过来的，所以在此页面设置来源。暂时不使用document.referrer
function ccodeTrack() {
    let ccodePara = getUrlParams('ccode') || getUrlParams('utm_code') || getUrlParams('utm_campaign') || getUrlParams('campaign_code');
    if (ccodePara) {
        var fromUrl = 'From:' + ccodePara;
        SetCookie('SELabel', fromUrl, 86400, null, '.ftacademy.cn', false);
        ga('send', 'event', 'Web Privileges', 'Tap', fromUrl, {
            'nonInteraction': 1
        });
    }
}

ccodeTrack();

// Mark：从升级高端会员进入，url中带有tap参数，当购买成功之后跳转来源并附加上参数buy=success
// 第一次打开执行这里，当再次点击的时候，memberType为空
function fromUpdate() {
    //var today = new Date();
    var StartDate = new Date('2020/11/09 12:00:00');
    var EndDate = new Date('2020/11/11 23:59:59');

    let tapPara = getUrlParams('tap') || '';
    let fPara = getUrlParams('from') || '';
    if (tapPara !== '') {
        /*
        console.log('>>>>>');
        console.log(standardMonthlyPriceValue);
        console.log(standardPriceValue);
        console.log(premiumPriceValue);
        console.log('>>>>>');
        */
        //var standardMonthlyPriceShow = standardMonthlyPriceValue['100%'];
        var standardPriceShow = standardPriceValue['100%'];
        var premiumPriceShow = premiumPriceValue['100%'];
        /*
        console.log('>>>>>');
        console.log(standardMonthlyPriceShow);
        console.log(standardPriceShow);
        console.log(premiumPriceShow);
        console.log('>>>>>');
        */
        // Tap Pop-up
        console.log(pricePolicy);
        console.log(tapPara);
        if (tapPara === 'standard') {
            if (fPara === 'ft_win_back' || fPara === 'ft_big_sale' || fPara === 'uibe' || fPara === 'bimba') {
                standardPriceShow = standardPriceValue['50%'];
                //standardPriceShow = standardPriceValue['85%']; // ##[Tap] [Standard] [Win Back]
            } else if (fPara === 'ft_renewal') {
                standardPriceShow = standardPriceValue['75%']; // ##[Tap] [Standard] [Renewal]
            } else if (fPara === 'ft_discount') {
                standardPriceShow = standardPriceValue['85%']; // ##[Tap] [Standard] [Discount]
            } else if (today.getTime() >= StartDate.getTime() && today.getTime() <= EndDate.getTime()) {
                standardPriceShow = standardPriceValue['85%']; // ##[Tap] [Standard] [Time Limit]
            } else {
                //true;
                standardPriceShow = (typeof(pricePolicy) !== 'undefined') ? pricePolicy['standard'] : standardPriceShow;
            }
            // ##[Tap] Standard -- Pop-up [FINAL]
            relevantDataInPayment(standardType, standardPriceShow);
        } else if (tapPara === 'premium') {
            if (!isEmptyObj(dataObj) && (dataObj.standard === 1 && dataObj.premium === 0)) {
                //upgradePrice = upgradePrice; // ##[Tap] [Premium] [Upgrade]
            } else {
                if (fPara === 'ft_win_back' || fPara === 'ft_big_sale' || fPara === 'uibe' || fPara === 'bimba') {
                    premiumPriceShow = premiumPriceValue['50%'];
                    //premiumPriceShow = premiumPriceValue['85%']; // ##[Tap] [Premium] [Win Back]
                } else if (fPara === 'ft_renewal') {
                    premiumPriceShow = premiumPriceValue['75%']; // ##[Tap] [Premium] [Renewal]
                } else if (fPara === 'ft_discount') {
                    premiumPriceShow = premiumPriceValue['85%']; // ##[Tap] [Premium] [Discount]
                } else if (today.getTime() >= StartDate.getTime() && today.getTime() <= EndDate.getTime()) {
                    premiumPriceShow = premiumPriceValue['85%']; // ##[Tap] [Premium] [Time Limit]
                } else {
                    //true;
                    premiumPriceShow = (typeof(pricePolicy) !== 'undefined') ? pricePolicy['premium'] : premiumPriceShow;
                }
                //upgradePrice = premiumPriceValue;
            }
            // ##[Tap] Premium -- Pop-up [FINAL]
            //relevantDataInPayment(premiumType, upgradePrice);
            relevantDataInPayment(premiumType, premiumPriceShow);
        }
        paymentPage.style.display = 'block';
    }

    // Mark:如果没有R cookie，则在此页面设置，成功页面获取带有tap的cookie
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
        }
    }
}

/**
 * Mark:加强版电子商务跟踪
 */
function trackEC() {
    let SELabel = GetCookie('SELabel') || 'Other';
    productImpression();
}
trackEC();

ga(function(tracker) {
    var clientId = tracker.get('clientId');
});