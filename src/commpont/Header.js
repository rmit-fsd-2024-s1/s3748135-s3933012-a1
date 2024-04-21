import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,Alert,Menu,notification,List, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../style.css';

function Header() {
    const { SubMenu } = Menu;
    const location = useLocation();
    const navigate=useNavigate();
    const [bl,setBl]=useState(false);
    const [email,setEmail]=useState("");

    const openNotificationWithIcon = (type,title,text) => {
      notification[type]({
        message: title,
        description:text,
      });
    };

    const OpenProfile = () =>{
      window.location.href="/profile";
    }
  

    useEffect(()=>{
      var now_user=window.localStorage.getItem("now_user");
      if(now_user){
        now_user=JSON.parse(now_user);
        setBl(true);
        setEmail(now_user.email);
      }else{
        window.location.href="/login";
      }
    },[]);
    
    const loginOut=e=>{
      window.localStorage.removeItem("now_user");
      openNotificationWithIcon('success','User',"Log out successfully!");
      setTimeout(function(){
        window.location.href="/login";
      },2000);
    }

    let menuClick = e => {
        if(e.key==1){
          navigate("/")
        }else if(e.key==2){
          navigate("/movie")
        }else if(e.key==3){
          navigate("/register")
        }else if(e.key==4){
          navigate("/login")
        }
    };

    return(
        <Menu  mode="horizontal" onClick={menuClick}>
            <span className="icon_title"> 
            Organic specialty products and small-scale farming
            </span>
            <Menu.Item key="1" >Home</Menu.Item>
            {bl?(
              <SubMenu title={"Hello!"+email} key="alipay" style={{position:"absolute",right: "1vw"}}>
                <Menu.Item onClick={OpenProfile}>My Profile</Menu.Item>
                <Menu.Item onClick={loginOut}>Login Out</Menu.Item>
              </SubMenu>
            ):(
              <span>Register</span>
            )}
      </Menu>
    )
}

export default Header;