import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{useState,useEffect} from 'react'
import { useLocation, useParams} from 'react-router'
import styled from 'styled-components';
import orderservices from '../../api/orderservices';

const PaymentPage = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
`
const Pagedesc = styled.p`
    font-size: 30px;
`
const UserId = styled.p`
    font-size: 20px;
`
const Orderdetailscontainer =styled.div`
    margin-top: 3rem;
    display: flex;
    flex-wrap: wrap;
    width: 50vw;
    margin: auto;
    padding: 10px;
    @media (max-width:800px){
        width: 100%;
    }
    & .product-details{
        padding-left: 40px;
    }
    & .details-btn{
        cursor: pointer;
    }
`
const Orderdetailsitem = styled.div`
    width: 100%;
    text-align: left;
    display: flex;
    padding: 10px;
`
const Orderdetailsdesc = styled.div`
    width: 30%;
`
const Orderdetailsvalue = styled.div`
    width: auto;
`
function Paymentpage() {
    const location = useLocation();
    const {paymentId} = useParams();
    const [paymentobj, setPaymentobj] = useState({
        id:"",
        date:"",
        orderlist:[],
        userId : "",
        total:"",
        confirmed: false
    })
    useEffect(() => {
        location.state.payment ? 
            setPaymentobj(location.state.payment) : 
                orderservices.getPaymentById(paymentId).then(response => {setPaymentobj({...response.data})});
        return () => {
            setPaymentobj({});
        }
    }, [])
    const [showDetails, setshowDetails] = useState(false);
    return (
            <PaymentPage>
            <Pagedesc>Order Details</Pagedesc>
            <UserId>Ordered by {paymentobj.userId}</UserId>
            <Orderdetailscontainer>
                <Orderdetailsitem>
                    <Orderdetailsdesc>Payment Id</Orderdetailsdesc>
                    <Orderdetailsvalue>: {paymentobj.id}</Orderdetailsvalue>
                </Orderdetailsitem>
                <Orderdetailsitem>
                    <Orderdetailsdesc>Date</Orderdetailsdesc>
                    <Orderdetailsvalue>: {new Date(paymentobj.date).toLocaleString()}</Orderdetailsvalue>
                </Orderdetailsitem>
                <Orderdetailsitem className = "details-btn" onClick={()=>setshowDetails(!showDetails)}>
                    <Orderdetailsdesc> <FontAwesomeIcon icon={showDetails ? faMinus : faPlus}/> Details </Orderdetailsdesc>
                </Orderdetailsitem>
                    {showDetails && paymentobj.orderlist.map(orders => {
                        return (
                            <>
                            <Orderdetailsitem  className="product-details">
                                <Orderdetailsdesc>Product Name</Orderdetailsdesc>
                                <Orderdetailsvalue>: {orders.product.productName}</Orderdetailsvalue>
                            </Orderdetailsitem>
                            <Orderdetailsitem className="product-details">
                                <Orderdetailsdesc>Product price</Orderdetailsdesc>
                                <Orderdetailsvalue>: {orders.product.price}</Orderdetailsvalue>
                            </Orderdetailsitem>
                            <Orderdetailsitem className="product-details">
                                <Orderdetailsdesc>qty</Orderdetailsdesc>
                                <Orderdetailsvalue>: {orders.qty}</Orderdetailsvalue>
                            </Orderdetailsitem>
                            <Orderdetailsitem className="product-details">
                                <Orderdetailsdesc>subtotal</Orderdetailsdesc>
                                <Orderdetailsvalue>: {orders.subtotal}</Orderdetailsvalue>
                            </Orderdetailsitem>
                            </>
                        )
                    })}
                <Orderdetailsitem>
                    <Orderdetailsdesc>Total</Orderdetailsdesc>
                    <Orderdetailsvalue>: {paymentobj.total}</Orderdetailsvalue>
                </Orderdetailsitem>
                <Orderdetailsitem>
                    <Orderdetailsdesc>Status</Orderdetailsdesc>
                    <Orderdetailsvalue>: {paymentobj.confirmed ? "payment accepted" : "not paid yet"}</Orderdetailsvalue>
                </Orderdetailsitem>
            </Orderdetailscontainer>
            </PaymentPage>
        
    )
}

export default Paymentpage
