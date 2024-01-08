import {
    EventObject,
    GetCookie,
    getUrlParams,
    isEmptyObj
} from './subscribe_api.js';

const WEBSITE_MAIN = 'https://www.chineseft.net';

let userName = GetCookie('USER_NAME');
let userNameId = document.getElementById('userName');
if (userName) {
    userNameId.innerHTML = userName;
}

let userEmail = GetCookie('USER_EMAIL');
let userEmailId = document.getElementById('userEmail');
if (userEmail) {
    userEmailId.innerHTML = '(' + userEmail + ')';
}

let tokenVal = getUrlParams('token');
let tokenId = document.getElementById('token');
tokenId.value = tokenVal;

let confirm = document.querySelector('.confirm');

let exchangeId = document.getElementById('exchange');
let notice = document.getElementById('notice');

EventObject.addHandler(confirm, "click", function() {
    let userId = GetCookie('USER_ID') || '';
    let exchange = document.querySelector('[name="exchange"]');
    let exchangeVal = exchange.value;
    let exchangeValNew = exchangeVal.replace(/\s/g, '');

    if (exchangeVal === '') {
        alert('请输入兑换码');
    } else if (exchangeValNew.length < 16) {
        alert('您输入的兑换码有误，请重新输入');
    } else {
        if (!!userId) {
            var xhrpw = new XMLHttpRequest();
            xhrpw.open('post', '/users/setting/binding');
            xhrpw.setRequestHeader('Content-Type', 'application/text');
            var exchangeInfo = {
                exchange: exchangeVal,
                token: tokenVal
            }
            xhrpw.onload = function() {
                if (xhrpw.status === 200) {
                    var data = xhrpw.responseText;
                    if (JSON.parse(data)) {
                        var dataObj = JSON.parse(data);
                        if (dataObj.errcode === 0) {
                            alert(dataObj.errmsg);
                            if (exchangeId) {
                                exchangeId.style.display = 'none';
                                notice.style.display = 'block';
                            }
                            jump();
                        } else if (dataObj.errcode === 100) {
                            alert(dataObj.errmsg);
                        } else {
                            alert("兑换失败（" + dataObj.errcode + "）\n您输入的兑换码有误，请重新输入。");
                        }
                    } else {
                        alert("系统问题\n服务器没有返回数据，请稍后重试。");
                    }
                } else {
                    alert("网络故障\n服务器未能正常响应，请稍后重试。");
                }
            };
            xhrpw.send(JSON.stringify(exchangeInfo));
        }
    }


});

function jump() {
    // Mark: 3秒自动跳转
    let s = window.setInterval(function() {
        var objTime = document.getElementById("time"); //获得time的对象
        var time = objTime.innerText; //获得time的值
        time = time - 1;
        objTime.innerText = time; //把新time赋给objTime里面
        if (time === 0) {
            window.location.href = WEBSITE_MAIN;
            window.clearInterval(s); //清空s，防止再次调用a()。即防止time减为负数
        }
    }, 1000);

    var returnTo = document.getElementById("returnTo");
    returnTo.onclick = function() {
        window.open(WEBSITE_MAIN, '_self');
    }
}

// test section
// function test(){

//     let jumpPara = getUrlParams('jump');
//     console.log('tt'+jumpPara);
//     if(jumpPara){
//         console.log('tt');
//         if(exchange){
//             exchange.style.display = 'none';
//             notice.style.display = 'block';
//         }
//         jump();
//     }
// }
// test();