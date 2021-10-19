import axios from "./axiosconfig.js";

class productService{
    
    getAllProducts(){
        return axios.get("/api/products")
        .then(response => {
            if(response.data.length && response.data){
                return response.data;
            }
        })
    }
    getProductsByCategory(category){
        return axios.get("/api/products/category/"+category)
        .then(response =>{
            if(response.data.length && response.data){
                return response.data;
            }
        })
        
    }

}


export default new productService();