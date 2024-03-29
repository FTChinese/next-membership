import {
    GetCookie,
    getUrlParams
} from './subscribe_api';

// Update tracking ID with your own
window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-2MCQJHGE8J', {
    send_page_view: false
});

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

var gaMore = {};
if (userIdForGA !== null) {
    gaMore.user_id = userIdForGA;
}
if (clientId !== '') {
    gaMore.client_id = clientId;
}
if (Object.keys(gaMore).length > 0) {
    gtag('config', 'G-2MCQJHGE8J', gaMore);
} else {
    gtag('config', 'G-2MCQJHGE8J');
}

try {
    var ccode =
        getUrlParams('ccode') ||
        getUrlParams('utm_code') ||
        getUrlParams('utm_campaign') ||
        getUrlParams('campaign_code') ||
        GetCookie('ccode') ||
        '';
    var seLabel = GetCookie('SELabel') || '';
    seLabel = seLabel.replace(/From:/g, '').replace(/\/.*$/g, '');
    if (seLabel !== '') {
        ccode = seLabel;
    }
    if (ccode !== '' && window.location.href.indexOf('utm_campaign') < 0) {
        var usource = 'marketing';
        var umedium = 'campaign';
        gtag('event', 'select_content', {
            send_to: 'G-2MCQJHGE8J',
            promotions: [{
                "id": ccode,
                "name": "Campaign",
                "creative_name": ccode,
                "position": 1
            }],
            "event_category": usource,
            "event_label": umedium
        });
    }
} catch (ignore) {}