import React,{useContext,useState,useEffect,useRef} from 'react';
import { useHistory } from 'react-router-dom';
import orderService from '../api/orderservices';
import { useUserContext } from './UserdataContext';
import axiosinstance from '../api/axiosconfig';
import Cookies from 'js-cookie';
 

const CartItemContext = React.createContext(
    {
    cartItem : [],
    addCartItem : ()=>{},
    removeCartItem : ()=>{},
    updateCartItem : ()=>{},
    postPayment : ()=>{},
    getUserCarts : ()=>{},
    clearCart : ()=>{}
    }
);
export function useCartItemContext(){
    return useContext(CartItemContext);
}
function CartContext({children}) {
    const history = useHistory();
    const userContext = useUserContext();
    const [cartItem, setcartItem] = useState([]);
    const ismounted = useRef(false);
    const clearCartItem = ()=>{
        setcartItem([]);
    }
    const addCartItem = (product,qty) =>{
        return orderService.postCollectOrder({
            product:product,
            qty:qty,
            userId: userContext.userId,
        }).then(response=>{
            setcartItem([]);
            return setcartItem(response.data);
        })
    }
    const removeCartItem = (orderId)=>{
        return orderService.deleteCollectOrder(orderId,userContext.userId)
        .then(response=>{
            setcartItem([]);
            return setcartItem(response.data);
        });
    }
    const updateCartItem = (orderId,product,qty) =>{
        return orderService.updateCollectOrder({
            orderId : orderId,
            product : product,
            qty : qty,
            date : new Date().getTime(),
            userId : userContext.userId
        }).then(response=> {
            setcartItem([]);
            return setcartItem(response.data);
        });
    }
    const postPayment = (total)=>{
        return (userContext.address !== null && userContext.phone !== null && userContext.postalcode !== null) ? 
            orderService.postPayment({
                orderlist:cartItem,
                userId : userContext.userId,
                total : total
            })
            .then(response=>{
                if(response.status === 200){
                    setcartItem([]);
                    window.open(`https://wa.me/+6282240955516?text=${chatgenerator(response.data)}`);
                    history.push({
                        pathname : `/payment/${response.data.id}`,
                        state:{
                            payment : {...response.data}
                        }
                    });
                }
            }) 
            :
            history.push("/profile")
    }
    const getUserCarts = () =>{
        return orderService.getCart(userContext.userId).then(response=> {
            console.log("getcart response:",response.data);
            setcartItem(response.data);})
    }
    const chatgenerator = (paymentobject)=>{
        return encodeURI(`Permisi kak, saya user ${paymentobject.userId} \n`+ 
        `telah melakukan pemesanan dengan id pembayaran ${paymentobject.id} \n`+
        `detail pesanan : \n`+
        `${paymentobject.orderlist.map((order,index)=>{
            return `produk : ${order.product.productName} \n`+
                    `jumlah : ${order.qty} \n`
        })}`+
        `total pembayaran : ${paymentobject.total}
        `
        )}
    useEffect(() => {
    var requestinterceptor;
    var responseinterceptor;
        if(!ismounted.current){
            ismounted.current = true;
        }else{
            if(userContext.authenticated){
                requestinterceptor = axiosinstance.interceptors.request.use(request =>{
                    if(userContext.role === "oauth2AppUser")
                        {request.headers.Authorization = `Bearer ${userContext.token}`;}
                    return request;
                });
                responseinterceptor = axiosinstance.interceptors.response.use(response => {
                    return response;
                },error=>{
                        console.log("error catched, status : ",error.response.status);
                        if(error.response.status === 401){
                            userContext.logoutUser();
                        }
                        return Promise.reject(error);
                    }
                );
                getUserCarts();
            }
            
        }
        return ()=>{
            axiosinstance.interceptors.request.eject(requestinterceptor);
            axiosinstance.interceptors.response.eject(responseinterceptor);
        }
    },[userContext.authenticated])
    return (
        <CartItemContext.Provider 
        value=
                {{
                    cartItem: cartItem
                    ,addCartItem : addCartItem
                    ,removeCartItem: removeCartItem
                    ,updateCartItem : updateCartItem
                    ,postPayment : postPayment
                    ,getUserCarts : getUserCarts
                    ,clearCart : clearCartItem
                }}>
            {children}
        </CartItemContext.Provider>
    )
}

export default CartContext
