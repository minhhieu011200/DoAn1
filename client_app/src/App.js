import './CSS/material-design-iconic-font.min.css'
import './CSS/font-awesome.min.css'
import './CSS/fontawesome-stars.css'
import './CSS/meanmenu.css'
import './CSS/animate.css'
import "./CSS/nice-select.css";
import "./CSS/slick.css";
import "./CSS/venobox.css";
import './CSS/bootstrap.min.css'
import './CSS/helper.css'
import './CSS/style.css'
import './CSS/responsive.css'
import './App.css';
import React, { lazy, Suspense } from 'react';


import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Footer from './component/Shared/Footer'
import CartContextProvider from "./component/context/CartContext"
import AuthContextProvider from "./component/context/AuthContext"
import Login from './component/Auth/Login'
import OrderSuccess from './component/Order/OrderSuccess'

const Header = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Shared/Header")), 1000);
  });
});

const Home = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Home/Home")), 1000);
  });
});

const Shop = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Shop/Shop")), 1000);
  });
});

const Cart = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Cart/Cart")), 1000);
  });
});

const Detail_Product = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Detail_Product/Detail_Product")), 2500);
  });
});

const Checkout = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Checkout/Checkout")), 1000);
  });
});

const Map = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./component/Checkout/Map")), 1000);
  });
});



function App() {
  return (
    <div>
      <CartContextProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="sk-cube-grid">
                  <div className="sk-cube sk-cube1"></div>
                  <div className="sk-cube sk-cube2"></div>
                  <div className="sk-cube sk-cube3"></div>
                  <div className="sk-cube sk-cube4"></div>
                  <div className="sk-cube sk-cube5"></div>
                  <div className="sk-cube sk-cube6"></div>
                  <div className="sk-cube sk-cube7"></div>
                  <div className="sk-cube sk-cube8"></div>
                  <div className="sk-cube sk-cube9"></div>
                </div>
              }
            >
              <Header />
              <Switch>
                <Route exact path="/" component={Home} />

                <Route exact path="/login" component={Login} />
                <Route exact path="/ordersuccess" component={OrderSuccess} />

                <Route exact path="/shop" component={Shop} />
                <Route path="/shop/:id" component={Shop} />

                <Route exact path="/detail/:id" component={Detail_Product} />

                <Route exact path="/cart" component={Cart} />

                <Route exact path="/checkout" component={Checkout} />
                <Route exact path="/map" component={Map} />
              </Switch>
              <Footer />
            </Suspense>

          </BrowserRouter>
        </AuthContextProvider>
      </CartContextProvider>
    </div>

  );
}

export default App;
