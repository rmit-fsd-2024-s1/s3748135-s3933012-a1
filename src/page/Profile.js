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
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [address,setAddress]=useState("");
  const [password,setPassword]=useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    var now_user=window.localStorage.getItem("now_user");
    if(now_user){
      now_user=JSON.parse(now_user);
      setEmail(now_user.email);
      setName(now_user.name);
      setDate(now_user.date);
      setAddress(now_user.address);
      setUsername(now_user.name);
    }else{
      window.location.href="/login";
    }
  },[]);

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
  let handleSubmit = e => {
    e.preventDefault();
    var now_user=window.localStorage.getItem("now_user");
    if(now_user){
      now_user=JSON.parse(now_user);
      //Password123!
      if(email!="" && password!="" && address!="" && username!="" ){
          if(isValidEmail(email)){
            if(isStrongPassword(password)){
              var dateTime=new Date();
              var cuurentdate=dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate()+" "+dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();
              const salt = bcryptjs.genSaltSync(10);
              const hashedPassword = bcryptjs.hashSync(password, salt);
              var user_list = window.localStorage.getItem("user_list");
              if(user_list){
                user_list=JSON.parse(user_list);
                var now_user_list=[];
                var bl=true;
                user_list.forEach(element => {
                  if(element.email==email && email!=now_user.email){
                    openNotificationWithIcon('error','Edit User Profile Tips','This email address has already been registered.');
                    bl=false;
                  }
                });
                if(bl){
                  var user={
                    "name":name,
                    "email":email,
                    "password":hashedPassword,
                    "address":address,
                    "date":cuurentdate,
                    "order":now_user.order
                  }
                  user_list.forEach(element => {
                    if(element.email!=now_user.email){
                      now_user_list.push(element);
                    }
                  });
                  now_user_list.push(user);
                  window.localStorage.setItem("user_list",JSON.stringify(now_user_list));
                  window.localStorage.removeItem("now_user");
                  openNotificationWithIcon('success','Edit User Profile Tips',"Edit User Profile successfully.Please login again!");
                  setTimeout(function(){
                    window.location.href="/";
                  },2000);
                }
              }else{
                openNotificationWithIcon('error','Edit User Profile Tips',"This user information is not found, please log in again!");
              }
            }else{
              openNotificationWithIcon('error','Edit User Profile Tips','The password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character.');
            }
          }else{
            openNotificationWithIcon('error','Edit User Profile Tips','The email format must be correct.');
          }
      }else{
        openNotificationWithIcon('error','Edit User Profile Tips','The User Profile cannot be empty');
      }
    }else{
      window.location.href="/login";
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
          <h1>Hello!{name}</h1>
          <div className="edit-profile">
            <h3>Edit User Profile</h3>
            <Form.Item>
                <label>UserName:</label>
                <Input
                  placeholder="UserName"
                  onChange={e=>setUsername(e.target.value)}
                  value={username}
                />
              </Form.Item>

              <Form.Item>
                <label>Email:</label>
                <Input
                  placeholder=""
                  onChange={e=>setEmail(e.target.value)}
                  value={email}
                />
              </Form.Item>

              <Form.Item>
                <label>Password:</label>
                <Input
                  placeholder=""
                  onChange={e=>setPassword(e.target.value)}
                  type="password"
                  value={password}
                />
              </Form.Item>

              <Form.Item>
                <label>Address:</label>
                <Input
                  placeholder=""
                  onChange={e=>setAddress(e.target.value)}
                  value={address}
                />
              </Form.Item>
            <p>
              <label>Date:</label>
              <span>{date}</span>
            </p>
            <Form.Item className="button_box">
                <Button type="primary" className="login-form-button" onClick={handleSubmit}>
                  Edit Save
                </Button>
                <Button type="primary" className="reset_button" onClick={deleteUserProfie}>
                  Unsubscribe
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