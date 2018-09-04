import React from "react";

const Button = ({ children, link = "/", title, type = "link", classNames }) => {
    const getButton = () => {
        let btn = "";
        if (type == "link") {
            btn = <a className={"base-btn " + classNames} href={link} title={title}>{children}</a>;
        } else {
            btn = <button className={"base-btn " + classNames} type={type}>{children}</button>
        }
        return btn;
    }

    return (
        <div className={"base-btn-wrap"}>
            {getButton()}
        </div>
    );
}

export default Button;