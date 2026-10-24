import StickyNavbar from '../LandingPage/StickyNavBar';
import HeroSection from "../LandingPage/HeroSection";
import FAQSection from '../LandingPage/FAQSection';
import FeatureSection from '../LandingPage/FeatureSection'
import Footer from "../LandingPage/Footer";
import useTheme from '../../hooks/useTheme';

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-page min-h-screen transition-colors duration-300">
    <StickyNavbar isDarkMode={isDarkMode} onToggleTheme={toggleTheme}/>
    <HeroSection/>
    <FeatureSection/>
    <FAQSection/>
    <Footer/>
   </div>
  );
};

export default HomePage;
