import React, { useContext,useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import userservice from '../api/userservice';
import Cookies from 'js-cookie';
const AppUserContext = React.createContext({
    userId : "",
    email : "",
    address:"",
    phone: "",
    role: "",
    avatarurl:"",
    postalcode:"",
    avatar_url:"",
    token: "",
    signUserIn : ()=>{},
    registerUser : ()=>{},
    oauthSignIn : ()=>{},
    clearUser : ()=>{},
    updateUser : ()=>{},
    logoutUser : ()=>{},
    authenticated : false
});
export function useUserContext(){
    return useContext(AppUserContext);
}


function UserdataContext({children}) {
    const history = useHistory();
    const [user, setuser] = useState(
        {   userId: "",
            email : "",
            address: "",
            phone: "",
            roles:"",
            avatar_url:"",
            postalcode:"",
            token: ""
        });
    const clearUser = () => {
        setuser({});
    };
    const signUserIn = (email,password)=>{
        return userservice.postCredentials({
            email:email,
            password:password})
        .then(response => {
            if(response.status === 200){
                const {password,...rest} = response.data
                localStorage.setItem("user",JSON.stringify({...rest}));
                setuser(JSON.parse(localStorage.getItem("user")));
                history.goBack();
            }
        });
    };
    const registerUser = (credentials)=>{
        console.log("credentials : ",credentials);
        return userservice.registerUser(credentials)
        .then(response=>{
            if(response.status ===200){
                location.reload();
                alert("sucessfully registered")
            }
        })
        .catch(error=>{
            console.log("Error : ",error);
        })
    };
    const OauthSignIn = (profile,token,provider)=>{
        return userservice.oauthSignIn(token.id_token,provider)
            .then(response =>{
                if(response.status === 200){
                    localStorage.setItem("user",JSON.stringify({...response.data,token:token.id_token}));
                    setuser(JSON.parse(localStorage.getItem("user")));
                    return history.goBack();
                }
            })
            .catch(error => {
                console.log(error);
        })  
    };
    const LogoutUser = ()=>{
        return userservice.logoutUser().then(resp =>{
                clearUser();
                Cookies.remove("JSESSIONID");
                sessionStorage.clear();
                localStorage.clear();
                history.push("/");
        })
    }
    const updateUser = (updatedata) =>{
        if(user.roles === "oauth2Appuser"){
            let {password,...rest} = {...user,...updatedata};
            return userservice.updateUser(rest).then(response=>{
                if(response.status === 200){
                    localStorage.setItem("user",JSON.stringify({...rest,...updatedata}))
                    setuser(JSON.parse(localStorage.getItem("user")));
                    history.push("/");
                }
            }) 
        }else{
            return userservice.updateUser({...user,...updatedata})
            .then(response => {
                if(response.status === 200){
                    const {password,...rest} = {...response.data}
                    localStorage.setItem("user",JSON.stringify({...rest}));
                    setuser(JSON.parse(localStorage.getItem("user")));
                    history.push("/");
                }
            });
        }
    } 
    useEffect(() => {
        if(localStorage.getItem("user")){
            setuser(JSON.parse(localStorage.getItem("user")));

        }
        return () => {
            clearUser();
            sessionStorage.clear();
            localStorage.clear();
            Cookies.remove("JSESSIONID");
        }
    }, [])
    return (
        <AppUserContext.Provider 
        value={{
            authenticated: (user.userId !== "" && user.userId !== undefined),
            email: user.email,
            userId: user.userId,
            address: user.address,
            phone: user.phone,
            postalcode: user.postalcode,
            avatarurl: user.avatar_url,
            role: user.roles,
            token : user.token,
            registerUser:registerUser,
            signUserIn:signUserIn,
            oauthSignIn:OauthSignIn,
            clearUser: clearUser,
            updateUser : updateUser,
            logoutUser : LogoutUser,
        }}>
            {children}
        </AppUserContext.Provider>
    )
}

export default UserdataContext;
