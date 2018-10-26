/*jshint esversion: 6 */
import {EventObject,GetCookie,SetCookie,parseUrlSearch} from './subscribe_api';
import {addTransaction} from './track';
   
// var eventAction = '';
// var paraArr = parseUrlSearch();
// if (paraArr && paraArr.length>0){
//     var arr = paraArr[0].split('=');
//     eventAction = arr[1] ;
// }

var memberType = paravalue(window.location.href, 'memberType');
memberType = decodeURIComponent(memberType);
var eventAction = memberType;
var memberTitle = '';
if (memberType === 'Standard') {
    memberTitle = '标准会员';
} else if (memberType === 'Premium') {
    memberTitle = '高端会员';
} else if (memberType === 'Standard Monthly') {
    memberTitle = '月度标准会员';
}

var SELabel = GetCookie('SELabel') || 'other from web';
if(SELabel.indexOf('/IOSCL/')>-1) {
    var clParaArr = SELabel.split('/IOSCL/');
    ga('send','event',clParaArr[0], 'Buy Success:'+eventAction, clParaArr[1], {'nonInteraction':1});
} else {
    // var ccode = SELabel.replace(/From:/g,'').replace(/\/.*$/g,'');
    // if (SELabel.indexOf('From:') === 0 && ccode !== '') {
    //     ga('set', 'AllowAnchor', true);
    //     ga('set', 'campaignName', ccode);
    //     ga('set', 'campaignSource', 'marketing');
    //     ga('set', 'campaignMedium', 'campaign');
    // }
    ga('send','event','Web Privileges', 'Buy Success:'+eventAction, SELabel, {'nonInteraction':1});
}

// MARK: get actual price from url parameter
var price = paravalue(window.location.href, 'price');
if (price === '') {
    price = (eventAction === 'Premium') ? '1998' : '198';
}

let randomVal = Math.round(Math.random()*89999)+10000;

let tradeNo = GetCookie('trade_no')||randomVal;


function paravalue(theurl, thep) {
    var k,thev;
    if (theurl.indexOf(thep + '=')>1) {
        k=theurl.indexOf(thep + '=') + thep.length + 1;
        thev=theurl.substring(k,theurl.length);
        thev=thev.replace(/[\&\#].*/g,'');
    } else {
        thev='';
    }
    return thev;
}


function addClientIdPar(clientId,url){
    var clientIdPar = '';
    var connector = (url.indexOf('?') > 0) ? '&' : '?';
    if(clientId && clientId !== ''){
        clientIdPar = connector+'clientId=' + clientId;
    }else{
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
            var date = new Date(expireDateString*1000);
            var years = date.getFullYear();
            var months = date.getMonth() + 1;
            var days = date.getDate();
            var exprireDateFinal = years + '年' + months + '月' + days + '日';
        }
        expireEle.innerHTML = exprireDateFinal;
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
                    jumpUrl = 'http://www.ftchinese.com';
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
        if(rCookie){
            jumpUrl = decodeURIComponent(rCookie);
        }else{
            jumpUrl = 'http://www.ftchinese.com';
        }
        jumpUrl = addClientIdPar(clientId, jumpUrl);
        // MARK: Fix the problem brought by ealier bugs which are not related to this page
        jumpUrl = jumpUrl.replace(/(&)(.*)(\?)/g, '$3$2$1');
        window.open(jumpUrl,'_self');
    });
}

let returnToId = document.getElementById("returnTo");

EventObject.addHandler(returnToId,"click",function(){ 
    returnTo();
});

window.onload = function(){
    jump();
}

// 放入交易成功页面
let affiliation =  SELabel;
addTransaction(tradeNo, eventAction, price, affiliation);
    
   


