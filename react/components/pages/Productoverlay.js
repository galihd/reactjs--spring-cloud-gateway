import React,{useState} from 'react'
import ReactModal from 'react-modal';
import Button from '../button';
import ProductList from '../ProductCarousel';
import "./productoverlay.css";
import { useCartItemContext } from '../../Context/CartContext';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinusCircle,faPlusCircle} from '@fortawesome/free-solid-svg-icons'

ReactModal.setAppElement("#react");
const Wrapperdiv = styled.div`
    margin-top: 1rem;
    padding: 10px 20px;
    width: fit-content;
    outline: 1px solid black;
    & button{
        outline: none;
        border: none;
        background-color: white;
        cursor: pointer;
    }

    & span{
        margin: 5px 15px;
    }
    @media (max-width:600px){
        padding: 5px 10px;
    }
`;
function Productoverlay({show,closemodal,product}) {
    var settings =
    {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: product.displays.length,
        slidesToScroll: 1,
        autoplay : false,
        adaptiveHeight:true,
        useTransform:true,
        focusOnSelect:true,
        centerPadding:"60px",
        afterChange: (index)=>{setselectedimg(product.displays[index])},
        responsive:[
            {
                breakpoint: 1300,
                settings:{
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 968,
                settings:{
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 720,
                settings:{
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 620,
                settings:{
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    }

    const cartItemContext = useCartItemContext();
    const [selectedimg, setselectedimg] = useState(product.displays[0]);
    const [itemqty, setitemqty] = useState(1);


    const addProducthandler = ()=>{
        cartItemContext.addCartItem(product,itemqty);
        setitemqty(1);
        closemodal();
    }
    return (
            <ReactModal 
                isOpen={show}
                preventScroll={true}
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                onRequestClose={closemodal}
                style={
                    {
                        content:{
                            top:"50%",
                            left:"50%",
                            height:"80vh",
                            width:"80vw",
                            marginLeft:"-40vw",
                            marginTop:"-40vh",
                            display:"flex",
                        },
                        overlay:{
                            
                        }
                    }
                }
            >   
                <div className="product-display-container">
                    <div className="thumbnail-display">
                        <img src={`data:image/png;base64,${selectedimg}`} alt={`${product.productId} - ${product.productName}` } />
                    </div>
                    <ProductList
                        settings={settings}
                        carouselitems={product.displays} 
                    />
                </div>
                <div className="product-info-container">
                    <Button buttonStyle="btn--close" 
                            buttonSize="small" 
                            onClick={closemodal}>X
                    </Button>
                    <div className="product-info-item-name">
                        <h2>{product.productName}</h2>
                        <h4>{`Rp ${product.price}`}</h4>
                    </div>
                    <div className="product-info-itemqty">
                        <span>Stok : </span>
                        <Wrapperdiv>
                            <button  onClick={()=>setitemqty(prev =>(prev-1))}><FontAwesomeIcon icon={faMinusCircle}/></button>
                            <span>{itemqty}</span>
                            <button  onClick={()=>setitemqty(prev=>(prev+1))}><FontAwesomeIcon icon={faPlusCircle}/></button>
                        </Wrapperdiv>
                    </div>
                    <div className="add-to-cart">
                        <Button buttonStyle="btn--primary" onClick ={addProducthandler}>ADD TO CART</Button>
                    </div>
                    <div className="product-info-item-desc">
                        <p>{product.description}</p>
                    </div>


                </div>
            </ReactModal>
    )
}

export default Productoverlay
