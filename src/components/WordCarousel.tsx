import React, { useState, useEffect, useRef } from 'react';

// Reordering words to ensure HTTP appears right before SSH
const words = [
  "HTTP",
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
  "S3": "#FF0000",   //  red
  "HTTP": "#000000",   // Black (changed from blue)
  "MCP": "#D4A27F"     // Tan/Light brown
};

const logos = {
  "SSH": "/lovable-uploads/sshh.png", // Updated SSH logo
  "Kubernetes": "/lovable-uploads/4c93e336-1593-4802-bcff-fb003b163819.png",
  "MySQL": "/lovable-uploads/mysql.svg", // MySQL logo
  "Snowflake": "/lovable-uploads/5fe673da-225f-4271-b883-7f92280d3485.png",
  "BigQuery": "/lovable-uploads/bigquery.svg", // BigQuery logo
  "Clickhouse": "/lovable-uploads/3e472fcd-246e-4baf-9e39-9972f54ba404.png",
  "S3": "/lovable-uploads/s3.png",
  "Looker": "/lovable-uploads/c9a26d5b-454e-4d36-92fe-3ab8e6e86095.png",
  "Postgres": "/lovable-uploads/a22f748a-8e8a-4fe1-a90d-16b739cabed5.png",
  "Retool": "/lovable-uploads/b8c4ef28-cbb5-4f9b-869d-41ca872b557d.png",
  "HTTP": "/lovable-uploads/b04cc8c4-e515-4557-b3d7-43e7abc6f85f.png",
  "Metabase": "/lovable-uploads/d12431ef-1ed7-4588-90e0-095b537ee7e8.png",
  "MCP": "/lovable-uploads/mcp.png" // MCP logo
};

