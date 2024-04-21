import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,notification } from 'antd';
import bcryptjs from 'bcryptjs';
import '../style.css';
import Header from '../commpont/UserHeader';
import Footer from '../commpont/Footer';

function Register() {
  const [email,setEmail]=useState("");
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [repassword,setRepassword]=useState("");

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
    //Password123!
    if(email!="" && password!="" && repassword!=""){
      if(repassword==password){
        if(isValidEmail(email)){
          if(isStrongPassword(password)){
            var dateTime=new Date();
            var cuurentdate=dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate()+" "+dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();
            const salt = bcryptjs.genSaltSync(10);
            const hashedPassword = bcryptjs.hashSync(password, salt);
            var user_list = window.localStorage.getItem("user_list");
            if(user_list){
              user_list=JSON.parse(user_list);
              var bl=true;
              user_list.forEach(element => {
                if(element.email==email){
                  openNotificationWithIcon('error','Register Tips','This email address has already been registered.');
                  bl=false;
                }
              });
              if(bl){
                var user={
                  "name":name,
                  "email":email,
                  "password":hashedPassword,
                  "address":'',
                  "date":cuurentdate,
                  "order":[],
                }
                user_list.push(user);
                window.localStorage.setItem("user_list",JSON.stringify(user_list));
                window.localStorage.setItem("now_user",JSON.stringify(user));
                openNotificationWithIcon('success','Register Tips',"Registered successfully!");
                setTimeout(function(){
                  window.location.href="/";
                },2000);
              }
            }else{
              var user={
                "name":name,
                "email":email,
                "address":'',
                "password":hashedPassword,
                "date":cuurentdate,
                "order":[],
              }
              user_list=[];
              user_list.push(user);
              window.localStorage.setItem("user_list",JSON.stringify(user_list));
              window.localStorage.setItem("now_user",JSON.stringify(user));
              openNotificationWithIcon('success','Register Tips',"Registered successfully!");
              setTimeout(function(){
                window.location.href="/";
              },2000);
            }
          }else{
            openNotificationWithIcon('error','Register Tips','The password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character.');
          }
        }else{
          openNotificationWithIcon('error','Register Tips','The email format must be correct.');
        }
       
      }else{
        openNotificationWithIcon('error','Register Tips','The two passwords must be the same!');
      }
    }else{
      openNotificationWithIcon('error','Register Tips','The registration information cannot be empty');
    }
  };

  return (
    <div>
      <Header/>
      <div className="form_box">
        <h2>Register</h2>
        <Form layout="inline">
          <Form.Item>
              <Input
                placeholder="Name"
                onChange={e=>setName(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
              <Input
                placeholder="Email"
                onChange={e=>setEmail(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
              <Input
                type="password"
                placeholder="Password"
                onChange={e=>setPassword(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
              <Input
                type="password"
                placeholder="Re-Password"
                onChange={e=>setRepassword(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="register-form-button"  onClick={handleSubmit}>
              Register
            </Button>
            Or <a href="/">Back Login!</a>
          </Form.Item>
        </Form>
      </div>
      <Footer/>
    </div>
  );
}

export default Register;