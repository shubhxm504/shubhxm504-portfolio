import React, { useState, useEffect, useRef } from 'react';
import { 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Database, 
  BarChart3, 
  Cloud, 
  Menu, 
  X,
  ChevronDown,
  Download,
  Award,
  CheckCircle2,
  BrainCircuit,
  Server,
  ArrowRight,
  Sun,
  Moon,
  Maximize2,
  Code2,
  PieChart,
  Activity,
  TrendingUp,
  ArrowUp,
  GraduationCap,
  Trophy,
  Search,
  Cpu,
  Presentation,
  Lightbulb
} from 'lucide-react';

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text = "", delay = 30, startDelay = 0 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (text && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, hasStarted, text]);

  return <span>{currentText}</span>;
};

// --- PROJECT MODAL COMPONENT ---
const ProjectModal = ({ project, isOpen, onClose, theme }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl ${theme.bg} ${theme.text} shadow-2xl border ${theme.borderColor} animate-fade-in-up`}>
        
        {/* Modal Header Image */}
        <div className={`relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-br ${project.color}`}>
           {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <X size={20} />
          </button>

          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-90" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              {/* Fallback Pattern for missing images */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" style={{ backgroundSize: '10px 10px' }}></div>
              {project.icon}
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{project.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium bg-white/10 text-white border border-white/20 rounded-full backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Content - STAR Method */}
        <div className="p-6 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.borderColor}`}>
                <div className="flex items-center gap-2 mb-1 text-yellow-500 font-semibold text-sm">
                   <Award size={16} /> Recognition
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>{project.recognition}</div>
             </div>
             <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.borderColor}`}>
                <div className="flex items-center gap-2 mb-1 text-green-500 font-semibold text-sm">
                   <BarChart3 size={16} /> Impact
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>{project.metrics}</div>
             </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${theme.accentText}`}>
                The Challenge
              </h3>
              <p className={`${theme.textSecondary} leading-relaxed`}>
                {project.problem}
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${theme.accentText}`}>
                The Solution
              </h3>
              <p className={`${theme.textSecondary} leading-relaxed`}>
                {project.solution}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${theme.accentText}`}>
                Key Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                 {/* Visual Tech Stack in Modal */}
                 {project.techStackIcons?.map((tech) => (
                    <div key={tech.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.cardBg} border ${theme.borderColor}`}>
                        <img src={`https://cdn.simpleicons.org/${tech.slug}`} alt={tech.name} className="w-4 h-4" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);

  // --- FIX: Force scroll to top on page refresh ---
  useEffect(() => {
    // 1. Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Force scroll to top immediately
    window.scrollTo(0, 0);

    // 3. Force scroll to top again after a tiny delay to override any browser "helpful" restoration
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
      
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));

      const sections = ['home', 'workflow', 'about', 'education', 'experience', 'projects', 'certifications', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top < window.innerHeight / 2;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  // --- THEME HELPERS ---
  const theme = {
    isDark, 
    bg: isDark ? 'bg-slate-950' : 'bg-slate-100',
    bgTexture: isDark ? 'bg-grid-white/[0.05]' : 'bg-grid-black/[0.05]',
    text: isDark ? 'text-slate-200' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    navBg: isDark ? 'bg-slate-950/90 border-white/5' : 'bg-white/90 border-slate-200 shadow-sm',
    cardBg: isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white/80 border-slate-200', 
    cardInner: isDark ? 'bg-slate-900/90' : 'bg-white/90', 
    cardBorder: isDark ? 'bg-slate-800' : 'bg-slate-300',
    cardHover: isDark ? 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'hover:border-cyan-500/50 hover:shadow-lg',
    accentText: isDark ? 'text-cyan-400' : 'text-cyan-600',
    accentBg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-600/10',
    skillTag: isDark ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-slate-100 text-slate-700 border-slate-300',
    gradientTitle: isDark ? 'from-cyan-400 via-blue-500 to-purple-500' : 'from-cyan-600 via-blue-600 to-purple-600',
    codeBlock: isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-800 text-slate-200 border-slate-700' 
  };

  // --- DATA ---
  const personalInfo = {
    name: "Shubham Choudhary",
    title: "Data Analyst & Engineer",
    tagline: "Transforming raw data into actionable insights for Fortune 5 clients.",
    bio: "I am a Data Analyst with 4 years of experience at Accenture, partnering cross-functionally to build scalable analytical frameworks and drive innovation. I specialize in reducing query latency, automating data pipelines, and delivering real-time insights that save hundreds of operational hours.",
    email: "shubhxm.ai@gmail.com",
    location: "Mumbai, India",
    linkedin: "https://www.linkedin.com/in/shubhxm504",
    phone: "+91 9699759942"
  };

  // Workflow Data
  const workflowSteps = [
    {
      title: "Discover",
      icon: <Search size={24} />,
      desc: "Scoping business problems, identifying KPIs, and defining success metrics with stakeholders."
    },
    {
      title: "Build",
      icon: <Database size={24} />,
      desc: "Architecting scalable pipelines (ETL), cleaning raw data, and ensuring data quality."
    },
    {
      title: "Analyze",
      icon: <Cpu size={24} />,
      desc: "Applying statistical models and ML algorithms to uncover hidden patterns and trends."
    },
    {
      title: "Deliver",
      icon: <Presentation size={24} />,
      desc: "Visualizing insights in Power BI dashboards and presenting actionable strategies."
    }
  ];

  // Skills with Logos
  const skills = [
    { 
      category: "Data Engineering", 
      icon: <Database size={20} />, 
      items: [
        { name: "Python", slug: "python" },
        { name: "SQL", slug: "mysql" }, 
        { name: "Snowflake", slug: "snowflake" },
        { name: "Azure", slug: "microsoftazure" },
        { name: "Spark", slug: "apachespark" } 
      ]
    },
    { 
      category: "Analytics & AI", 
      icon: <BarChart3 size={20} />, 
      items: [
        { name: "Power BI", slug: "powerbi" },
        { name: "Excel", slug: "microsoftexcel" },
        { name: "Pandas", slug: "pandas" }, 
        { name: "Scikit", slug: "scikitlearn" } 
      ]
    },
    { 
      category: "Cloud & Tools", 
      icon: <Cloud size={20} />, 
      items: [
        { name: "Databricks", slug: "databricks" },
        { name: "GCP", slug: "googlecloud" },
        { name: "Git", slug: "git" },
        { name: "IBM Maximo", slug: "ibm" } 
      ]
    },
  ];

  const experience = [
    {
      id: 1,
      role: "Data Analyst",
      company: "Accenture",
      period: "Sept 2022 - Present",
      description: "Partnering with product and engineering teams to scope business problems and design A/B tests. Mentoring 8 junior members to enhance team efficiency.",
      achievements: [
        "Reduced query latency by 30% by building scalable SQL & Python analytical frameworks.",
        "Saved 200+ hours weekly by identifying integration inefficiencies and delivering an innovative solution.",
        "Designed A/B tests driving a 15% increase in feature adoption.",
        "Empowered 100+ business users with real-time Power BI dashboards."
      ],
      tech: ["Python", "SQL", "Power BI", "A/B Testing"]
    },
    {
      id: 2,
      role: "Associate Data Analyst",
      company: "Accenture",
      period: "June 2021 - Aug 2022",
      description: "Focused on optimizing data ingestion and building interactive dashboards for dynamic service analytics.",
      achievements: [
        "Fast Track Promotion to Analyst in 14 months (10 months ahead of schedule).",
        "Cut manual preparation time by 25% through optimized PL/SQL scripts and ETL logic.",
        "Reduced ad-hoc reporting backlog by 30% using dynamic Power BI dashboards.",
        "Recognized as FY'22 H1 Pinnacle Rising Star (6 recognitions)."
      ],
      tech: ["PL/SQL", "ETL", "Power BI", "Automation"]
    }
  ];

  const education = [
    {
      degree: "Bachelor of Engineering (B.E)",
      field: "Electronics & Telecommunication",
      school: "Thakur College of Engineering and Technology",
      period: "2017 - 2021",
      grade: "Mumbai, India"
    },
    {
      degree: "Higher Secondary (Class XII)",
      field: "Computer Science",
      school: "Thakur College of Science and Commerce",
      period: "2016 - 2017",
      grade: "Mumbai, India"
    }
  ];

  const awards = [
    {
      title: "Pinnacle Rising Star Award",
      issuer: "Accenture",
      date: "FY'22 H1",
      desc: "Awarded for outstanding performance and significant contribution to client success."
    },
    {
      title: "Fast Track Promotion",
      issuer: "Accenture",
      date: "Aug 2022",
      desc: "Promoted to Analyst level 10 months ahead of schedule due to exceptional delivery."
    },
    {
      title: "1st Prize - Mind's Eye Exhibition",
      issuer: "TCET",
      date: "2021",
      desc: "Secured first place among 100+ competing teams for the Smart Campus IoT project."
    },
    {
      title: "Google Assistant Recognition",
      issuer: "Google",
      date: "2020",
      desc: "Received swag & $5K cloud credits for high-impact innovation with MedHelper."
    }
  ];

  const projects = [
    {
      title: "MedHelper: Health & Medication Assistant",
      description: "A Google Home application to manage medication schedules. Integrated OAuth2 for cloud storage linking 5,000+ active users.",
      problem: "Elderly patients often forget medication schedules, and existing apps required complex manual entry, leading to low adherence.",
      solution: "Developed a voice-activated Google Assistant action using Python and Dialogflow. Implemented secure OAuth2 linking to allow users to sync data across devices seamlessly.",
      tags: ["Google Assistant", "IoT", "Cloud", "OAuth2"],
      techStackIcons: [{name:"Google Cloud", slug:"googlecloud"}, {name:"Python", slug:"python"}, {name:"OAuth", slug:"auth0"}],
      metrics: "Reduced missed doses by 30%",
      recognition: "Earned Google Recognition & $5K Cloud Credits",
      color: isDark ? "from-blue-500 to-indigo-500" : "from-blue-600 to-indigo-600",
      icon: <BrainCircuit size={48} />,
      image: "/medhelper-thumbnail.jpg"
    },
    {
      title: "Smart Campus IoT System",
      description: "Real-time location tracking system for students using IoT devices. Automated admin tasks like attendance and library management.",
      problem: "Campus administration relied on manual attendance and tracking, which was time-consuming (20+ hrs/week) and prone to errors.",
      solution: "Built an IoT network using RFID sensors and a centralized web dashboard. Automated data flow from sensors to a SQL database for real-time monitoring.",
      tags: ["IoT", "Web Development", "Real-time Data"],
      techStackIcons: [{name:"SQL", slug:"mysql"}, {name:"Arduino", slug:"arduino"}, {name:"React", slug:"react"}],
      metrics: "Cut repetitive task time by 25%",
      recognition: "1st Prize @ Mind's Eye Exhibition",
      color: isDark ? "from-emerald-500 to-teal-500" : "from-emerald-600 to-teal-600",
      icon: <Server size={48} />
    }
  ];

  const certifications = [
    "Microsoft Certified: Azure Data Engineer Associate",
    "Microsoft Certified: Azure AI Engineer Associate",
    "Google Certified: Professional Data Engineer",
    "Google Certified: Professional ML Engineer",
    "Microsoft Certified: Power BI Data Analyst Associate"
  ];

  // --- ANALYTICS DATA ---
  const impactMetrics = [
    { label: "Query Latency", value: "30%", trend: "down", color: "text-green-500" },
    { label: "Manual Hours", value: "25%", trend: "down", color: "text-blue-500" },
    { label: "Adoption Rate", value: "15%", trend: "up", color: "text-purple-500" },
    { label: "Setup Time", value: "40%", trend: "down", color: "text-cyan-500" }
  ];

  const skillDistribution = [
    { label: "Analytics", value: 90 },
    { label: "Visualization", value: 90 },
    { label: "Data Engineering", value: 90 },
    { label: "Cloud Arch.", value: 80 },
  ];

  const codeLines = [
    { label: "name:", color: "text-slate-400", valColor: "text-green-400", val: "'Shubham Choudhary'," },
    { label: "status:", color: "text-slate-400", valColor: "text-green-400", val: "'Open to Opportunities'," },
    { label: "noticePeriod:", color: "text-slate-400", valColor: "text-cyan-400", val: "'Immediate'," },
    { label: "email:", color: "text-slate-400", valColor: "text-slate-200", val: "'shubhxm.ai@gmail.com'," },
    { label: "location:", color: "text-slate-400", valColor: "text-yellow-200", val: "'Mumbai, India'," },
    { label: "experience:", color: "text-slate-400", valColor: "text-orange-400", val: "4,", comment: "// years" },
    { label: "tools:", color: "text-slate-400", valColor: "text-slate-400", val: "['SQL', 'Python', 'Azure']," },
    { label: "complexData:", color: "text-slate-400", valColor: "text-blue-400", val: "'Simplified'," },
    { label: "bugs:", color: "text-slate-400", valColor: "text-red-400", val: "undefined" }
  ];

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen selection:bg-cyan-500/30 font-sans transition-colors duration-300 relative`}>
      
      {/* Background Texture Grid */}
      <div className={`absolute inset-0 z-0 pointer-events-none ${theme.bgTexture}`} style={{ backgroundSize: '30px 30px' }}></div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-[60]" style={{ width: `${scrollProgress * 100}%` }} />

      {/* NEW: Back To Top Button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-2xl z-50 transition-all duration-300 hover:scale-110 focus:outline-none ${isDark ? 'bg-cyan-500 text-slate-900 shadow-cyan-500/30 hover:bg-cyan-400' : 'bg-cyan-600 text-white shadow-cyan-600/30 hover:bg-cyan-500'} animate-fade-in-up`}
          aria-label="Back to Top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Modal Injection */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        theme={theme}
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? `${theme.navBg} backdrop-blur-md border-b py-4` : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center">
          <a href="#home" className="text-lg font-bold font-mono hover:scale-105 transition-transform cursor-pointer flex items-center whitespace-nowrap shrink-0">
            <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mr-1`}>&lt;</span>
            <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>Port</span>
            <span className={isDark ? 'text-blue-500' : 'text-blue-600'}>folio</span>
            <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} ml-1`}>/&gt;</span>
          </a>

          <div className="hidden md:flex items-center gap-8 ml-14 mr-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${activeSection === link.name.toLowerCase() ? theme.accentText : `${theme.textSecondary} hover:${theme.accentText}`}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full ${activeSection === link.name.toLowerCase() ? 'w-full' : ''}`}></span>
              </a>
            ))}
          </div>
            
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a 
              href="/resume.pdf" 
              download="Shubham_Choudhary_Resume.pdf"
              className={`px-5 py-2 text-sm font-bold ${isDark ? 'text-slate-900 bg-cyan-400 hover:bg-cyan-300' : 'text-white bg-cyan-600 hover:bg-cyan-500'} rounded-full transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-2 focus:outline-none cursor-pointer`}
            >
              Resume <Download size={16} />
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4 ml-auto">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full focus:outline-none ${isDark ? 'text-yellow-400' : 'text-slate-600'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`focus:outline-none ${theme.textSecondary}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-300'} border-b p-6 flex flex-col gap-4 shadow-2xl animate-fade-in-down`}>
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`${theme.textSecondary} hover:${theme.accentText} block py-2 font-medium`}
              >
                {link.name}
              </a>
            ))}
            <a href="/resume.pdf" download className={`w-full py-3 mt-2 ${isDark ? 'text-slate-900 bg-cyan-400' : 'text-white bg-cyan-600'} rounded-lg font-bold focus:outline-none text-center block`}>
              Download Resume
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden z-10">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] animate-pulse-slow ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/20'}`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[100px] animate-pulse-slow delay-700 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/20'}`} />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="reveal-on-scroll">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-600/10 border-green-600/20 text-green-700'} text-sm mb-6 transition-colors cursor-default`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-green-500' : 'bg-green-600'}`}></span>
              </span>
              Available for new opportunities
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Turning data into <br />
              <span className={`bg-gradient-to-r ${theme.gradientTitle} bg-clip-text text-transparent bg-300% animate-gradient`}>
                decisions.
              </span>
            </h1>
            <p className={`text-lg ${theme.textSecondary} mb-8 max-w-lg leading-relaxed`}>
              {personalInfo.bio}
            </p>
            <div className="flex gap-4">
              <a href="#projects" className={`group px-6 py-3 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'} font-bold rounded-lg transition-all flex items-center gap-2 focus:outline-none`}>
                View Projects 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className={`px-6 py-3 border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'} rounded-lg transition-all font-medium focus:outline-none`}>
                Contact Me
              </a>
            </div>
            
            <div className={`mt-12 flex gap-6 ${theme.textSecondary} items-center`}>
              <a href={personalInfo.linkedin} className={`hover:${theme.accentText} hover:scale-110 transition-all duration-300 focus:outline-none`} title="LinkedIn"><Linkedin size={28} /></a>
              <a href={`mailto:${personalInfo.email}`} className={`hover:text-purple-500 hover:scale-110 transition-all duration-300 focus:outline-none`} title="Email"><Mail size={28} /></a>
              <span className={`text-sm font-mono border-l ${isDark ? 'border-slate-700' : 'border-slate-300'} pl-6`}>{personalInfo.location}</span>
            </div>
          </div>

          <div className="relative hidden md:block reveal-on-scroll delay-200">
            {/* Code Block Card with Gradient Border */}
            <div className={`relative rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-[1.02] group`}>
                <div className={`relative z-10 ${theme.codeBlock} rounded-2xl p-6 h-full backdrop-blur-xl`}>
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 group-hover:bg-red-400 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 group-hover:bg-yellow-400 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-green-500 group-hover:bg-green-400 transition-colors" />
                    </div>
                    {/* Fixed: Switched to overflow-x-auto and whitespace-nowrap for authentic code editor scrolling */}
                    <div className="space-y-3 font-mono text-sm min-h-[300px] overflow-x-auto scrollbar-hide">
                        <div className="flex whitespace-nowrap">
                        <span className="text-purple-400 mr-2">const</span>
                        <span className="text-blue-400 mr-2">analyst</span>
                        <span className="text-slate-400">=</span>
                        <span className="text-slate-400 ml-2">{'{'}</span>
                        <span className="text-xs text-slate-500 ml-auto self-center px-2 border border-slate-700 rounded">profile.ts</span>
                        </div>
                        <div className="flex mt-2">
                            <div className="flex flex-col text-slate-600 text-right pr-4 select-none">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <span key={i}>{i + 1}</span>
                                ))}
                            </div>
                            <div className="flex-1">
                                {codeLines.map((line, idx) => (
                                    <div key={idx} className="flex whitespace-nowrap">
                                        <span className={`${line.color} mr-2 shrink-0`}>{line.label}</span>
                                        <span className={`${line.valColor}`}>
                                            <Typewriter text={line.val} delay={30} startDelay={500 + (idx * 800)} />
                                        </span>
                                        {line.comment && (
                                            <span className="text-slate-600 ml-2 shrink-0">
                                                <Typewriter text={line.comment} delay={20} startDelay={1000 + (idx * 800)} />
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div className="text-slate-400">{'}'}; <span className="text-slate-200 cursor-blink">|</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-2xl blur-2xl opacity-20 -z-10 animate-pulse-slow`} />
          </div>
        </div>
        
        {/* Scroll Down Arrow - REMOVED PADDING p-2 to fix 'rectangle' issue */}
        <a href="#workflow" className={`absolute bottom-10 left-1/2 -translate-x-1/2 ${theme.textSecondary} hover:${theme.text} animate-bounce cursor-pointer focus:outline-none`}>
          <ChevronDown size={24} />
        </a>
      </section>

      {/* NEW: My Workflow Section */}
      <section id="workflow" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 reveal-on-scroll">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
               <Lightbulb className="text-yellow-500" /> My Workflow
            </h2>
            <div className={`w-20 h-1 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full mb-4`} />
             <p className={theme.textSecondary}>From raw data to actionable insights: my process for solving problems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
             <div className={`hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 -z-10`}></div>

             {workflowSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col items-center text-center group reveal-on-scroll`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                   <div className={`w-24 h-24 rounded-full ${theme.cardBg} border ${theme.borderColor} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <div className={`${theme.accentText} group-hover:scale-110 transition-transform`}>
                        {step.icon}
                      </div>
                      {/* Step Number Badge */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${isDark ? 'bg-slate-800 text-cyan-400' : 'bg-white text-cyan-600'} border ${theme.borderColor} flex items-center justify-center font-bold text-sm`}>
                        {idx + 1}
                      </div>
                   </div>
                   <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>{step.title}</h3>
                   <p className={`text-sm ${theme.textSecondary} max-w-[200px]`}>{step.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* About & Skills Section - UPDATED WITH VISUAL TECH STACK */}
      <section id="about" className={`py-20 relative z-10 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Expertise</h2>
            <div className={`w-20 h-1 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full`} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skillGroup, idx) => (
              <div 
                key={skillGroup.category}
                className={`relative group rounded-2xl p-[1px] overflow-hidden transition-all duration-500 hover:-translate-y-2 reveal-on-scroll ${theme.cardBorder}`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`relative h-full ${theme.cardInner} p-6 rounded-2xl backdrop-blur-md`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.accentText} mb-4 ${isDark ? 'bg-slate-800 group-hover:bg-cyan-500/10' : 'bg-slate-100 group-hover:bg-cyan-600/10'} transition-all duration-300`}>
                    {skillGroup.icon}
                    </div>
                    <h3 className={`text-xl font-semibold mb-6 group-hover:${theme.accentText} transition-colors`}>{skillGroup.category}</h3>
                    
                    {/* Visual Grid for Skills */}
                    <div className="grid grid-cols-3 gap-3">
                        {skillGroup.items.map((skill) => (
                            <div key={skill.name} className={`flex flex-col items-center justify-center p-2 rounded-lg border ${theme.navBg} hover:bg-white/5 transition-colors group/skill`}>
                                {skill.slug ? (
                                    <img 
                                        // Removed color filter to show original brand colors
                                        src={`https://cdn.simpleicons.org/${skill.slug}`} 
                                        alt={skill.name}
                                        className="w-6 h-6 mb-2 opacity-80 group-hover/skill:opacity-100 transition-opacity"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className={`mb-2 opacity-80 group-hover/skill:opacity-100 transition-opacity ${theme.text}`}>
                                        {skill.icon || <Code2 size={24} />}
                                    </div>
                                )}
                                <span className={`text-[10px] font-medium text-center ${theme.textSecondary} group-hover/skill:${theme.text}`}>{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Analytics Section */}
      <section id="analytics" className={`py-20 relative z-10 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
               <PieChart className="text-cyan-500" /> Portfolio Analytics
            </h2>
            <div className={`w-20 h-1 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full mb-4`} />
            <p className={theme.textSecondary}>A data-driven view of my professional impact and skill distribution.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Chart 1: Impact Metrics (Circular Cards) */}
             <div className={`p-6 rounded-2xl border ${theme.cardBorder} ${theme.cardInner} reveal-on-scroll`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                   <TrendingUp size={20} className="text-green-500" /> Impact Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   {impactMetrics.map((metric, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border ${theme.navBg} hover:border-cyan-500/30 transition-colors group relative`}
                      >
                        {/* Custom Tooltip on Hover - Re-added per user request (removed 'title' attribute to fix grey box) */}
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {metric.value} improvement in {metric.label}
                         </div>
                         <div className={`text-2xl font-bold mb-1 ${metric.color}`}>{metric.value}</div>
                         <div className={`text-xs ${theme.textSecondary} uppercase tracking-wider mb-2`}>{metric.label}</div>
                         <div className="w-full bg-slate-700/30 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${metric.color.replace('text', 'bg')} w-0 group-hover:w-full transition-all duration-1000 ease-out`} style={{width: '85%'}}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Chart 2: Skill Distribution (Animated Bars) */}
             <div className={`p-6 rounded-2xl border ${theme.cardBorder} ${theme.cardInner} reveal-on-scroll`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                   <Activity size={20} className="text-purple-500" /> Skill Proficiency
                </h3>
                <div className="space-y-5">
                   {skillDistribution.map((skill, idx) => (
                      <div key={idx} className="group relative">
                          {/* Custom Tooltip on Hover - Re-added per user request (removed 'title' attribute to fix grey box) */}
                         <div className="absolute -top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {skill.value}% Proficiency
                         </div>
                         <div className="flex justify-between text-sm mb-2">
                            <span className={theme.text}>{skill.label}</span>
                            <span className={theme.textSecondary}>{skill.value}%</span>
                         </div>
                         <div className="w-full bg-slate-700/30 h-2.5 rounded-full overflow-hidden">
                            <div 
                               className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 animate-slide-right`}
                               style={{ 
                                   width: `${skill.value}%`,
                                   animation: `slideRight 1s ease-out forwards ${idx * 0.2}s`
                               }}
                            ></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={`py-20 relative z-10 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/50'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 text-center reveal-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
            <p className={theme.textSecondary}>Proven track record of innovation at Accenture.</p>
          </div>

          <div className={`space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b ${isDark ? 'before:from-transparent before:via-slate-700 before:to-transparent' : 'before:from-transparent before:via-slate-300 before:to-transparent'}`}>
            {experience.map((job, index) => (
              <div 
                key={job.id} 
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group reveal-on-scroll"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                
                {/* Timeline Dot */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${isDark ? 'border-slate-950 bg-slate-800' : 'border-slate-50 bg-white'} ${isDark ? 'group-hover:bg-cyan-500' : 'group-hover:bg-cyan-600'} transition-colors duration-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg relative z-10`}>
                   <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} opacity-0 group-hover:animate-ping`}></div>
                </div>
                
                {/* Content Card with Gradient Border */}
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] relative p-[1px] rounded-2xl overflow-hidden group-hover:-translate-y-1 transition-all duration-500 ${theme.cardBorder}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`relative ${theme.cardInner} p-6 rounded-2xl backdrop-blur-md h-full`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                            <h3 className={`font-bold text-lg group-hover:${theme.accentText} transition-colors`}>{job.role}</h3>
                            <span className={`text-xs font-mono ${theme.accentText} ${theme.accentBg} px-2 py-1 rounded border ${isDark ? 'border-cyan-500/20' : 'border-cyan-600/20'}`}>{job.period}</span>
                        </div>
                        <div className={`${theme.textSecondary} font-medium mb-3 flex items-center gap-2`}>
                            {job.company}
                        </div>
                        <p className={`${theme.textSecondary} text-sm leading-relaxed mb-4`}>
                            {job.description}
                        </p>
                        
                        <ul className="space-y-2 mb-4">
                            {job.achievements.map((achievement, i) => (
                            <li key={i} className={`flex gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                <span className={`${theme.accentText} mt-1`}>▹</span>
                                {achievement}
                            </li>
                            ))}
                        </ul>

                        <div className={`flex flex-wrap gap-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                            {job.tech.map(t => (
                            <span key={t} className={`text-xs ${theme.textSecondary} border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'} px-2 py-0.5 rounded transition-colors`}>
                                {t}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Education Section */}
      <section id="education" className={`py-20 ${theme.bg} relative z-10`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
               <GraduationCap className="text-cyan-500" /> Education
            </h2>
            <div className={`w-20 h-1 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full mb-4`} />
            <p className={theme.textSecondary}>Academic background and qualifications.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {education.map((edu, idx) => (
                <div 
                  key={idx}
                  className={`relative p-[1px] rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 reveal-on-scroll ${theme.cardBorder}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                   <div className={`relative flex flex-col p-6 rounded-2xl ${theme.cardInner} h-full`}>
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className={`text-xl font-bold ${theme.accentText}`}>{edu.degree}</h3>
                            <p className={`text-sm font-medium ${theme.text}`}>{edu.field}</p>
                         </div>
                         <span className={`text-xs font-mono px-2 py-1 rounded ${theme.skillTag}`}>{edu.period}</span>
                      </div>
                      <div className={`mt-auto text-sm ${theme.textSecondary}`}>
                         <p className="font-semibold">{edu.school}</p>
                         <p>{edu.grade}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className={`py-20 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/50'} relative z-10`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 reveal-on-scroll">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications & Awards</h2>
             <p className={theme.textSecondary}>Validated expertise and recognition.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
             {/* Certifications Column */}
             <div className="space-y-6 reveal-on-scroll">
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                   <CheckCircle2 className="text-green-500" /> Certifications
                </h3>
                <div className="grid gap-4">
                   {certifications.map((cert, idx) => (
                      <div 
                        key={idx}
                        className={`relative p-[1px] rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${theme.cardBorder}`}
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <div className={`relative flex items-center gap-4 p-4 rounded-xl ${theme.cardInner} h-full`}>
                              <div className={`p-2 ${theme.accentBg} rounded-lg ${theme.accentText} shrink-0`}>
                                  <CheckCircle2 size={20} />
                              </div>
                              <span className={`font-medium text-sm ${theme.text}`}>{cert}</span>
                          </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Awards Column */}
             <div className="space-y-6 reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                   <Trophy className="text-yellow-500" /> Honors & Awards
                </h3>
                <div className="grid gap-4">
                   {awards.map((award, idx) => (
                      <div 
                        key={idx}
                        className={`relative p-[1px] rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${theme.cardBorder}`}
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <div className={`relative flex flex-col p-5 rounded-xl ${theme.cardInner} h-full`}>
                              <div className="flex justify-between items-start mb-2">
                                 <span className={`font-bold text-sm ${theme.text}`}>{award.title}</span>
                                 {/* Updated background color for date badge: Cyan instead of slate/grey */}
                                 <span className={`text-xs font-mono ${theme.accentText} ${theme.accentBg} px-2 py-1 rounded`}>{award.date}</span>
                              </div>
                              <div className={`text-xs font-semibold ${theme.textSecondary} mb-2`}>{award.issuer}</div>
                              <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>"{award.desc}"</p>
                          </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Projects Section - UPDATED WITH MODAL TRIGGER */}
      <section id="projects" className={`py-20 relative z-10 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16 reveal-on-scroll">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Impactful Projects</h2>
              <div className={`w-20 h-1 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'} rounded-full`} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className={`relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col group reveal-on-scroll ${theme.cardBorder}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`relative ${theme.cardInner} rounded-2xl overflow-hidden h-full flex flex-col backdrop-blur-md`}>
                    {/* Mock Image Gradient with Zoom Effect */}
                    <div className={`h-48 w-full bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-100 transition-all duration-500 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    
                    {/* Updated Image Logic */}
                    {project.image ? (
                        <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all duration-500 bg-black/10 backdrop-blur-[2px] group-hover:backdrop-blur-none">
                        <div className="text-white drop-shadow-lg transform group-hover:scale-125 transition-transform duration-500 ease-out">
                            {project.icon}
                        </div>
                        </div>
                    )}
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col relative">
                        <h3 className={`text-xl font-bold mb-2 group-hover:${theme.accentText} transition-colors flex items-center gap-2`}>
                            {project.title}
                            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </h3>
                        <p className={`${theme.textSecondary} text-sm mb-4 line-clamp-3`}>{project.description}</p>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex -space-x-2">
                                {project.tags.slice(0, 3).map(tag => (
                                    <div key={tag} className={`w-6 h-6 rounded-full ${theme.cardBg} border ${theme.navBg} flex items-center justify-center text-[10px]`} title={tag}>
                                        {tag[0]}
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setSelectedProject(project)}
                                className={`flex items-center gap-2 text-sm font-semibold ${theme.accentText} hover:underline focus:outline-none`}
                            >
                                View Case Study <Maximize2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden z-10">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDark ? 'bg-cyan-500/5' : 'hidden'} rounded-full blur-[100px]`} />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Open to New Opportunities</h2>
          <p className={`${theme.textSecondary} text-lg mb-10`}>
            I am actively seeking full-time roles in Data Engineering and Analytics. If you are building a team that values scalable frameworks and data-driven decisions, let's connect.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <a 
              href={`mailto:${personalInfo.email}`}
              className={`group px-8 py-4 ${isDark ? 'bg-cyan-500 text-slate-900' : 'bg-cyan-600 text-white'} font-bold rounded-lg hover:bg-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 flex items-center gap-2 focus:outline-none`}
            >
              <Mail size={20} className="group-hover:-translate-y-1 transition-transform" /> Email Me
            </a>
            <a 
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`group px-8 py-4 ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'} font-bold rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-300'} transition-all border ${isDark ? 'border-white/5' : 'border-slate-300'} flex items-center gap-2 focus:outline-none`}
            >
              <Linkedin size={20} className="group-hover:-translate-y-1 transition-transform" /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className={`py-8 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'} border-t text-center ${theme.textSecondary} text-sm relative z-10`}>
        <div className="flex justify-center gap-6 mb-4">
          <a href={personalInfo.linkedin} className={`hover:${theme.accentText} transition-colors`}><Linkedin size={20} /></a>
          <a href={`mailto:${personalInfo.email}`} className={`hover:text-purple-500 transition-colors`}><Mail size={20} /></a>
        </div>
        <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
      </footer>

      {/* Tailwind Custom Styles for animations that aren't defaults */}
      <style>{`
        html {
            scroll-behavior: smooth;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-300% {
          background-size: 300% 300%;
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUp 0.7s ease-out forwards;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .cursor-blink {
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        .bg-grid-white\/\[0\.05\] {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(255,255,255,0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .bg-grid-black\/\[0\.05\] {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(0,0,0,0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideRight {
            from { width: 0; }
        }
        .animate-slide-right {
            animation: slideRight 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;