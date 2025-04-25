import React, { useState, useEffect, useRef } from 'react';

// Reordering words to ensure HTTP appears right before SSH
const words = [
  "SSH",
  "Kubernetes", 
  "Postgres",
  "Snowflake",
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
  "Snowflake": "Implement granular access controls over engineer data interactions within Snowflake environments.",
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
  "Snowflake": "#29B5E8",  // Snowflake light blue
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
  "Snowflake": "/lovable-uploads/5fe673da-225f-4271-b883-7f92280d3485.png",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  
  // Initial load reference
  const isInitialLoad = useRef(true);
  
  // Start carousel on initial load
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      // Start with Snowflake (index 3)
      setCurrentIndex(3);
    }
    
    // Auto-rotate carousel
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  // Helper functions for carousel display
  const getPrevIndex = () => {
    if (currentIndex < 0) return -1; // No word showing yet
    
    // For SSH (index 0), we want HTTP (last element) to be the previous word
    if (currentIndex === 0) {
      return words.length - 1; // Return index of HTTP
    }
    return (currentIndex - 1 + words.length) % words.length;
  };
  
  const getNextIndex = () => {
    if (currentIndex < 0) return -1; // No word showing yet
    return (currentIndex + 1) % words.length;
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black pb-16">
      <header className="absolute top-8 left-8">
        <img 
          src="/lovable-uploads/165a663c-4cc0-4f1d-884a-1f33303936d0.png" 
          alt="Logo" 
          className="h-16 object-contain" 
          onLoad={(e) => {
            console.log('Logo loaded successfully', e.target);
          }}
          onError={(e) => {
            console.error('Failed to load logo', e.target);
            console.log('Image source:', (e.target as HTMLImageElement).src);
          }}
        />
      </header>
      
      <div className="flex flex-col items-center justify-center flex-grow mt-16">
        <div className="text-5xl md:text-7xl font-bold mb-2 flex items-start gap-2">
          <span className="mt-[7.5rem]">Stop worrying about</span>
          <div className="inline-block relative h-[22rem] min-w-[500px]">
            <div className="absolute left-0 w-full">
              <div className="relative h-[22rem] overflow-hidden">
                <div 
                  className="absolute w-full text-left transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateY(calc(${currentIndex * -5.0}rem + 7.5rem))`,
                  }}
                >
                  {/* Add HTTP placeholder above SSH whenever it's displayed */}
                  {currentIndex === 0 && showPlaceholders && (
                    <div 
                      className="h-[5.0rem] flex items-center gap-4 absolute left-0 top-0" 
                      style={{
                        opacity: 0.3, 
                        color: '#8E9196',
                        transform: 'translateY(-5.0rem)' // Move up by one element height
                      }}
                    >
                      <span>HTTP</span>
                      {logos["HTTP"] && (
                        <img 
                          src={logos["HTTP"]} 
                          alt="HTTP logo" 
                          className="max-w-[12rem] w-auto object-contain h-[4.2rem]"
                          style={{ opacity: 1, backgroundColor: 'inherit' }}
                        />
                      )}
                    </div>
                  )}

                  {/* Add SSH placeholder below MCP when it's displayed */}
                  {currentIndex === words.length - 1 && showPlaceholders && (
                    <div 
                      className="h-[5.0rem] flex items-center gap-4 absolute left-0 bottom-0" 
                      style={{
                        opacity: 0.3, 
                        color: '#8E9196',
                        transform: 'translateY(5.0rem)' // Move down by one element height
                      }}
                    >
                      <span>SSH</span>
                      {logos["SSH"] && (
                        <img 
                          src={logos["SSH"]} 
                          alt="SSH logo" 
                          className="max-w-[12rem] w-auto object-contain h-[5.2rem]"
                          style={{ opacity: 1, backgroundColor: 'inherit' }}
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Render all words */}
                  {words.map((word, idx) => {
                    const isNext = idx === getNextIndex();
                    const isCurrent = idx === currentIndex;
                    const isPrevious = idx === getPrevIndex();
                    
                    return (
                      <div 
                        key={word}
                        className="h-[5.0rem] flex items-center gap-4" 
                        style={{
                          opacity: isCurrent ? 1 : 
                                   isNext || isPrevious ? 0.3 : 0,
                          color: isCurrent ? wordColors[word as keyof typeof wordColors] : 
                                  isPrevious ? '#8E9196' : 
                                  isNext ? '#8E9196' : 'inherit'
                        }}
                      >
                        <span>{word}</span>
                        {logos[word as keyof typeof logos] && (
                          <img 
                            src={logos[word as keyof typeof logos]} 
                            alt={`${word} logo`} 
                            className={`max-w-[12rem] w-auto object-contain ${
                              word === "SSH" ? "h-[5.2rem]" : 
                              word === "Kubernetes" ? "h-[3.8rem]" : 
                              word === "MCP" ? "h-[4.0rem]" : "h-[4.2rem]"
                            }`}
                            style={{ 
                              opacity: 1,
                              backgroundColor: word === "S3" ? 'transparent' : 'inherit'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-4xl px-6 -mt-4">
          <p className="text-2xl md:text-3xl text-gray-600 text-center transition-opacity duration-300">
            {currentIndex >= 0 && descriptions[words[currentIndex] as keyof typeof descriptions]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordCarousel;