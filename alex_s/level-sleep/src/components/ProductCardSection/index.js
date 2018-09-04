import React from "react";

import ReadReviews from "../ReadReviews";
import Button from "../Button";

const ProductCardSection = ({ title, content, image, width }) => {
    let isMobile = width <= 767;

    return (
        <section className="product-card-section small-section">
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <h2 className="p-title">{title}</h2>
                        <ReadReviews />
                        <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: content }}></div>
                        {!isMobile &&
                            <Button classNames="blue h-dark">Show Pillow</Button>
                        }
                    </div>
                    <div className="col-sm-7 col-sm-offset-1">
                        <img src={image} title={title} alt={title} />
                        {isMobile &&
                            <Button classNames="blue h-dark">Show Pillow</Button>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductCardSection;