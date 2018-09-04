import React, { Component } from "react";
import scrollToComponent from "react-scroll-to-component";
import getCoords from "../../services/getCoords";

import Header from "../../components/Header";
import PromoSection from "../../components/PromoSection";
import MattressOverview from "../../components/MattressOverview";
import SetupSection from "../../components/SetupSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import ProofSection from "../../components/ProofSection";
import SingleTestimonialSection from "../../components/SingleTestimonialSection";
import ScienceSection from "../../components/ScienceSection";
import WarrantySection from "../../components/WarrantySection";
import DetailsSection from "../../components/DetailsSection";
import ProductCardSection from "../../components/ProductCardSection";
import TrustSection from "../../components/TrustSection";
import Footer from "../../components/Footer";
import CTAMobile from "../../components/CTAMobile";

const DATA = {
    "promo_section": {
        "message": "Promotion : Email Capture"
    },
    "site_logo": {
        "title": "Level Sleep",
        "src": "images/site/logo.png"
    },
    "main_menu": [
        {
            "id": "1",
            "title": "Shop",
            "link": "/"
        },
        {
            "id": "2",
            "title": "Our Research",
            "link": "/"
        },
        {
            "id": "3",
            "title": "Reviews",
            "link": "/"
        },
        {
            "id": "4",
            "title": "FAQs",
            "link": "/"
        }
    ],
    "mattress_section": {
        "gallery": [
            {
                "id": "1",
                "title": "gallery-item-1",
                "img": "images/temp/gallery-item-1.png",
                "thumbnail": "images/temp/gallery-item-thumbnail-1.png"
            },
            {
                "id": "2",
                "title": "gallery-item-2",
                "img": "images/temp/gallery-item-1.png",
                "thumbnail": "images/temp/gallery-item-thumbnail-1.png"
            },
            {
                "id": "3",
                "title": "gallery-item-3",
                "img": "images/temp/gallery-item-1.png",
                "thumbnail": "images/temp/gallery-item-thumbnail-1.png"
            },
            {
                "id": "4",
                "title": "gallery-item-4",
                "img": "images/temp/gallery-item-1.png",
                "thumbnail": "images/temp/gallery-item-thumbnail-1.png"
            },
            {
                "id": "5",
                "title": "gallery-item-5",
                "img": "images/temp/gallery-item-1.png",
                "thumbnail": "images/temp/gallery-item-thumbnail-1.png"
            }
        ],
        "size_list": [
            {
                "id": "1",
                "title": "Cal King",
                "price": "$1,999"
            },
            {
                "id": "2",
                "title": "King",
                "price": "$1,999"
            },
            {
                "id": "3",
                "title": "Queen",
                "price": "$1,699"
            },
            {
                "id": "4",
                "title": "Full",
                "price": "$1,499"
            },
            {
                "id": "5",
                "title": "Twin XL",
                "price": "$1,199"
            },
            {
                "id": "6",
                "title": "Twin",
                "price": "$1,099"
            }
        ],
        "overview_header": {
            "title": "TriSupport™ Mattress",
            "description": "With patented TriSupport design guaranteed to relieve pain and improve sleep.",
            "reviews": true,
        },
        "image_label": {
            "src": "images/icons/365-night-trial.png",
            "title": "365 night trial"
        },
        "divider": {
            "image": {
                "src": "images/icons/forever-warranty.png",
                "title": "Forever warranty"
            }
        },
    },
    "setup_section": {
        "header": {
            "icon": "icon-medical",
            "title": "Backed by Science, Recommended by Doctors"
        },
        "list": [
            {
                "id": "1",
                "icon": "icon-smile",
                "title": "Proven Relief for Back and Joint Pain",
                "description": "Clinically-proven to provide therapeutic support using three differentiated levels of firmness that contour to your body while providing spinal alignment and pain reducing while you sleep."
            },
            {
                "id": "2",
                "icon": "icon-improve",
                "title": "Improves Sleep for Any Position",
                "description": "The Level mattress provides ideal support for the body throughout the night. Regardless of your sleeping position, you will find ultimate comfort and pressure point relief with the patented TriSupport design."
            },
            {
                "id": "3",
                "icon": "icon-energy",
                "title": "Diminish Fatigue and Improve Recovery",
                "description": "Level's patented technology allows the body to maintain proper spinal alignment for deeper, undisturbed sleep, reducing tossing and turning by up to 35% and next day fatigue by up to 43%."
            }
        ]
    },
    "testimonials_section": {
        "header": {
            "icon": "icon-comments",
            "title": "Doctors Recommend Us, Customers Love Us",
            "reviews": true
        },
        "list": [
            {
                "id": "1",
                "thumbnail": "images/temp/testimonial-tumbnail-1.png",
                "title": "video-1",
                "author": {
                    "name": "Jana",
                    "profession": "Customer",
                    "portrait": "images/temp/testimonial-author-portrait-1.png"
                }
            },
            {
                "id": "2",
                "thumbnail": "images/temp/testimonial-tumbnail-2.png",
                "title": "video-2",
                "author": {
                    "name": "Dr. Robert Adams",
                    "profession": "Chiropractor",
                    "portrait": "images/temp/testimonial-author-portrait-2.png"
                }
            },
            {
                "id": "3",
                "thumbnail": "images/temp/testimonial-tumbnail-3.png",
                "title": "video-3",
                "author": {
                    "name": "Mick",
                    "profession": "Customer",
                    "portrait": "images/temp/testimonial-author-portrait-3.png"
                }
            }
        ]
    },
    "proof_section_1": {
        "header": {
            "icon": "icon-certificate",
            "title": "Proven Relief for Back and Joint Pain",
            "description": "Clinically-proven to provide therapeutic support using three unique levels of firmness that contour to your body while providing spinal alignment and pain reduction while you sleep."
        },
        "content": {
            "img": "images/temp/proof-section-img-1.png",
            "title": "section-1",
            "author": {
                "name": "Dr. Robert Adams",
                "profession": "Chiropractor",
                "portrait": "images/temp/testimonial-author-portrait-2.png"
            },
            "items": [
                {
                    "id": "1",
                    "title": "Clinically Tested and Shown to Alleviate Pain",
                    "description": "Working with the country’s top sleep researchers, Level’s design was proven effective. Our patented technology is guaranteed to alleviate pain and improve your sleep. Or get your money back.",
                    "mobileImg": "images/temp/proof-section-img-1-mobile-1.png"
                },
                {
                    "id": "2",
                    "title": "Patented Technology to Provide Back Support",
                    "description": "Level’s three-zone design features lumbar support and two softer zones that allow your shoulder and hips to sink into the mattress, providing improved alignment and reduced pain regardless of your sleeping position.",
                    "mobileImg": "images/temp/proof-section-img-1-mobile-2.png"
                },
                {
                    "id": "3",
                    "title": "Reduce Tossing and Turning",
                    "description": "Level’s patented design reduces compression of the soft tissues which improves blood flow. Experience relief from hip and shoulder pressure to help you stay asleep longer and sleep deeper throughout the night.",
                    "mobileImg": "images/temp/proof-section-img-1-mobile-3.png"
                }
            ]
        }
    },
    "proof_section_2": {
        "header": {
            "icon": "icon-heart",
            "title": "Clinically Tested and Shown to Alleviate Pain",
            "description": "The three zones of premium foams work together to keep your body in a neutral position throughout the night. That is why participants in our clinical trial reported a 54% reduction in morning stiffness."
        },
        "content": {
            "img": "images/temp/proof-section-img-2.png",
            "title": "section-2",
            "items": [
                {
                    "id": "1",
                    "title": "LEVELsoft",
                    "description": "Absorbs your shoulders, reducing pressure and pain.",
                    "mobileImg": "images/temp/proof-section-img-2-mobile-1.png"
                },
                {
                    "id": "2",
                    "title": "LEVELfirm",
                    "description": "Firmer foam comfortably supports your lower back and side, reducing back pain.",
                    "mobileImg": "images/temp/proof-section-img-2-mobile-2.png"
                },
                {
                    "id": "3",
                    "title": "LEVELmedium",
                    "description": "Absorbs and support your hips, aligning them with your spine and fighting hip pain.",
                    "mobileImg": "images/temp/proof-section-img-2-mobile-3.png"
                }
            ]
        }
    },
    "proof_section_3": {
        "header": {
            "icon": "icon-flag",
            "title": "Containing 100% USA-made Premium Materials",
            "description": "Engineered to be the most comfortable mattress for science-backed sleep, Level is engineered, tested and built in the USA. Using only the best materials, our foam is CertiPUR-US® certified to be free of harmful chemicals and safe for your sleep."
        },
        "content": {
            "img": "images/temp/proof-section-img-3.png",
            "title": "section-3",
            "items": [
                {
                    "id": "1",
                    "title": "Top Grade, Breathable Foam",
                    "description": "Open-cell, non-toxic, and highly durable foams work together to support and cushion.",
                    "mobileImg": "images/temp/proof-section-img-3-mobile-1.png"
                },
                {
                    "id": "2",
                    "title": "High-Resilience Foam Base",
                    "description": "Sturdy, breathable, and long-lasting foam base supports the Performance Layer and provides the foundation on any flat surface.",
                    "mobileImg": "images/temp/proof-section-img-3-mobile-2.png"
                },
                {
                    "id": "3",
                    "title": "Rich, Premium Fabric Cover",
                    "description": "Thick, durable cover offers a four way stretch technology that maximizes comfort and breathability.",
                    "mobileImg": "images/temp/proof-section-img-3-mobile-3.png"
                }
            ]
        }
    },
    "single_testimonial_section": {
        "message": "I noticed less tossing & turning the first night I slept on my Level mattress. After a few more nights, I realized I wasn't snoring as much if at all! I like its firmness. I'm quite comfortable sleeping on my back or side. I'm very happy with my new mattress!",
        "author": {
            "name": "Catherine S.",
            "profession": "Denver CO",
            "portrait": "images/temp/single-testimonial-author-portrait.png"
        }
    },
    "science_section": {
        "header": {
            "title": "Over 10 Years of Development",
            "button": "Learn More"
        },
        "list": [
            {
                "id": "1",
                "icon": "icon-health",
                "title": "Fight Back Pain with Patented Sleep Technology",
                "description": "Level’s three-zone design features a supportive lumbar strip and two softer zones that allow your shoulder and hips to sink into the mattress while providing support to your lower back regardless of your sleeping position."
            },
            {
                "id": "2",
                "icon": "icon-sun",
                "title": "Reduce Morning Stiffness by Up to 54%",
                "description": "Each of the three layers of premium foams contours to your body while keeping your spine in a neutral position throughout the night. That is why participants in our clinical trial reported a 54% reduction in morning stiffness."
            },
            {
                "id": "3",
                "icon": "icon-minus",
                "title": "Alleviate Neck and Shoulder Discomfort ",
                "description": "Level’s soft shoulder zone absorbs your shoulder’s weight. While ideal for side sleepers, all participants in our clinical trial reported a 56% reduction in morning pain."
            }
        ],
        "image_label": {
            "image": "images/icons/clinical-studies.png",
            "title": "Clinical studies"
        }
    },
    "warranty_section": {
        "header": {
            "icon": "icon-certify-big",
            "title": "365 Night Trial and Forever Warranty",
            "description": "“The Level mattress is a wonderful experience. Delivery was fast and set up was easy. I’m already sleeping better and noticing the varied support in the mattress provides pain free, relaxed sleep.”",
            "author": {
                "name": "Alex R.",
                "profession": "Austin, TX",
                "portrait": "images/temp/warranty-section-author-portrait.png"
            }
        },
        "list": [
            {
                "id": "1",
                "title": "365 night trial",
                "image": "images/icons/365-night-trial.png"
            },
            {
                "id": "2",
                "title": "Forever warranty",
                "image": "images/icons/forever-warranty.png"
            },
            {
                "id": "3",
                "title": "CertiPUR-US certified foam",
                "image": "images/icons/certipur.png"
            },
            {
                "id": "4",
                "title": "Free shipping and return",
                "image": "images/icons/freeshipping.png"
            }
        ]
    },
    "details_section": {
        "header": {
            "icon": "icon-detail",
            "title": "Product Details",
            "description": "All our products are made in the USA of non-toxic materials. <br/> If you'd like to learn more about the order and shipment process, please visit our <a href='/' title='FAQs'>FAQs.</a>"
        },
        "materials": [
            {
                "id": "1",
                "html": "<p><strong>3&quot; Performance Layer</strong></p><p>Head and Shoulder Region: <em>LEVELsoft Foam</em></p><p>Torso Region: <em>LEVELfirm Foam</em></p><p> Hip and Leg Region: <em>LEVELmid Foam</em></p>",
            },
            {
                "id": "2",
                "html": "<p><strong>Mattress Base 73&quot;</strong> <br /> High Resilience Poly Urethane foam</p>"
            }
        ],
        "sizes": [
            {
                "id": "1",
                "title": "Twin",
                "size": "39&quot; x 75&quot; x 10&quot;  &  46 lbs"
            },
            {
                "id": "2",
                "title": "Twin XL",
                "size": "39&quot; x 85&quot; x 10&quot;  &  49 lbs"
            },
            {
                "id": "3",
                "title": "Full",
                "size": "54&quot; x 75&quot; x 10&quot;  &  61 lbs"
            },
            {
                "id": "4",
                "title": "Queen",
                "size": "60&quot; x 80&quot; x 10&quot;  &  71 lbs"
            },
            {
                "id": "5",
                "title": "King",
                "size": "76&quot; x 80&quot; x 10&quot;  &  86 lbs"
            },
            {
                "id": "6",
                "title": "Cal King",
                "size": "72&quot; x 84&quot; x 10&quot;  &  89 lbs"
            }
        ]
    },
    "product_card_section": {
        "title": "Restore Pillow",
        "content": "<ul><li><strong>Patented design to align neck and reduce pain</stron></li><li><strong>Natural spinal support to open airways and reduce snoring</stron></li></ul>",
        "image": "images/temp/pillow.png"
    },
    "trust_section": {
        "list": [
            {
                "id": "1",
                "title": "Thousands <br/> of Happy <br/> Customers",
                "image": "images/icons/icon-thumb.png",
                "stars": 5
            },
            {
                "id": "2",
                "title": "Approved <br/> by Over 200 Chiropractors",
                "image": "images/icons/icon-recco.png",
                "stars": 5
            },
            {
                "id": "3",
                "title": "Secure Credit Cards and Easy Monthly Payments with Affirm",
                "image": "images/icons/icon-affirm.png",
                "stars": 0
            }
        ]
    },
    "footer": {
        "logo": {
            "title": "Level Sleep",
            "src": "images/site/logo-footer.png"
        },
        "contacts": {
            "content": "<p>579 First St West <br/> Sonoma, CA 95476 <br/>USA</p><p><a href=\"tel:8009998831\">P. 800.999.8831</a></p><p><a href=\"mailto:admin@levelsleep.com\">E. admin@levelsleep.com</a></p>"
        },
        "information": [
            {
                "id": "1",
                "title": "About",
                "link": "/"
            },
            {
                "id": "2",
                "title": "FAQs",
                "link": "/"
            },
            {
                "id": "3",
                "title": "Locations",
                "link": "/"
            },
            {
                "id": "4",
                "title": "Chiropractor Partner Program",
                "link": "/"
            }
        ],
        "socials": [
            {
                "id": "1",
                "icon": "icon-facebook",
                "link": "/",
                "title": "Facebook"
            },
            {
                "id": "2",
                "icon": "icon-instagram",
                "link": "/",
                "title": "Instagram"
            },
            {
                "id": "3",
                "icon": "icon-pinterest",
                "link": "/",
                "title": "Pinterest"
            }
        ],
        "navigation": [
            {
                "id": "1",
                "title": "Privacy Policy",
                "link": "/"
            },
            {
                "id": "2",
                "title": "Terms of Service",
                "link": "/"
            }
        ],
        "copyright": {
            "text": "2018 Level Sleep. All Rights Reserved.",
            "note": "*based on publicly available information"
        }
    }
}

