import React from 'react'
import './BreadCrum.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons'; 
const BreadCrum = (props) => {
    const {product}=props;
  return (
    <div className='BreadCrum'>
      HOME <FontAwesomeIcon icon={faAngleRight} /> SHOP <FontAwesomeIcon icon={faAngleRight} /> {product.category} <FontAwesomeIcon icon={faAngleRight} /> {product.sub_category} <FontAwesomeIcon icon={faAngleRight} /> {product.lecturer} <FontAwesomeIcon icon={faAngleRight} /> {product.name}
     
    </div>
  )
}

export default BreadCrum
