import axios from "./axiosconfig.js";
//todo : add authorization header
class userService{
    registerUser(user){
        return axios.post("/api/user",user);
    }
    postCredentials(user){
        return axios.post("/login",user);
    }
    oauthSignIn(token,provider){
        return axios.post(`/oauthlogin?provider=${provider}`,
        {description : "oauth2 sign in post"},
        {
            headers:{
                Authorization : `Bearer ${token}`
            }
        }
        );
    }
    updateUser(user){
        return axios.put("/api/user",user);
    }
    logoutUser(){
        return axios.post("/logout");
    }
}

export default new userService();