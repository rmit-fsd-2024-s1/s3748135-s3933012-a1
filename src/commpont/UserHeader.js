import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,Alert,Menu,notification,List, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../style.css';

function Header() {

    let menuClick = e => {
        
    };
    
    return(
        <Menu  mode="horizontal" onClick={menuClick}>
            <span className="icon_title"> 
                Organic specialty products and small-scale farming
            </span>
      </Menu>
    )
}

export default Header;