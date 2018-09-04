import React from "react";

import InfoLabel from "../InfoLabel";

const Divider = ({ image }) => (
    <div className="divider">
        <div className="container">
            <InfoLabel image={image} />
        </div>
    </div>
);

export default Divider;