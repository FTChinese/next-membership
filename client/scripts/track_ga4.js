let listName = 'webMembership';
let category = 'membership';

function productImpressionGA4(id, name) {
    gtag('event', 'view_item_list', {
        send_to: 'G-2MCQJHGE8J',
        items: [{
                item_id: 'Standard',
                item_name: 'Standard',
                item_category: category,
                item_brand: 'FTC',
                item_list_name: listName,
                index: 1
            },
            {
                item_id: 'Premium',
                item_name: 'Premium',
                item_category: category,
                item_brand: 'FTC',
                item_list_name: listName,
                index: 2
            }
        ]
    });
    addProductGA4();
}

function addProductGA4() {
    gtag('event', 'view_item', {
        send_to: "G-2MCQJHGE8J",
        items: [{
                item_id: 'Standard',
                item_name: 'Standard',
                item_category: category,
                item_brand: 'FTC',
                index: 1
            },
            {
                item_id: 'Premium',
                item_name: 'Premium',
                item_category: category,
                item_brand: 'FTC',
                index: 2
            }
        ]
    });
}

function onProductClickGA4(name, position) {
    gtag('event', 'select_item', {
        send_to: "G-2MCQJHGE8J",
        items: [{
            item_id: name,
            item_name: name,
            item_category: category,
            brand: 'FTC',
            index: position
        }]
    });
}

// function addPromotionGA4(id, name) {
//   gtag('event', 'view_promotion', {
//     send_to: "G-2MCQJHGE8J",
//     promotions: [
//       {
//         promotion_id: id,
//         promotion_name: name,
//         creative_name: category,
//         position: 'web site'
//       }
//     ]
//   });
// }

// function onPromoClickGA4(id, name) {
//   gtag('event', 'view_promotion', {
//     send_to: "G-2MCQJHGE8J",
//     promotions: [
//       {
//         promotion_id: id,
//         promotion_name: name,
//         creative_name: category,
//         position: 'web site'
//       }
//     ]
//   });
// }

function addTransactionGA4(tradeId, name, price, affiliation, ccode) {
    gtag('event', 'purchase', {
        send_to: "G-2MCQJHGE8J",
        transaction_id: tradeId,
        value: price,
        currency: 'CNY',
        items: [{
            item_id: tradeId,
            item_name: name,
            item_category: category,
            brand: 'FTC',
            quantity: 1,
            price: price,
            affiliation: affiliation,
            promotion_id: ccode
        }]
    });
    /*
    console.log('[addTransactionGA4] -- tradeId -- ' + tradeId);
    console.log('[addTransactionGA4] -- name -- ' + name);
    console.log('[addTransactionGA4] -- category -- ' + category);
    console.log('[addTransactionGA4] -- price -- ' + price);
    console.log('[addTransactionGA4] -- affiliation -- ' + affiliation);
    console.log('[addTransactionGA4] -- ccode -- ' + ccode);
    */
}

export {
    productImpressionGA4,
    onProductClickGA4,
    //addPromotionGA4,
    //onPromoClickGA4,
    addTransactionGA4
};