import React, { useContext } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AuthContext } from './component/context/Auth'


import Header from './component/Shared/Header'
import Menu from './component/Shared/Menu';
import PrivateRoute from './component/PrivateRoute/PrivateRoute'
import PrivateRouteAdmin from './component/PrivateRoute/PrivateRouteAdmin'

import Product from './component/Product/Product'
import CreateProduct from './component/Product/CreateProduct'
import UpdateProduct from './component/Product/UpdateProduct'

import Coupon from './component/Coupon/Coupon'
import CreateCoupon from './component/Coupon/CreateCoupon'
import UpdateCoupon from './component/Coupon/UpdateCoupon'

import Sale from './component/Sale/Sale'
import CreateSale from './component/Sale/CreateSale'
import UpdateSale from './component/Sale/UpdateSale'

import Producer from './component/Producer/Producer'
import CreateProducer from './component/Producer/CreateProducer'
import DetailProducer from './component/Producer/DetailProducer'
import UpdateProducer from './component/Producer/UpdateProducer'

import Permission from './component/Permission/Permission'
import CreatePermission from './component/Permission/CreatePermission'
import UpdatePermission from './component/Permission/UpdatePermission'

import User from './component/User/User'
import CreateUser from './component/User/CreateUser'
import UpdateUser from './component/User/UpdateUser'

import UserCus from './component/UserCus/UserCus'
import CreateUserCus from './component/UserCus/CreateUserCus'
import UpdateUserCus from './component/UserCus/UpdateUserCus'

import Order from './component/Order/Order'
import DetailOrder from './component/Order/DetailOrder'
import ConfirmOrder from './component/Order/ConfirmOrder'
import Delivery from './component/Order/Delivery'
import ConfirmDelivery from './component/Order/ConfirmDelivery'
import CompletedOrder from './component/Order/CompletedOrder'
import CancelOrder from './component/Order/CancelOrder'
import Login from './component/Login/Login';
import NotFound from './component/NotFound/NotFound';

function App() {
  const { jwt, user } = useContext(AuthContext);
  return (
    <Router>
      <div id="main-wrapper" data-theme="light" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed" data-boxed-layout="full">

        <Header />
        <Menu />

        <Switch>
          <Route exact path='/' component={Login} />

          <PrivateRoute exact path='/customer' component={UserCus} />
          <PrivateRoute path='/customer/create' component={CreateUserCus} />
          <PrivateRoute path='/customer/update/:id' component={UpdateUserCus} />


          <PrivateRoute exact path='/product' component={Product} />
          <PrivateRoute path='/product/create' component={CreateProduct} />
          <PrivateRoute path='/product/update/:id' component={UpdateProduct} />

          <PrivateRoute exact path='/coupon' component={Coupon} />
          <PrivateRoute path='/coupon/create' component={CreateCoupon} />
          <PrivateRoute path='/coupon/update/:id' component={UpdateCoupon} />

          <PrivateRoute exact path='/producer' component={Producer} />
          <PrivateRoute path='/producer/create' component={CreateProducer} />
          <PrivateRoute path='/producer/update/:id' component={UpdateProducer} />
          <PrivateRoute path='/producer/:id' component={DetailProducer} />


          <PrivateRoute exact path='/sale' component={Sale} />
          <PrivateRoute path='/sale/create' component={CreateSale} />
          <PrivateRoute path='/sale/update/:id' component={UpdateSale} />

          <PrivateRoute exact path='/order' component={Order} />
          <PrivateRoute path='/order/detail/:id' component={DetailOrder} />
          <PrivateRoute path='/confirmorder' component={ConfirmOrder} />
          <PrivateRoute path='/delivery' component={Delivery} />
          <PrivateRoute path='/confirmdelivery' component={ConfirmDelivery} />
          <PrivateRoute path='/completedorder' component={CompletedOrder} />
          <PrivateRoute path='/cancelorder' component={CancelOrder} />

          <PrivateRouteAdmin exact path='/permission' component={Permission} />
          <PrivateRouteAdmin path='/permission/create' component={CreatePermission} />
          <PrivateRouteAdmin path='/permission/update/:id' component={UpdatePermission} />

          <PrivateRouteAdmin exact path='/user' component={User} />
          <PrivateRouteAdmin path='/user/create' component={CreateUser} />
          <PrivateRouteAdmin path='/user/update/:id' component={UpdateUser} />

          <Route component={NotFound} />
        </Switch>;

      </div>

    </Router>




  );
}

export default App;
