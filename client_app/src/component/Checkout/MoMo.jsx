import React, { useEffect, useState } from 'react';
import axios from 'axios';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';


function MoMo(props) {
    const [error, setError] = useState(false)
    useEffect(() => {
        const path = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        const partnerCode = process.env.REACT_APP_PARTNER_CODE
        const accessKey = process.env.REACT_APP_ACCESS_KEY
        const serectkey = process.env.REACT_APP_SECRET_KEY
        const orderInfo = "Thanh toán MoMo"
        const notifyurl = process.env.REACT_APP_API + "/api/payment/momo"
        const returnUrl = "https://hieusuper20hcm.netlify.app/momo"
        const amount = props.total.toString()
        const orderId = uuidv4();
        const requestType = "captureMoMoWallet"
        const extraData = props.extraData
        const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${orderId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${returnUrl}&notifyUrl=${notifyurl}&extraData=${extraData}`

        var signature = crypto.createHmac('sha256', serectkey)
            .update(rawSignature)
            .digest('hex');

        var body = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: orderId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            returnUrl: returnUrl,
            notifyUrl: notifyurl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
        })
        axios.post(path, body)
            .then(response => {
                console.log(response)
                if (response.data.errorCode !== 0) {
                    setError(true)
                    setTimeout(() => {
                        setError(false)
                    }, 1500)
                } else {
                    localStorage.setItem('carts', JSON.stringify([]))
                    window.location.href = response.data.payUrl
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }, [])

    return (
        <div>
            {
                error &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Lỗi thanh toán!!!</h4>
                    </div>
                </div>
            }
        </div>
    );
}

export default MoMo;
