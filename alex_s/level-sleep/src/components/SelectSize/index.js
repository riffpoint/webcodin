import React, { Component } from "react";

import Button from "../Button";
import Affirm from "../Affirm";

export default class SelectSize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sizeList: this.props.sizeList,
            currentSelect: ""
        }
    }

    componentDidMount() {
        this.setState({
            currentSelect: this.state.sizeList[0].title
        });
        this.props.updateSelectedSize(this.state.sizeList[0].title);
    }

    updateCurrentSelect = (text) => {
        this.setState({
            currentSelect: text
        });
        this.props.updateSelectedSize(text);
    }

    render() {
        let { currentSelect, sizeList } = this.state;
        let { myRef } = this.props;
        let buttonClass = this.props.width <= 768 ? "black h-light" : "blue h-dark";

        return (
            <form className="select-size" ref={myRef}>
                <div className="s-header">
                    <h3 className="h-title">Select Size</h3>
                    <a href="/" title="Product Details">Product Details</a>
                </div>
                <div className="radio-btns-list">
                    {sizeList.map(({ id, title, price }) => {
                        let firstEl = id == 1;

                        return (
                            <div className="radio-btn-wrap" key={id}>
                                <input
                                    id={"select-size-" + id}
                                    name="select-size"
                                    type="radio"
                                    value={title}
                                    defaultChecked={firstEl}
                                    onChange={() => this.updateCurrentSelect(title)}
                                />
                                <label htmlFor={"select-size-" + id}>
                                    <h4 className="s-title">{title}</h4>
                                    <div className="s-price">{price}</div>
                                </label>
                            </div>
                        );
                    })}
                </div>
                <div className="add-checkbox">
                    <label className="checkbox-wrap">
                        Add {currentSelect} Foundation
                        <input type="checkbox" name="add-checkbox" />
                        <div className="checkmark"></div>
                    </label>
                    <div className="price">$275</div>
                </div>
                <div className="base-btn-wrap">
                    <Button type="button" classNames={buttonClass}>Buy {currentSelect} Now</Button>
                </div>
                <Affirm
                    image="images/site/affirm-logo.svg"
                    title="Affirm"
                    text="As low as $67/month at 0% APR. Pre-qualify"
                />
            </form>
        );
    }
}

