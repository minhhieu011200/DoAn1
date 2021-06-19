import React, { useEffect, useState } from 'react';
import producerAPI from '../API/producer'
import Slider from './Sliders'

function Home(props) {
    const [producer, setProducer] = useState([])

    useEffect(() => {
        const fetchAllData = async () => {
            const res = await producerAPI.getAPI()
            setProducer(res)
        }

        fetchAllData()
    }, [])


    return (
        <div className="container">
            <div className="slider-with-banner">

                <div className="row">
                    <div className="col-lg-8 col-md-8">
                        <div>
                            <div className="carousel-inner">
                                <div className="single-slide align-center-left animation-style-01 bg-1"
                                    style={{ backgroundImage: `url("https://cdn.tgdd.vn/Products/Images/42/210246/Slider/samsung-galaxy-a71-053720-033719-472.jpg")` }}>
                                    <div className="slider-progress"></div>

                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                        <div className="li-banner">
                            <a>
                                <img src="https://cdn.tgdd.vn/Products/Images/42/202028/Slider/vi-vn-oppo-a9-2020-thumbvideo.jpg" alt="" />
                            </a>
                        </div>
                        <div className="li-banner mt-15 mt-sm-30 mt-xs-30">
                            <a>
                                <img src="https://didonghan.vn/pic/news/cuoithangthat-500-261.jpg" height="255px" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Slider producer="Sale" id="" />

            <div className="li-static-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 text-center">
                            <div className="single-banner">
                                <img src="https://minhkiet.com.vn/wp-content/uploads/2018/06/ssbia-700x350.gif" height="200px" alt="Li's Static Banner" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                            <div className="single-banner">
                                <img src="http://file.hstatic.net/1000347078/collection/banneriphone_12pro_67dd5ad18e4f484587c9ae6f3e0b542d.jpg?fbclid=IwAR3EWpXeDBPSqJntdAZhYNjecrhprnaJlXVmNFPLmOyKRHFG9LETJpDyIbE" height="200px" alt="Li's Static Banner" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                            <div className="single-banner">
                                <img src="https://galaxydidong.vn/wp-content/uploads/2020/05/IMG_20200504_174251.jpg" height="200px" alt="Li's Static Banner" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                producer && producer.map((item, index) =>
                (
                    <Slider producer={item.producer} key={index._id} id={item._id} />
                ))
            }

        </div >

    );
}

export default Home;