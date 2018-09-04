import React, { Fragment } from "react";

const Materials = ({ materials = [] }) => (
    <Fragment>
        {materials.map(({ id, html }) => {
            return (
                <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: html }} key={id}></div>
            );
        })}
    </Fragment>
);

export default Materials;