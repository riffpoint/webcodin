import React from "react";

import SectionHeader from "../SectionHeader";
import TextBox from "../TextBox";

const SetupSection = ({ header, list = [] }) => (
    <section className="setup-section small-section">
        <div className="container">
            <SectionHeader header={header} classNames="position-center" />
            <div className="row">
                {list.map(item => {
                    return (
                        <TextBox item={item} classNames="col-sm-4" key={item.id} />
                    );
                })}
            </div>
        </div>
    </section>
);

export default SetupSection;