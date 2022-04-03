import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonNext,
} from 'pure-react-carousel';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import { AnimatedHeader, AnimatedParagraph } from '../util/animations';
import { useInView } from 'react-intersection-observer';
import ScrollRight from '../../images/scrollright.svg';
import { useIntl } from 'gatsby-plugin-intl';

import {
  CaseStudyWrapper,
  CaseStudyHeaderWrapper,
  CaseStudySliderWrapper,
  CaseStudySliderImageWrapper,
} from '../styled';

export const SliderContent = ({ item }) => {
  const locale = useIntl().locale;
  const realizacjaLang = locale === 'pl' ? item.realizacja.pl : item.realizacja.en;
  return (
    <CaseStudySliderWrapper to={realizacjaLang.slug === 'torbasmaku' ? '/torbasmaku' :`/case/${realizacjaLang.slug}`}>
      <CaseStudySliderImageWrapper>
        <Img
          style={{ height: '100%' }}
          fluid={realizacjaLang.landingImage.localFile.childImageSharp.fluid}
          alt="logo"
        />
      </CaseStudySliderImageWrapper>
      <div className="text__cnt">
        <h3>{realizacjaLang.component2Client}</h3>
        <p>{realizacjaLang.component2Services}</p>
      </div>
    </CaseStudySliderWrapper>
  );
};

const CaseStudy = ({ refProp, triangle = true }) => {
  const data = useStaticQuery(graphql`
  {
    cases: allWpRealizacja(limit: 7) {
      nodes {
        realizacja {
          en {
            component2Client
            component2Services
            landingImage {
              localFile {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid_tracedSVG
                  }
                }
              }
            }
            slug
          }
          pl {
            component2Client
            component2Services
            landingImage {
              localFile {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid_tracedSVG
                  }
                }
              }
            }
            slug
          }
        }
      }
    }
    triangle: file(relativePath: {eq: "caseStudy/triangle.png"}) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
  }  
`);
  const slideNumber = data.cases.nodes.length

  const Header = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });
    return (
      <CaseStudyHeaderWrapper ref={ref} className={ !(window.location.pathname == '/') && 'wrapper'}>
        <div className="text">
          <AnimatedHeader inView={inView}>Case studies</AnimatedHeader>
          <AnimatedParagraph inView={inView}>
            {useIntl().formatMessage({ id: "case-study-header-wrapper.paragraph1" })}<br/>{useIntl().formatMessage({ id: "case-study-header-wrapper.paragraph2" })}
          </AnimatedParagraph>
        </div>
        {slideNumber > 3 ?
        <ButtonNext className="next">
          <motion.div style={{ width: '100%', height: '100%' }}>
            <img src={ScrollRight} alt="scroll right button" />
          </motion.div>
        </ButtonNext> : ''}
      </CaseStudyHeaderWrapper>
    );
  };
  
  const isMobile = useMediaQuery({
    query: '(max-device-width: 1080px)',
  });
  const url = location.pathname;

  if (isMobile) triangle = false;
  const renderSlider = (
    <Slider style={{ outline: 'none' }}>
      {data.cases.nodes.map(
        (item, index) => {
          const locale = useIntl().locale;
          const postLang = locale === 'pl' ? item.realizacja.pl : item.realizacja.en;
          if (!url.includes(postLang.slug))
          return <Slide className="slide" key={index} index={index} id={postLang.slug}>
            <SliderContent item={item} />
          </Slide>
        }
      )
    }
    </Slider>
  );

  const mobile = (
    <>
      {data.cases.nodes.map(
        (item, index) => {
          const locale = useIntl().locale;
          const postLang = locale === 'pl' ? item.realizacja.pl : item.realizacja.en;
          (index < 5 && !url.includes(postLang.slug)) && <SliderContent item={item} key={index} />
        })}
    </>
  );
  const content = (
    <CaseStudyWrapper ref={refProp} id="caseStudy">
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        touchEnabled={slideNumber > 3 ? true : false}
        dragEnabled={slideNumber > 3 ? true : false}

        totalSlides={data.cases.nodes.length + 1}
        className="carousel__cnt"
        visibleSlides={
          data.cases.nodes.length >= 3 ? 3 : data.cases.nodes.length
        }
        infinite={true}
        step={3}
      >
        <Header />
        {!isMobile  && renderSlider}
      </CarouselProvider>
      {isMobile && mobile}
    </CaseStudyWrapper>
  );
  return data && content;
};

export default CaseStudy;