import React from "react";

const Socials = ({ list = [], classNames }) => (
    <nav className={"socials " + classNames}>
        <ul>
            {list.map(({ id, icon, link = "/", title }) => {
                return (
                    <li key={id}>
                        <a href={link} title={title}>
                            <span className={"icon " + icon}></span>
                        </a>
                    </li>
                );
            })}
        </ul>
    </nav>
);

export default Socials;