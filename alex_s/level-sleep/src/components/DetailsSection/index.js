import React from "react";

import SectionHeader from "../SectionHeader";
import Materials from "./Materials";
import Sizes from "./Sizes";

const DetailsSection = ({ header, materials, sizes, myRef }) => (
    <section className="details-section small-section" ref={myRef}>
        <div className="container">
            <SectionHeader header={header} classNames="position-center" headerType="h1" />
            <div className="row">
                <div className="col-sm-5">
                    <div className="d-column">
                        <h2 className="d-title">Materials</h2>
                        <Materials materials={materials} />
                    </div>
                </div>
                <div className="col-sm-5 col-sm-offset-2">
                    <div className="d-column">
                        <h2 className="d-title">Size & Weight</h2>
                        <Sizes sizes={sizes} />
                    </div>
                </div>
            </div>
        </div>
    </section >
);

export default DetailsSection;