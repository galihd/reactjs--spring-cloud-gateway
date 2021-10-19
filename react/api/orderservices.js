import axios from "./axiosconfig.js";



class orderService{

    postOrder(productOrder){
        return axios.post("/api/order",productOrder);
    }
    deleteOrder(orderid){
        return axios.delete("/api/order?id="+orderid);
    }
    postCollectOrder(productOrder){
        return axios.post("/api/userorder",productOrder);
    }
    getCart(userId){
        return axios.get("/api/userorder?userId="+userId);
    }
    updateCollectOrder(productOrder){
        return axios.put("/api/userorder",productOrder);
    }
    deleteCollectOrder(orderId,userId){
        return axios.delete(`/api/userorder?orderId=${orderId}&userId=${userId}`);
    }
    getPaymentById(paymentId){
        return axios.get(`/api/payment/${paymentId}`);
    }
    getPaymentsByUserId(userId){
        return axios.get(`/api/userorder/payment/${userId}`);
    }
    postPayment(payment){
        return axios.post("/api/payment",payment);
    }
}

export default new orderService();