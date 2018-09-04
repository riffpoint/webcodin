import React from "react";

import Button from "../Button";

const CTAMobile = ({ show, select, scrollTo }) => (
    <div className={"cta-mobile " + (show ? "show" : "")} >
        <div className="pull-left">
            <h3 className="cta-title">{select} selected</h3>
            <a href="/" onClick={e => scrollTo(e, "DetailsSection")} title="Product Details">Product Details</a>
            <a href="/" onClick={e => scrollTo(e, "SelectSize")} title="Change">Change</a>
        </div>
        <div className="pull-right">
            <Button type="button" classNames="blue h-light">Buy Now</Button>
        </div>
    </div>
);

export default CTAMobile;