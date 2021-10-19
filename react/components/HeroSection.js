import React,{ useEffect,useState,useRef } from 'react';
import './HeroSection.css';
import Button from './button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLongArrowAltRight} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function HeroSection(){
    return(
        <div className="herosection">
            <video src={require("../../public/videos/video-1.mp4")} autoPlay loop muted playsInline />
            <h1>I C A L A N D. I D</h1>
            <p>selogan icalan</p>
            <div className="div hero-btns">
            <Link to="/products">
                <Button buttonStyle="btn--outline" buttonSize="medium">
                    Products <FontAwesomeIcon icon={faLongArrowAltRight} />
                </Button>
            </Link>    
                <br />
            <Button buttonStyle="btn--outline" buttonSize="medium">
                Register <FontAwesomeIcon icon={faLongArrowAltRight} />
            </Button>
            </div>
        </div>
    )
}

export default HeroSection;