import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom'
import Search from './Search'
import producerAPI from '../API/producer'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import Logo from '../../IMG/logo.jpg'

function Header() {
    const { cartItem, sumCount, sumPrice, show_success, deleteCart } = useContext(CartContext);
    const { user, logOut } = useContext(AuthContext);
    const [menu, setMenu] = useState([])
    useEffect(() => {
        const fetchAllData = async () => {
            const res = await producerAPI.getAPI()
            setMenu(res)
        }

        fetchAllData()
    }, [])



    return (
        <header>
            {
                show_success &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Bạn Đã Thêm Hàng Thành Công!</h4>
                    </div>
                </div>
            }
            {/* Begin Header Top Area */}
            <div className="header-top">
                <div className="container">
                    <div className="row">
                        {/* Begin Header Top Left Area */}
                        <div className="col-lg-3 col-md-4">
                            <div className="header-top-left">
                                <ul className="phone-wrap">
                                    <li><span>Telephone:(+84) 938 576 760</span></li>
                                </ul>
                            </div>
                        </div>
                        {/* Header Top Left Area End Here */}
                        {/* Begin Header Top Right Area */}
                        <div className="col-lg-9 col-md-8">
                            <div className="header-top-right">
                                <ul className="ht-menu">
                                    <li>
                                        <div className="ht-setting-trigger">
                                            {
                                                user ?
                                                    (
                                                        <span>Hello, {user.fullname}</span>
                                                    ) :
                                                    (
                                                        <span>Account</span>
                                                    )
                                            }

                                        </div>
                                        <div className="setting ht-setting">

                                            {
                                                user ?
                                                    (
                                                        <ul className="ht-setting-list">
                                                            <li><NavLink to="/profile" href >Xem thông tin</NavLink></li>
                                                            <li><NavLink to="/order" href >Lịch sử đặt hàng</NavLink></li>
                                                            <li><p onClick={() => { logOut() }}>Đăng xuất</p></li>

                                                        </ul>
                                                    ) :
                                                    (
                                                        <ul className="ht-setting-list">
                                                            <li><NavLink to="/login">Đăng nhập</NavLink></li>
                                                            <li><NavLink to="/register">Đăng kí</NavLink></li>
                                                        </ul>
                                                    )
                                            }


                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header Top Area End Here */}
            {/* Begin Header Middle Area */}
            <div className="header-middle pl-sm-0 pr-sm-0 pl-xs-0 pr-xs-0">
                <div className="container">
                    <div className="row">
                        {/* Begin Header Logo Area */}
                        <div className="col-lg-3">
                            <div className="logo pb-sm-30 pb-xs-30">
                                <Link to="/">
                                    <img src={Logo} alt="" width="200px" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-9 pl-0 ml-sm-15 ml-xs-15">
                            <Search />

                            <div className="header-middle-right">
                                <ul className="hm-menu">
                                    {/* Header Middle Wishlist Area End Here */}
                                    {/* Begin Header Mini Cart Area */}

                                    <li className="hm-minicart">
                                        <div className="hm-minicart-trigger">
                                            <span className="item-icon" />
                                            <span className="item-text">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(sumPrice) + 'đ'}
                                                <span className="cart-item-count">{sumCount}</span>
                                            </span>
                                        </div>
                                        <span />
                                        <div className="minicart">
                                            <ul className="minicart-product-list">
                                                {
                                                    cartItem && cartItem.map((c, index) => (
                                                        <li key={index}>
                                                            <a className="minicart-product-image">
                                                                <img src={process.env.REACT_APP_API + c.image} alt="cart products" />
                                                            </a>
                                                            <div className="minicart-product-details">
                                                                <Link to={"/detail/" + c.id_product}><h6 className="product_name">{c.name_product}</h6></Link>

                                                                <span>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(c.price_product)} x {c.count}</span>
                                                            </div>
                                                            <button onClick={() => deleteCart(c)} className="close" title="Remove">
                                                                <i className="fa fa-close" />
                                                            </button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                            <p className="minicart-total">SUBTOTAL: <span>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(sumPrice) + ' Đ'}</span></p>
                                            <div className="minicart-button">
                                                <Link to="/cart" className="li-button li-button-fullwidth">
                                                    <span>View Full Cart</span>
                                                </Link>
                                                <NavLink to="/checkout" className="li-button li-button-fullwidth">
                                                    <span>Checkout</span>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Header Mini Cart Area End Here */}
                                </ul>
                            </div>
                            {/* Header Middle Right Area End Here */}
                        </div>
                        {/* Header Middle Right Area End Here */}
                    </div>
                </div>
            </div>
            {/* Header Middle Area End Here */}
            {/* Begin Header Bottom Area */}
            <div className="header-bottom header-sticky d-none d-lg-block d-xl-block">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* Begin Header Bottom Menu Area */}
                            <div className="hb-menu">
                                <nav>
                                    <ul>
                                        <li><Link to="/">Home</Link></li>

                                        <li className="dropdown-holder dropdown"><Link to="/shop">Shop</Link>
                                            <ul className="hb-dropdown">
                                                {
                                                    menu && menu.map((item, index) =>
                                                    (
                                                        <li className="sub-dropdown-holder" key={index}>
                                                            <NavLink to={"/shop/" + item.producer.toLowerCase()} className="sidebar-link">
                                                                {item.producer}
                                                            </NavLink>
                                                        </li>

                                                    ))
                                                }


                                            </ul>
                                        </li>

                                        <li><Link to="/event">Event</Link></li>
                                    </ul>
                                </nav>
                            </div>
                            {/* Header Bottom Menu Area End Here */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Header Bottom Area End Here */}
            {/* Begin Mobile Menu Area */}
            <div className="mobile-menu-area d-lg-none d-xl-none col-12">
                <div className="container">
                    <div className="row">
                        <div className="mobile-menu mean-container">
                            <div className="mean-bar">
                                <a className="meanmenu-reveal collapse" data-toggle="collapse" data-target="#nav" aria-expanded="false" aria-controls="nav" ><span /><span /><span /></a>
                                <nav id="nav" className="mean-nav collapse">
                                    <ul>
                                        <li><Link to="/">Home</Link></li>
                                        <li className="dropdown-holder"><Link to="/shop">Shop</Link>
                                            <a className="mean-expand collapse" data-toggle="collapse" data-target="#shop" aria-expanded="false" aria-controls="shop" style={{ fontSize: '18px', cursor: 'pointer' }}>+</a>
                                            <ul id="shop" className="hb-dropdown collapse">
                                                {
                                                    menu && menu.map((item, index) =>
                                                    (
                                                        <li className="sub-dropdown-holder" key={index}>
                                                            <NavLink to={"/shop/" + item.producer.toLowerCase()} className="sidebar-link">
                                                                {item.producer}
                                                            </NavLink>
                                                        </li>

                                                    ))
                                                }


                                            </ul>

                                        </li>
                                        <li><Link to="/event">Event</Link></li>

                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Area End Here */}
        </header>
    );
}

export default Header;
