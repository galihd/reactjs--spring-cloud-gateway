import React, { useState, useEffect } from 'react'
import './button.css'
const STYLES = ['btn--primary','btn--menu','btn--outline','btn--close'];
const SIZE = ['big','medium','small'];
function Button({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}){

    const setButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const setButtonSize = SIZE.includes(buttonSize) ? buttonSize : STYLES[1];
    return(
        <button
             onClick={onClick}
             className={`btn ${setButtonStyle} ${setButtonSize}`}
             type = {type}
        >
           {children}
        </button>
    )
}

export default Button;