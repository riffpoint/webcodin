import React from "react";

import Button from "../Button";

const QuestionsSection = ({ }) => (
    <div className="questions-section">
        <div className="icon-wrap">
            <span className="icon icon-question"></span>
        </div>
        <h2 className="q-title">Still Have Questions?</h2>
        <Button classNames="white h-dark" title="Chat Us"><span className="icon icon-speechbubble"></span> Chat Us</Button>
        <Button classNames="white h-dark" title="Call Us"><span className="icon icon-phone"></span> Call Us</Button>
    </div>
);

export default QuestionsSection;