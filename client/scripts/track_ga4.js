let listName = 'webMembership';
let category = 'membership';

// Update tracking ID with your own
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-2MCQJHGE8J', {
  send_page_view: false
});

// 把交易号放在cookie里，这样buy success能获取到此交易号，把成功页面现有的代码暂时隐藏
// 生成交易号，交易号为全局的，这样display和
// 放入订阅页面
function productImpressionGA4(id, name) {
  gtag('event', 'view_item_list', {
    send_to: 'G-2MCQJHGE8J',
    items: [
      {
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
  addProduct();
}

function addProduct() {
  gtag('event', 'view_item', {
    send_to: "G-2MCQJHGE8J",
    items: [
      {
        item_id: 'Standard',
        item_name: 'Standard',
        item_category: listName,
        item_brand: 'FTC',
        index: 1
      },
      {
        item_id: 'Premium',
        item_name: 'Premium',
        item_category: listName,
        item_brand: 'FTC',
        index: 2
      }
    ]
  });
}


// 出来订阅页面，可以addPromotion，放入订阅页面
function addPromotionGA4(id, name) {
  gtag('event', 'view_promotion', {
    send_to: "G-2MCQJHGE8J",
    promotions: [
      {
        promotion_id: id,
        promotion_name: name,
        creative_name: category,
        position: 'web site'
      }
    ]
  });
}

function onProductClickGA4(name, position) {
  gtag('event', 'select_item', {
    send_to: "G-2MCQJHGE8J",
    items: [
      {
        item_id: name,
        item_name: name,
        item_category: listName,
        brand: 'FTC',
        index: position
      }
    ]
  });
}



// 当点击立即订阅时，调用此
function onPromoClickGA4(id, name) {
  gtag('event', 'view_promotion', {
    send_to: "G-2MCQJHGE8J",
    promotions: [
      {
        promotion_id: id,
        promotion_name: name,
        creative_name: category,
        position: 'web site'
      }
    ]
  });
}

function addTransactionGA4(tradeId, name, price, affiliation, ccode) {
  gtag('event', 'purchase', {
    send_to: "G-2MCQJHGE8J",
    transaction_id: tradeId,
    value: price,
    currency: 'CNY',
    items: [
      {
        item_id: tradeId,
        item_name: name,
        item_category: category,
        brand: 'FTC',
        quantity: 1,
        price: price,
        affiliation: affiliation,
        promotion_id: ccode
      }
    ]
  });
  console.log("GA4" + affiliation);
}

export {
  productImpressionGA4,
  addPromotionGA4,
  onPromoClickGA4,
  addTransactionGA4,
  onProductClickGA4
};