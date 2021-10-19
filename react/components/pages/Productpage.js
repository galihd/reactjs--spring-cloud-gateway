import React from 'react'
import { Link, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import Cards from '../Cards'
import './Productpage.css'
import ShoppingGuidepage from './ShoppingGuidepage';



function Productpage() {
    let match = useRouteMatch();
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
                    <Cards category="FOODS"/>
                    <Cards category="BEVERAGES"/>
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
