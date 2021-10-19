import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Homepage from './components/pages/Homepage';
import './App.css';
import Productpage from './components/pages/Productpage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Cartspage from './components/pages/Cartspage';
import Loginpage from './components/pages/loginpage';
import Profilepage from './components/pages/Profilepage';
import UserdataContext from './Context/UserdataContext';
import CartContext from './Context/CartContext';
import Paymentpage from './components/pages/Paymentpage';



function App() {
  return (
    <div className="App">
      <Router>
      <UserdataContext>
        <CartContext>
          <Navbar />
          <Switch>
          <Route path="/login" exact component={Loginpage} />
          <Route path="/" exact component={Homepage} />
          <Route path="/products" component={Productpage} />
          <Route path="/cart" component={Cartspage}/>
          <Route path="/profile" component={Profilepage}/>
          <Route exact path="/payment/:paymentId" component={Paymentpage} />
          </Switch>
          <Footer/>
          </CartContext>     
      </UserdataContext>
      </Router>
    </div>
  );
}

export default App;
