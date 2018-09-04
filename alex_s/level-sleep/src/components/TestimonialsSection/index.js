import React from "react";

import SectionHeader from "../SectionHeader";
import MobileSlider from "../MobileSlider";
import Column from "./Column";

const TestimonialsSection = ({ header, list = [], width }) => {
    let isMobile = width <= 767;

    return (
        <section className="testimonials-section small-section">
            <div className="container">
                <SectionHeader header={header} classNames="position-center" />

                {!isMobile &&
                    <div className="row t-items">
                        {list.map(item => {
                            return (
                                <Column key={item.id} item={item} classNames="col-sm-4" />
                            );
                        })}
                    </div>
                }

                {isMobile &&
                    <MobileSlider>
                        {list.map(item => {
                            return (
                                <Column key={item.id} item={item} />
                            );
                        })}
                    </MobileSlider>
                }
            </div>
        </section>
    );
}

export default TestimonialsSection;