import React from "react";

import Gallery from "../../components/Gallery";
import SectionHeader from "../../components/SectionHeader";
import SelectSize from "../../components/SelectSize";
import InfoLabel from "../InfoLabel";
import Divider from "../../components/Divider";
import Affirm from "../Affirm";

const MattressOverview = ({ sizeList, gallery, header, imgLabel, divider, width, myRef, updateSelectedSize }) => {
    let isMobile = width <= 767;

    return (
        <section className="mattress-overview">
            <div className="container">
                <div className="row">
                    <div className="col-sm-6 col-md-7">
                        <div className="gallery-wrap">
                            <Gallery gallery={gallery} width={width} />
                            <InfoLabel image={imgLabel} />
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-5">
                        <div className="right-side">
                            <SectionHeader header={header}>
                                {isMobile &&
                                    < Affirm
                                        image="images/site/affirm-logo.svg"
                                        title="Affirm"
                                        text="As low as $67/month at 0% APR. Pre-qualitfy Now"
                                    />
                                }
                            </SectionHeader>
                            <SelectSize myRef={myRef} sizeList={sizeList} updateSelectedSize={updateSelectedSize} width={width} />
                        </div>
                    </div>
                </div>
            </div>
            <Divider image={divider} />
        </section>
    );
};

export default MattressOverview;