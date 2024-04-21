import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,Alert,Menu,notification,List, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from '../commpont/Header';
import Footer from '../commpont/Footer';
import bcryptjs from 'bcryptjs';

import '../style.css';

  
function Profile() {
  const [email,setEmail]=useState("");
  const [date,setDate]=useState("");
  const [month,setMonth]=useState(1);
  const [year,setYear]=useState(2025);
  const [card,setCard]=useState("");
  const [password,setPassword]=useState("");
  const [cartList,setCartList]=useState([]);
  const [sumPrice,setSumPrice]=useState(0.0);


  const navigate = useNavigate();

  useEffect(()=>{
    var now_user=window.localStorage.getItem("now_user");
    if(now_user){
      now_user=JSON.parse(now_user);
      getCart();
    }else{
      window.location.href="/login";
    }
  },[]);

  const getCart=()=>{
    var cart_list=window.localStorage.getItem("cart_list");
    var sum_number=0;
    if(cart_list){
      cart_list=JSON.parse(cart_list);
    }else{
      cart_list=[];
    }
    cart_list.forEach(item=>{
      sum_number=sum_number*1+item.bargaiPrice*1;
    });
    setSumPrice(sum_number);
    setCartList(cart_list);
  }

  const openNotificationWithIcon = (type,title,text) => {
    notification[type]({
      message: title,
      description:text,
    });
  };

  const isValidEmail = (email)=> {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  const isStrongPassword = (password) => {
    const minLength = 8;
    const hasNumber = /[0-9]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[^0-9a-zA-Z]/.test(password);
   
    return (
      password.length >= minLength &&
      hasNumber &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar
    );
  }

  function validateCreditCard(cardNumber, month, year) {
    function isValidCardNumber(cardNumber) {
      const validLengths = [16, 13]; 
      return validLengths.includes(cardNumber.length) && !isNaN(cardNumber);
    }
   
    function isValidMonth(month) {
      return month >= 1 && month <= 12;
    }
   
    function isValidYear(year) {
      return year >= new Date().getFullYear() && year <= new Date().getFullYear() + 20; 
    }
   
    return isValidCardNumber(cardNumber) && isValidMonth(month) && isValidYear(year);
  }

  let Purchase = e => {
    e.preventDefault();
    //1234567890123456
    var bl=validateCreditCard(card,month,year);
    if(bl){
      var now_user=window.localStorage.getItem("now_user");
      if(now_user){
        now_user=JSON.parse(now_user);
        var user_list = window.localStorage.getItem("user_list");
        var cart_list = window.localStorage.getItem("cart_list");
        cart_list=JSON.parse(cart_list);
        var now_user_list=[];
        if(user_list){
          user_list=JSON.parse(user_list);
          user_list.forEach(element => {
            if(element.email!=now_user.email){
              now_user_list.push(element);
            }
          });
          var now_order=now_user.order;
          now_order.push(cart_list);
          var user={
            "name":now_user.name,
            "email":now_user.email,
            "password":now_user.hashedPassword,
            "address":now_user.address,
            "date":now_user.date,
            "order":now_order
          }
          now_user_list.push(user);
          window.localStorage.setItem("user_list",JSON.stringify(now_user_list));
        }

        openNotificationWithIcon('success','Buy Tips','Successful purchase.');
        window.localStorage.removeItem("cart_list");
        window.location.href="/";
      }else{
        window.location.href="/login";
      }
    }else{
      openNotificationWithIcon('error','Card Tips','Incorrect credit card.');
    }
   
  };

  let deleteUserProfie = e => {
    e.preventDefault();
    var now_user=window.localStorage.getItem("now_user");
    if(now_user){
      now_user=JSON.parse(now_user);
      var user_list = window.localStorage.getItem("user_list");
      var now_user_list=[];
      if(user_list){
        user_list=JSON.parse(user_list);
        user_list.forEach(element => {
          if(element.email!=now_user.email){
            now_user_list.push(element);
          }
        });
        window.localStorage.setItem("user_list",JSON.stringify(now_user_list));
        window.localStorage.removeItem("now_user");
        openNotificationWithIcon('success','Unsubscribe User Profile Tips',"Unsubscribe User Profile successfully.");
        setTimeout(function(){
          window.location.href="/";
        },2000);
      }
    }else{
      window.location.href="/login";
    }
  };

  return (
    <div>
      <Header/>

      <div className="Profile_body">
        <div className="profile_data">
          <h1>Shopping Cart</h1>
          <div className="edit-profile">
            <h3>Confirm order information</h3>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={cartList}
            renderItem={(item) => (
              <List.Item
              >
              <List.Item.Meta
                    title={<a href="#">{item.bargaiNname}</a>}
                    description={item.author}
                  />
                <div>${item.bargaiPrice}</div>
              </List.Item>
            )}
            />
             <div className="buy_button_box_2">
                <p>
                  <span>${sumPrice}</span>
                </p>
              </div>
          </div>
          <div className="edit-profile">
            <h3>Credit card</h3>
              <Form.Item>
                <Input
                  placeholder=""
                  onChange={e=>setCard(e.target.value)}
                  value={card}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Year"
                  onChange={e=>setYear(e.target.value)}
                  type="number"
                  value={year}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Month"
                  onChange={e=>setMonth(e.target.value)}
                  type="number"
                  value={month}
                />
              </Form.Item>
            <Form.Item className="button_box">
                <Button type="primary" className="login-form-button" onClick={Purchase}>
                  Purchase
                </Button>
            </Form.Item>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default Profile;