import logo from './logo.svg';
import React, { useState,useEffect, useMemo } from "react";
import { BrowserRouter as Router, Route ,Routes} from "react-router-dom";
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import Profile from './page/Profile';
import Cart from './page/Cart';


function App() {
  
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/register" element={<Register/>} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/profile" element={<Profile/>} />
                <Route exact path="/cart" element={<Cart/>} />

            </Routes> 
          </Router>
    </div>
  );
}

export default App;
