import React, {useState,useEffect,useRef} from 'react'
import './navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUser,faShoppingCart,faSearchDollar } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { useCartItemContext } from '../Context/CartContext';
import { useUserContext } from '../Context/UserdataContext';


function Navbar(){
    const cartItemContext = useCartItemContext();
    const userContext = useUserContext();

    const [show, setshow] = useState(true);
    const [lastscroll, setlastscroll] = useState(0);


    const handlescroll = ()=>{
        let position = window.pageYOffset;
        setshow(lastscroll > position);
        setlastscroll(position);
    }

    useEffect(() => {
        window.addEventListener('scroll',handlescroll);
        return () => {
            window.removeEventListener('scroll',handlescroll);
        }
    },[lastscroll])
    
    return(
        <nav className={show ? "show" : "hide"}>
            <Navlogo href="/" caption="ICALAND.ID" />
            <Navitems href="/"caption="Home" icon = {<FontAwesomeIcon icon={faHome}/>}/>
            <Navitems href="/products" caption="Products" icon={<FontAwesomeIcon icon={faSearchDollar}/>}/>
            <Navitems href="/cart" caption={`Cart[${cartItemContext.cartItem.length}]`} icon={<FontAwesomeIcon icon={faShoppingCart}/>} />
            <Navitems 
                href={"/profile"}
                caption="Account" 
                icon={<FontAwesomeIcon icon = {faUser} />}>
            </Navitems>
        </nav>
    );
}

function Navlogo(props){
    return(
        <div className="nav-logo">
            <Link to={props.href}> {props.caption} </Link>
        </div>
    )
}
function NavLink({href,caption,icon}){
    return(
        <Link to={href}>
                <span className="link-caption">{caption}</span>
                 <span className="link-icon">{icon}</span>
        </Link>
    )
}
function Navitems(props){
    const [open, setOpen] = useState(false);
    const selectedRef = useRef(null);
    
    const clickhandler = (e) =>{
        if(selectedRef.current.contains(e.target)){
            return;
        }else{
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown",clickhandler)
        return () => {
            document.removeEventListener("mousedown",clickhandler)
        }
    }, [])

    return(
        <div className="nav-items" ref={selectedRef} onClick={() => setOpen(!open)}>
            <NavLink href={props.href} caption={props.caption} icon={props.icon}/>
            {open && props.children}
        </div>
    )
}

export default Navbar;