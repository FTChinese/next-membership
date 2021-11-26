/**
 * 问题区域
 * 思路：
 * 1.从json中读取数据，当点击更新当前问题，显示当前问题，目前需要解决是需要获取当前元素
 * 2.tab就直接放在一个div中，当点击哪个div显示里面的内容，这个容易
 */
import {
    EventObject
} from './subscribe_api';

let expanders = document.querySelectorAll('.o-expander');
let expandToggle = function(event) {
    let ariaExpanded = this.getAttribute('aria-expanded');
    let ii = this.children[0].children[0];

    let nextSbl = this.parentNode.children[1];
    let ariaHidden = nextSbl.getAttribute('aria-hidden');
    if (ii) {
        if (ariaExpanded == 'false') {
            this.setAttribute('aria-expanded', 'true');
            ii.style.animation = "arrowRotateDown 0.25s 1 forwards ease-in";
        } else {
            this.setAttribute('aria-expanded', 'false');
            ii.style.animation = "arrowRotateUp 0.25s forwards ease-out";
        }
    }

    if (nextSbl) {
        if (ariaHidden == 'true') {
            nextSbl.setAttribute('aria-hidden', 'false');
            nextSbl.style.maxHeight = '715px';
            nextSbl.style.transition = "max-height 0.25s ease";
        } else {
            nextSbl.setAttribute('aria-hidden', 'true');
            nextSbl.style.maxHeight = '0px';
            nextSbl.style.transition = "max-height 0.25s ease";

        }
    }
};

for (let i = 0, len = expanders.length; i < len; i++) {
    var firstChild = expanders[i].children[0];
    EventObject.addHandler(firstChild, "click", expandToggle);
}

function clickTab() {
    let tabContentLabel = document.querySelectorAll('.tabContent-label');
    let tabContentContainer = document.getElementById('tabContentContainer');
    let selectedIndex = 0;
    let tabSwitch = function(event) {
        let id = this.getAttribute('id');
        let cutId = id.replace('-label', '');

        let answerId = '';
        let canSelectedId = '';
        for (let i = 1; i <= 3; i++) {
            answerId = 'tabContent' + i;
            canSelectedId = 'tabContent' + i + '-label';
            if (cutId == answerId) {
                selectedIndex = i;
                document.getElementById(answerId).style.display = 'block';
                this.setAttribute('aria-selected', 'true');
            } else {
                document.getElementById(answerId).style.display = 'none';
                document.getElementById(canSelectedId).setAttribute('aria-selected', 'false');
            }

        }
    };

    for (let i = 0; i <= 2; i++) {
        EventObject.addHandler(tabContentLabel[i], "click", tabSwitch);
    }
}

clickTab();

function clickTabForm() {

    let tabSelect = document.getElementById('o-tab__select');
    let tabSwitch = function(event) {
        var optionValue = tabSelect.value;
        let answerId = '';
        for (let i = 1; i <= 3; i++) {
            answerId = 'tabContent' + i;
            if (optionValue == answerId) {
                document.getElementById(answerId).style.display = 'block';
            } else {
                document.getElementById(answerId).style.display = 'none';
            }
        }
    };

    EventObject.addHandler(tabSelect, "change", tabSwitch);
}

clickTabForm();