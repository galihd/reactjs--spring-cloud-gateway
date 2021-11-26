import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{useState} from 'react'
import GoogleLogin from 'react-google-login';
import { useForm } from 'react-hook-form';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import styled from 'styled-components';
import { useUserContext } from '../../Context/UserdataContext';
import Button from '../button';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'
const Loginpagecontainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 3rem;
    background-color: white;

    & .formtransition-enter{
        height: 0;
        opacity: 0;
    }
    & .formtransition-enter-active{
        height: 1;
        opacity: 1;
        transition: height 200ms ease;
        transition: opacity 2s ease;
    }
    & .formtransition-exit{
        height: 1;
        opacity: 0;
    }
    & .formtransition-exit-active{
        height: 0;
        opacity: 1;
        transition: height 200ms ease;
        transition: opacity 2s ease;
    }
`;

const Formcontainer = styled.div`
    width:40% ;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin:auto;
    top: 50%;
    padding: 1rem;
    border: 1px solid black;
    border-radius: 10px;
    @media(max-width:725px){
        width: 100%;
    }
`;
const Customform = styled.form`
    color: white;
    width: 100%;
    & .error{
        font-size: 10px;
        color: red;
        margin: 5px;
    }
`
const Formswitcher = styled.div`
    margin: 5px;
    display: inline-block;
    text-align: center;

    & span{
        cursor: pointer;
        -webkit-text-fill-color:black;
    }
    & span:hover{
        -webkit-text-stroke-width:0.3px;
        -webkit-text-stroke-color:black;
        -webkit-text-fill-color:white;
    }

    ${props => {
        if(props.active){
            return `
            -webkit-text-stroke-width:0.3px;
            -webkit-text-stroke-color:black;
            -webkit-text-fill-color:white;     
            `
        } 
    }}
`

const Formcontrol = styled.div`
    width: 100%;
    margin-top : 1rem;
    &input {
        outline: none;
    }
    & span{
        font-size: 15px;
        padding: 0 10px;
        background-color:white;
    }
    & input[type="email"]{
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
    & input[type="submit"]{
        position: relative;
        background-color: white;
        font-size: 15px;
        width: 100px;
        padding: 5px 10px;
        border-radius: 8px;
        cursor: pointer;
    }
    & input[type="submit"]:hover{
        background-color: black;
        color: white;
    }
    & .form-border{
        width: 100%;
        border-bottom: 1px solid black;
        text-align: center;
        line-height: 0.1rem;
    }
    & .btn--outline{
        border-radius: 10px;
        font-size: 15px;
        color: black;
        border: 1px solid black;
        & big{
            width: 80%;
        }
    }

    & .btn--outline:hover{
        background-color: black;
        color: white;
    }
`
const Forminput = styled.input`
    outline: none;
    width: 80%;
    padding: 5px;
    border-radius: 5px;
    font-size: 13px;
    border: 1px solid grey;
    &:focus{
        border: 1px solid black;
    }
`

function Loginpage() {
    
    const userContext = useUserContext();
    const [loginform, setloginform] = useState(true);
    const googlesuccesshandler = (response)=>{
        userContext.oauthSignIn(response.profileObj,response.tokenObj,"google");
    }
    const googlefailurehandler = (response)=>{
        console.log("oauth failure",response.data);
        console.log(response);
    }
    return (
        <TransitionGroup component={Loginpagecontainer}>
            <Formcontainer>
                <Formcontrol>
                    <Formswitcher active={loginform} onClick={()=>{!loginform && setloginform(true) }}><span>SIGN IN</span></Formswitcher>
                    <Formswitcher active={!loginform} onClick={()=>{loginform && setloginform(false)}}><span>REGISTER</span></Formswitcher>
                </Formcontrol>
                {
                loginform ?  
                    <Loginform active={loginform}/>
                : 
                    <Registerform active={!loginform}/>
                }
                <Formcontrol><div className="form-border"><span>OR</span></div> </Formcontrol>
                <Formcontrol><a href="https://www.icaland.id/oauth2/authorization/google">test</a></Formcontrol>
                <Formcontrol>
                    <GoogleLogin 
                        clientId="491877475842-meqk5iqgu1snm9r0925q312fkktpovt6.apps.googleusercontent.com"
                        redirectUri="https://www.icaland.id/login/oauth2/code/google"
                        onSuccess={googlesuccesshandler}
                        onFailure={googlefailurehandler}
                        icon={false}
                        buttonText="Login"
                        render = {renderprops => (
                            <Button buttonStyle="btn--outline" buttonSize="big" disabled={renderprops.disabled} onClick={renderprops.onClick}>
                                Sign in with Google <FontAwesomeIcon icon={faGoogle}/>
                            </Button>)}
                    />
                </Formcontrol>
            </Formcontainer>
            </TransitionGroup>
    )
}

function Registerform({active}){
    const userContext = useUserContext();
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const submithandler = (data)=>{
        userContext.registerUser(data);
    }
    const schema = yup.object().shape({
        email : yup.string().required().email(),
        password : yup.string().required().min(5),
        address : yup.string().required(),
        phone : yup.string().matches(phoneRegExp).required(),
    });
    const {register,handleSubmit, formState:{errors}} = useForm({
        resolver: yupResolver(schema)
    });
    return(
        <CSSTransition 
        classNames={{
            enter:"formtransition-enter",
            enterActive:"formtransition-enter-active",
            exit:"formtransition-exit",
            exitActive:"formtransition-exit-active"
        }}
        timeout={200} 
        in={active}>
                    <Customform onSubmit={handleSubmit(submithandler)}>
                    <Formcontrol>
                        <Forminput {...register("email")} type="email" placeholder="E-mail" name="email"></Forminput>
                    </Formcontrol>
                    {errors.email && <p className="error">valid email required</p>}
                    <Formcontrol>
                        <Forminput {...register("password")} type="password" placeholder="Password" name="password" ></Forminput>
                    </Formcontrol>
                    {errors.password && <p className="error">password minimum 5 character</p>} 
                    <Formcontrol>
                        <Forminput {...register("phone")} type="text" placeholder="Phone" name="phone"></Forminput>
                    </Formcontrol>
                    {errors.phone && <p className="error">your phone number doesn't look right</p>} 
                    <Formcontrol>
                        <Forminput {...register("address")} type="text" placeholder="Address" name="address"></Forminput>
                    </Formcontrol>
                    {errors.address && <p className="error">address required</p>} 
                    <Formcontrol>
                        <Forminput type="submit" value="Register"/>
                    </Formcontrol>
                    </Customform>
        </CSSTransition>
    )
}

function Loginform({active}){
    const schema = yup.object().shape({
        email : yup.string().email().required(),
        password : yup.string().min(5).required()
    })
    const {register,handleSubmit,formState: {errors}} = useForm({
        resolver : yupResolver(schema)
    });
    const userContext = useUserContext();
    const submithandler = (data)=>{
        userContext.signUserIn(data.email,data.password);
    }
    const errorsubmit = (data)=>{
        console.log("error submit",data);
    }
    return(
        <CSSTransition
        classNames={{
            enter:"formtransition-enter",
            enterActive:"formtransition-enter-active",
            exit:"formtransition-exit",
            exitActive:"formtransition-exit-active"
        }} 
        timeout={200}
        in={active}>
                <Customform onSubmit={handleSubmit(submithandler,errorsubmit)}>
                    <Formcontrol>
                        <Forminput {...register("email")} type="email" placeholder="E-mail" name="email"></Forminput>
                    </Formcontrol>
                    {errors.email && <p className="error">valid email required</p>}
                    <Formcontrol>
                        <Forminput {...register("password")} type="password" placeholder="Password" name="password"></Forminput>
                    </Formcontrol>
                    {errors.password && <p className="error">password minimum 5 character</p>}
                    <Formcontrol><Forminput type="submit" value="Login"/></Formcontrol>
                </Customform>
        </CSSTransition>
    )
}

export default Loginpage;
