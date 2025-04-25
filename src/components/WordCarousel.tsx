import React, { useState, useEffect, useRef } from 'react';

// Reordering words to ensure HTTP appears right before SSH
const words = [
  "SSH",
  "Kubernetes", 
  "Postgres",
  "MySQL",
  "Snowflake",
  "BigQuery",
  "Retool",
  "Metabase",
  "Looker",
  "Clickhouse", 
  "S3",
  "HTTP",
  "MCP"
];

const descriptions = {
  "SSH": "Instantly replay SSH sessions, review detailed command summaries, and receive real-time alerts for risky actions.",
  "Kubernetes": "Gain complete visibility over Kubernetes sessions with AI-powered risk detection and real-time termination capabilities for suspicious activities.",
  "Postgres": "Apply instant, zero-latency policies to encrypt, mask, and block sensitive columns directly at the data connection layer.",
  "MySQL": "Maintain granular control and visibility over MySQL databases.",
  "Snowflake": "Implement granular access controls over engineer data interactions within Snowflake environments.",
  "BigQuery": "Ensure proper access control and audit logging of all BigQuery operations.",
  "Retool": "Secure and monitor data flows within Retool applications through comprehensive access controls.",
  "Metabase": "Protect business intelligence data with fine-grained access policies and usage monitoring for Metabase dashboards.",
  "Looker": "Secure sensitive analytics by controlling data access and monitoring user behavior within Looker environments.",
  "Clickhouse": "Safeguard high-performance analytics with real-time monitoring and access controls for Clickhouse databases.",
  "S3": "Enable precise control over bucket operations with detailed access monitoring and policy enforcement.",
  "HTTP": "Apply real-time policy controls to HTTP requests and responses, protecting APIs and web services from unauthorized access.",
  "MCP": "Safely enable your team to use MCP servers with assurance that sensitive data is secure by enabling data controls, exact queries run, and end user identification."
};

const wordColors = {
  "SSH": "#000000",   // Black
  "Kubernetes": "#326CE5",   // Kubernetes blue
  "Postgres": "#2B4C7E",   // Dark Blue
  "MySQL": "#00758F",   // MySQL blue
  "Snowflake": "#29B5E8",  // Snowflake light blue
  "BigQuery": "#4285F4",   // Google blue
  "Retool": "#000000",   // Retool black
  "Metabase": "#509EE3",   // Metabase blue
  "Looker": "#3B82F6",   // Different Blue
  "Clickhouse": "#FFCC00",   // Clickhouse yellow
  "S3": "#ea384c",   // Dark red (changed back from orange)
  "HTTP": "#000000",   // Black (changed from blue)
  "MCP": "#D4A27F"     // Tan/Light brown
};

const logos = {
  "SSH": "/lovable-uploads/820226f2-e48f-4437-9e73-5c01f075f247.png", // Updated SSH logo
  "Kubernetes": "/lovable-uploads/4c93e336-1593-4802-bcff-fb003b163819.png",
  "MySQL": "/lovable-uploads/mysql.svg", // MySQL logo
  "Snowflake": "/lovable-uploads/5fe673da-225f-4271-b883-7f92280d3485.png",
  "BigQuery": "/lovable-uploads/bigquery.svg", // BigQuery logo
  "Clickhouse": "/lovable-uploads/3e472fcd-246e-4baf-9e39-9972f54ba404.png",
  "S3": "/lovable-uploads/954f2d10-5282-47d8-a2ba-208fc79487d5.png", // Updated S3 logo
  "Looker": "/lovable-uploads/c9a26d5b-454e-4d36-92fe-3ab8e6e86095.png",
  "Postgres": "/lovable-uploads/a22f748a-8e8a-4fe1-a90d-16b739cabed5.png",
  "Retool": "/lovable-uploads/b8c4ef28-cbb5-4f9b-869d-41ca872b557d.png",
  "HTTP": "/lovable-uploads/b04cc8c4-e515-4557-b3d7-43e7abc6f85f.png",
  "Metabase": "/lovable-uploads/d12431ef-1ed7-4588-90e0-095b537ee7e8.png",
  "MCP": "/lovable-uploads/mcp.png" // MCP logo
};

