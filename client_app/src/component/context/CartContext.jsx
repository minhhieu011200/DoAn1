import React, { createContext, useState, useEffect } from 'react';


export const CartContext = createContext();

const CartContextProvider = (props) => {
    const [sumCount, setSumCount] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [cartItem, setCartItem] = useState([]);
    const [show_success, set_show_success] = useState(false)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('carts'))) {
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
            price_product: item.price_product,
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

    const checkOut = () => {
        setSumCount(0)
        localStorage.setItem('carts', JSON.stringify([]))
    }


    return (
        <CartContext.Provider
            value={{
                cartItem,
                sumPrice,
                sumCount,
                show_success,
                addToCart,
                deleteCart,
                onChangeCount,
                increaseCount,
                decreaseCount,
                checkOut

            }}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;