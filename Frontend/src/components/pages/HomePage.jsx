import { Button } from "@material-tailwind/react";
import StickyNavbar from '../LandingPage/StickyNavBar';
import HeroSection from "../LandingPage/HeroSection";
import FAQSection from '../LandingPage/FAQSection';
import FeatureSection from '../LandingPage/FeatureSection'
import Footer from "../LandingPage/Footer";

const HomePage = () => {
  return (
    <>
    <StickyNavbar/>
    <HeroSection/>
    <FeatureSection/>
    <FAQSection/>
    <Footer/>
   </>
  );
};

export default HomePage;