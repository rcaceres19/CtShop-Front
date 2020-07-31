import React from 'react';
import { withFirebase } from '../../vendor/firebase';
import Loader from '../../components/loader/bversion';
import ImageGallery from 'react-image-gallery';
import SearchBar from '../../components/searchbar';
import ProductPrice from '../../components/productPrice';
import NumericInput from 'react-numeric-input';
import AddToCartBtn from '../../components/addToCartBtn';
import _array from 'lodash/array';
import { Link } from 'react-router-dom';
import ProductComments from '../../components/productComments';
import MyReactImageMagnify from "./MyReactImageMagnify";
import ProductColor from '../../components/productColor';

class ProductDetailPageBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company: null,
      product: null,
      loading: true,
      qty: 1,
      stock: 0,
      hasSizes: false,
      hasColors: false,
      avaAmount: 0,
      sizeSelected: false,
      error: false,
      colors: [],
      selectedColor: null
    };

    this.increaseQty = this.increaseQty.bind(this);
    this.setSize = this.setSize.bind(this);
    this.myRenderItem = this.myRenderItem.bind(this);
    this.selectColor = this.selectColor.bind(this);
  }

  async componentDidMount() {
    let {owner = null, product = null } = this.props;
    
    if (owner && product) {
      try {
        let company = await this.props.firebase.db.ref(`/companies/${owner}`).once('value');
        let prd = await this.props.firebase.db.ref(`/products/${owner}/${product}`).once('value');
        let hasSizes = false;
        let avaAmount = 0;
        let sizeSelected = false;
        let colors = [];
        let selectedColor = null;

        company = company.val();
        prd = prd.val();

        company._id = owner;
        prd._id = product;

        prd.images = prd.images.map( image => { return { original: image, thumbnail: image, renderItem: this.myRenderItem }});
        hasSizes = Array.isArray(prd.stock);
        avaAmount = hasSizes ? prd.stock[0].cantidad : prd.stock;
        sizeSelected = hasSizes ? prd.stock[0].talla : sizeSelected;
        colors  = prd.cat === 'ropa' && hasSizes ? prd.stock[0].color : [];
        selectedColor = colors.length ? colors[0].toLowerCase() : null;

        this.setState({ company, product: prd, loading: false, hasSizes, avaAmount, sizeSelected, colors, selectedColor });
      } catch (e) {
        console.log(e);

        this.setState({ owner, product, loading: false, error: true });
      }
    }
  }

  setSize(size) {
    const stock = this.state.product.stock;
    const findSize = _array.findIndex(stock, item => item.talla === size);
    
    this.setState({ sizeSelected: size, avaAmount: stock[findSize].cantidad, qty: 1, colors: stock[findSize].color });
  }

  selectColor(selectedColor) {
    this.setState({ selectedColor });
  }

  increaseQty(qty) {
    this.setState({ qty });
  }

  myRenderItem() {
    return <MyReactImageMagnify smallImage={arguments[0].thumbnail} largeImage={arguments[0].original} />;
  }

  render() {
    const { company, product, qty, hasSizes, avaAmount, sizeSelected, hasColors, selectedColor} = this.state;

    return (
      <>
        <SearchBar noText={true}/>
        <section className="section">
          <div className="container">
            {this.state.loading && <Loader withMessage={false} />}
            {!this.state.loading && <>
              <div className="row">
                <div className="columns is-centered">
                  <div className="column is-one-third">
                    <ImageGallery
                      items={product.images}
                      thumbnailPosition="left"
                      showFullscreenButton={false}
                      showPlayButton={false}
                    />
                  </div>
                  <div className="column is-two-fifths">
                    <div id="myPortal" />
                    <small><a href="/">{product.cat}</a> / {product.name}</small>
                    <h1 className="title is-3 is-bold has-text-black has-text-weight-bold ">
                      {product.name} <br/>
                      <span className="tag is-small is-white">Vendido Por: </span><span className="tag is-small is-light">
                        <Link to={`/tienda/${company._id}`}>{company.company}</Link>
                        </span>
                    </h1>
                    <hr/>
                    <p>{product.desc}</p>
                    <hr/>
                    {hasSizes && <><h5 className="title is-5 has-text-weight-bold has-text-grey">Tallas disponibles:</h5>
                    <p className="has-text-centered"><div className="select is-rounded is-centered is-danger">
                      <select onChange={ e => this.setSize(e.target.value)}>
                        {product.stock.map( item => <option value={item.talla}>{item.talla}</option>)}
                      </select>
                    </div></p>
                    <hr/></>}
                    {this.state.colors.length > 0 && <><h5 className="title is-5 has-text-weight-bold has-text-grey">Colores disponibles:</h5>
                      <p className="has-text-centered">{this.state.colors.map( c => <ProductColor changecolor={this.selectColor} color={c} selectedcolor={this.state.selectedColor}/>)}</p>
                    <hr/></>}
                    <h5 className="title is-5 has-text-weight-bold has-text-grey">Precio:</h5>
                    <ProductPrice price={product.price} discount={ product.descuento ? product.descuento.porcentaje : null } />
                    <hr/>
                    <p className="has-text-centered">
                      <small><b>Cantidad Disponible: {avaAmount}</b></small> <br/>
                      <NumericInput className="input" step={1} min={1} max={Number(avaAmount)} value={qty} size={3} onChange={ (van) => this.increaseQty(van)}/>
                    </p>
                    <br/><br/>
                    <AddToCartBtn vendor={company} product={product} qty={qty} sizeSelected={sizeSelected} selectedColor={selectedColor ? selectedColor : false} />
                  </div>
                </div>
              </div>
            </>}
            <hr/>
            <div className="row">
              <ProductComments firebase={this.props.firebase} product={this.props.product}/>
            </div>
          </div>
        </section>
      </>
    );
  }
}


const ProductDetailPage = withFirebase(ProductDetailPageBase);

export default ProductDetailPage;