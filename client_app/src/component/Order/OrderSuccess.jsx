import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from '../context/CartContext'

OrderSuccess.propTypes = {

};

function OrderSuccess(props) {
    const { setRedirect } = useContext(CartContext);
    useEffect(() => {
        setRedirect(false);
    }, [])
    return (
        <div className="container">
            <h1>You Have Ordered Successfully</h1>
        </div>
    );
}

export default OrderSuccess;