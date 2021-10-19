import React,{useEffect,useState} from 'react'
import styled from 'styled-components';
import { useUserContext } from '../../Context/UserdataContext'
import Button from '../button';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import orderservices from '../../api/orderservices';
import userService from '../../api/userservice';
import { useCartItemContext } from '../../Context/CartContext';
 
const Profilepagecontainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 3rem;
    background-color: white;
`;
const ImgWrapper = styled.div`
    margin: 20px;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    border: 1px solid black;
    background: url(${props => props.imgurl});
    background-size: cover;
`;
const PageWarn = styled.div`
    width: 100%;
    & p{
        font-size: 13px;
    }
`;
const Formcontainer = styled.div`
    width:60% ;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin:auto;
    padding: 1rem;
    border-radius: 10px;
    & form{
        width: 100%;
        height: max-content;
    }
    @media(max-width:725px){
        width: 100%;
    }

    & .error{
        font-size: 10px;
        color: red;
        margin: 5px;
    }
`;
const Formcontrol = styled.div`
    width: 100%;
    margin-top : 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & label{
        font-size: 13px;
        display: inline-block;
        @media(max-width:725px){
            text-align : left;
        }
    }

`;
const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 10px 0;
    & input[type="submit"],.btn--close{
        color: white;
        justify-self: center;
        padding: 5px 10px;
        text-align: center;
        border: 1px solid black;
        font-size: 13px;
        width: fit-content;
        background-color: black;
        border-radius: 0;
        margin: 10px 10px;
        cursor: pointer;
    }
`;
const Forminput = styled.input`
    display: inline-block;
    outline: none;
    padding: 5px;
    border-radius: 5px;
    font-size: 13px;
    border: 1px solid grey;
    &:not([type="submit"]){
        min-width: 60%;
    }
    &:focus{
        border: 1px solid black;
    }
`

const TransactionHistorySection = styled.div`
    width: 100%;
    padding: 20px;
    border-top: 1px solid black;
    & p {
        margin-bottom: 2rem;
        font-size: 25px;
    }
    & table{
        border: none;
        text-align: left;
        font-size: 13px;
        width: 100%;
        & tr{
            &:nth-child(even){
                background-color: black;
                color: white;
            }
            & th{
                text-align: center;
            }
            & td{
                cursor: pointer;
            }
            & th,td{
                padding: 15px;
                margin: 0;
            }
        }
        
    }
`