const WordCarousel = () => {
  // State for carousel operation
  const [currentIndex, setCurrentIndex] = useState(0);
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
        }, 7000); // Set to 7 seconds for better readability
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
    const remValue = 7.5; // Increased height for larger text
    // Position the current word in the middle with room for 1 full item on each side
    // Adjusted to align exactly with "Stop worrying about" text
    const transformY = `translateY(calc(-${currentIndex * remValue}rem + 18.5rem))`;
    
    // Logging to help debug transitions (especially from last to first)
    React.useEffect(() => {
      console.log(`CurrentIndex: ${currentIndex}, Last? ${isLastItem}`);
    }, [currentIndex, isLastItem]);
    
    return (
      <div className="carousel-container relative w-full h-[32rem]">
        <div 
          className="absolute w-full text-left transition-transform ease-in-out"
          style={{ 
            transform: transformY,
            // Increased transition duration for smoother animations
            transitionDuration: '800ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {/* Virtual elements for circular scrolling effect */}
          
          {/* Last word (MCP) above first word (HTTP) for circular effect */}
          <div 
            key={`virtual-last-above-first-${words[words.length - 1]}`}
            className="h-[7.5rem] flex items-center absolute w-full left-0" 
            style={{
              top: "-7.5rem", // Position above first word with less space
              // Only show when HTTP is current or about to be current
              opacity: currentIndex === 0 || currentIndex === words.length - 1 ? 0.3 : 0,
              color: '#8E9196',
              background: 'transparent',
              transform: 'none',
              transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="flex items-center justify-end" style={{ width: '130px', marginRight: '15px' }}>
              {logos[words[words.length - 1] as keyof typeof logos] && (
                <img 
                  src={logos[words[words.length - 1] as keyof typeof logos]} 
                  alt={`${words[words.length - 1]} logo`} 
                  className="max-w-[120px] h-[5rem] object-contain"
                  style={{ 
                    opacity: words.length - 1 === currentIndex ? 1 : 0.4, // Reduced opacity for non-current words
                    backgroundColor: words[words.length - 1] === "S3" || words[words.length - 1] === "SSH" ? 'transparent' : 'inherit',
                    pointerEvents: 'none', // Prevent any click events
                    maxHeight: words[words.length - 1] === "Retool" ? '4.8rem' : words[words.length - 1] === "MySQL" ? '4rem' : words[words.length - 1] === "BigQuery" ? '4.1rem' : '5rem', // Custom heights
                    maxWidth: words[words.length - 1] === "Retool" ? '100px' : words[words.length - 1] === "MySQL" ? '82px' : words[words.length - 1] === "Snowflake" ? '90px' : words[words.length - 1] === "BigQuery" ? '75px' : '100px', // Custom widths
                    padding: words[words.length - 1] === "BigQuery" ? '6px' : '0', // Special padding for BigQuery logo
                    marginLeft: words[words.length - 1] === "Kubernetes" || words[words.length - 1] === "Postgres" ? '-10px' : 
                              words[words.length - 1] === "MySQL" ? '10px' : 
                              words[words.length - 1] === "Snowflake" ? '-8px' : 
                              words[words.length - 1] === "BigQuery" ? '-3px' : 
                              words[words.length - 1] === "Retool" ? '-14px' : '0', // Custom shifts for alignment
                    filter: words.length - 1 === currentIndex ? 'none' : 'grayscale(60%)' // Apply grayscale to non-current logos
                  }}
                />
              )}
            </div>
            <span className="text-6xl md:text-7xl font-bold min-w-[28rem] inline-block" style={{ 
              marginLeft: words[words.length - 1] === "MySQL" ? '-5px' : 
                        words[words.length - 1] === "Snowflake" ? '-10px' : 
                        words[words.length - 1] === "BigQuery" ? '5px' : 
                        words[words.length - 1] === "Retool" ? '-8px' : 
                        words[words.length - 1] === "Metabase" || words[words.length - 1] === "Looker" || words[words.length - 1] === "Clickhouse" || words[words.length - 1] === "S3" ? '-5px' : 
                        words[words.length - 1] === "MCP" ? '-15px' : '-15px', 
              fontSize: "6rem" 
            }}>{words[words.length - 1]}</span>
          </div>
          
          {/* First word (HTTP) below last word (MCP) for circular effect */}
          <div 
            key={`virtual-first-below-last-${words[0]}`}
            className="h-[7.5rem] flex items-center absolute w-full left-0" 
            style={{
              top: `${words.length * 7.5}rem`, // Position below last word
              // Only show when MCP is current or about to be current
              opacity: currentIndex === words.length - 1 || currentIndex === 0 ? 0.3 : 0,
              color: '#8E9196',
              background: 'transparent',
              transform: 'none',
              transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="flex items-center justify-end" style={{ width: '130px', marginRight: '15px' }}>
              {logos[words[0] as keyof typeof logos] && (
                <img 
                  src={logos[words[0] as keyof typeof logos]} 
                  alt={`${words[0]} logo`} 
                  className="max-w-[120px] h-[5rem] object-contain"
                  style={{ 
                    opacity: 0 === currentIndex ? 1 : 0.4, // Reduced opacity for non-current words
                    backgroundColor: words[0] === "S3" || words[0] === "SSH" ? 'transparent' : 'inherit',
                    pointerEvents: 'none', // Prevent any click events
                    maxHeight: words[0] === "Retool" ? '4.8rem' : words[0] === "MySQL" ? '4rem' : words[0] === "BigQuery" ? '4.1rem' : '5rem', // Custom heights
                    maxWidth: words[0] === "Retool" ? '100px' : words[0] === "MySQL" ? '82px' : words[0] === "Snowflake" ? '90px' : words[0] === "BigQuery" ? '75px' : '100px', // Custom widths
                    padding: words[0] === "BigQuery" ? '6px' : '0', // Special padding for BigQuery logo
                    marginLeft: words[0] === "Kubernetes" || words[0] === "Postgres" ? '-10px' : 
                              words[0] === "MySQL" ? '10px' : 
                              words[0] === "Snowflake" ? '-8px' : 
                              words[0] === "BigQuery" ? '-3px' : 
                              words[0] === "Retool" ? '-14px' : '0', // Custom shifts for alignment
                    filter: 0 === currentIndex ? 'none' : 'grayscale(60%)' // Apply grayscale to non-current logos
                  }}
                />
              )}
            </div>
            <span className="text-6xl md:text-7xl font-bold min-w-[28rem] inline-block" style={{ 
              marginLeft: words[0] === "MySQL" ? '-5px' : 
                        words[0] === "Snowflake" ? '-10px' : 
                        words[0] === "BigQuery" ? '5px' : 
                        words[0] === "Retool" ? '-8px' : 
                        words[0] === "Metabase" || words[0] === "Looker" || words[0] === "Clickhouse" || words[0] === "S3" ? '-5px' : 
                        words[0] === "MCP" ? '-15px' : '-15px', 
              fontSize: "6rem" 
            }}>{words[0]}</span>
          </div>
          
          {/* Render all regular words */}
          {words.map((word, idx) => {
            const isNext = idx === getNextIndex();
            const isCurrent = idx === currentIndex;
            const isPrevious = idx === getPrevIndex();
            
            return (
              <div 
                key={`word-${word}-${idx}-${currentIndex}`} // Include currentIndex in key to force re-render
                className="h-[7.5rem] flex items-center absolute w-full left-0" 
                style={{
                  // Position each word at its index for scrolling animation
                  top: `${idx * 7.5}rem`,
                  opacity: isCurrent ? 1 : 
                          isNext || isPrevious ? 0.7 : 
                          idx === (currentIndex + 2) % words.length || idx === (currentIndex - 2 + words.length) % words.length ? 0.4 : 0, // Show 2 prev and 2 next words with higher contrast
                  color: isCurrent ? wordColors[word as keyof typeof wordColors] : 
                          isPrevious || isNext || idx === (currentIndex + 2) % words.length || idx === (currentIndex - 2 + words.length) % words.length ? '#8E9196' : 'inherit',
                  background: 'transparent',
                  transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), color 800ms cubic-bezier(0.4, 0, 0.2, 1), background 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none' // Prevent click events on words
                }}
              >
                {/* Logo with spacing - now comes first */}
                <div className="flex items-center justify-end" style={{ width: '130px', marginRight: '15px' }}>
                  {logos[word as keyof typeof logos] && (
                    <img 
                      src={logos[word as keyof typeof logos]} 
                      alt={`${word} logo`} 
                      className="max-w-[120px] h-[5rem] object-contain"
                      style={{ 
                        opacity: isCurrent ? 1 : 0.4, // Reduced opacity for non-current words
                        backgroundColor: word === "S3" || word === "SSH" ? 'transparent' : 'inherit',
                        pointerEvents: 'none', // Prevent any click events on logos
                        maxHeight: word === "Retool" ? '4.8rem' : word === "MySQL" ? '4rem' : word === "BigQuery" ? '4.1rem' : '5rem', // Custom heights
                        maxWidth: word === "Retool" ? '100px' : word === "MySQL" ? '82px' : word === "Snowflake" ? '90px' : word === "BigQuery" ? '75px' : '100px', // Custom widths
                        padding: word === "BigQuery" ? '6px' : '0', // Special padding for BigQuery logo
                        marginLeft: word === "Kubernetes" || word === "Postgres" ? '-10px' : 
                                   word === "MySQL" ? '10px' : 
                                   word === "Snowflake" ? '-8px' : 
                                   word === "BigQuery" ? '-3px' : 
                                   word === "Retool" ? '-14px' : '0', // Custom shifts for alignment
                        filter: isCurrent ? 'none' : 'grayscale(60%)' // Apply grayscale to non-current logos
                      }}
                    />
                  )}
                </div>
                
                {/* Word text */}
                <span className="text-6xl md:text-7xl font-bold min-w-[28rem] inline-block" style={{ 
                  marginLeft: word === "MySQL" ? '-5px' : 
                            word === "Snowflake" ? '-10px' : 
                            word === "BigQuery" ? '5px' : 
                            word === "Retool" ? '-8px' : 
                            word === "Metabase" || word === "Looker" || word === "Clickhouse" || word === "S3" ? '-5px' : 
                            word === "MCP" ? '-15px' : '-15px', 
                  fontSize: "6rem" 
                }}>{word}</span>
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
        padding: 0,
        height: "100vh", // Use full viewport height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Center content vertically
        paddingBottom: "70px" // Shift content down further
      }}
      onClick={(e) => e.stopPropagation()} // Stop event propagation
    >
      <header className="absolute top-16 left-20">
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
      
      <div className="flex flex-col mx-auto" style={{ maxWidth: "1400px", marginTop: "80px", marginLeft: "5%" }}>
        {/* Main container with a consistent width that will be used for both elements */}
        <div className="w-full px-0">
          {/* Create a common container that'll be used for both headline and description */}
          <div className="flex flex-col">
            {/* Create a container with consistent width for both headline and description */}
            <div style={{ marginLeft: "0rem", width: "1550px" }}>
              {/* Headline container */}
              <div className="flex flex-nowrap items-center mb-8 whitespace-nowrap" id="headline-container">
                {/* Headline text - no wrapping for single line layout */}
                <div id="headline-text" className="text-6xl md:text-7xl font-bold whitespace-nowrap" style={{ paddingTop: '0.5rem', fontSize: "6rem", marginLeft: "60px", marginTop: "0", position: "relative", top: "2.4rem" }}>
                  Stop worrying about
                </div>
                
                {/* Carousel with fixed size - positioned to align the current word */}
                <div 
                  className="inline-block relative overflow-visible w-[1200px] h-[38rem] ml-0 -translate-x-6"
                  style={{ 
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent'
                  }}
                  onClick={preventDefaultBehavior} // Prevent any click events from causing navigation
                >
                  {renderCarousel()}
                  <div className="absolute bottom-0 left-0 w-[1250px] h-[16rem] bg-gradient-to-t from-white from-0% via-white via-60% to-transparent z-10 pointer-events-none" style={{marginBottom: "-2rem"}}></div>
                  <div className="absolute top-0 left-0 w-[1250px] h-[8rem] bg-gradient-to-b from-white from-0% via-white via-40% to-transparent z-10 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Description container using the same width container */}
              <div className="mt-24" id="description-container">
                <div className="text-4xl md:text-5xl text-left transition-opacity duration-800 font-medium"
                    style={{ 
                      width: "96%",
                      marginLeft: "60px",
                      minHeight: "240px", /* Increased height for larger text */
                      paddingTop: "4px", /* Add slight padding to maintain vertical alignment */
                      paddingBottom: "4px", /* Add slight padding to maintain vertical alignment */
                      lineHeight: "1.35", /* Slightly increased line height for better readability */
                      color: currentIndex >= 0 ? wordColors[words[currentIndex] as keyof typeof wordColors] : '#6B7280',
                      overflowWrap: "break-word" /* Ensure long words break properly */
                    }}>
                  {currentIndex >= 0 && descriptions[words[currentIndex] as keyof typeof descriptions]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCarousel;