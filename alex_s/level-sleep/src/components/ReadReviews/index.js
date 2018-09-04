import React from "react";

const ReadReviews = ({ link = "/", numberOfStars = 5 }) => {
    const getStars = () => {
        let arr = [];

        for (let i = 1; i <= numberOfStars; i++) {
            arr.push('<span class="icon icon-star"></span>');
        }

        return arr.join('');
    }

    return (
        <a href={link} className="read-reviews" title="Read Reviews">
            <span className="r-stars" dangerouslySetInnerHTML={{ __html: getStars() }}></span>
            <span className="r-text">Read Reviews</span>
        </a>
    );
}

export default ReadReviews;