import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const Gallery = ({ gallery = [], width }) => {

    let isMobile = width <= 767;

    let settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,

        customPaging: (i) => {
            return (
                <div>
                    {!isMobile &&
                        <img src={gallery[i].thumbnail} />
                    }
                </div>
            );
        }
    };

    return (
        <div className="gallery">
            <Slider {...settings}>
                {gallery.map(({ title, img, id }) => {
                    return (
                        <div key={id} className="gallery-item">
                            <img src={img} alt={title} title={title} />
                        </div>
                    )
                })}
            </Slider>
        </div>
    );
};

export default Gallery;