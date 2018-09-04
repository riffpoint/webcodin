import React from "react";

import QuestionSection from "../QuestionsSection";
import Logo from "../Logo";
import Socials from "../Socials";
import Menu from "../Menu";

const Footer = ({ logo = {}, contacts, information = [], socials, navigation, copyright = {} }) => (
    <footer id="footer" className="footer">
        <div className="container">
            <div className="row">
                <div className="col-sm-5 col-md-4 blue">
                    <QuestionSection />
                </div>
                <div className="col-sm-7 col-md-6 col-md-offset-2 black">
                    <Logo src={logo.src} title={logo.title} />
                    <div className="footer-row">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row-inner">
                                    <h3 className="f-title">Contact Us</h3>
                                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: contacts.content }}></div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row-inner">
                                    <h3 className="f-title">Information</h3>
                                    <Menu menu={information} classNames="f-info-link" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-row">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row-inner">
                                    <Socials list={socials} classNames="horizontal" />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <Menu menu={navigation} classNames="terms-menu horizontal" />
                            </div>
                        </div>
                    </div>
                    <div className="copyright">
                        <div className="row">
                            <div className="col-sm-6">&copy; {copyright.text}</div>
                            <div className="col-sm-6">{copyright.note}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer >
);

export default Footer;