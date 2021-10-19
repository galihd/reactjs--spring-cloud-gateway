import React,{useState} from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css";
import {CSSTransition} from 'react-transition-group';
import './ProductCarousel.css';

function ProductList({Categories,Caption,settings,carouselitems}) {

    return(
        <div className="carousel">
        <div className="carousel-head">
            <h2>{Categories}</h2>
            <span>{Caption}</span>
        </div>
        <div className="carousel-items">
        <Slider {...settings}>
            {Categories ? carouselitems.map((items,index)=>{
                   return(
                   <CarouselItem
                    src={`data:image/png;base64,${items.displays[0]}`}
                    alt={items.alt}
                    caption={items.caption}
                    key={index}/>
                   )
            }) : 
            carouselitems.map((display,index) => {
                return(
                    <CarouselItem
                        src={`data:image/png;base64,${display}`}
                        key={index} />
                    )
            })
            }
        </Slider>
        </div>
    </div>
        
    )
    
}

function CarouselItem({src,alt,caption}) {
    const [hovered, sethovered] = useState(false);
    return(
        <div className="carousel-item">
            <a className="carousel-thumb-wrapper">
                <CSSTransition in={hovered} timeout={100} 
                classNames={{enter: "carousel-hovered-enter"
                            ,enterActive:"carousel-hovered-active",
                            exit:"carousel-hovered-exit",
                            exitActive:"carousel-hovered-exit-active"}}>
                <img
                    onMouseEnter={()=> sethovered(true)}
                    onMouseOut={()=> sethovered(false)}
                    src={src}
                    alt={alt}
                />
                </CSSTransition>
                <div className="carousel-info">
                    <h2>{caption}</h2>
                </div>
            </a>
        </div>
    )
}

export default ProductList;