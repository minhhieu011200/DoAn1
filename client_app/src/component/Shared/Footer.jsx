import React from 'react';
import Logo from '../../IMG/logo.jpg'

function Footer(props) {
    return (
        <div className="footer">
            <div className="footer-static-middle">
                <div className="container">
                    <div className="footer-logo-wrap pt-50 pb-35">
                        <div className="row text-center">
                            {/* Begin Footer Logo Area */}
                            <div className="col-sm-12 col-lg-6 text-center text-lg-left">
                                <div className="footer-logo">
                                    <img src={Logo} style={{ width: '200px' }} alt="Footer Logo" />
                                    <p className="info">
                                        Mua bán điện thoại
                                    </p>
                                </div>
                                <ul className="des">
                                    <li>
                                        <span>Address:</span> 83 năm châu
                                    </li>
                                    <li>
                                        <span>Phone: </span>
                                        <a href="#">(+84) 938 576 760</a>
                                    </li>
                                    <li>
                                        <span>Email: </span>
                                        <a href="mailto://info@yourdomain.com">minhhieu0112000@gmail.com</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-6">
                                <div className="footer-block">
                                    <h3 className="footer-block-title text-center">Follow Us</h3>
                                    <ul className="social-link d-flex justify-content-center">
                                        <li className="facebook">
                                            <a href="https://www.facebook.com/thewingphone" data-toggle="tooltip" target="_blank" title="Facebook">
                                                <i className="fa fa-facebook" />
                                            </a>
                                        </li>
                                        <li className="youtube">
                                            <a href="https://www.youtube.com/" data-toggle="tooltip" target="_blank" title="Youtube">
                                                <i className="fa fa-youtube" />
                                            </a>
                                        </li>
                                        <li className="instagram">
                                            <a href="https://www.instagram.com/minhhieu0112000/" data-toggle="tooltip" target="_blank" title="Instagram">
                                                <i className="fa fa-instagram" />
                                            </a>
                                        </li>
                                        <li className="github">
                                            <a href="https://github.com/minhhieu011200/DoAn1" data-toggle="tooltip" target="_blank" title="github">
                                                <i className="fa fa-github" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                            {/* Footer Block Area End Here */}
                        </div>
                    </div>
                </div>
            </div >
            {/* Footer Static Middle Area End Here */}
            {/* Begin Footer Static Bottom Area */}
            <div className="footer-static-bottom pt-5 pb-5">
                <div className="copyright text-center">
                    <img src="images/payment/1.png" alt="" />
                    Design by Minh Hiếu
                </div>
            </div>
        </div >
    );
}

export default Footer;
