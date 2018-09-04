import React from "react";

const InfoLabel = ({ image: { src, title } }) => (
    <div className="info-label">
        <img src={src} alt={title} title={title} />
    </div>
);

export default InfoLabel;