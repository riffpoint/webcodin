import React from "react";

const Affirm = ({ link = "/", image, title, text }) => (
    <div className="affirm">
        <a href={link}>
            <img src={image} title={title} alt={title} />
            <span>{text}</span>
        </a>
    </div>
);

export default Affirm;