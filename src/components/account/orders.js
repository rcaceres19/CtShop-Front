import React from 'react';
import { withFirebase } from '../../vendor/firebase';
import Loader from '../loader/bversion';
import {formatMoney} from '../../utils/products';

const internals = {
  orders: []
};

class UserOrdersBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const userID = this.props.firebase.auth.currentUser.uid;
      const ordersRequest = await this.props.firebase.db.ref(`users/${userID}/orders`).orderByChild('status').equalTo(this.props.filterValue).once('value');
      const orders = ordersRequest.val();
      const ordersArr = [];

      Object.keys(orders).map( order => {
        const tempOrder = { _orderID: order, ...orders[order]}
        ordersArr.push(tempOrder);

        return true;
      });

      internals.orders = ordersArr;

      console.log(internals.orders);

      this.setState({ loading: false });
    } catch(e) {
      console.log(e.message);
      this.setState({ loading: false });
    }
  }

  render() {
    const pendienteMessage = this.props.filterValue === 'pendiente' ? 'Pendientes': 'Completadas';
    return(
      <> 
        <h3 className="title is-5">Ordenes {pendienteMessage}</h3>
        <hr/>
        {this.state.loading && <Loader />}
        {!this.state.loading && internals.orders.length === 0 && <p className="has-text-centered">No tienes ordenes {pendienteMessage}</p>}
        {!this.state.loading && internals.orders.length > 0 && internals.orders.map( order => <>
          <div className="card">
            <div className="card-content">
              <h3 className="title is-4 has-text-dark">Orden #: {order._orderID} <span className="tag is-info is-bi is-light">{order.status}</span></h3>
              <hr/>
              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th><abbr title="Position">#</abbr></th>
                      <th>&nbsp;</th>
                      <th>Producto</th>
                      <th><abbr title="Played">Vendedor</abbr></th>
                      <th><abbr title="Won">Enviado</abbr></th>
                      <th><abbr title="Won">Cant.</abbr></th>
                      <th><abbr title="Won">Total </abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map( (product, i) => {
                      return(<tr>
                        <th>{i+1}</th>
                        <th><img src={`${product.product.images[0]}`} width="20" alt={product.product.name}/></th>
                        <td><a href={`/producto/${product.vendor._id}/${product.product._id}`} target="_blank" rel="noopener noreferrer">
                          {product.product.name} - <small>{product.sizeSelected ? product.sizeSelected:''}{product.selectedColor ?  ', '+product.selectedColor:''}</small></a>
                          </td>
                        <td><a href={`/tienda/${product.vendor._id}`} target="_blank" rel="noopener noreferrer">{product.vendor.company}</a></td>
                        <td>{product.shipped ? <span className="tag is-success is-light">Si</span> : <span className="tag is-danger is-light">No</span>}</td>
                        <td>{product.qty}</td>
                        <td>L {formatMoney(product.discountedPrice.discountedPrice * product.qty)}</td>
                      </tr>)
                    })}
                  </tbody>
                </table>         
              </div>
              <nav className="level">
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Total</p>
                    <p className="title is-4 has-text-weight-bold">L {formatMoney(order.orderTotal)}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Env&iacute;o <small>(Incluido)</small></p>
                    <p className="title is-4 has-text-weight-bold">L {formatMoney(order.shipping)}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Articulos</p>
                    <p className="title is-4 has-text-weight-bold">{order.totalItems}</p>
                  </div>
                </div>
                
              </nav>
            </div>
          </div>
          <hr/>
        </>)}
      </>
    );
  }
}

const UserOrders = withFirebase(UserOrdersBase);

export default UserOrders;