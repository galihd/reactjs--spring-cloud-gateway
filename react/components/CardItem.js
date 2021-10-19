import React, { useState} from 'react'
import {CSSTransition} from 'react-transition-group';
import './CardItem.css'
import Productoverlay from './pages/Productoverlay';


function CardItem({product}) {
    const [hovered, sethovered] = useState(false);
    const [modalOPen, setmodalOPen] = useState(false);

    return(
        <>
        <Productoverlay show={modalOPen} closemodal={() => setmodalOPen(false)} product={product}/>
        <div className="card-item-wrapper">
        <div className="card-item">
            <a className="thumb-wrapper"
                onClick={()=>setmodalOPen(true)}
                onMouseEnter={()=>sethovered(true)}
                onMouseOut={()=>sethovered(false)}>
                    <CSSTransition in={hovered} timeout={200} 
                    classNames={{enter: "hovered-enter"
                                ,enterActive:"hovered-active",
                                exit:"hovered-exit",
                                exitActive:"hovered-exit-active"}}>
                <img
                    src={hovered? `data:image/png;base64,${product.displays[0]}` : `data:image/png;base64,${product.displays[1]}`}
                    alt={product.productName}
                />
                    </CSSTransition>
            </a>
            <div className="card-info">
                <h2 onClick={()=>setmodalOPen(true)}>
                    <span>{product.productName}</span>
                </h2>
                <h3>{`Rp ${product.price}`}</h3>
            </div>
        </div>
        </div>
        </>
    )
}

export default CardItem;