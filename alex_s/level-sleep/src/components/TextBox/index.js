import React from "react";

const TextBox = ({ item, classNames = "" }) => {
    let { icon, title, description } = item;

    return (
        <div className={"text-box " + classNames}>
            <div className="b-header">
                {icon &&
                    <div className="icon-wrap">
                        <span className={"icon " + icon}></span>
                    </div>
                }
                <h3 className="b-title">{title}</h3>
            </div>
            <div className="b-description">{description}</div>
        </div>
    );
}

export default TextBox;