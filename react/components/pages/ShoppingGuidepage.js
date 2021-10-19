import React from 'react'
import styled from 'styled-components'

const Guidepagecontainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    & button{
        padding: 20px;
    }
    
`
const GuideSection = styled.div`
    width: 100%;
    height: 100%;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const GuideItem = styled.div`
    padding: 10px;
    width: 40%;
    @media(max-width : 800px){
        width: 100%;
    }
`

const Guideimg = styled.img`
    object-fit: cover;
    width: 100%;
    height: auto;
    padding: 40px 10px;
`

const Guidedesc = styled.p`
    font-size: 20px;
    margin: 10px;
    text-align: left;
`
const GuideWarningdesc = styled.p`
    font-size: 13px;
    color: red;
    margin-left: 0;
    padding-left: 0px;
    text-align: left;
`


function Guidepage() {
    return (
        <Guidepagecontainer>
            <GuideSection>
                <GuideItem>
                    <Guidedesc>1. Pastikan identitas telah dilengkapi</Guidedesc>
                    <Guideimg src={require("../../../public/images/profile-data-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>2. Pilih produk</Guidedesc>
                    <Guideimg src={require("../../../public/images/display-product-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>3. Tentukan jumlah barang</Guidedesc>
                    <Guideimg src={require("../../../public/images/display-overlay-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>4. Lakukan pemesanan</Guidedesc>
                    <Guideimg src={require("../../../public/images/cart-display-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>5. Verifikasi pemesanan melalui whatsapp kami</Guidedesc>
                    <GuideWarningdesc>*gunakan template message chat untuk kemudahan konfirmasi pemesanan</GuideWarningdesc>
                    <Guideimg src={require("../../../public/images/display-product-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>6. Lakukan pembayaran &amp; upload bukti transfer </Guidedesc>
                    <Guideimg src={require("../../../public/images/display-product-guide.png")}/>
                </GuideItem>
                <GuideItem>
                    <Guidedesc>7. Cek status pemesanan yg telah dibayar</Guidedesc>
                    <Guideimg src={require("../../../public/images/display-product-guide.png")}/>
                </GuideItem>
            </GuideSection>
        </Guidepagecontainer>
    )
}

export default Guidepage
