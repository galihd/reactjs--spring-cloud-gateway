import React,{useState,useEffect} from 'react'
import Slider from 'react-slick';
import productservices from '../../api/productservices';
import HeroSection from '../HeroSection';
import ProductList from '../ProductCarousel';
import './Homepage.css'



function Homepage() {
    const [carouselitems, setcarouselitems] = useState([]);
    useEffect(() => {
        productservices.getAllProducts().then(response=>{
            setcarouselitems(response);
        })
    }, [])
    var settings =
        {
            dots: false,
            infinite: true,
            speed: 1000,
            slidesToShow: 8,
            slidesToScroll: 6,
            autoplay : false,
            adaptiveHeight:true,
            responsive:[
                {
                    breakpoint: 1200,
                    settings:{
                        slidesToShow: 6,
                        slidesToScroll: 6,
                    }
                },
                {
                    breakpoint: 968,
                    settings:{
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        arrows: false
                    }
                },
                {
                    breakpoint: 680,
                    settings:{
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        arrows: false
                    }
                },
                {
                    breakpoint: 520,
                    settings:{
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false
                    }
                }
            ]
        }
    return (
        <div className="homepage">
            <HeroSection/>      
            <ProductList 
                Categories="#OurProductHashTag"
                Caption="this is a caption" 
                DisplayLength={8}
                settings={settings}
                carouselitems={carouselitems}
                />
            <Pageslider/>
            <PaymentBanner />
        </div>
    );
}
function Pageslider(props){
    return(
        <Slider 
        arrows={false}
        dots={false}
        infinite
        fade={true}
        speed={0}
        slidesToShow={1}
        slidesToScroll={1}
        adaptiveHeight
        autoplay
        autoplaySpeed={5000}>
            <div className="sliderbanner food">
                    Food
            </div>
            <div className="sliderbanner beverage">
                    Beverages
            </div>
            <div className="sliderbanner service">
                    Catering Service
            </div>
        </Slider>
    )
}

function PaymentBanner(){
    return(
        <div className="paymentsection">
            <div className="payment-method-wrapper"></div>
            <img src={require("../../../public/images/pembayaran-image.jpg")} alt="payment-method"/>
            <div className="payment-shopee-tokopedia">
            <p>ATAU TEMUI KAMI DI</p>
            <a href="#"><img src={require("../../../public/images/shopee-logo.png")} alt="Shopee" className="payment-logo" /></a>
            <a href="#"><img src={require("../../../public/images/tokopedia-logo.png")} alt="Tokopedia" className="payment-logo"/></a>
            </div>
        </div>
    );
}



export default Homepage;
