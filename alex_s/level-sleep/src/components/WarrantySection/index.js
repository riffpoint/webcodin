import React from "react";

import SectionHeader from "../SectionHeader";
import AuthorInfo from "../AuthorInfo";

const WarrantySection = ({ header, list = [] }) => (
    <section className="warranty-section">
        <div className="container">
            <div className="w-inner">
                <SectionHeader header={header}>
                    <AuthorInfo author={header.author} classNames="horizontal" />
                </SectionHeader>
                <ul className="w-list">
                    {list.map(({ id, image, title }) => {
                        return (
                            <li key={id}>
                                <img src={image} title={title} alt={title} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    </section>
);

export default WarrantySection;