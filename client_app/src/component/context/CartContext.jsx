import React, { createContext, useState, useEffect } from 'react';

import io from "socket.io-client";

import orderAPI from '../API/order';

const socket = io(process.env.REACT_APP_API, {
    transports: ['websocket'], jsonp: false
});
socket.connect();

export const CartContext = createContext();

const CartContextProvider = (props) => {
    const [redirect, setRedirect] = useState(false);
    const [sumCount, setSumCount] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [cartItem, setCartItem] = useState([]);
    const [show_success, set_show_success] = useState(false)
    const [flag, setFlag] = useState(false)
    const [check, setCheck] = useState('')

    useEffect(async () => {

        if (JSON.parse(localStorage.getItem('carts'))) {
            if (!flag) {
                const response = await orderAPI.checkCart({ cartItem: JSON.parse(localStorage.getItem('carts')) })
                if (response.msg !== 'Thanh Cong') {
                    localStorage.setItem('carts', JSON.stringify(response.cart))
                }
                setFlag(true)
            }
            setCartItem(JSON.parse(localStorage.getItem('carts')))
            Sum(JSON.parse(localStorage.getItem('carts')), 0, 0)
        }
    }, [sumCount])



    function Sum(cartItem, count, price) {
        cartItem.forEach(item => {
            count += Number(item.count);
            price += Number(item.price_product) * Number(item.count);
        })
        setSumCount(count);
        setSumPrice(price);
    }

    const addToCart = (item, count) => {
        const cart = {
            id_cart: Math.random().toString().replace(".", ""),
            id_product: item._id,
            name_product: item.name_product,
            price_product: item.id_sale && item.id_sale.status ? Number(item.price_product) * (100 - Number(item.id_sale.promotion)) / 100 : item.price_product,
            image: item.image,
            count: count,
        }

        if (cartItem.length > 0) {
            const findCart = cartItem.find(value => {
                return value.id_product === cart.id_product
            })

            if (findCart) {
                cartItem.map(c => {
                    if (c === findCart) {
                        return c.count += Number(count)
                    }
                })
                setSumPrice(Number(sumPrice) + Number(count) * Number(cart.price_product))
                setSumCount(Number(sumCount) + count)
                set_show_success(true)

                setTimeout(() => {
                    set_show_success(false)
                }, 1000)
                localStorage.setItem('carts', JSON.stringify(cartItem))
            }
            else {
                setSumPrice(Number(sumPrice) + Number(count) * Number(cart.price_product))
                setSumCount(Number(sumCount) + count)

                cartItem.push(cart)
                localStorage.setItem('carts', JSON.stringify(cartItem))

                set_show_success(true)

                setTimeout(() => {
                    set_show_success(false)
                }, 1000)
            }
        }
        else {
            setSumPrice(Number(sumPrice) + Number(count) * Number(cart.price_product))
            setSumCount(Number(sumCount) + count)

            cartItem.push(cart)
            localStorage.setItem('carts', JSON.stringify(cartItem))

            set_show_success(true)

            setTimeout(() => {
                set_show_success(false)
            }, 1000)
        }
    }

    const resetCart = async (cart) => {
        let cartArr = cart.map(e => {
            return Object.assign({}, {
                id_cart: Math.random().toString().replace(".", ""),
                id_product: e.id_product._id,
                name_product: e.id_product.name_product,
                price_product: e.id_product.price_product,
                image: e.id_product.image,
                count: e.count,
            });
        })
        const response = await orderAPI.checkCart({ cartItem: cartArr })
        if (response.msg !== "Thanh Cong") {
            localStorage.setItem('carts', JSON.stringify(response.cart))
            setSumCount(1)
            return
        }
        localStorage.setItem('carts', JSON.stringify(cartArr))
        setSumCount(1)
    }

    const deleteCart = (data) => {
        let updateCart = cartItem.filter((item) => {
            return item !== data
        })

        setSumPrice(Number(sumPrice) + Number(data.count) * Number(data.price_product))
        setSumCount(Number(sumCount) - Number(data.count))
        localStorage.setItem('carts', JSON.stringify(updateCart))
    }

    const onChangeCount = (count, item) => {
        const index = cartItem.indexOf(item);
        setSumCount(Number(sumCount) + Number(count) - item.count)
        cartItem[index].count = count
        localStorage.setItem('carts', JSON.stringify(cartItem))

    }

    const increaseCount = (item) => {
        const index = cartItem.indexOf(item);
        setSumCount(Number(sumCount) + 1)
        cartItem[index].count = Number(item.count) + 1
        localStorage.setItem('carts', JSON.stringify(cartItem))
    }

    const decreaseCount = (item) => {
        const index = cartItem.indexOf(item);
        setSumCount(Number(sumCount) - 1)
        cartItem[index].count = Number(item.count) - 1
        localStorage.setItem('carts', JSON.stringify(cartItem))
    }

    const checkOut = async (fullname, phone, id_user, address, total, status, pay, id_payment, feeship, code, discount) => {
        const data = {
            fullname: fullname,
            phone: phone,
            id_user: id_user,
            address: address,
            total: total,
            status: status,
            pay: pay,
            id_payment: id_payment,
            feeship: feeship,
            cartItem: cartItem,
            code: code,
            discount: discount === 0 ? undefined : discount
        }
        const response = await orderAPI.post_order(data)
        if (response.msg === "Thanh Cong") {
            socket.emit('send_order', "Có người vừa đặt hàng")
            setSumCount(0)
            localStorage.setItem('carts', JSON.stringify([]))
            setRedirect(true)
        } else {
            setCheck(response.msg)
            localStorage.setItem('carts', JSON.stringify(response.cart))
            setSumCount(0)
            setTimeout(() => {
                setCheck('')
            }, 1500)
        }
    }

    const checkCart = async (cartItem) => {
        const response = await orderAPI.checkCart({ cartItem: cartItem })
        if (response.msg !== "Thanh Cong") {
            setCheck(response.msg)
            localStorage.setItem('carts', JSON.stringify(response.cart))
            setSumCount(0)
            setTimeout(() => {
                setCheck('')
            }, 1500)
        } else {
            setCheck(response.msg)
            setTimeout(() => {
                setCheck('')
            }, 1500)
        }
    }

    return (
        <CartContext.Provider
            value={{
                cartItem,
                sumPrice,
                sumCount,
                setSumCount,
                show_success,
                addToCart,
                deleteCart,
                onChangeCount,
                increaseCount,
                decreaseCount,
                checkOut,
                redirect,
                setRedirect,
                check,
                setCheck,
                checkCart,
                resetCart
            }}>
            {props.children}
        </CartContext.Provider>
    );
}
export default CartContextProvider;