import React, { useState, useEffect } from 'react';
import crypto from 'crypto'

import io from "socket.io-client";

import orderAPI from '../API/order';

const socket = io(process.env.REACT_APP_API, {
    transports: ['websocket'], jsonp: false
});
socket.connect();

function MoMo(props) {
    const { search } = window.location;

    const [note, setNote] = useState('')
    useEffect(() => {

        const fetchData = async () => {
            const serectkey = process.env.REACT_APP_SECRET_KEY
            const accessKey = new URLSearchParams(search).get('accessKey')
            const amount = new URLSearchParams(search).get('amount')
            const extraData = new URLSearchParams(search).get('extraData')
            const errorCode = new URLSearchParams(search).get('errorCode')
            const localMessage = new URLSearchParams(search).get('localMessage')
            const message = new URLSearchParams(search).get('message')
            const orderId = new URLSearchParams(search).get('orderId')
            const orderInfo = new URLSearchParams(search).get('orderInfo')
            const orderType = new URLSearchParams(search).get('orderType')
            const partnerCode = new URLSearchParams(search).get('partnerCode')
            const payType = new URLSearchParams(search).get('payType')
            const requestId = new URLSearchParams(search).get('requestId')
            const responseTime = new URLSearchParams(search).get('responseTime')
            const transId = new URLSearchParams(search).get('transId')

            let param = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&transId=${transId}&message=${message}&localMessage=${localMessage}&responseTime=${responseTime}&errorCode=${errorCode}&payType=${payType}&extraData=${extraData}`

            var signature = crypto.createHmac('sha256', serectkey)
                .update(param)
                .digest('hex');

            console.log(signature)
            if (new URLSearchParams(search).get('signature') !== signature) {
                setNote("Thông tin request không hợp lệ")
                return;
            }
            var body = {
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: orderId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                orderType: orderType,
                transId: transId,
                message: message,
                localMessage: localMessage,
                responseTime: responseTime,
                errorCode: errorCode,
                payType: payType,
                extraData: extraData,
                signature: signature
            }
            if (errorCode == 0) {
                const response = await orderAPI.momo(body)
                if (response === "Thanh Cong") {
                    socket.emit('send_order', "Có người vừa đặt hàng")
                }

                setNote("Thanh toán thành công")
            } else {
                const response = await orderAPI.momo(body)
                console.log(response)
                setNote("Thanh toán thất bại")
            }

        }
        fetchData()

    }, [])

    return (
        <div className="container">
            <h1>{note}</h1>
        </div>
    );
}

export default MoMo;