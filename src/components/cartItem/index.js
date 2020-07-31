import React from 'react';
import ProductPrice from '../productPrice';

const CartItem = props => {
  console.log(props.data.product);
  const {name, images, descuento:oferta = null, price, _id:productID } = props.data.product;
  const {company:companyName, _id:companyID} = props.data.vendor;
  const {qty, sizeSelected, selectedColor = null} = props.data;

  return(
    <>
      <div className="row">
        <div className="columns">
          <div className="column is-one-fifth">
            <img src={images[0]} alt={name} className="cart-item-img"/>
          </div>
          <div className="column">
            <a href={`/tienda/${companyID}`} className="has-text-black"><small>Vendido por: <div className="tag is-light"><b>{companyName}</b></div></small></a>
            <p className="title is-4 has-text-weight-bold has-text-link-dark">
              <a className="has-text-link-dark " href={`/producto/${companyID}/${productID}`}>{name}</a>
              <br/><div className="tags">
              {sizeSelected && <span className="tag has-text-weight-bold is-light is-warning">Talla: {sizeSelected}</span>}
              <span className="tag has-text-weight-bold is-light is-warning">Cantidad: {qty}</span>
              {selectedColor && <span className="tag has-text-weight-bold is-light is-warning">Color: {selectedColor}</span>}
              </div>
            </p>
          </div>
          <div className="column">
            <ProductPrice price={price} discount={ oferta ? oferta.porcentaje : null } isCard={true} />
            {props.deleteFromCart !== null && <div className="buttons is-centered">
              <button onClick={e => props.deleteFromCart({productID, companyID})} className="button is-danger is-small "><span className="icon"><i className="fa fa-trash"/></span> <span>Eliminar</span></button>
            </div>}
          </div>
        </div>
      </div>
      <hr/>
    </>
  );
};

export default CartItem;