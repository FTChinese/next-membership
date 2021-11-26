import {
    EventObject,
    GetCookie,
    getUrlParams,
    isEmptyObj
} from './subscribe_api.js';

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

let conform = document.querySelector('.conform');

let exchangeId = document.getElementById('exchange');
let notice = document.getElementById('notice');

EventObject.addHandler(conform, "click", function() {
    let userId = GetCookie('USER_ID') || '';
    let exchange = document.querySelector('[name="exchange"]');
    let exchangeVal = exchange.value;
    let exchangeValNew = exchangeVal.replace(/\s/g, '');

    if (exchangeVal === '') {
        alert('请输入信息！');
    } else if (exchangeValNew.length < 16) {
        alert('您的兑换码有误，请确认后再输入！');
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
                            alert('您的兑换码有误，请确认后再输入!');
                        }
                    } else {
                        alert('FT中文网服务器没有返回数据！');
                    }
                } else {
                    alert('FT中文网服务器未能正常相应！');
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
        if (time == 0) {
            window.location.href = 'http://www.ftchinese.com';
            window.clear(s); //清空s，防止再次调用a()。即防止time减为负数
        }
    }, 1000);


    var returnTo = document.getElementById("returnTo");
    returnTo.onclick = function() {
        window.open('http://www.ftchinese.com', '_self');
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