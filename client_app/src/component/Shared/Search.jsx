import React, { useState, useRef } from 'react';
import queryString from 'query-string'
import productAPI from '../API/product';
import { NavLink, Link } from 'react-router-dom'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css"

function Search(props) {
    const [search, setSearch] = useState('')
    const delaySearchTextTimeOut = useRef(null)
    const [product, setProduct] = useState()
    const [show, setShow] = useState(false)

    const onChangeText = (e) => {
        const value = e.target.value

        setSearch(value)
        setShow(false)

        if (delaySearchTextTimeOut.current) {
            clearTimeout(delaySearchTextTimeOut.current)
        }

        delaySearchTextTimeOut.current = setTimeout(async () => {
            const query = '?' + queryString.stringify({ search: search })
            const response = await productAPI.searchProduct(query)
            console.log(response)
            setProduct(response)
        }, 300)

    }

    const handleSelect = (value) => {
        setSearch(value)
    };

    const handleClick = () => {
        setShow(true)
        setSearch('')
    }



    return (
        <form action={"/shop/search"} method="get" className="hm-searchbox">
            <Combobox onSelect={handleSelect} aria-labelledby="demo">
                <ComboboxInput
                    type="text"
                    id="header-search"
                    placeholder="Enter your search key ..."
                    value={search} onChange={onChangeText}
                    name="s"
                />
                <ComboboxPopover>
                    <ComboboxList className="show-search">
                        {
                            product && !show && product.length > 0 ? product.map(value => (
                                <ComboboxOption key={value._id} value={value.name_product} onClick={handleClick}>
                                    <NavLink to={"/detail/" + value._id} className="hover_box_search d-flex">
                                        <div style={{ padding: '.8rem' }}>
                                            <img className="img_list_search" src={process.env.REACT_APP_API + value.image} alt="" />
                                        </div>

                                        <div className="group_title_search" style={{ marginTop: '2.7rem' }}>
                                            <h6 className="product_name">{value.name_product}</h6>
                                            <span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.price_product) + ' VNĐ'}</span>
                                        </div>

                                    </NavLink>
                                </ComboboxOption>
                            )) : (
                                <h4 className="text-center">Không có sản phẩm nào</h4>
                            )
                        }
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            <button className="li-btn" type="submit"><i className="fa fa-search" /></button>
        </form>
    );
}

export default Search;
