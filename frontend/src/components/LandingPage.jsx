import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Building2, 
  Zap, 
  Database, 
  Leaf, 
  Radio, 
  MapPin, 
  Compass, 
  Headphones, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Layers,
  ChevronRight,
  Clock,
  Shield,
  ShieldCheck,
  Globe2,
  Sparkles,
  KeyRound,
  Check,
  Fingerprint,
  Info,
  X,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { useAuth, DEMO_OPERATORS } from '../context/AuthContext';

export default function LandingPage() {
  const { loginWithDemoRole, login, loading } = useAuth();
  
  // Navigation & Login State
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'personas' | 'stations'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // 2FA Security Modal State
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [pendingUser, setPendingUser] = useState(null);
  const [otpError, setOtpError] = useState('');

  // Support / Help Modal State
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Status & Feedback Messages
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Live Clocks
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Clocks for Indian Standard Time (IST) & Universal (UTC)
  const formatTime = (date, timeZone, label) => {
    try {
      const timeStr = date.toLocaleTimeString('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return `${timeStr} ${label}`;
    } catch {
      return `${date.toTimeString().slice(0, 8)} ${label}`;
    }
  };

  const istTimeStr = formatTime(currentTime, 'Asia/Kolkata', 'IST');
  const utcTimeStr = formatTime(currentTime, 'UTC', 'UTC');

  // Quick Login Handler
  const handleQuickLogin = (roleOrOperatorId) => {
    setErrorMessage(null);
    const targetOperator = DEMO_OPERATORS.find(
      op => op.id === roleOrOperatorId || op.role === roleOrOperatorId || op.station_id === roleOrOperatorId
    ) || DEMO_OPERATORS[0];

    setSuccessMessage(`Authorizing ${targetOperator.full_name} (${targetOperator.clearance.split(' ')[0]} ${targetOperator.clearance.split(' ')[1]})...`);
    
    setTimeout(() => {
      loginWithDemoRole(targetOperator.id);
    }, 450);
  };

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // If empty credentials, auto-route to India HQ Mission Director
    if (!username.trim()) {
      handleQuickLogin('india_operator');
      return;
    }

    const lower = username.toLowerCase().trim();
    let target = DEMO_OPERATORS.find(
      op => op.email.toLowerCase() === lower || 
            op.full_name.toLowerCase().includes(lower) || 
            (op.station_id && lower.includes(op.station_id.replace('station-', '')))
    );

    if (lower.includes('maitri')) {
      target = DEMO_OPERATORS[1];
    } else if (lower.includes('bharati')) {
      target = DEMO_OPERATORS[2];
    } else if (lower.includes('science') || lower.includes('ananya')) {
      target = DEMO_OPERATORS[3];
    } else if (lower.includes('power') || lower.includes('arjun')) {
      target = DEMO_OPERATORS[4];
    } else if (!target) {
      target = DEMO_OPERATORS[0];
    }

    setSuccessMessage(`Access Granted: ${target.full_name} (${target.clearance.split(' ')[0]} ${target.clearance.split(' ')[1] || ''}). Transferring to POLARIS Mission Control...`);
    setTimeout(() => {
      loginWithDemoRole(target.id);
    }, 450);
  };

  const handleVerify2FA = (directBypass = false) => {
    if (directBypass || otpCode.join('').length >= 4 || otpCode.join('') === '842109') {
      setShowTwoFactorModal(false);
      if (pendingUser) {
        setSuccessMessage(`Clearance Verified. Entering POLARIS Command Suite...`);
        setTimeout(() => {
          loginWithDemoRole(pendingUser.id);
        }, 400);
      }
    } else {
      setOtpError('Invalid Security Passcode. Use test code: 842109 or click 1-Click Fast Pass.');
    }
  };

  const handleAutofillDemo = (operatorIndex = 0) => {
    const op = DEMO_OPERATORS[operatorIndex];
    setUsername(op.email);
    setPassword('MissionControl@2026');
    setErrorMessage(null);
  };

  return (
    <div className="landing-page-root">
      <div className="landing-page-frame">
        
        {/* ====================================================================
            TOP GOVERNMENT OF INDIA & MOES BANNER
            ==================================================================== */}
        <header className="portal-gov-header">
          <div className="gov-header-left">
            {/* Ashoka Lion Emblem */}
            <div className="ashoka-emblem-svg">
              <svg viewBox="0 0 48 56" width="34" height="40" fill="none">
                <path d="M24 2C20 2 17 5 17 9C17 11 18 13 20 14.5C18 15.5 16 17.5 16 20C16 23 18 25.5 21 26.5V30H14C11 30 9 32 9 35C9 37 10 39 12 40C9 41.5 7 44 7 47H41C41 44 39 41.5 36 40C38 39 39 37 39 35C39 32 37 30 34 30H27V26.5C30 25.5 32 23 32 20C32 17.5 30 15.5 28 14.5C30 13 31 11 31 9C31 5 28 2 24 2Z" fill="#1e3a5f" />
                <circle cx="24" cy="9" r="3" fill="#ffffff" />
                <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
                <circle cx="28" cy="20" r="2.5" fill="#ffffff" />
                <circle cx="24" cy="44" r="3" stroke="#0284c7" strokeWidth="1.2" />
                <rect x="12" y="50" width="24" height="3" rx="1.5" fill="#1e3a5f" />
              </svg>
            </div>
            <div className="gov-titles-col">
              <span className="gov-hindi">भारत सरकार | पृथ्वी विज्ञान मंत्रालय</span>
              <span className="gov-eng">Government of India • Ministry of Earth Sciences</span>
              <span className="gov-dept">National Centre for Polar and Ocean Research (NCPOR), Goa</span>
            </div>
          </div>

          <div className="gov-header-right">
            {/* Live Ticking Time Capsule */}
            <div className="portal-live-clocks-strip">
              <div className="portal-clock-item">
                <Clock size={12} className="text-cyan" />
                <span className="p-clk-lbl">IST:</span>
                <span className="p-clk-val">{istTimeStr}</span>
              </div>
              <div className="portal-clock-divider" />
              <div className="portal-clock-item">
                <Globe2 size={12} className="text-dim" />
                <span className="p-clk-lbl">UTC:</span>
                <span className="p-clk-val">{utcTimeStr}</span>
              </div>
            </div>

            {/* Satellite Ku-Band Status Pill */}
            <div className="sat-link-status-badge" title="Space-Ground ISRO GSAT-7A Polar Uplink Active">
              <span className="sat-pulsing-dot" />
              <span className="sat-link-text">GSAT-7A SAT-LINK NOMINAL</span>
            </div>

            {/* Azadi Ka Amrit Mahotsav Emblem Badge */}
            <div className="amrit-mahotsav-badge">
              <span className="amrit-number">75</span>
              <div className="amrit-text-col">
                <span className="amrit-line1">Azadi Ka</span>
                <span className="amrit-line2">Amrit Mahotsav</span>
              </div>
            </div>
          </div>
        </header>

        {/* Live Scrolling Mission Alert Banner */}
        <div className="portal-mission-ticker-bar">
          <div className="ticker-label-badge">
            <Radio size={12} className="animate-pulse" />
            <span>MISSION BULLETIN</span>
          </div>
          <div className="ticker-marquee-content">
            <span>❄️ POLARIS Mission Control Online • 44th Indian Scientific Expedition to Antarctica (ISEA) active • Maitri Station Diesel Microgrid stable at 132 kW • Bharati ISRO Radome satellite downlink at 100% telemetry link efficiency • All systems nominal.</span>
          </div>
        </div>

        {/* ====================================================================
            MAIN HERO & LOGIN SPLIT BODY
            ==================================================================== */}
        <div className="portal-main-body">
          
          {/* LEFT HERO: Antarctic Landscape + Digital Twin Overlay */}
          <div className="portal-hero-section">
            <div className="hero-bg-image-wrap">
              <img src="/antarctic_hero_bg.jpg" alt="Antarctica Research Station" className="hero-bg-img" />
              <div className="hero-polar-gradient" />
            </div>

            {/* Top Brand Crest & Map Graphic */}
            <div className="hero-brand-row">
              <div className="hero-brand-left">
                <div className="hero-logo-container">
                  <svg viewBox="0 0 40 32" className="hero-polar-crest" fill="none">
                    <path d="M20 2L36 12V24L20 31L4 24V12L20 2Z" stroke="#0284c7" strokeWidth="2" fill="rgba(2, 132, 199, 0.15)" />
                    <path d="M11 23L17 14L22 21L27 10L33 23H11Z" fill="#0284c7" fillOpacity="0.5" />
                    <path d="M27 10L22 21L17 14L11 23H33L27 10Z" stroke="#0284c7" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="27" cy="10" r="1.5" fill="#ffffff" />
                    <circle cx="17" cy="14" r="1.5" fill="#ffffff" />
                  </svg>
                </div>
                <div className="hero-brand-names">
                  <h1 className="hero-polaris-title">POLARIS</h1>
                  <span className="hero-polaris-subtitle">Polar Operations & Logistics Automated Remote Infrastructure System</span>
                </div>
              </div>

              {/* Glowing Antarctic Continent Radar Map */}
              <div className="hero-radar-map-box">
                <svg viewBox="0 0 160 160" className="hero-antarctic-svg">
                  {/* Radar Circles */}
                  <circle cx="80" cy="80" r="70" stroke="rgba(2, 132, 199, 0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                  <circle cx="80" cy="80" r="50" stroke="rgba(2, 132, 199, 0.25)" strokeWidth="1" fill="none" />
                  <circle cx="80" cy="80" r="30" stroke="rgba(2, 132, 199, 0.3)" strokeWidth="1" fill="none" />
                  
                  {/* Antarctic Continent Silhouette Outline */}
                  <path 
                    d="M 80,32 C 96,30 114,40 126,55 C 138,70 134,95 120,115 C 108,130 85,135 68,128 C 50,122 36,105 34,88 C 32,72 45,55 58,45 C 68,36 74,33 80,32 Z" 
                    fill="rgba(255, 255, 255, 0.65)" 
                    stroke="#0284c7" 
                    strokeWidth="1.5"
                  />
                  
                  {/* Bharati Station (Top-Right Coast) */}
                  <g className="radar-station-pin" onClick={() => handleQuickLogin('station-bharati')} style={{ cursor: 'pointer' }}>
                    <circle cx="118" cy="62" r="4.5" fill="#0284c7" className="animate-ping" opacity="0.8" />
                    <circle cx="118" cy="62" r="3" fill="#0284c7" />
                    <text x="124" y="64" fill="#0f172a" fontSize="8.5" fontWeight="bold">Bharati (69°S)</text>
                  </g>

                  {/* Maitri Station (Bottom-Right / Inland Oasis) */}
                  <g className="radar-station-pin" onClick={() => handleQuickLogin('station-maitri')} style={{ cursor: 'pointer' }}>
                    <circle cx="106" cy="108" r="4.5" fill="#0284c7" className="animate-ping" opacity="0.8" />
                    <circle cx="106" cy="108" r="3" fill="#0284c7" />
                    <text x="112" y="110" fill="#0f172a" fontSize="8.5" fontWeight="bold">Maitri (70°S)</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Main Headline & Tagline */}
            <div className="hero-headline-group">
              <h2 className="hero-headline-text">
                Autonomous Digital Twin & Remote Command Hub<br />
                for Indian Antarctic Research Stations
              </h2>
              <p className="hero-tagline-text">
                Real-Time Telemetry &nbsp;•&nbsp; Priority-Queue Sat-Link &nbsp;•&nbsp; Combined Heat & Power &nbsp;•&nbsp; Predictive Cryosphere AI
              </p>
            </div>

            {/* Interactive Station Preview Cards */}
            <div className="hero-station-cards-cluster">
              {/* Maitri Station Card */}
              <div 
                className="portal-station-card" 
                onClick={() => handleQuickLogin('station-maitri')}
                title="Click for Direct Station Command: Maitri Research Station"
              >
                <div className="p-st-thumb-wrap">
                  <img src="/stations/maitri.jpg" alt="Maitri Research Station" className="p-st-thumb" />
                </div>
                <div className="p-st-meta">
                  <div className="p-st-header-row">
                    <h4 className="p-st-name">Maitri Research Station</h4>
                    <span className="p-st-health-pill">Health 87%</span>
                  </div>
                  <span className="p-st-coord"><MapPin size={10} className="text-cyan" /> 70° 45′ S, 11° 44′ E</span>
                  <span className="p-st-region"><Compass size={10} className="text-dim" /> Schirmacher Oasis • -18.7°C</span>
                  <div className="p-st-status-pill">
                    <span className="p-live-dot" /> Microgrid 132 kW • Life Support Active
                  </div>
                </div>
              </div>

              {/* Bharati Station Card */}
              <div 
                className="portal-station-card" 
                onClick={() => handleQuickLogin('station-bharati')}
                title="Click for Direct Station Command: Bharati Research Station"
              >
                <div className="p-st-thumb-wrap">
                  <img src="/stations/bharati.jpg" alt="Bharati Research Station" className="p-st-thumb" />
                </div>
                <div className="p-st-meta">
                  <div className="p-st-header-row">
                    <h4 className="p-st-name">Bharati Research Station</h4>
                    <span className="p-st-health-pill">Health 92%</span>
                  </div>
                  <span className="p-st-coord"><MapPin size={10} className="text-cyan" /> 69° 24′ S, 76° 11′ E</span>
                  <span className="p-st-region"><Compass size={10} className="text-dim" /> Larsemann Hills • -12.4°C</span>
                  <div className="p-st-status-pill">
                    <span className="p-live-dot" /> CHP Cogeneration • ISRO Radome Uplink
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 5-Column Feature Icons Strip */}
            <div className="hero-features-ribbon">
              <div className="h-feat-col">
                <Building2 size={16} className="h-feat-icon" />
                <span className="h-feat-label">Infrastructure<br />& Permafrost</span>
              </div>
              <div className="h-feat-col">
                <Zap size={16} className="h-feat-icon" />
                <span className="h-feat-label">Energy Grid<br />& CHP Systems</span>
              </div>
              <div className="h-feat-col">
                <Database size={16} className="h-feat-icon" />
                <span className="h-feat-label">Fuel & Ration<br />Forecasting</span>
              </div>
              <div className="h-feat-col">
                <Leaf size={16} className="h-feat-icon" />
                <span className="h-feat-label">Environmental<br />Cryosphere AI</span>
              </div>
              <div className="h-feat-col no-border">
                <Radio size={16} className="h-feat-icon" />
                <span className="h-feat-label">Priority Queue<br />Sat-Link (ISRO)</span>
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN PANEL: Secure Mission Access + Tabs */}
          <div className="portal-login-section">
            <div className="login-panel-inner">
              
              {/* Header */}
              <div className="login-heading-block">
                <div className="login-title-row">
                  <ShieldCheck size={22} className="text-cyan" />
                  <h3 className="login-main-title">Mission Access Portal</h3>
                </div>
                <p className="login-main-subtitle">Secure Government Authentication & Clearance Hub</p>
              </div>

              {/* Login Mode Navigation Tabs */}
              <div className="portal-auth-nav-tabs">
                <button 
                  type="button" 
                  className={`auth-nav-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('credentials')}
                >
                  <KeyRound size={13} />
                  <span>Credentials</span>
                </button>
                <button 
                  type="button" 
                  className={`auth-nav-tab-btn ${activeTab === 'personas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personas')}
                >
                  <Shield size={13} />
                  <span>Personnel Roles</span>
                </button>
                <button 
                  type="button" 
                  className={`auth-nav-tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stations')}
                >
                  <Globe2 size={13} />
                  <span>Workspaces</span>
                </button>
              </div>

              {/* Status alerts */}
              {errorMessage && (
                <div className="login-alert-box error">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="login-alert-box success">
                  <CheckCircle2 size={14} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ==========================================================
                  TAB 1: DIRECT CREDENTIALS FORM
                  ========================================================== */}
              {activeTab === 'credentials' && (
                <form className="login-credentials-form" onSubmit={handleFormSubmit}>
                  <div className="portal-form-group">
                    <label className="portal-input-label">Official Operator ID / Email</label>
                    <div className="portal-input-wrap">
                      <User size={15} className="portal-input-icon" />
                      <input
                        type="text"
                        className="portal-text-input"
                        placeholder="e.g. india.operator@polaris.gov.in"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="portal-form-group">
                    <div className="portal-label-row">
                      <label className="portal-input-label">Security Passcode</label>
                      <button 
                        type="button" 
                        className="portal-quick-autofill-btn"
                        onClick={() => handleAutofillDemo(0)}
                      >
                        Autofill Demo Passcode
                      </button>
                    </div>
                    <div className="portal-input-wrap">
                      <Lock size={15} className="portal-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="portal-text-input"
                        placeholder="Enter mission passcode"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="portal-pw-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="portal-options-row">
                    <label className="portal-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Keep operator session active</span>
                    </label>
                    <span className="portal-security-badge">
                      <Shield size={11} /> 256-Bit Encrypted
                    </span>
                  </div>

                  <button type="submit" className="portal-submit-btn" disabled={loading}>
                    <span>Verify & Access Mission Control</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="portal-quick-personas-mini">
                    <span className="p-mini-lbl">Or 1-Click Fast Pass:</span>
                    <div className="p-mini-chips-row">
                      <button type="button" className="p-mini-chip" onClick={() => handleQuickLogin('india_operator')}>
                        🇮🇳 HQ Director
                      </button>
                      <button type="button" className="p-mini-chip" onClick={() => handleQuickLogin('station-maitri')}>
                        ❄️ Maitri Base
                      </button>
                      <button type="button" className="p-mini-chip" onClick={() => handleQuickLogin('station-bharati')}>
                        📡 Bharati Base
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ==========================================================
                  TAB 2: PERSONNEL CLEARANCE ROLES (PERSONAS)
                  ========================================================== */}
              {activeTab === 'personas' && (
                <div className="portal-personas-list">
                  <div className="personas-hint-txt">
                    Select an authorized operator profile to inspect role-isolated station permissions:
                  </div>

                  {DEMO_OPERATORS.map((op) => (
                    <div 
                      key={op.id}
                      className="portal-persona-card"
                      onClick={() => handleQuickLogin(op.id)}
                      title={`Click to authenticate as ${op.full_name}`}
                    >
                      <div className="persona-avatar-col">
                        <span className="persona-avatar-txt">{op.avatar || op.full_name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="persona-info-col">
                        <div className="persona-top-row">
                          <h5 className="persona-name">{op.full_name}</h5>
                          <span className="persona-clearance-pill">{op.clearance.split(' ')[0]}</span>
                        </div>
                        <span className="persona-title">{op.title}</span>
                        <span className="persona-location"><MapPin size={10} /> {op.locationBadge}</span>
                      </div>
                      <ChevronRight size={16} className="persona-arrow-icon" />
                    </div>
                  ))}
                </div>
              )}

              {/* ==========================================================
                  TAB 3: DIRECT WORKSPACE SELECTOR
                  ========================================================== */}
              {activeTab === 'stations' && (
                <div className="portal-workspaces-stack">
                  <div 
                    className="workspace-select-card"
                    onClick={() => handleQuickLogin('india_operator')}
                  >
                    <div className="ws-card-left">
                      <div className="ws-circle-icon blue-circle">
                        <Building2 size={18} />
                      </div>
                      <div className="ws-text-wrap">
                        <h5 className="ws-heading">India HQ National Mission Control</h5>
                        <p className="ws-description">
                          Multi-Station Unified Telemetry, Cross-Station Switching, Satellite Bandwidth Allocation & National Command.
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="ws-arrow-icon" />
                  </div>

                  <div 
                    className="workspace-select-card"
                    onClick={() => handleQuickLogin('station-maitri')}
                  >
                    <div className="ws-card-left">
                      <div className="ws-circle-icon cyan-circle">
                        <Activity size={18} />
                      </div>
                      <div className="ws-text-wrap">
                        <h5 className="ws-heading">Maitri Research Station Hub</h5>
                        <p className="ws-description">
                          Inland Schirmacher Oasis life-support, diesel generator grid, Priyadarshini water management, and weather radar.
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="ws-arrow-icon" />
                  </div>

                  <div 
                    className="workspace-select-card"
                    onClick={() => handleQuickLogin('station-bharati')}
                  >
                    <div className="ws-card-left">
                      <div className="ws-circle-icon green-circle">
                        <Zap size={18} />
                      </div>
                      <div className="ws-text-wrap">
                        <h5 className="ws-heading">Bharati Research Station Hub</h5>
                        <p className="ws-description">
                          Larsemann Hills coastal radar, ISRO satellite radome ground station, CHP plant, and RO desalination grid.
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="ws-arrow-icon" />
                  </div>
                </div>
              )}

              {/* Security & Support Footer */}
              <div className="portal-login-footer">
                <div className="sec-notice-row">
                  <Lock size={12} className="text-dim" />
                  <span>Authorized Government Personnel Only • SIH 2026 Polar System</span>
                </div>
                <button 
                  type="button" 
                  className="support-link-btn"
                  onClick={() => setShowHelpModal(true)}
                >
                  <Headphones size={12} />
                  <span>Mission Support & Guidelines</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ====================================================================
            BOTTOM DARK NAVY FOOTER STRIP
            ==================================================================== */}
        <footer className="portal-dark-footer">
          <div className="footer-left-txt">
            <span>POLARIS &nbsp;|&nbsp; Ministry of Earth Sciences &nbsp;|&nbsp; National Centre for Polar & Ocean Research (NCPOR)</span>
          </div>
          <div className="footer-right-cluster">
            <span className="footer-motto-txt">Science • Exploration • Sustainability • Resilience</span>
            {/* Indian Flag Tricolor Bar */}
            <div className="flag-tricolor-bar">
              <span className="tri-bar-saffron" />
              <span className="tri-bar-white" />
              <span className="tri-bar-green" />
            </div>
          </div>
        </footer>

      </div>

      {/* ====================================================================
          SIMULATED 2-FACTOR AUTHENTICATION / CLEARANCE MODAL
          ==================================================================== */}
      {showTwoFactorModal && (
        <div className="portal-modal-backdrop" onClick={() => setShowTwoFactorModal(false)}>
          <div className="twofa-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="twofa-header">
              <div className="twofa-icon-wrap">
                <Fingerprint size={28} className="text-cyan" />
              </div>
              <h4 className="twofa-title">Security Clearance Verification</h4>
              <p className="twofa-sub">
                Confirm identity for <strong>{pendingUser?.full_name || 'Operator'}</strong> ({pendingUser?.clearance || 'Level 5'})
              </p>
            </div>

            <div className="twofa-body">
              <div className="twofa-passcode-box">
                <label className="twofa-input-label">Enter 6-Digit Mission Security Token</label>
                <div className="twofa-digits-row">
                  {['8', '4', '2', '1', '0', '9'].map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      className="twofa-digit-input"
                      value={otpCode[idx] || digit}
                      onChange={(e) => {
                        const newOtp = [...otpCode];
                        newOtp[idx] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                    />
                  ))}
                </div>
                <span className="twofa-hint-txt">💡 Test Passcode pre-filled: <strong>842109</strong> (or click Direct Bypass)</span>
              </div>

              {otpError && (
                <div className="login-alert-box error" style={{ margin: '8px 0' }}>
                  <AlertCircle size={13} />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="twofa-actions-row">
                <button 
                  type="button" 
                  className="twofa-cancel-btn"
                  onClick={() => setShowTwoFactorModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="twofa-verify-btn"
                  onClick={() => handleVerify2FA(true)}
                >
                  <ShieldCheck size={16} />
                  <span>Confirm & Authorize</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MISSION SUPPORT & SYSTEM INFORMATION MODAL
          ==================================================================== */}
      {showHelpModal && (
        <div className="portal-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="support-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="support-dialog-header">
              <div className="support-header-left">
                <Info size={20} className="text-cyan" />
                <h4 className="support-modal-title">POLARIS Mission Support & Directory</h4>
              </div>
              <button 
                type="button" 
                className="support-modal-close" 
                onClick={() => setShowHelpModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="support-dialog-body">
              <div className="support-info-card">
                <h5 className="support-card-title">National Polar Operations Helpdesk</h5>
                <p className="support-card-desc">
                  For emergency SAT-LINK priority preemption, cryosphere telemetry verification, or credential re-issuance:
                </p>
                <ul className="support-contact-list">
                  <li><strong>HQ Command Desk:</strong> +91-832-2525555 (NCPOR Goa, Ministry of Earth Sciences)</li>
                  <li><strong>Satellite Operations (ISRO Telemetry):</strong> GSAT-7A Ku-Band Ground Terminal</li>
                  <li><strong>Maitri Station Schirmacher Radio:</strong> HF / VHF 143.900 MHz (Callsign: Maitri Base)</li>
                  <li><strong>Bharati Station Larsemann Radio:</strong> Maritime Inmarsat FleetBroadband</li>
                </ul>
              </div>

              <div className="support-info-card">
                <h5 className="support-card-title">System Architecture & SIH 2026 Prototype</h5>
                <p className="support-card-desc">
                  POLARIS is an end-to-end digital twin and low-bandwidth mission control prototype engineered to simulate real-time sensor streams, priority queue preemption, and predictive energy analytics for India's Antarctic expeditions.
                </p>
              </div>
            </div>

            <div className="support-dialog-footer">
              <button 
                type="button" 
                className="support-close-action-btn"
                onClick={() => setShowHelpModal(false)}
              >
                Close Support Directory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
