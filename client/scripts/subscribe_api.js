var EventObject = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};

const GetCookie = (name) => {
    var start = document.cookie.indexOf(name + '='),
        len = start + name.length + 1,
        end = document.cookie.indexOf(';', len);
    if ((!start) && (name !== document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start === -1) {
        return null;
    }
    if (end === -1) {
        end = document.cookie.length;
    }
    return decodeURIComponent(document.cookie.substring(len, end));
};

const DeleteCookie = (name) => {
    var exp = new Date(),
        cval = GetCookie(name);
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + '=' + cval + '; expires=' + exp.toGMTString();
};

const SetCookie = (name, value, sec, path, domain, secure) => {
    var expires = new Date();
    if (sec === null || sec === '') {
        sec = 600 * (24 * 60 * 60 * 1000);
    } else {
        sec = 1000 * sec;
    }
    expires.setTime(expires.getTime() + sec);
    document.cookie = name + '=' + escape(value) + ((expires === null) ? '' : ('; expires=' + expires.toGMTString())) + ((path === null) ? '/' : ('; path=' + path)) + ((domain === null) ? '' : ('; domain=' + domain)) + ((secure === true) ? '; secure' : '');
};

function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
        return true;
    } else {
        return false;
    }
}

function parseUrlSearch() {
    var para = location.search;
    if (para) {
        para = para.substring(1);
        para = decodeURIComponent(para);
        var paraArr = para.split('&');
        return paraArr;
    }
    return undefined;
}

function getUrlParams(key = '') {
    var value = '';
    var paraArr = parseUrlSearch();
    if (paraArr && paraArr.length > 0) {
        var arr = [];
        for (var i = 0, len = paraArr.length; i < len; i++) {
            if (paraArr[i].toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) > -1) {
                arr = paraArr[i].split('=');
                if (arr.length > 1 && arr[0].toLocaleLowerCase() === key.toLocaleLowerCase()) {
                    value = arr[1].toLocaleLowerCase();
                }
            }
        }

        return value;
    }
    return value;
}

function isEmptyObj(dataObj) {
    var arr = Object.keys(dataObj);
    if (arr.length > 0) {
        return false;
    } else {
        return true;
    }
}

function getDeviceType() {
    var uaString = navigator.userAgent || navigator.vendor || '';
    var deviceType = 'PC';
    if (/iPad/i.test(uaString)) {
        deviceType = 'iPad';
    } else if (/OS [0-9]+\_/i.test(uaString) && (/iPhone/i.test(uaString) || /iPod/i.test(uaString))) {
        deviceType = 'iPhone';
    } else if (/Android|micromessenger/i.test(uaString)) {
        deviceType = 'android';
    }
    return deviceType;
}

export {
    EventObject,
    GetCookie,
    SetCookie,
    DeleteCookie,
    isWeiXin,
    parseUrlSearch,
    getUrlParams,
    isEmptyObj,
    getDeviceType
};