function Profilepage() {
    const history = useHistory();
    const userContext = useUserContext();
    const cartContext = useCartItemContext();
    const [updateuser, setupdateuser] = useState({
        password : "",
        address : userContext.address,
        postalcode : userContext.postalcode,
        phone : userContext.phone,
        newpassword : "",
        confirmpassword : "",
    });
    const [orderHistory, setorderHistory] = useState([])

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const schema = yup.object().shape({
        password : (userContext.role === "oauth2AppUser") ? 
            yup.string().nullable().notRequired() 
            : yup.string().required().test(function(value,context){
                return (value === "" || value === undefined) ? true : 
                    new Promise((resolve,reject)=>{
                        userService.postCredentials(userContext.email,value).then(res => res.status === 200 ? resolve(true) : resolve(false))
                    })
            }),
        newpassword : yup.string().nullable().notRequired().when({
            is: value=>value?.length,
            then: rule=> rule.required().min(5), 
        }),
        confirmpassword : yup.string().oneOf([yup.ref('newpassword'), null]),
        address : yup.string().required(),
        postalcode : yup.string().required().length(5),
        phone : yup.string().required().matches(phoneRegExp)
    })
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver : yupResolver(schema)
    });
 

    const changeHandler= (event)=>{
        setupdateuser({...updateuser,[event.target.name] : event.target.value});
        if(event.target.value === "" && userContext[event.target.name] !== ""){
            setupdateuser({...updateuser,[event.target.name] : userContext[event.target.name]});
        }
        console.log("updateruser",updateuser);
    }
    

    const updateHandler= ()=>{
        if(updateuser.newpassword === "" || updateuser.newpassword === undefined){
            userContext.updateUser(updateuser);
        }else{
            let {newpassword,confirmpassword, ...rest} = updateuser;
            userContext.updateUser({...rest,password : updateuser.newpassword});
        }
    }

    const logoutHandler=()=>{
        userContext.logoutUser();
        cartContext.clearCart();
        history.push("/")
    }
    useEffect(() => {
        localStorage.getItem("user") ? orderservices.getPaymentsByUserId(userContext.userId).then(res=>{
            console.log("order history :",res.data);
            setorderHistory(res.data);
        }) : history.push("/login");
    }, [])
    return (
        <Profilepagecontainer>
            <Formcontainer>
                    <PageWarn>
                        <p>Pastikan Alamat lengkap dan Nomor telfon sudah terisi sebelum melakukan pemesanan</p>
                    </PageWarn>
                    <ImgWrapper imgurl={`data:image/png;base64,${userContext.avatarurl}`} />
                <form onSubmit={handleSubmit(updateHandler)}>
                    <Formcontrol>
                        <label htmlFor="userId">User ID</label>
                        <Forminput type="text" placeholder={userContext.userId} readOnly={true} name="userId" id="userId"></Forminput>
                    </Formcontrol>
                    <Formcontrol>
                        <label htmlFor="email">E-mail</label>
                        <Forminput type="email" placeholder={userContext.email} readOnly={true} name="userId" id="email"></Forminput>
                    </Formcontrol>
                    <Formcontrol>
                        <label htmlFor="password">Password</label>
                        <Forminput {...register("password")} type="password" name="password" id="password" value={updateuser.password} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.password && <p className="error">*password did not match</p>}
                    <Formcontrol>
                        <label htmlFor="newpassword">New Password</label>
                        <Forminput {...register("newpassword")} type="password" placeholder="new password" name="newpassword" id="password" value={updateuser.newpassword} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.newpassword && <p className="error">*password minimum 5 characters</p>}
                    <Formcontrol>
                        <label htmlFor="confirmpassword">Confirm New Password</label>
                        <Forminput {...register("confirmpassword")} type="password" placeholder="confirm new password" name="confirmpassword" id="password" value={updateuser.confirmpassword} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.confirmpassword && <p className="error">*new password did not match</p>}
                    <Formcontrol>    
                        <label htmlFor="address">Address</label>
                        <Forminput {...register("address")} type="text" placeholder={userContext.address} name="address" value={updateuser.address} id="address" value={updateuser.address} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.address && <p className="error">*address required</p>}
                    <Formcontrol>    
                        <label htmlFor="postalcode">Postal code</label>
                        <Forminput {...register("postalcode")} type="text" placeholder={userContext.postalcode} name="postalcode" value={updateuser.postalcode} id="postalcode" value={updateuser.postalcode} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.postalcode && <p className="error">*postal code length must be 5</p>}
                    <Formcontrol>    
                        <label htmlFor="phone">Phone Number</label>
                        <Forminput {...register("phone")} type="text" placeholder={userContext.phone} name="phone" value={updateuser.phone} id="phone" value={updateuser.phone} onChange={changeHandler}></Forminput>
                    </Formcontrol>
                    {errors.phone && <p className="error">*your phone number doesn't look right</p>}
                    <ButtonWrapper>
                        <Button type="button" buttonSize="medium" buttonStyle="btn--close" onClick={logoutHandler}>Sign out</Button>
                        <Forminput type="submit" value="update" />
                    </ButtonWrapper>
                </form>
            </Formcontainer>
            <TransactionHistorySection>
                <p>TRANSACTION HISTORY</p>
                <table>
                    <tr>
                        <th>ORDER ID</th>
                        <th>ORDER DATE</th>
                    </tr>
                {orderHistory.map(payment=>{
                    return(
                        <tr key={payment.id} onClick={()=>{
                            history.push({
                                pathname : `/payment/${payment.id}`,
                                state :{
                                    payment : {...payment}
                                }
                            })
                        }}>
                            <td>{payment.id}</td>
                            <td>{new Date(payment.date).toLocaleString()}</td>
                        </tr>
                    )}
                )}
                </table>
            </TransactionHistorySection>
        </Profilepagecontainer>
    )
}

export default Profilepage
