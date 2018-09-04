import React from "react";

const Logo = ({ link = "/", src, title }) => (
    <a href={link} className="logo">
        <img src={src} alt={title} title={title} />
    </a>
);

export default Logo;