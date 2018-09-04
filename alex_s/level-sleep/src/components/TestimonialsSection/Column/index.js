import React from "react";

import AuthorInfo from "../../AuthorInfo";

const Column = ({ item, classNames }) => {
    let { thumbnail, title, author } = item;

    return (
        <div className={classNames}>
            <div className="video-thumbnail">
                <img src={thumbnail} title={title} alt={title} />
                <button className="button-play" type="button">
                    <span className="icon icon-button-play"></span>
                </button>
            </div>
            <AuthorInfo author={author} classNames="horizontal" />
        </div>
    );
}

export default Column;