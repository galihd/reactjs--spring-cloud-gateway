import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { mapProductDisplay } from '../../api/productservices.js';
import Button from '../button.js';
import { useCartItemContext } from '../../Context/CartContext.js';
import { useHistory } from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinusCircle,faPlusCircle} from '@fortawesome/free-solid-svg-icons'
const Cartpage = styled.div`
    display: grid;
    width: 100%;
    min-height: 100%;
    background-color: white;
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: auto;
    padding: 1rem;
    @media (max-width:800px){
        display: flex;
        flex-wrap: wrap;
    }
`;
const Paysection = styled.div`
    width: 100%;
    padding: 10px;
    font-size: 30px;
    border: 1px solid black;
    border-radius: 8px;
    height: fit-content;
    margin: 5px;
    position: relative;
    & .btn{
        position: absolute;
        right: 0;
        bottom: 0;
        outline: 1px solid black;
        border-radius: 3px;
        overflow: hidden;
        &:active{
            background-color: black;
            color: white;
        }
        &::before{
            position:Absolute;
            content:"";
            margin:0;
            left:0;
            bottom:0;
            height:10px;
            width:10px;
            border-left: 2px solid orangered;
            border-bottom: 2px solid orangered;
            transition: all 200ms;
        }
        &::after{
            position:Absolute;
            content:"";
            margin:0;
            top:0;
            right:0;
            height:10px;
            width:10px;
            border-top: 2px solid green;
            border-right: 2px solid green;
            transition: all 200ms;
        }
    }

    & .btn:hover{
        -webkit-text-stroke-width: 0.5px;
        -webkit-text-stroke-color: white;
        -webkit-text-fill-color: pink;
        &::before{
            height:100%;
            width:100%;
        }
        &::after{
            height:100%;
            width:100%;
        }
    }

`;
const Orderlistcontainer = styled.div`
    width: 100%;
    height: 100%;
`;

const Totalinfo = styled.p`
    text-align: left;
    font-size: ${props => props.size};
    color: ${props => props.color};
    display: block;
    margin-top:  ${props => props.margin || "5px"};
`;

function Cartspage() {
    const cartItemContext = useCartItemContext();
    const history = useHistory();
    const [Total, setTotal] = useState(0);
    const [orderqty, setorderqty] = useState(0);
    useEffect(()=>{
        !localStorage.getItem("user") && history.push("/login")
    },[])
    useEffect(()=>{
        let total = 0;
        let orderqty = 0;
        cartItemContext.cartItem.forEach(item=>{
            total+= item.subtotal;
            orderqty += item.qty;
        })
        setorderqty(orderqty);
        setTotal(total);
    },[cartItemContext.cartItem])


    const orderHandler = ()=>{
        if(cartItemContext.cartItem.length > 0){
            setTotal(0);
            cartItemContext.postPayment(Total);
        }
    }
    return (
        
        <Cartpage>
            <Orderlistcontainer>
            {cartItemContext.cartItem.map((item,index)=>{
                return(
                    <Productorder 
                        orderId={item.orderId}
                        product={item.product}
                        date={new Date(item.date).toLocaleString()}
                        qty={item.qty}
                        subtotal={item.subtotal}
                        key={index}
                    />
                );
            })}
            </Orderlistcontainer>
            <Paysection>
                <Totalinfo size="15px" color="gray">Total Ordered : {orderqty}</Totalinfo>
                <Totalinfo size="15px" color="gray">Discount : Rp 0</Totalinfo>
                <Totalinfo size="25px" margin="1rem">TOTAL : Rp {Total}</Totalinfo>
                <Button buttonSize="medium" buttonStyle="btn--primary" onClick={orderHandler}>Order</Button>
            </Paysection>
        </Cartpage>
    )
}

const Productwrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid black;
    border-radius: 8px;
    margin: 5px;
    position: relative;
`;
const Orderthumbnail = styled.div`
    width: 5rem;
    height: 5rem;
    background-image: url(${props => `data:image/png;base64,${props.thumbnail}`});
    background-size: cover;
`
const Orderinfo=styled.div`
    display: flex;
    width: auto;
    padding: 10px;
    width: 100%;
    text-align: left;
    & p{
        margin: 3px;
    }
`;
const Fixeddesc=styled.div`

`;
const Productname=styled.p`
    font-size: 15px;
    font-weight: bold;
`;

const Productdesc=styled.p`
    font-size: 12px;
    color: #282828;
    text-align: ${props => props.align || "left"};
`;
const Editabledesc = styled.div`
    margin-left: auto;
    & span {
        font-size: 13px;
    }
    &div{
        margin: 0;
        margin-top: auto;
    }
    @media (max-width:550px){
        & span{
            margin: 5px;
        }
    }

    & .btn{
        position: absolute;
        right: 0;
        top: 0;
        margin: 0;
        border-radius: 8px;
    }
`;
const Wrapperdiv = styled.div`
    margin-top: 1rem;
    padding: 10px 20px;
    width: max-content;
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

function Productorder({orderId,product,qty,date}){
    const cartContext = useCartItemContext();
    const [itemqty, setitemqty] = useState(qty);
    const [edited, setedited] = useState(false);

    useEffect(() => {
        qty === itemqty ? setedited(false) : setedited(true);
    }, [itemqty])
    

    return(
        <Productwrapper>
            <Orderthumbnail thumbnail={product.displays[0]}/>
            <Orderinfo>
                <Fixeddesc>
                <Productname>{product.productName}</Productname>
                <Productdesc>Price : {product.price}</Productdesc>
                <Productdesc>Order ID : {orderId}</Productdesc>
                <Productdesc>Order date : {date}</Productdesc>
                </Fixeddesc>
                <Editabledesc>
                {   
                    edited && 
                    <Button buttonSize="small" 
                        buttonStyle= { itemqty===0? "btn--close" : "btn--primary"} 
                        onClick={itemqty===0? ()=>cartContext.removeCartItem(orderId) : ()=>cartContext.updateCartItem(orderId,product,itemqty)}>
                       {itemqty===0? "Remove" : "Save"}
                    </Button>
                }
                <Wrapperdiv>
                    <button  onClick={()=>setitemqty(prev =>(prev-1))}><FontAwesomeIcon icon={faMinusCircle}/></button>
                    <span>{itemqty}</span>
                    <button  onClick={()=>setitemqty(prev=>(prev+1))}><FontAwesomeIcon icon={faPlusCircle}/></button>
                </Wrapperdiv>
                <Productdesc align="center">Rp {itemqty*product.price}</Productdesc>
                </Editabledesc>
            </Orderinfo>
        </Productwrapper>
    )
}

export default Cartspage
