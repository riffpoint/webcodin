import React from "react";

import AuthorInfo from "../AuthorInfo";

const SingleTestimonialSection = ({ message, author }) => (
    <section className="single-testimonial-section">
        <div className="container">
            <div className="t-quotes">
                <span className="icon icon-quotemarks"></span>
            </div>
            <div className="t-message">{message}</div>
            <AuthorInfo author={author} classNames="vertical" />
        </div>
    </section>
);

export default SingleTestimonialSection;