import React from 'react';
import { setToLocalStorage, getFromLocalStorage} from '../../utils/cart';
import _array from 'lodash/array';

class AddToCartBtn extends React.Component {
  constructor(props) {
    super(props);

    this.state ={};

    this.addToCart = this.addToCart.bind(this);
  }

  addToCart(vendor, product, qty, sizeSelected, selectedColor) {
    const _cart = getFromLocalStorage();
    const productToAdd = { _id: product._id, qty, sizeSelected, selectedColor };

    _cart['cart'][vendor._id] = _cart['cart'][vendor._id] ? _cart['cart'][vendor._id] : [];

    const existsInCartIndex = _array.findIndex(_cart['cart'][vendor._id], item => item._id === product._id);

    if (existsInCartIndex !== -1) {
      _cart['cart'][vendor._id][existsInCartIndex]= productToAdd;
    } else {
      _cart['cart'][vendor._id].push(productToAdd);
    }

    setToLocalStorage('_cart', _cart, () => window.location = '/carrito');
  }

  render() {
    const {vendor, product, qty, sizeSelected = false, selectedColor = false} = this.props;

    return(
      <React.Fragment>
        {/* {isOutOfStock && <p className="has-text-centered has-text-danger"><b>Agotado</b></p>} */}
        <div className="buttons is-centered">
          <button className="button is-danger is-small has-text-weight-bold" onClick={e => this.addToCart(vendor, product, qty, sizeSelected, selectedColor)}>
            <span className="icon"><i className="fa fa-cart-plus"/></span> <span>Agregar al Carrito</span>
          </button>
        </div>
      </React.Fragment>
      
    );
  }
}

export default AddToCartBtn;