import React from 'react';
import { getProductColor } from '../../utils/products';

const ProductDetailColor = props => {
  const isSelected = props.color === props.selectedcolor ? 'selected' : '';
  return (
    <div className={`product-color ${props.color} ${isSelected}`} style={{backgroundColor: getProductColor(props.color)}} onClick={() => props.changecolor(props.color)}></div>
  )
};

export default ProductDetailColor;