export default class MattressPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            CTAshow: false,
            currentSelect: "",
        };
    }

    componentWillMount() {
        window.addEventListener("resize", this.handleWindowSizeChange);
        window.addEventListener("scroll", this.handleWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowSizeChange);
        window.addEventListener("scroll", this.handleWindowScroll);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    }

    handleWindowScroll = () => {
        let windowScroll = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);

        const selectSize = document.querySelector(".select-size"),
            footer = document.querySelector(".footer"),
            selectSizeT = getCoords(selectSize).top,
            selectSizeH = selectSize.clientHeight,
            footerT = getCoords(footer).top;

        let CTAstate = this.state.CTAshow;

        if (windowScroll > selectSizeT + selectSizeH && windowScroll < footerT) {
            if (!CTAstate) {
                this.setState({ CTAshow: true });
            }
        } else if (windowScroll < selectSizeT + selectSizeH || windowScroll > footerT) {
            if (CTAstate) {
                this.setState({ CTAshow: false });
            }
        }
    }

    updateSelectedSize = (select) => {
        this.setState({
            currentSelect: select
        })
    }

    scrollTo = (e, scrollTo) => {
        e.preventDefault();

        const linksToComponent = {
            "SelectSize": this.SelectSize,
            "DetailsSection": this.DetailsSection
        }

        scrollToComponent(linksToComponent[scrollTo], { offset: 0, align: 'top', duration: 1500, ease: "linear" })
    }

    render() {
        let { width, CTAshow, currentSelect } = this.state;

        return (
            <div id="main-content">
                <PromoSection
                    message={DATA.promo_section.message}
                />
                <Header
                    siteLogo={DATA.site_logo}
                    mainMenu={DATA.main_menu}
                    width={width}
                />
                <div className="content">
                    <MattressOverview
                        header={DATA.mattress_section.overview_header}
                        gallery={DATA.mattress_section.gallery}
                        sizeList={DATA.mattress_section.size_list}
                        imgLabel={DATA.mattress_section.image_label}
                        divider={DATA.mattress_section.divider.image}
                        myRef={(node) => { this.SelectSize = node }}
                        updateSelectedSize={this.updateSelectedSize}
                        width={width}
                    />
                    <SetupSection
                        header={DATA.setup_section.header}
                        list={DATA.setup_section.list}
                    />
                    <TestimonialsSection
                        header={DATA.testimonials_section.header}
                        list={DATA.testimonials_section.list}
                        width={width}
                    />
                    <ProofSection
                        header={DATA.proof_section_1.header}
                        content={DATA.proof_section_1.content}
                        width={width}
                    />
                    <ProofSection
                        header={DATA.proof_section_2.header}
                        content={DATA.proof_section_2.content}
                        width={width}
                    />
                    <ProofSection
                        header={DATA.proof_section_3.header}
                        content={DATA.proof_section_3.content}
                        width={width}
                    />
                    <SingleTestimonialSection
                        message={DATA.single_testimonial_section.message}
                        author={DATA.single_testimonial_section.author}
                    />
                    <ScienceSection
                        header={DATA.science_section.header}
                        list={DATA.science_section.list}
                        label={DATA.science_section.image_label}
                        width={width}
                    />
                    <WarrantySection
                        header={DATA.warranty_section.header}
                        list={DATA.warranty_section.list}
                    />
                    <DetailsSection
                        header={DATA.details_section.header}
                        materials={DATA.details_section.materials}
                        sizes={DATA.details_section.sizes}
                        myRef={(node) => { this.DetailsSection = node }}
                    />
                    <ProductCardSection
                        title={DATA.product_card_section.title}
                        content={DATA.product_card_section.content}
                        image={DATA.product_card_section.image}
                        width={width}
                    />
                    <TrustSection
                        list={DATA.trust_section.list}
                    />
                    <CTAMobile
                        scrollTo={this.scrollTo}
                        select={currentSelect}
                        show={CTAshow}
                    />
                </div>
                <Footer
                    logo={DATA.footer.logo}
                    contacts={DATA.footer.contacts}
                    information={DATA.footer.information}
                    socials={DATA.footer.socials}
                    navigation={DATA.footer.navigation}
                    copyright={DATA.footer.copyright}
                />
            </div>
        );
    }
}