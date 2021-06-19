import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import queryString from 'query-string'

import productAPI from '../API/product'
import SelectCount from '../Shared/SelectCount';
import { CartContext } from '../context/CartContext'


function Sliders(props) {
    const { addToCart } = useContext(CartContext);
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const [count, setCount] = useState(1)
    const [products, set_products] = useState([])
    const increaseCount = (value) => {
        setCount(count + 1)
    }


    const decreaseCount = (value) => {
        setCount(count - 1)
    }

    const onChangeCount = (value, item) => {
        setCount(Number(value))
    }

    useEffect(() => {

        const fetchData = async () => {

            const params = {
                producer: props.id,
                count: 7
            }

            const query = '?' + queryString.stringify(params)

            const response = await productAPI.getCategory(query)

            set_products(response)

        }

        fetchData()

    }, [])



    return (
        <section className="product-area li-laptop-product pt-60 pb-45">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="li-section-title">
                            <h2>
                                <NavLink to={"/shop/" + props.producer.toLowerCase()} className="sidebar-link">
                                    {props.producer}
                                </NavLink>
                            </h2>
                        </div>
                        <Slider {...settings}>
                            {
                                products && products.map(item => (
                                    <div key={item._id}>
                                        <div className="home">
                                            <div className="product-image">
                                                <img src={process.env.REACT_APP_API + item.image} width="100%" style={{ minHeight: "300px" }} />
                                                {
                                                    item.number < 1 ? (<span className="sticker">Sold</span>) :
                                                        (
                                                            item.id_sale && item.id_sale.status ? (<span className="sticker">-{item.id_sale.promotion}%</span>) : ("")
                                                        )
                                                }

                                            </div>
                                            <hr className="m-0 mt-3" />
                                            <div className="product_desc ml-3">
                                                <div className="product_desc_info">

                                                    <h3><NavLink to={"/detail/" + item._id} className="product_name shop" >{item.name_product}</NavLink></h3>

                                                    {
                                                        item.id_sale && item.id_sale.status ?
                                                            (
                                                                <div className="price-box d-flex justify-content-between">
                                                                    <del className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(item.price_product) + ' VNĐ'}</del>
                                                                    <span className="new-price new-price-2" style={{ color: '#525252' }}>
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(Number(item.price_product) * (100 - Number(item.id_sale.promotion)) / 100) + ' VNĐ'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="price-box">
                                                                    <span className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(item.price_product) + ' VNĐ'}</span>
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                                <div>
                                                    <ul className="add-actions-link">
                                                        <li className="add-cart active"><NavLink to={"/detail/" + item._id} style={{ cursor: 'pointer' }}>Add to cart</NavLink></li>
                                                        <li><a style={{ cursor: 'pointer' }} onClick={() => setCount(1)} title="quick view" className="quick-view-btn" data-toggle="modal" data-target={"#examplemodalcenter" + item._id} ><i className="fa fa-eye" /></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))
                            }

                        </Slider>
                    </div>
                </div>
            </div>
            {
                products && products.map((item) => (
                    <div className="modal fade modal-wrapper" id={"examplemodalcenter" + item._id}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                    <div className="modal-inner-area row">
                                        <div className="col-lg-5 col-md-6 col-sm-6 image-cart-mini">
                                            {/* Product Details Left */}
                                            <div className="product-details-left">
                                                <div className="product-details-images slider-navigation-1">
                                                    <div className="lg-image">
                                                        <img src={process.env.REACT_APP_API + item.image} alt="product image" />
                                                    </div>

                                                </div>
                                            </div>
                                            {/*// Product Details Left */}
                                        </div>
                                        <div className="col-lg-7 col-md-6 col-sm-6">
                                            <div className="product-details-view-content pt-60">
                                                <div className="product-info">
                                                    <h2>{item.name_product}</h2>
                                                    <div className="price-box pt-20">
                                                        {
                                                            item.id_sale && item.id_sale.status ?
                                                                (
                                                                    <div>
                                                                        <del className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(item.price_product) + ' VNĐ'}</del>
                                                                        <div className="new-price mt-2" style={{ color: 'black' }}>
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(Number(item.price_product) * (100 - Number(item.id_sale.promotion)) / 100) + ' VNĐ'}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="price-box">
                                                                        <span className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(item.price_product) + ' VNĐ'}</span>
                                                                    </div>
                                                                )

                                                        }
                                                    </div>
                                                    <div className="product-desc">
                                                        <p>
                                                            <span>
                                                                {item.describe}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div className="single-add-to-cart">
                                                        <div className="quantity">

                                                            <div className="cart-plus-minus">
                                                                <SelectCount count={count} increaseCount={increaseCount} decreaseCount={decreaseCount} onChangeCount={onChangeCount} />
                                                            </div>
                                                        </div>
                                                        <div className="cart-quantity">
                                                            {
                                                                item.number < 1 ?
                                                                    (
                                                                        <button className="sold-out" type="submit">Sold Out</button>
                                                                    ) :
                                                                    (
                                                                        <button onClick={() => addToCart(item, count)} className="add-to-cart" type="submit">Add to cart</button>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

        </section>


    );
}

export default Sliders;