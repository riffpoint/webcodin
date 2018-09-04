import React from "react";

const AuthorInfo = ({ author: { name, profession, portrait }, classNames }) => (
    <div className={"author-info " + classNames}>
        <div className="a-portrait-wrap">
            <div className="a-portrait">
                {portrait &&
                    <img src={portrait} title={name} alt={name} />
                }
            </div>
        </div>
        <div className="a-details">
            <div className="a-name">{name}</div>
            <div className="a-profession">{profession}</div>
        </div>
    </div>
);

export default AuthorInfo;