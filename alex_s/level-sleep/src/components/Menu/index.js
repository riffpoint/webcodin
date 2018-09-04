import React from "react";
import { Link } from "react-router-dom";

const Menu = ({ menu = [], classNames = "" }) => (
    <nav className={"menu " + classNames}>
        <ul>
            {menu.map(({ id, link = "/", title }) => {
                return (
                    <li key={id}>
                        <Link to={link} title={title} >{title}</Link>
                    </li>
                );
            })}
        </ul>
    </nav>
);

export default Menu;