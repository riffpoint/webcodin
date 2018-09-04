import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

export default class MobileSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSlide: 1
        }

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    next = () => {
        this.slider.slickNext();
    }

    previous = () => {
        this.slider.slickPrev();
    }

    render() {
        let { currentSlide } = this.state;
        let { children, slidesToShow = 2 } = this.props;

        const settings = {
            arrows: false,
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: slidesToShow,
            slidesToScroll: 1,
            beforeChange: (oldIndex, newIndex) => {
                this.setState({
                    currentSlide: newIndex + 1
                });
            }
        };

        return (
            <div className="mobile-slider">
                <Slider ref={c => (this.slider = c)} {...settings}>
                    {children}
                </Slider>
                <div className="m-slider-controls">
                    <button className="arrow-prev" onClick={this.previous}>
                        <span className="icon icon-arrow-prev"></span>
                    </button>
                    <div className="slider-counter">
                        {currentSlide}/{children.length}
                    </div>
                    <button className="arrow-next" onClick={this.next}>
                        <span className="icon icon-arrow-next"></span>
                    </button>
                </div>
            </div>
        );
    }
}