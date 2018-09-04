import React, { Fragment } from "react";

import SectionHeader from "../SectionHeader";
import TextBox from "../TextBox";
import AuthorInfo from "../AuthorInfo";
import MobileSlider from "../MobileSlider";

const ProofSection = ({ header, content: { img, title, items = [], author }, width }) => {
    let isMobile = width <= 767;

    return (
        <section className="proof-section small-section">
            <div className="container">
                <SectionHeader header={header} classNames="position-center">
                    {author &&
                        <AuthorInfo author={author} classNames="horizontal" />
                    }
                </SectionHeader>
            </div>
            {!isMobile &&
                <Fragment>
                    <div className="img-wrap">
                        <img src={img} title={title} alt={title} />
                    </div>
                    <div className="container">
                        <div className="row">
                            {items.map(item => {
                                return (
                                    <TextBox item={item} classNames="col-sm-4" key={item.id} />
                                );
                            })}
                        </div>

                    </div>
                </Fragment>
            }
            {isMobile &&
                <div className="container">
                    <MobileSlider slidesToShow={1}>
                        {items.map(item => {
                            let { mobileImg, title } = item;

                            return (
                                <div className="slide-item" key={item.id} >
                                    <div className="img-wrap">
                                        <img src={mobileImg} title={title} alt={title} />
                                    </div>
                                    <TextBox item={item} />
                                </div>
                            );
                        })}
                    </MobileSlider>
                </div>
            }
        </section>
    );
}

export default ProofSection;