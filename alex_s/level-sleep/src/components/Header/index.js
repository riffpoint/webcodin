import React, { Fragment } from "react";

import Logo from "../Logo";
import Menu from "../Menu";

const Header = ({ siteLogo, mainMenu, width }) => {
    let isMobile = width <= 719;

    return (
        <div id="header" className="header">
            <div className="pull-left">
                <Logo src={siteLogo.src} title={siteLogo.title} />
            </div>
            {!isMobile &&
                <div className="pull-right">
                    <Menu menu={mainMenu} classNames="horizontal" />
                    <div className="help-box">
                        <span className="icon icon-speechbubble"></span>
                        Questions? <a href="/">Chat Us</a> or <a href="tel:8009998831">Call Us at 800-999-8831</a>
                    </div>
                    <a href="/" className="cart-btn">
                        <span className="icon icon-cart"></span>
                    </a>
                </div>
            }
            {isMobile &&
                <Fragment>
                    <div className="pull-right">
                        <button type="button" className="help-box">
                            <span className="icon icon-speechbubble"></span>
                        </button>
                        <button type="button" className="cart-btn">
                            <span className="icon icon-cart"></span>
                        </button>
                        <button type="button" className="menu-btn">
                            <span className="icon icon-hamburger"></span>
                        </button>
                    </div>
                    <Menu menu={mainMenu} />
                </Fragment>
            }
        </div>
    );
};

export default Header;