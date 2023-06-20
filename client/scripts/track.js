let listName = 'webMembership';
let category = 'membership';


// 把交易号放在cookie里，这样buy success能获取到此交易号，把成功页面现有的代码暂时隐藏
// 生成交易号，交易号为全局的，这样display和
// 放入订阅页面
function productImpression(id, name) {
    gtag('event', 'view_item_list', {
        'items': [
            {
                'item_id': 'Standard',
                'item_name': 'Standard',
                'item_category': category,
                'brand': 'FTC',
                'index': 1
            },
            {
                'item_id': 'Premium',
                'item_name': 'Premium',
                'item_category': category,
                'brand': 'FTC',
                'index': 2
            }
        ]
    });

    addProduct();
    gtag('config', 'G-CGZ5MQE66Z');
}

function addProduct() {
    gtag('event', 'view_item', {
        'items': [
            {
                'item_id': 'Standard',
                'item_name': 'Standard',
                'item_category': listName,
                'brand': 'FTC',
                'index': 1
            },
            {
                'item_id': 'Premium',
                'item_name': 'Premium',
                'item_category': listName,
                'brand': 'FTC',
                'index': 2
            }
        ]
    });

    // 设置 action 为 'detail'
    gtag('event', 'select_item', {
        'items': [
            {
                'item_id': 'Standard',
                'item_name': 'Standard',
                'item_category': listName,
                'brand': 'FTC',
                'index': 1
            },
            {
                'item_id': 'Premium',
                'item_name': 'Premium',
                'item_category': listName,
                'brand': 'FTC',
                'index': 2
            }
        ]
    });

    gtag('config', 'G-CGZ5MQE66Z');
}


// 出来订阅页面，可以addPromotion，放入订阅页面
function addPromotion(id, name) {
    gtag('event', 'view_promotion', {
        'items': [
            {
                'item_id': id,
                'item_name': name,
                'creative_name': category,
                'creative_slot': 'web side'
            }
        ]
    });

    gtag('config', 'G-CGZ5MQE66Z');
}

function onProductClick(name, position) {
    gtag('event', 'select_item', {
        'items': [
            {
                'item_id': name,
                'item_name': name,
                'item_category': listName,
                'brand': 'FTC',
                'index': position
            }
        ]
    });

    // 设置 action 为 'click'
    gtag('event', 'select_content', {
        'content_type': 'product',
        'items': [
            {
                'item_id': name,
                'item_name': name,
                'item_category': listName,
                'brand': 'FTC',
                'index': position
            }
        ]
    });

    gtag('config', 'G-CGZ5MQE66Z');
}



// 当点击立即订阅时，调用此
function onPromoClick(id, name) {
    gtag('event', 'view_promotion', {
        'items': [
            {
                'item_id': id,
                'item_name': name,
                'creative_name': category,
                'creative_slot': 'web side'
            }
        ]
    });

    // 设置 action 为 'promo_click'
    gtag('event', 'select_content', {
        'items': [
            {
                'item_id': id,
                'item_name': name,
                'item_category': category
            }
        ]
    });

    gtag('config', 'G-CGZ5MQE66Z');
}

function addTransaction(tradeId, name, price, affiliation) {
    gtag('event', 'purchase', {
        'transaction_id': tradeId,
        'affiliation': affiliation,
        'value': price,
        'currency': 'CNY',
        'items': [
            {
                'item_id': name,
                'item_name': name,
                'item_category': category,
                'brand': 'FTC',
                'quantity': 1,
                'price': price,
            }
        ]
    });

    gtag('config', 'G-CGZ5MQE66Z');
}

export {
    productImpression,
    addPromotion,
    onPromoClick,
    addTransaction,
    onProductClick
};