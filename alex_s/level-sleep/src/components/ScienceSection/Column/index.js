import React from "react";

const Column = ({ item, classNames = "" }) => {
    let { icon, title, description } = item;

    return (
        <div className={"text-box " + classNames}>
            <div className="b-wrap">
                <div className="b-inner">
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
            </div>
        </div>
    );
}

export default Column;