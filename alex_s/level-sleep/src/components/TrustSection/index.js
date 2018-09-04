import React from "react";

import Column from "./Column";

const TrustSection = ({ list = [] }) => (
    <section className="trust-section">
        <div className="container">
            <div className="row">
                {list.map(item => {
                    return (
                        <Column key={item.id} item={item} classNames="col-sm-4" />
                    );
                })}
            </div>
        </div>
    </section>
);

export default TrustSection;