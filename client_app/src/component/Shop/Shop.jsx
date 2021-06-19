import React, { useState, useEffect, useContext } from 'react';

import queryString from 'query-string'
import producerAPI from '../API/producer'
import { NavLink } from 'react-router-dom'
import Pagination from '../Shared/Pagination'
import SelectCount from '../Shared/SelectCount';
import { CartContext } from '../context/CartContext'

function Shop(props) {
    const { addToCart } = useContext(CartContext);
    const { search } = window.location;
    const [menu, setMenu] = useState([])
    const [filter, setFilter] = useState({
        page: '1',
        limit: '6',
        status: true,
        sort: ""
    })

    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [count, setCount] = useState(1)
    const [show, setShow] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            const query = '?' + queryString.stringify(Object.assign({}, filter, { search: new URLSearchParams(search).get('s') }))
            const response = await producerAPI.detailProduct(props.match.params.id, query)
            setProducts(response.products)
            setTotalPage(response.totalPage)
        }
        fetchAllData()
    }, [filter, new URLSearchParams(search).get('s'), props.match.params.id])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    useEffect(() => {
        const fetchAllData = async () => {
            const res = await producerAPI.getAPI()
            setMenu(res)
            setTimeout(() => setShow(true));
        }
        fetchAllData()
    }, [])

    const increaseCount = (value) => {
        setCount(count + 1)
    }


    const decreaseCount = (value) => {
        setCount(count - 1)
    }

    const onChangeCount = (value, item) => {
        setCount(Number(value))
    }

    const onChangeSort = (value) => {
        console.log(value)
        setFilter({
            ...filter,
            sort: value
        })
    }

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Shop</li>
                        </ul>
                    </div>
                </div>
            </div>


            {
                show && (
                    <div className="content-wraper mt-60 mt-sm-30">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-lg-3">
                                    {/*sidebar-categores-box start  */}
                                    <div className="sidebar-categores-box">
                                        <div className="sidebar-title">
                                            <h2>SmartPhone</h2>
                                        </div>
                                        {/* category-sub-menu start */}
                                        <div className="category-sub-menu">
                                            <ul>
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
                                        </div>
                                        {/* category-sub-menu end */}
                                    </div>
                                </div>

                                <div className="col-md-12 col-lg-9">

                                    <div className="shop-top-bar">

                                        <div className="product-select-box">
                                            <div className="product-short">
                                                <p>Sort By:</p>
                                                <select className="nice-select" onChange={(e) => onChangeSort(e.target.value)}>
                                                    <option value="">Relevance</option>
                                                    <option value="1">Price (Low &gt; High)</option>
                                                    <option value="-1">Price (High &gt; Low)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shop-products-wrapper">
                                        <div className="tab-content">
                                            <div id="grid-view" className="tab-pane active show" role="tabpanel">
                                                <div className="product-area shop-product-area">

                                                    <div className="row d-flex justify-content-center justify-content-md-around justify-content-lg-around justify-content-xl-start">

                                                        {
                                                            products && products.length > 0 ? products.map((item, index) => (
                                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mt-80" style={{ maxWidth: "360px", minHeight: "450px", maxHeight: "460px" }} key={index}>
                                                                    <div className="single-product-wrap">
                                                                        <div className="product-image">
                                                                            <img src={process.env.REACT_APP_API + item.image} width="100%" style={{ minHeight: "300px" }} />
                                                                            {
                                                                                item.number < 1 ? (<span className="sticker">Sold</span>) :
                                                                                    (
                                                                                        item.id_sale && item.id_sale.status ? (<span className="sticker">-{item.id_sale.promotion}%</span>) : ("")
                                                                                    )
                                                                            }

                                                                        </div>

                                                                        <div className="product_desc">
                                                                            <div className="product_desc_info">
                                                                                <div className="product-review">
                                                                                    <h5 className="manufacturer">
                                                                                        <NavLink to={"/shop/" + item.id_producer.producer}>{item.id_producer.producer}</NavLink>
                                                                                    </h5>

                                                                                </div>
                                                                                <h4><NavLink to={"/detail/" + item._id} className="product_name shop" >{item.name_product}</NavLink></h4>

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
                                                                            <div className="add-actions">
                                                                                <ul className="add-actions-link">
                                                                                    <li className="add-cart active"><NavLink to={"/detail/" + item._id} style={{ cursor: 'pointer' }}>Add to cart</NavLink></li>
                                                                                    <li><a style={{ cursor: 'pointer' }} onClick={() => setCount(1)} title="quick view" className="quick-view-btn" data-toggle="modal" data-target={"#examplemodalcenter" + item._id} ><i className="fa fa-eye" /></a></li>

                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>

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

                                                                </div>
                                                            )) : (

                                                                <h3 className="mx-auto mt-3">Không có sản phẩm nào</h3>
                                                            )

                                                        }

                                                    </div>

                                                </div>
                                            </div>

                                            <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                )
            }


        </div >
    );
}

export default Shop;