const WordCarousel = () => {
  // State for carousel operation
  const [currentIndex, setCurrentIndex] = useState(4);
  const [showDescription, setShowDescription] = useState(true);
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  
  // Reference for tracking interval
  const carouselInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Start carousel on load - pure index incrementation with modulo
  useEffect(() => {
    // Add a global event listener to prevent page refreshes
    const preventRefresh = (e: BeforeUnloadEvent) => {
      // Only prevent automatic refreshes during carousel transitions
      if (e.currentTarget === window) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    // Add the event listener
    window.addEventListener('beforeunload', preventRefresh);
    
    // Auto-rotate carousel - advance to next item every 10 seconds
    const rotateCarousel = () => {
      try {
        carouselInterval.current = setTimeout(() => {
          // Simply increment the index with modulo for wrap-around
          // Using a function update to ensure we're working with the latest state
          setCurrentIndex(prevIndex => {
            try {
              // Calculate the next index with modulo to ensure proper wrap-around
              const nextIndex = (prevIndex + 1) % words.length;
              console.log(`Advancing carousel: ${prevIndex} -> ${nextIndex}`);
              return nextIndex;
            } catch (err) {
              console.error("Error calculating next index:", err);
              // Fallback to a safe value
              return prevIndex; 
            }
          });
          
          // Schedule the next rotation
          rotateCarousel();
        }, 10000); // Increased to 10 seconds
      } catch (err) {
        console.error("Error in carousel rotation:", err);
      }
    };
    
    // Start the rotation immediately
    rotateCarousel();
    
    // Clean up interval and event listener on unmount
    return () => {
      if (carouselInterval.current) {
        clearTimeout(carouselInterval.current);
      }
      window.removeEventListener('beforeunload', preventRefresh);
    };
  }, []);
  
  // Helper functions for carousel display with true circular behavior
  const getPrevIndex = () => {
    if (currentIndex < 0) return -1; // No word showing yet
    // Always use modulo to get previous word (wraps around from first to last)
    if (currentIndex === 0) return words.length - 1;
    return (currentIndex - 1 + words.length) % words.length;
  };
  
  const getNextIndex = () => {
    if (currentIndex < 0) return -1; // No word showing yet
    // Always use modulo to get next word (wraps around from last to first)
    if (currentIndex === words.length - 1) return 0;
    return (currentIndex + 1) % words.length;
  };
  
  // Determine if we're showing the last item - for special handling of the loop
  const isLastItem = currentIndex === words.length - 1;
  
  // Calculate vertical offset to align "Stop worrying about" with the active word
  const verticalOffset = useRef(5.0);  // in rem units
  
  // Render the carousel content
  const renderCarousel = () => {
    // Ensure we use consistent transform calculations for smoother animations
    // Wrap-around transition should be handled similarly to all other transitions
    const remValue = 5.0;
    const transformY = `translateY(calc(-${currentIndex * remValue}rem + ${remValue}rem))`;
    
    // Logging to help debug transitions (especially from last to first)
    React.useEffect(() => {
      console.log(`CurrentIndex: ${currentIndex}, Last? ${isLastItem}`);
    }, [currentIndex, isLastItem]);
    
    return (
      <div className="carousel-container relative w-full h-[15rem]">
        <div 
          className="absolute w-full text-left transition-transform ease-in-out"
          style={{ 
            transform: transformY,
            // Increased transition duration for smoother animations
            transitionDuration: '800ms',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {/* Virtual elements for circular scrolling effect */}
          
          {/* Last word (MCP) above first word (SSH) for circular effect */}
          <div 
            key={`virtual-last-above-first-${words[words.length - 1]}`}
            className="h-[5.0rem] flex items-center gap-3 absolute w-full left-0" 
            style={{
              top: "-5.0rem", // Position above first word with less space
              // Only show when SSH is current or about to be current
              opacity: currentIndex === 0 || currentIndex === words.length - 1 ? 0.3 : 0,
              color: '#8E9196',
              background: 'transparent',
              transform: 'none',
              transition: 'opacity 600ms ease-in-out, transform 800ms ease-in-out'
            }}
          >
            <span className="text-5xl md:text-7xl font-bold min-w-[7rem] inline-block">{words[words.length - 1]}</span>
            {logos[words[words.length - 1] as keyof typeof logos] && (
              <img 
                src={logos[words[words.length - 1] as keyof typeof logos]} 
                alt={`${words[words.length - 1]} logo`} 
                className="max-w-[12rem] h-[4.2rem] object-contain ml-0"
                style={{ 
                  opacity: 1,
                  backgroundColor: words[words.length - 1] === "S3" ? 'transparent' : 'inherit',
                  pointerEvents: 'none' // Prevent any click events
                }}
              />
            )}
          </div>
          
          {/* First word (SSH) below last word (MCP) for circular effect */}
          <div 
            key={`virtual-first-below-last-${words[0]}`}
            className="h-[5.0rem] flex items-center gap-3 absolute w-full left-0" 
            style={{
              top: `${words.length * 5.0}rem`, // Position below last word
              // Only show when MCP is current or about to be current
              opacity: currentIndex === words.length - 1 || currentIndex === 0 ? 0.3 : 0,
              color: '#8E9196',
              background: 'transparent',
              transform: 'none',
              transition: 'opacity 600ms ease-in-out, transform 800ms ease-in-out'
            }}
          >
            <span className="text-5xl md:text-7xl font-bold min-w-[7rem] inline-block">{words[0]}</span>
            {logos[words[0] as keyof typeof logos] && (
              <img 
                src={logos[words[0] as keyof typeof logos]} 
                alt={`${words[0]} logo`} 
                className="max-w-[12rem] h-[4.2rem] object-contain ml-0"
                style={{ 
                  opacity: 1,
                  backgroundColor: words[0] === "S3" ? 'transparent' : 'inherit',
                  pointerEvents: 'none' // Prevent any click events
                }}
              />
            )}
          </div>
          
          {/* Render all regular words */}
          {words.map((word, idx) => {
            const isNext = idx === getNextIndex();
            const isCurrent = idx === currentIndex;
            const isPrevious = idx === getPrevIndex();
            
            return (
              <div 
                key={`word-${word}-${idx}-${currentIndex}`} // Include currentIndex in key to force re-render
                className="h-[5.0rem] flex items-center gap-3 absolute w-full left-0" 
                style={{
                  // Position each word at its index for scrolling animation
                  top: `${idx * 5.0}rem`,
                  opacity: isCurrent ? 1 : 
                          isNext || isPrevious ? 0.3 : 0, // Show current, prev and next words
                  color: isCurrent ? wordColors[word as keyof typeof wordColors] : 
                          isPrevious || isNext ? '#8E9196' : 'inherit',
                  background: 'transparent',
                  transition: 'opacity 600ms ease-in-out, color 800ms ease-in-out, background 800ms ease-in-out, transform 800ms ease-in-out',
                  pointerEvents: 'none' // Prevent click events on words
                }}
              >
                {/* Word text */}
                <span className="text-5xl md:text-7xl font-bold min-w-[7rem] inline-block">{word}</span>
                
                {/* Logo with spacing */}
                {logos[word as keyof typeof logos] && (
                  <img 
                    src={logos[word as keyof typeof logos]} 
                    alt={`${word} logo`} 
                    className="max-w-[12rem] h-[4.2rem] object-contain ml-0"
                    style={{ 
                      opacity: 1,
                      backgroundColor: word === "S3" ? 'transparent' : 'inherit',
                      pointerEvents: 'none' // Prevent any click events on logos
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Prevent page refresh
  const preventDefaultBehavior = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="flex flex-col items-center justify-center bg-white text-black min-h-screen"
      style={{ 
        paddingBottom: "15vh", // Push content up from bottom by 15% of viewport height
      }}
      onClick={(e) => e.stopPropagation()} // Stop event propagation
    >
      <header className="absolute top-6 left-8">
        <img 
          src="/lovable-uploads/165a663c-4cc0-4f1d-884a-1f33303936d0.png" 
          alt="Logo" 
          className="h-16 object-contain" 
          onClick={preventDefaultBehavior}
          onLoad={() => {
            console.log('Logo loaded successfully');
          }}
          onError={(e) => {
            console.error('Failed to load logo');
            const img = e.target as HTMLImageElement;
            if (img && img.src) {
              console.log('Image source:', img.src);
              
            }
          }}
        />
      </header>
      
      <div className="flex flex-col items-center justify-start">
        {/* Main container for headline with vertically centered alignment */}
        <div className="flex items-center justify-center mb-2 px-16">
          {/* Added margin to center the content horizontally */}
          <div className="text-5xl md:text-7xl font-bold whitespace-nowrap pr-6 ml-16">
            Stop worrying about
          </div>
          
          {/* Carousel with fixed size - positioned to align the current word */}
          <div 
            className="inline-block relative overflow-hidden w-[500px] h-[15rem]" 
            style={{ 
              marginTop: '0rem',
              boxShadow: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent'
            }}
            onClick={preventDefaultBehavior} // Prevent any click events from causing navigation
          >
            {renderCarousel()}
          </div>
        </div>
        
        <div className="w-full max-w-4xl px-6 mt-10">
          <p className="text-2xl md:text-3xl text-gray-600 text-center transition-opacity duration-800">
            {currentIndex >= 0 && descriptions[words[currentIndex] as keyof typeof descriptions]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordCarousel;