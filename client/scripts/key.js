/*
 *
 * [ Google Analytics ]
 *
 */
import {
    GetCookie,
    getUrlParams
} from './subscribe_api';

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
    a.onload = function() {
        if (typeof clearEvents === 'function') {
            clearEvents()
        }
    }
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
// -- https://www.google-analytics.com/analytics.js
// -- https://www.ftacademy.cn/analytics.js -- [./analytics.js]

var userIdForGA = GetCookie('U') || GetCookie('USER_ID') || '';
var clientId;
try {
    clientId = getUrlParams('clientId') || GetCookie('clientId') || '';
    var url = window.location.href.replace(/&clientId=.*/g, '')
    var stateObj = {
        foo: "bar"
    };
    history.replaceState(stateObj, "page 3", url);
} catch (ignore) {}
var gaMore = {
    hasValue: false
};
if (userIdForGA !== null) {
    gaMore.userId = userIdForGA;
    gaMore.hasValue = true;
}
if (clientId !== '') {
    gaMore.clientId = clientId;
    gaMore.hasValue = true;
}
if (gaMore.hasValue) {
    ga('create', 'UA-1608715-1', 'auto', gaMore);
} else {
    ga('create', 'UA-1608715-1', 'auto');
}

ga('require', 'displayfeatures');
ga('require', 'ec');

// MARK: - Track Campaign Code on Google Analytics
try {
    ga('set', 'AllowAnchor', true);
    var ccode = getUrlParams('ccode') || getUrlParams('utm_code') || getUrlParams('utm_campaign') || getUrlParams('campaign_code') || GetCookie('ccode') || '';
    var seLabel = GetCookie('SELabel') || '';
    seLabel = seLabel.replace(/From:/g, '').replace(/\/.*$/g, '');
    if (seLabel !== '') {
        ccode = seLabel;
    }
    if (ccode !== '' && window.location.href.indexOf('utm_campaign') < 0) {
        var usource = 'marketing';
        var umedium = 'campaign';
        ga('set', 'campaignName', ccode);
        ga('set', 'campaignSource', usource);
        ga('set', 'campaignMedium', umedium);
    }
} catch (ignore) {}

try {
    ga('send', 'pageview', window.location.href);
} catch (err) {}