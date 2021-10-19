import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook,faInstagram,faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import './footer.css';
import { Link } from 'react-router-dom';


function Footer(){
    return(
        <div className="footer">
            <div className="footer-container">
                <FooterContent />
            </div>
        </div>
    );
}
function FooterContent(){
    return(
        <>
        <div className="footer-content">
            <Footersection title="ABOUT US">
                <Footerlinktext href="#">Icalan.id</Footerlinktext>
            </Footersection>
            <Footersection title="POLICIES">
                <Footerlinktext href="#">TERMS &amp; CONDITIONS</Footerlinktext>
                <Footerlinktext href="#">PRIVACY POLICY</Footerlinktext>
            </Footersection>
            <Footersection title="OUR CONTACTS">
                <Footerlink>
                    <FooterlinkIcon href="#" icon={faFacebook}/>
                    <FooterlinkIcon href="#" icon={faInstagram}/>
                    <FooterlinkIcon href="#" icon={faWhatsapp}/>
                </Footerlink>
            </Footersection>
            <Footersection title="CUSTOMER GUIDES">
                <Footerlinktext href="/products/shopping-guide">SHOPPING GUIDE</Footerlinktext>
                <Footerlinktext href="#">REFUND POLICY</Footerlinktext>
            </Footersection>
        </div>
        <div className="footer-logo">
            <a href="#"><img src={require("../../public/images/Logo.jpeg")} alt="Icaland.id" /></a>
            <p>X</p>
            <a href="#" className="partner-logo"><img src={require("../../public/images/shopee-logo.png")} alt="Shopee-logo"/> </a>
            <a href="#"  className="partner-logo"><img src={require("../../public/images/tokopedia-logo.png")} alt="Tokopedia-logo"/> </a>
        </div>
        </>
    );
}
function Footersection(props){
    return(
        <div className="footer-section">
            <h4>{props.title}</h4>
            <ul>
                {props.children}
            </ul>
        </div>
    );
}
function Footerlink(props){
    return(
        <li className="footer-link">
            {props.children}
        </li>
    )
}
function FooterlinkIcon(props){
    return(
            <a href={props.href} className="icon-wrapper"><FontAwesomeIcon icon={props.icon}/></a>
    )
}
function Footerlinktext(props){
    return(
        <li className="footer-link">
            <Link to={props.href}>{props.children}</Link>
        </li>
    );
}

export default Footer;