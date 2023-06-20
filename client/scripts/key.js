/*
 *
 * [ Google Analytics ]
 *
 */

import {
    GetCookie,
    getUrlParams
} from './subscribe_api';

// (function(i, s, o, g, r, a, m) {
//     i['GoogleAnalyticsObject'] = r;
//     i[r] = i[r] || function() {
//         (i[r].q = i[r].q || []).push(arguments)
//     }, i[r].l = 1 * new Date();
//     a = s.createElement(o),
//         m = s.getElementsByTagName(o)[0];
//     a.async = 1;
//     a.src = g;
//     m.parentNode.insertBefore(a, m);
//     a.onload = function() {
//         if (typeof clearEvents === 'function') {
//             clearEvents()
//         }
//     }
// })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
gtag('config', 'G-CGZ5MQE66Z');
// -- https://www.google-analytics.com/analytics.js
// -- https://www.ftacademy.cn/analytics.js -- [./analytics.js]

var userIdForGA = GetCookie('U') || GetCookie('USER_ID') || '';
if (userIdForGA !== '') {
    gtag('set', { 'user_id': userIdForGA });
}

// Set client ID
var clientId;
try {
    clientId = getUrlParams('clientId') || GetCookie('clientId') || '';
    var url = window.location.href.replace(/&clientId=.*/g, '');
    var stateObj = {
        foo: "bar"
    };
    history.replaceState(stateObj, "page 3", url);
} catch (ignore) { }

if (clientId !== '') {
    gtag('set', { 'client_id': clientId });
}

// Set campaign code
try {
    var ccode = getUrlParams('ccode') || getUrlParams('utm_code') || getUrlParams('utm_campaign') || getUrlParams('campaign_code') || GetCookie('ccode') || '';
    var seLabel = GetCookie('SELabel') || '';
    seLabel = seLabel.replace(/From:/g, '').replace(/\/.*$/g, '');
    if (seLabel !== '') {
        ccode = seLabel;
    }
    if (ccode !== '' && window.location.href.indexOf('utm_campaign') < 0) {
        gtag('event', 'page_view', { 'send_to': 'G-CGZ5MQE66Z', 'campaign': ccode });
    }
} catch (ignore) { }