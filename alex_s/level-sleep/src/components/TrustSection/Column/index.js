import React from "react";

const Column = ({ item, classNames = "" }) => {
    const getStars = (stars) => {
        let arr = [];

        for (let i = 0; i < stars; i++) {
            arr.push('<span class="icon icon-star"></span>');
        }

        return arr.join('');
    }
    
    let { title, image, stars = 0 } = item;

    return (
        <div className={"text-box " + classNames}>
            <div className="t-item">
                <div className="t-img">
                    <img src={image} title={title} alt={title} />
                </div>
                <div className="t-content">
                    <div className="t-stars" dangerouslySetInnerHTML={{ __html: getStars(stars) }}></div>
                    <h3 className="t-title" dangerouslySetInnerHTML={{ __html: title }}></h3>
                </div>
            </div>
        </div>
    );
}

export default Column;