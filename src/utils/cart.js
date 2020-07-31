import crypto from 'crypto-js';
// import { formatMoney } from './products';
import config from '../config';

const internals = {
  appKey: 'C@Tr@c0sSh0p--Rul3z4eVa'
};

export const setToLocalStorage = (key = '_cart', data = null, callback = null) => {
  let edata = false;

  try {
    if (!key) {
      console.log('{setToLocalStorage}: a key must be specified.');

      return null;
    }

    if (!data) {
      console.log('{setToLocalStorage}: data to save must be provided.');

      return null;
    }

    edata = crypto.AES.encrypt( JSON.stringify(data), internals.appKey).toString();

    localStorage.setItem(key, edata);

    if (callback) callback();
  } catch(e) {
    console.log(e.message);

    return null;
  }
};

export const getFromLocalStorage = (key = '_cart') => {
  const cart_template = {ckey: config._cartID, cart: {}};
  try {
    if (!key) {
      console.log('{getFromLocalStorage}: a key must be specified.');

      return null;
    }

    if (!localStorage[key]) {
      console.log(`{getFromLocalStorage}: specified key {${key}} does not exists in localStorage`);

      return cart_template;
    }

    const _dataByte = crypto.AES.decrypt(localStorage[key], internals.appKey);
    let decryptedData = JSON.parse(_dataByte.toString(crypto.enc.Utf8));

    // console.log('the key', crypto.AES.decrypt('U2FsdGVkX1920CLY1VcU8sudABPV1V5qZiYNo/jR8V4l/rlM6V1k1PCfd14RAVSxdA9ZuE2KBy8olpOd4bRLe8mtrFhzW1Q0SognM3ZsI8meaVgyRa+TpnzWAYP9YOMo3tKGeRddabmNDCi/pxBD/+oe++wyHg6nbjV/tLItaNHnRHOqWMSjvFKufCcVnTrE', internals.appKey).toString(crypto.enc.Utf8) );

    // Check current key
    decryptedData = (decryptedData.ckey && decryptedData.ckey === config._cartID) ? decryptedData : cart_template;

    // console.log(decryptedData.ckey && decryptedData.ckey === config._cartID);

    return decryptedData;
  } catch(e) {
    console.log(e.message);

    return cart_template;
  }
};

export const getCartWithData = async (fb) => {
  try {
    const _cart = await getFromLocalStorage();
    const vendors = Object.keys(_cart['cart']);
    const products = [];
    let shipping = [];

    await Promise.all( vendors.map( async vendor => {
      const vendorFetch = await fb.db.ref(`/companies/${vendor}`).once('value');
      const vendorData = vendorFetch.val();
      const item = {};

      item['vendor'] = {
        _id: vendor,
        ...vendorData
      };

      shipping.push(vendorData.delivery_price);

      await Promise.all( _cart['cart'][vendor].map( async product => {
        const productFetch = await fb.db.ref(`/products/${vendor}/${product._id}`).once('value');
        const productData = productFetch.val();

        products.push({ vendor: {...item.vendor}, product: {_id:product._id, ...productData}, qty: product.qty, sizeSelected: product.sizeSelected, selectedColor: product.selectedColor });

      })).then( () => console.log(`All products Fetched for company ${item.vendor.name}`));
    })).then( () => console.log('All data fetched'));

    shipping = Array.from(new Set(shipping)).reduce( (accum, item) => accum + item, 0);
    // console.log(_cart);
    
    return {products, shipping, originalCart: _cart};
  } catch(e) {
    console.log(e.message);

    return [];
  }
};