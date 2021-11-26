import React,{useEffect,useState} from 'react'
import { Link, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import productservices from '../../api/productservices';
import Cards from '../Cards'
import './Productpage.css'
import ShoppingGuidepage from './ShoppingGuidepage';




function Productpage() {
    const [productList, setproductList] = useState([]);
    let match = useRouteMatch();

    useEffect(() => {
        productservices.getAllProducts()
            .then(response => {
                setproductList(response);
            })
        return () => {
            setproductList([]);
        }
    }, [])
    return (
        <div className="productpage">
            <Redirect from={match.path} exact to={`${match.path}/product-list`} />
            <div className="productpage-logo-container">
                <img src={require("../../../public/images/Logo.jpeg")} alt="icaland.id" />
            </div>
            <div className="pagenav">
                <Pagelink url={`${match.url}/product-list`}>PRODUCT</Pagelink>
                <Pagelink url={`${match.url}/shopping-guide`}>SHOPPING GUIDE</Pagelink>
                <Pagelink url={`${match.url}/payment-guide`}>PAYMENT GUIDE</Pagelink>
            </div>
            <Switch>
                <Route path={`${match.path}/product-list`}>
                    {/* <Cards category="FOODS" />
                    <Cards category="BEVERAGES" /> */}
                    <Cards category="SUZUKI" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "SUZUKI")}/>
                    <Cards category="HONDA" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "HONDA")}/>
                    <Cards category="MAZDA" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "MAZDA")}/>
                    <Cards category="TOYOTA" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "TOYOTA")}/>
                    <Cards category="DAIHATSU" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "DAIHATSU")}/>
                    <Cards category="BMW" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "BMW")}/>
                    <Cards category="MERCEDES-BENZ" productlist={productList.filter(mobil => mobil.category.toUpperCase() === "MERCEDES-BENZ")}/>
                </Route>
                <Route path={`${match.path}/shopping-guide`}>
                    <ShoppingGuidepage/>
                </Route>
                <Route path={`${match.path}/payment-guide`}>
                    <p>Payment guide</p>
               </Route>
            </Switch>

        </div>
    )
}
function Pagelink({children,url}){
    return(
        <Link to={url}> <div className="pagelink">
            <span >{children}</span>
        </div>
        </Link>
    )
}

export default Productpage;
