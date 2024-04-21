import React, { useState,useEffect, useMemo } from "react";
import { Form, Input, Button,Checkbox,Alert,Menu,notification,List, Avatar,Table,Drawer } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from '../commpont/Header';
import Footer from '../commpont/Footer';
import { v4 as uuidv4 } from 'uuid';
import '../style.css';

  
function Home() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [bargaiNname,setBargainName]=useState("");
  const [bargaiPrice,setBargainPrice]=useState(0.0);
  const [quantity,setBargainQuantity]=useState(0.0);
  const [bargainList,setBargainList]=useState([]);
  const [sumPrice,setSumPrice]=useState(0.0);

  const [cart_number,setCart_number]=useState(0);
  const [cartList,setCartList]=useState([]);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  

  const isTenDaysBefore = (date) => {
    const currentDate = new Date();
    const tenDaysAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7天的毫秒数
    return date >= tenDaysAgo && date <= currentDate;
  }




  const showDrawer = () => {
    setOpen(true);
    getCart();
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    var bargain_list=window.localStorage.getItem("bargain_list");
    if(bargain_list){
      bargain_list=JSON.parse(bargain_list);
      var now_bragain_list=[];
      bargain_list.forEach(element => {
        var date_bl=isTenDaysBefore(new Date(element.date));
        if(date_bl){
          now_bragain_list.push(element);
        }
      });
      setBargainList(now_bragain_list);      
    }
    cart_onload();
  },[]);

  const columns = [
    {
      title: 'Bargain Nname',
      dataIndex: 'bargaiNname',
      key: 'bargaiNname',
    },
    {
      title: 'Bargain Price',
      dataIndex: 'bargaiPrice',
      key: 'bargaiPrice',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Commodity Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'bid',
      render: (text, record) => (
        <Button type="primary" onClick={() => addShoppingCart(record.bid)}>+ Add to shopping cart</Button>
      ),
    },
  ];

  const cart_onload=()=>{
    var cart_list=window.localStorage.getItem("cart_list");
    if(cart_list){
      cart_list=JSON.parse(cart_list);
    }else{
      cart_list=[];
    }
    setCart_number(cart_list.length);
  }

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

  const deleteCart=(bid)=>{
    var cart_list=window.localStorage.getItem("cart_list");
    cart_list=JSON.parse(cart_list);
    var now_cart_list=[];
    cart_list.forEach(item=>{
      if(item.bid!=bid){
        now_cart_list.push(item);
      }
    });
    window.localStorage.setItem("cart_list",JSON.stringify(now_cart_list));
    openNotificationWithIcon('success','Shopping Cart Tips','Delete cart successfully!');
    cart_onload();
    getCart();
  }

  const addShoppingCart=(bid)=>{
    var now_bargain={};
    var cart_list=window.localStorage.getItem("cart_list");
    bargainList.forEach(item=>{
      if(item.bid==bid){
        now_bargain=item;
      }
    });
    if(now_bargain.quantity-1>=0){
      if(cart_list){
        cart_list=JSON.parse(cart_list);
      }else{
        cart_list=[];
      }
      cart_list.push(now_bargain);
      window.localStorage.setItem("cart_list",JSON.stringify(cart_list));
      openNotificationWithIcon('success','Add Shopping Cart Tips','Add cart successfully!');
      cart_onload();
    }else{
      openNotificationWithIcon('error','Add Shopping Cart Tips','Not enough stock.');
    }
  }

  const openNotificationWithIcon = (type,title,text) => {
    notification[type]({
      message: title,
      description:text,
    });
  };

  let openCart = () =>{
    window.location.href="/cart";
  }

  let handleSubmit = e => {
    e.preventDefault();
    if(bargaiNname!="" && bargaiPrice!="" && quantity!=""){
      var now_user=window.localStorage.getItem("now_user");
      var dateTime=new Date();
      var cuurentdate=dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate()+" "+dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();
      if(now_user){
        now_user=JSON.parse(now_user);
        var bargain_list=window.localStorage.getItem("bargain_list");
        if(bargain_list){
          bargain_list=JSON.parse(bargain_list);
          bargain_list.push({
            "bid": uuidv4(),
            "bargaiNname":bargaiNname,
            "bargaiPrice":bargaiPrice,
            "quantity":quantity,
            "date":cuurentdate,
            "author":now_user.name
          });
        }else{
          bargain_list=[];
          bargain_list.push({
            "bid": uuidv4(),
            "bargaiNname":bargaiNname,
            "bargaiPrice":bargaiPrice,
            "quantity":quantity,
            "date":cuurentdate,
            "author":now_user.name
          });
        }
        window.localStorage.setItem("bargain_list",JSON.stringify(bargain_list));
        openNotificationWithIcon('success','Add Bargain Tips',"Add data Successfullly!");
        window.location.reload();
      }else{
        openNotificationWithIcon('error','Login Permission Tips','Please log in to the user before adding data.');
        window.location.href="/login";
      }
    }else{
      openNotificationWithIcon('error','Add Bargain Tips','Add data cannot be empty!');
    }
  };

  return (
    <div>
      <Header/>

      <div className="home_body">
        <h1>Show all the specials for a week</h1>
        <div className="add_body">
          <h2>Add Bargain</h2>
          <Form layout="inline" >
          <Form.Item>
              <Input
                placeholder="Bargain Name"
                onChange={e=>setBargainName(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
              <Input
                type="number"
                placeholder="Bargain Price"
                onChange={e=>setBargainPrice(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
              <Input
                type="number"
                placeholder="Commodity Quantity"
                onChange={e=>setBargainQuantity(e.target.value)}
              />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="login-form-button" onClick={handleSubmit}>
              Add Submit
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>

      <div>
        <Table columns={columns} dataSource={bargainList} rowKey={record => record.bid}/>

      </div>

      <div className="cart_buuton_box" onClick={showDrawer}>
        <svg t="1713698506507" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2469" width="40" height="40"><path d="M335.67232 827.060224c-28.985344 0-52.48512 23.5008-52.48512 52.489216 0 28.95872 23.5008 52.512768 52.48512 52.512768 28.988416 0 52.488192-23.554048 52.488192-52.512768C388.160512 850.561024 364.660736 827.060224 335.67232 827.060224zM860.551168 827.060224c-28.985344 0-52.48512 23.5008-52.48512 52.489216 0 28.95872 23.499776 52.512768 52.48512 52.512768 28.988416 0 52.488192-23.554048 52.488192-52.512768C913.03936 850.561024 889.53856 827.060224 860.551168 827.060224zM918.779904 722.08384c-33.702912 0-603.608064 0-603.608064 0S202.60864 365.359104 131.463168 118.475776c-8.99584-31.241216-27.34592-26.244096-52.488192-26.244096-21.886976 0-26.24512 0-26.24512 0-29.164544 0-52.486144 0.101376-52.486144 26.244096 0 23.602176 25.321472 26.244096 52.486144 26.244096 0 0 14.199808 0 26.24512 0 25.320448 0 209.951744 629.85216 209.951744 629.85216s593.742848 0 629.85216 0C954.891264 774.572032 952.480768 722.08384 918.779904 722.08384zM913.03936 669.597696l110.716928-393.660416L236.438528 275.93728 367.65696 669.597696 913.03936 669.597696z" fill="#ffffff" p-id="2470"></path></svg>
        <span>{cart_number}</span>
      </div>

      <Drawer title="Shopping cart" onClose={onClose} open={open}>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={cartList}
        renderItem={(item) => (
          <List.Item
            actions={[ <a key="list-loadmore-more" onClick={()=>deleteCart(item.bid)}>X</a>]}
          >
           <List.Item.Meta
                title={<a href="#">{item.bargaiNname}</a>}
                description={item.author}
              />
            <div>${item.bargaiPrice}</div>
          </List.Item>
        )}
        />
        <div className="buy_button_box">
          <p>
            <span>${sumPrice}</span>
          </p>
          <p>
            <button onClick={openCart}>Pay</button>
          </p>
        </div>
      </Drawer>
      <Footer/>
    </div>
  );
}

export default Home;