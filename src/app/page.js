'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Leaderboard from "@/components/Leaderboard";
import DeadlineTimer from "@/components/DeadlineTimer";
import Switch from "@/components/ui/sky-toggle";
import Footer from "@/components/Footer";
import MobileSidebar from "@/components/MobileSidebar";
import data from "../../public/data.json";
import lockedPlayersData from "../../public/locked_players.json";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Confetti from 'react-confetti';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState('/assets/gdsc-logo_svg.svg');
  const [isGiftBoxOpen, setIsGiftBoxOpen] = useState(false);
  const [showSwagsMessage, setShowSwagsMessage] = useState(false);
  const [currentTier, setCurrentTier] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const totalParticipants = data.length;
  const skillBadgeMasters = data.filter(
    (participant) => {
      const skillBadges = Number(participant["# of Skill Badges Completed"] || 0);
      const games = Number(participant["# of Arcade Games Completed"] || 0);
      return skillBadges >= 19 && games >= 1;
    }
  ).length;
  const gameWinners = data.reduce((acc, participant) => acc + participant["# of Arcade Games Completed"], 0);
  const creditsRedeemed = data.filter(
    (participant) => participant["Access Code Redemption Status"] === "Yes"
  ).length;

  const tiers = [
    {
      image: '/tier1.svg',
      title: 'Tier 1 - Premium Swags',
      message: 'When 100 students complete the campaign, the top 100 achievers will receive these exclusive premium swags!',
      requirement: '100 students needed'
    },
    {
      image: '/tier2.svg',
      title: 'Tier 2 - Elite Swags',
      message: 'When 70 students complete the campaign, the top 70 achievers will receive these elite swags!',
      requirement: '70 students needed'
    },
    {
      image: '/tier3.svg',
      title: 'Tier 3 - Special Swags',
      message: 'When 50 students complete the campaign, the top 50 achievers will receive these special swags!',
      requirement: '50 students needed'
    }
  ];

  const revealSwags = () => {
    setIsRevealing(true);
    setCurrentTier(0);
    setShowSwagsMessage(true);
    setShowConfetti(true);
    
    // Stop confetti after 6 seconds
    setTimeout(() => setShowConfetti(false), 6000);
    
    // Launch-style reveal animation
    const revealInterval = setInterval(() => {
      setCurrentTier(prev => {
        if (prev < tiers.length - 1) {
          return prev + 1;
        } else {
          clearInterval(revealInterval);
          setIsRevealing(false);
          return prev;
        }
      });
    }, 2000); // 2 seconds between each tier reveal
  };

  // Get window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const totalBadgesEarned = data.reduce((acc, participant) => acc + participant["# of Skill Badges Completed"], 0);
  const averageProgress = totalParticipants > 0 ? (totalBadgesEarned / (totalParticipants * 100)).toFixed(2) : 0;
  const topPerformer = lockedPlayersData.length > 0 ? lockedPlayersData[0] : {
    "User Name": "N/A",
    "Google Cloud Skills Boost Profile URL": "#",
    "# of Skill Badges Completed": 0,
    "# of Arcade Games Completed": 0
  };

  const activeParticipants = data.filter(
    (participant) => participant["# of Skill Badges Completed"] > 0 || participant["# of Arcade Games Completed"] > 0
  ).length;

  const completionRate = totalParticipants > 0 ? ((skillBadgeMasters / totalParticipants) * 100).toFixed(2) : 0;

  const averageCompletionRate = totalParticipants > 0 ? (data.reduce((acc, p) => acc + (p["# of Skill Badges Completed"] + p["# of Arcade Games Completed"]), 0) / (totalParticipants * 20) * 100).toFixed(2) : 0;

  const participantsWith19SkillBadges = data.filter(
    (participant) => Number(participant["# of Skill Badges Completed"] || 0) >= 19
  ).length;

  const participantsWithAnyArcadeGames = data.filter(
    (participant) => Number(participant["# of Arcade Games Completed"] || 0) >= 1
  ).length;

  // Calculate percentages based on total completions out of 50 students goal
  const skillBadges19Percentage = Math.min((totalBadgesEarned / 50) * 100, 100).toFixed(1);
  const arcadeGamesPercentage = Math.min((gameWinners / 50) * 100, 100).toFixed(1);

  const performanceData = Array.from({ length: 20 }, (_, i) => {
    const count = data.filter(p => p['# of Skill Badges Completed'] === i).length;
    return { name: `${i} Badges`, count };
  });

  const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];


  // ✅ useEffect: updates logo based on theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || 'dark';
    setCurrentLogo(
      initialTheme === 'light'
        ? '/assets/gdsc-logo-svg-light.svg'
        : '/assets/gdsc-logo_svg.svg'
    );

    // ✅ fixed JS-compatible handler
  const handleThemeChange = (event) => {
    const newTheme = event.detail;
    if (!newTheme) return;
    setCurrentLogo(
      newTheme === 'light'
        ? '/assets/gdsc-logo-svg-light.svg'
        : '/assets/gdsc-logo_svg.svg'
    );
  };

    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // ✅ Social Links component
  const SocialLinks = () => (
    <>
      <Link href="https://linkedin.com/company/gdgoc-gctc">
        <div className="cursor-pointer hover:text-accent transition-colors">
          <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" fill="currentColor" />
          </svg>
        </div>
      </Link>

      <Link href="https://x.com/gdgoc_gctc">
        <div className="cursor-pointer hover:text-accent transition-colors">
          <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z" fill="currentColor" />
          </svg>
        </div>
      </Link>

      <Link href="https://www.instagram.com/gdgoc.gctc?igsh=ZXI4a3VoYjRqdnFk">
        <div className="cursor-pointer hover:text-accent transition-colors">
          <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="currentColor" />
          </svg>
        </div>
      </Link>

      <Link href="http://gdg.community.dev/gdg-on-campus-geethanjali-college-of-engineering-and-technology-hyderabad-india">
        <div className="cursor-pointer hover:text-accent transition-colors">
          <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.55.06-1.08.16-1.58L9 13v1c0 1.1.9 2 2 2v2.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor" />
          </svg>
        </div>
      </Link>

      <div className="h-4 flex items-center">
        <Switch sizePx={16} />
      </div>
    </>
  );

  return (
    <>
      {/* Navbar */}
      <nav className='w-full shadow-md relative bg-[var(--color-background)] border-b border-[var(--color-border)]'>
        {/* Mobile Header - Compact Design */}
        <div className="md:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/assets/cloudLg.svg" alt="Google Cloud Logo" width="32" height="32" />
              <div>
                <p className="text-xs font-medium text-[var(--color-header-text)] leading-tight">
                  Demo Days: Google Cloud Study Jams 2025-26
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[var(--color-primary)] focus:outline-none p-2 rounded-lg hover:bg-[var(--color-card-background)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
          <div className="px-4 pb-3">
            <div className="relative h-10 w-full">
              <Image
                src={currentLogo}
                alt="GDSC Logo"
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Desktop Header - Original Design */}
        <div className="hidden md:block">
        <div className="bg-[var(--color-background)] text-[var(--color-header-text)] w-full m-auto text-center p-2 flex justify-center items-center">
          <div><Image src="/assets/cloudLg.svg" alt="Google Cloud Logo" width="40" height="40" /></div>
          <p className='text-sm md:text-base'>
            Demo Days: Google Cloud Study Jams 2025-26
          </p>
        </div>

        <div className="w-full pl-0 pr-4 md:pl-0 md:pr-6 py-3 flex justify-between items-center">
          <div className="logo flex items-center justify-start h-12 md:h-16 -ml-6 md:-ml-10">
            <div className="relative h-full w-[22rem] md:w-[32rem]">
              <Image
                src={currentLogo}
                alt="GDSC Logo"
                fill
                sizes="(max-width: 768px) 22rem, 32rem"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Desktop Links */}
            <div className="flex items-center space-x-5 text-[var(--color-primary)]">
            <SocialLinks />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>

      {/* Deadline Timer */}
      <DeadlineTimer />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        </div>
      )}

      {/* Animated Gift Box */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsGiftBoxOpen(true)}
          className="gift-box-button group relative"
          title="Click to reveal swags!"
        >
          <Image
            src="/giftbox.svg"
            alt="Gift Box"
            width={48}
            height={48}
            className="group-hover:opacity-80 transition-opacity duration-300"
          />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </button>
      </div>

      {/* Gift Box Popup */}
      {isGiftBoxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100 popup-enter">
            <div className="mb-6">
              <Image
                src="/giftbox.svg"
                alt="Gift Box"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                🎁 Surprise Gift Box! 🎁
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click the button below to reveal your swags!
              </p>
            </div>
            
            {!showSwagsMessage ? (
              <button
                onClick={revealSwags}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-lg text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">🚀 Launch Swags Reveal! 🚀</span>
                <span className="sm:hidden">🎁 Reveal Swags</span>
              </button>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                    {tiers[currentTier].title}
                  </div>
                  
                  {/* Carousel Container */}
                  <div className="relative mb-6">
                    <div className="overflow-hidden rounded-xl launch-glow">
                      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTier * 100}%)` }}>
                        {tiers.map((tier, index) => (
                          <div key={index} className="w-full flex-shrink-0">
                            <div className="relative w-full h-64">
                              <Image
                                src={tier.image}
                                alt={tier.title}
                                fill
                                className="object-contain tier-reveal transition-all duration-1000"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Carousel Navigation */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {tiers.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTier(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${
                            index === currentTier 
                              ? 'bg-yellow-500 scale-125 progress-pulse' 
                              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-center">
                    {tiers[currentTier].message}
                  </p>
                  
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mt-4">
                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm text-center">
                      📊 {tiers[currentTier].requirement}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => {
                      setIsGiftBoxOpen(false);
                      setShowSwagsMessage(false);
                      setCurrentTier(0);
                      setIsRevealing(false);
                      setShowConfetti(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowSwagsMessage(false);
                      setCurrentTier(0);
                      setIsRevealing(false);
                      setShowConfetti(false);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                  >
                    Launch Again
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setIsGiftBoxOpen(false);
                setShowSwagsMessage(false);
                setCurrentTier(0);
                setIsRevealing(false);
                setShowConfetti(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Program Metrics */}
      <div className="text-center my-6 md:my-12 px-4">
        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-[var(--color-header-text)]">
          Program Metrics
        </h2>
        {/* Desktop: Single row layout */}
        <div className="hidden lg:flex justify-center gap-6 px-4 max-w-7xl mx-auto">
          {/* Credits Redeemed */}
          <div className="metric-card metric-card-blue group flex-1 max-w-[200px]">
            <div className="metric-icon-wrapper metric-icon-blue">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Credits Redeemed</h3>
              <p className="metric-value">{creditsRedeemed}</p>
            </div>
          </div>

          {/* Total Badges Earned */}
          <div className="metric-card metric-card-red group flex-1 max-w-[200px]">
            <div className="metric-icon-wrapper metric-icon-red">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Total Badges Earned</h3>
              <p className="metric-value">{totalBadgesEarned}</p>
            </div>
          </div>

          {/* Top Performer */}
          <div className="metric-card metric-card-yellow group flex-1 max-w-[200px]">
            <div className="metric-icon-wrapper metric-icon-yellow">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Skill Badges</h3>
              <p className="metric-value">51</p>
            </div>
          </div>

          {/* Arcade Game Winners */}
          <div className="metric-card metric-card-green group flex-1 max-w-[200px]">
            <div className="metric-icon-wrapper metric-icon-green">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Arcade Game Winners</h3>
              <p className="metric-value">{gameWinners}</p>
            </div>
          </div>

          {/* Campaign Achievers */}
          <div className="metric-card metric-card-purple group flex-1 max-w-[200px]">
            <div className="metric-icon-wrapper metric-icon-purple">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Campaign Achievers</h3>
              <p className="metric-value">{skillBadgeMasters}</p>
            </div>
          </div>
        </div>

        {/* Mobile: Bento grid layout */}
        <div className="lg:hidden grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {/* Row 1: Credits Redeemed (left) + Total Badges (right) */}
          <div className="metric-card metric-card-blue group">
            <div className="metric-icon-wrapper metric-icon-blue">
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Credits Redeemed</h3>
              <p className="metric-value">{creditsRedeemed}</p>
            </div>
          </div>

          <div className="metric-card metric-card-red group">
            <div className="metric-icon-wrapper metric-icon-red">
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Total Badges Earned</h3>
              <p className="metric-value">{totalBadgesEarned}</p>
            </div>
          </div>

          {/* Row 2: Top Performer (left) + Game Winners (right) */}
          <div className="metric-card metric-card-yellow group">
            <div className="metric-icon-wrapper metric-icon-yellow">
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Skill Badges</h3>
              <p className="metric-value">51</p>
            </div>
          </div>

          <div className="metric-card metric-card-green group">
            <div className="metric-icon-wrapper metric-icon-green">
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <div className="metric-content">
              <h3 className="metric-label">Arcade Game Winners</h3>
              <p className="metric-value">{gameWinners}</p>
            </div>
          </div>

          {/* Row 3: Campaign Achievers (centered, spans 2 columns) */}
          <div className="metric-card metric-card-purple group col-span-2">
            <div className="flex items-center gap-4">
              <div className="metric-icon-wrapper metric-icon-purple">
                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="metric-content">
                <h3 className="metric-label">Campaign Achievers</h3>
                <p className="metric-value">{skillBadgeMasters}</p>
            </div>
            </div>
          </div>

          {/* Row 4: Achievement Goals (spans 2 columns) */}
          <div className="col-span-2 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              Achievement Goals
            </h3>
<p className="text-gray-600 dark:text-gray-300 text-xs mb-4">
              Progress towards 50 students
            </p>
            
            <div className="space-y-4">
              {/* Skill Badges Progress */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Skill Badges
                  </label>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${skillBadges19Percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {skillBadges19Percentage}%
                </p>
              </div>

              {/* Arcade Games Progress */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Arcade Games
                  </label>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-500 dark:to-teal-700 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${arcadeGamesPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {arcadeGamesPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section - Desktop */}
      <div className="hidden lg:block my-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {/* Resources Tile */}
            <div>
              <div className="h-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 flex flex-col justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg className='w-8 h-8 text-blue-600 dark:text-blue-400 mr-3' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0112 21.75c1.052 0 2.062-.18 3-.512v-14.25c-1.052-.18-2.062-.25-3-.25zM12 6.042V3.75m0 2.292c-1.19 0-2.37-.08-3.548-.252M12 6.042c1.19 0 2.37.08 3.548.252m-4.478 8.278l-1.834-1.834m0 3.668L17.25 10.5m-1.834 1.834l1.834 1.834m-3.668 0l-1.834-1.834" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Learning Resources
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                    Access comprehensive Google Cloud learning materials, hands-on labs, and step-by-step guides.
                  </p>
                  <Link href="/resources">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0112 21.75c1.052 0 2.062-.18 3-.512v-14.25c-1.052-.18-2.062-.25-3-.25zM12 6.042V3.75m0 2.292c-1.19 0-2.37-.08-3.548-.252M12 6.042c1.19 0 2.37.08 3.548.252m-4.478 8.278l-1.834-1.834m0 3.668L17.25 10.5m-1.834 1.834l1.834 1.834m-3.668 0l-1.834-1.834" />
                      </svg>
                      <span className="font-semibold">Explore</span>
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Progress Bars Card */}
            <div>
              <div className="h-full bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Achievement Goals
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Progress towards 50 students
                  </p>
                </div>
                
                <div className="space-y-6">
                  {/* Skill Badges Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Skill Badges
                      </label>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${skillBadges19Percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {skillBadges19Percentage}%
                    </p>
                  </div>

                  {/* Arcade Games Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Arcade Games
                      </label>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-500 dark:to-teal-700 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${arcadeGamesPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {arcadeGamesPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Leaderboard topPerformer={topPerformer} />

      <Footer />
    </>
  );
}
