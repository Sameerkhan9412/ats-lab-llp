import About from "./components/Homepage/About";
import Banner from "./components/Homepage/Banner";
import Testings from "./components/Homepage/Testings";
import Gallary from "./components/Homepage/Gallary";
import Contact from "./components/Homepage/Contact";
import Services from "./components/Homepage/Services";
import HeroSection from "./components/Homepage/HeroSection";

export default function Home() {
  return (
    <div className="">
      <HeroSection/>
      <Services/>
      <About/>
      <Testings/>
      <Gallary/>
      <Banner/>
      <Contact/>
    </div>
  );
}
