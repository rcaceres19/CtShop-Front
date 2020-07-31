export const normalizeProducts = data => {
  const negocios = Object.keys(data);
  const productos = [];

  if (negocios.length) {
    negocios.forEach( negocio => {
      const productosKeys = Object.keys( data[negocio] );

      productosKeys.forEach( producto => {

        data[negocio][producto]['price'] = Number(data[negocio][producto]['price']);
        const product = {_id: producto,...data[negocio][producto], negocio};

        productos.push( product );
      });
    });
  }

  console.log(productos);

  return productos;
};

export const priceWithDiscount = (price = 0, discount = null) => {

  return {
    original: Number(price),
    discountedPrice: discount ? (Number(price) - ( Number(price) * (Number(discount) / 100 ))) : Number(price)
  };
};

export const formatMoney = (num) => Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

export const getProductColor = color => {
  console.log(color);
  const COLORS = {
    rojo: '#e11010',
    azul: '#0a1fe0',
    verde: '#0fbb47',
    negro: '#000',
    blanco: '#fff',
    turquesa: '#40E0D0',
    celeste: '#0fb0ba',
    morado: '#7e0fba',
    gris: '#d0d0d0',
    amarillo: '#f0ed0e',
  };

  return COLORS[color.toLowerCase()];
};
