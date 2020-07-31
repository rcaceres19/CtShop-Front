import React from 'react'
import SearchBar from '../../components/searchbar';
import algoliasearch from 'algoliasearch/lite';

// Custom Components
import DataSection from '../../components/home/dataSection';
import Stores from '../../components/home/afiliados';

const client = algoliasearch('JMZRBX4JGB', 'd1bde073070f32b4e78c356083cb55cd');
const index = client.initIndex('ctindex');

const internals = {
  productos: []
};

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const dataTransaction = await index.search('');
      
      if (dataTransaction.nbHits > 0) {

        internals.productos = dataTransaction.hits.map( item => {

          item['_id'] = item.objectID;
          item['negocio'] = item.vendedorID;
          item['images'] = item.image;

          return item;
        });
        
      }
      
      this.setState({loading: false});
    } catch(e) {
      console.log(e.message);

      this.setState({loading: false});
    }
  }

  render() {
    return(
      <React.Fragment>
        <SearchBar/>
        <section className="section">
        <div className="container has-text-centered">
          <a href="https://admin.catrachosshop.com/" target="_blank" rel="noopener noreferrer"><img src="/banner.jpeg" alt="Catrachoshop.com"/></a>
        </div>
        </section>
        <DataSection title="&Uacute;ltimos Agregados" products={[...internals.productos].sort( (a,b) => a.dateAdded - b.dateAdded).slice(0, 10)}/>
        <DataSection title="Ofertas" products={internals.productos.filter( oferta => (oferta && oferta.descuento && oferta.descuento.porcentaje > 0) ).slice(0, 10)}/>
        <Stores />
        <hr/>
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="columns is-centered">
                <div className="column is-three-fifths">
                  <h1 className="title is-3 has-text-centered"><b>¿C&oacute;mo funciona Catrachos Shop?</b></h1>
                  <hr/>
                  <p><a href="/"><b>Catrachos Shop</b></a> es una plataforma de tiendas online para micro, peque&ntilde;a y medianas empresas donde nuestros afiliados ofrecen sus productos a trav&eacute;s de la herramienta de la misma manera que comercializan en su tienda f&iacute;sica. Aqu&iacute; encontrar&aacute;s una diversidad de productos y empresas locales que se adapta a lo que buscas.  Apoya la creatividad, el dise&ntilde;o y la innovaci&oacute;n de estos empresarios.</p>
                  <hr />
                  <p>Estos son algunos datos que debes conocer sobre c&oacute;mo funciona <a href="/"><b>Catrachos Shop</b></a>:</p>
                  <ul>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Reg&iacute;strate.</li>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Revisa el cat&aacute;logo de productos de las tiendas o busca lo que necesitas.</li>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Agrega al carrito de compras los art&iacute;culos que deseas comprar.</li>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Completa un formulario con tu informaci&oacute;n de facturaci&oacute;n.</li>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Selecciona un m&eacute;todo de pago ya sea con tarjeta de cr&eacute;dito/d&eacute;bito o PayPal.</li>
                      <li><i class="fa fa-check" aria-hidden="true"></i> Pasa por t&uacute; compra o coordina con la empresa para realizar el env&iacute;o.</li>
                  </ul>
                  <hr />
                  <p className="has-text-centered"><b>¡Apoya a las empresas locales!</b></p>
                  <br />
                </div>
                <div className="column">
                  <img src="/store.svg" alt="catrashosshop.com" width="500"/>
                </div>
              </div>
            </div>
          </div> {/*  Container */}
        </section>{/*  Section */}
      </React.Fragment>
    );
  }
}


export default Home;