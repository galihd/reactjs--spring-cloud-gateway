import React, { useState,useEffect } from 'react';
import CardItem from './CardItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Cards.css';
// import productservices from '../api/productservices';


function Cards({category,productlist}) {
    const [display, setdisplay] = useState(true);
    return (
        <div className="cards">
            <div className="cards-header"
                onClick={()=>{setdisplay(!display)}}>
                <span>
                    <FontAwesomeIcon icon={display? faChevronDown : faChevronRight} />
                </span>
                <h3>{category}</h3>
             </div>
            {productlist && <CardsContainer active={display?"active":"hidden"} products={productlist}/>}
        </div>
    )
}

function CardsContainer({active,products}){
    return(
    <div className={`cardscontainer ${active}`}>
            {
                products.map((product,index) => {
                    return(
                        <CardItem product={product} key={index}/>
                    )
                })
            }
    </div>
    )
}
export default Cards;
