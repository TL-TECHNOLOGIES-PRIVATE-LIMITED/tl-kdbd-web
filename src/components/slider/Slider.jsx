import React, { useState, useEffect } from 'react';
import { services } from '../../constants/datas';
import servicetag from '../../img/tag.png';
import { IoCloseCircle } from 'react-icons/io5';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'; // Import arrow icons

const Slider = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBrochureVisible, setIsBrochureVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [completedRotations, setCompletedRotations] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // State to track hover status

  // Helper function to get current image
  const getCurrentImage = () => {
    const currentService = services[currentServiceIndex];
    if (Array.isArray(currentService.image)) {
      return currentService.image[currentImageIndex];
    }
    return currentService.image;
  };

  // Handle service rotation and track completed rotations
  useEffect(() => {
    if (isHovered) return; // Skip rotation when hovered
    const serviceInterval = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % services.length;
        // If we're going back to the start, increment completed rotations
        if (nextIndex === 0) {
          setCompletedRotations(prev => prev + 1);
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(serviceInterval);
  }, [isHovered]); // Effect depends on isHovered

  // Handle image rotation only after completing a full service rotation
  useEffect(() => {
    const currentService = services[currentServiceIndex];
    if (Array.isArray(currentService.image) && completedRotations > 0) {
      setCurrentImageIndex(prevIndex => {
        return (prevIndex + 1) % currentService.image.length;
      });
      setCompletedRotations(0); // Reset rotation count
    }
  }, [completedRotations]);

  const isLastService = currentServiceIndex === services.length - 1;

  const splitHeading = (heading) => {
    const parts = heading.split('(');
    if (parts.length > 1) {
      return (
        <>
          {parts[0].trim()}
          <span className="text-sm font-medium">{" "}- {" "}{parts[1].replace("(", " ").replace(")", " ")}</span>
        </>
      );
    }
    return heading;
  };

  // Functions to manually change the slide
  const handleNext = () => {
    setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const handlePrev = () => {
    setCurrentServiceIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
  };

  return (
    <div
      className="relative w-full h-full overflow-x-hidden"
      onMouseEnter={() => setIsHovered(true)} // Set hover to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hover to false on mouse leave
    >
      <div className="absolute top-[-7px] bg-white rounded-lg right-0 z-40">
        {isLastService ? (
          <motion.img
            key="service-tag"
            src={servicetag}
            alt="Service Tag"
            className="md:h-12 h-10 w-auto z-40"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <img src={servicetag} alt="Tag" className="md:h-12 h-10 w-auto z-40" />
        )}
      </div>

      {isBrochureVisible && selectedDocument !== null ? (
        <div className="w-full h-full flex justify-center relative items-center">
          <iframe
            src={selectedDocument}
            className="w-full h-full"
            title="Brochure"
          />
          <div className="absolute bottom-4 left-5">
            <button
              className="border border-black flex gap-2 text-2xl bg-white shadow-md text-red-500 p-2 rounded-full z-50"
              onClick={() => setIsBrochureVisible(false)}
            >
              <IoCloseCircle />
            </button>
          </div>
        </div>
      ) : isBrochureVisible && selectedDocument === null ? (
        <div className="w-full h-full relative flex bg-stone-50 justify-center items-center text-3xl font-bold text-red-500">
          <button
            className="absolute bottom-0 left-0 flex gap-2 text-2xl shadow-md text-red-500 p-2 rounded-full z-50"
            onClick={() => setIsBrochureVisible(false)}
          >
            <IoCloseCircle />
          </button>
          <Typewriter
            options={{
              strings: ['Coming Soon', 'Stay tune !'],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
            }}
          />
        </div>
      ) : (
        <motion.img
          key={`image-${currentServiceIndex}-${currentImageIndex}`}
          src={getCurrentImage()}
          alt="Slider Image"
          initial={{ opacity: 0.0, x: 20 }}
          animate={{ opacity: 0.5, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-full h-full object-cover z-50"
        />
      )}

      <div className="absolute inset-0 flex flex-col md:gap-4 gap-2 items-start justify-end text-start text-white p-4">
        <motion.h2
          key={`heading-${currentServiceIndex}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="md:text-[28px] text-[22px] font-bold mb-2 leading-tight bg-clip-text"
          style={{ lineHeight: 1 }}
        >
          {splitHeading(services[currentServiceIndex].heading)}
        </motion.h2>

        <motion.h4
          key={`tagline-${currentServiceIndex}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="md:text-[20px] text-[16px] font-bold mb-2 leading-tight"
          style={{ lineHeight: 1 }}
        >
          {services[currentServiceIndex].Tagline}
        </motion.h4>

        <motion.p
          key={`paragraph-${currentServiceIndex}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ lineHeight: 1.2 }}
          className="md:text-lg text-xs leading-3 ps-1 font-normal text-stone-400 border-s-2 border-red-600"
        >
          {services[currentServiceIndex].paragraph}
        </motion.p>

        <div className="flex items-center w-full justify-between">
          <a
            className="w-fit text-transparent"
            target="_blank"
            href="https://api.whatsapp.com/send/?phone=%2B919061432814&text=Hello%2C+I+am+interested+to+know+more+about+TL-+PRODUCTS+%26+SERVICES&type=phone_number&app_absent=0"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          <div className="flex w-fit gap-2 justify-center">
            {services.map((_, index) => (
              <div
                key={`service-indicator-${index}`}
                className={`h-2 rounded-full transition-all duration-500 ease-in-out ${currentServiceIndex === index ? 'w-10 bg-stone-500' : 'w-2 bg-stone-800'
                  }`}
              />
            ))}
          </div>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-white text-sm font-medium bg-white bg-opacity-30 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-gray-500">
            {currentServiceIndex + 1}/{services.length}
          </span>
        </div>
      </div>

      {/* Arrow Buttons for Manual Navigation */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-50">
        <button
          onClick={handlePrev}
          className="bg-white p-2 rounded-full shadow-lg text-white backdrop-blur-sm bg-opacity-10"
        >
          <IoIosArrowBack size={24} />
        </button>
      </div>

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50">
        <button
          onClick={handleNext}
          className="bg-white p-2 rounded-full shadow-lg text-white backdrop-blur-sm bg-opacity-10"
        >
          <IoIosArrowForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
