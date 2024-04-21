import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,Alert,notification } from 'antd';
import bcryptjs from 'bcryptjs'; 
import Header from '../commpont/UserHeader';
import Footer from '../commpont/Footer';
import '../style.css';

  
function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const openNotificationWithIcon = (type,title,text) => {
    notification[type]({
      message: title,
      description:text,
    });
  };

  const isValidEmail = (email)=> {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };


  let handleSubmit = e => {
    e.preventDefault();
    if(email!="" && password!=""){
      if(isValidEmail(email)){
        var user_list = window.localStorage.getItem("user_list");
        if(user_list){
          user_list=JSON.parse(user_list);
          var login_bl=false;
          user_list.forEach(element => {
            bcryptjs.compare(password, element.password, function(err, res) {
              if (res) {
                if(email==element.email){
                  login_bl=true;
                  window.localStorage.setItem("now_user",JSON.stringify(element));
                  openNotificationWithIcon('success','Login Tips',"Login successful!");
                  setTimeout(function(){
                    window.location.href="/";
                  },2000);
                }
              }
            });
          });
        }else{
          openNotificationWithIcon('error','Login Tips','Currently unregistered user!');
        }
      }else{
        openNotificationWithIcon('error','Login Tips','The email format must be correct.');
      }
    }else{
      openNotificationWithIcon('error','Login Tips','The password and Email address cannot be empty');
    }
  };

  return (
    <div>
      <Header/>
      <div className="form_box">
        <h2>Login</h2>
        <Form layout="inline" >
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
            <Button type="primary" className="login-form-button" onClick={handleSubmit}>
              Log in
            </Button>
            Or <a href="/register">register now!</a>
          </Form.Item>
        </Form>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;