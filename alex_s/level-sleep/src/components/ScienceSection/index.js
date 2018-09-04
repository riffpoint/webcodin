import React from "react";

import Button from "../Button";
import Column from "./Column";
import MobileSlider from "../MobileSlider";

const ScienceSection = ({ header, list = [], label, width }) => {
    let isMobile = width <= 767;

    return (
        <section className="science-section small-section">
            <div className="s-label">
                <img src={label.image} title={label.title} alt={label.title} />
            </div>
            <div className="container">
                <div className="s-header">
                    <h2 className="s-title">{header.title}</h2>
                    <Button classNames="blue h-light">{header.button}</Button>
                </div>

                {!isMobile &&
                    <div className="row text-grid">
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

export default ScienceSection;