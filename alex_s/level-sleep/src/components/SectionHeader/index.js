import React from "react";

import ReadReviews from "../../components/ReadReviews";

const SectionHeader = ({ children, header: { icon = "", title, reviews = false, description }, headerType = "h2", classNames = "" }) => {
    const CustomTag = headerType;

    return (
        <div className={"section-header " + classNames}>
            {icon &&
                <div className="icon-wrap">
                    <span className={"icon " + icon}></span>
                </div>
            }
            <CustomTag className="h-title">{title}</CustomTag>
            {reviews &&
                <ReadReviews />
            }
            {description &&
                <div className="h-description" dangerouslySetInnerHTML={{ __html: description}}></div>
            }
            {children}
        </div>
    );
};

export default SectionHeader;