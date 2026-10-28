/**
 * Vishal Nagarajan - Portfolio & CRM Data Store
 * Default projects, experience, publications, certifications, and baseline state
 */

const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Vishal Nagarajan",
    title: "Embedded Software Engineer",
    subtitle: "Firmware • Safety-Critical Systems • Microcontrollers • CAN Bus",
    location: "Coimbatore, Tamil Nadu, India",
    email: "vishalnagarajan.work@gmail.com",
    linkedin: "https://linkedin.com/in/vakxee",
    instagram: "https://instagram.com/vishalnagarajan_",
    github: "https://github.com",
    bio: "Electronics & Communication Engineering graduate specializing in embedded software development, real-time firmware, and hardware-software integration. Proven experience at Hindustan Aeronautics Limited (HAL) optimizing avionics algorithms and enforcing MISRA C compliance. Independent developer of 13+ embedded hardware/software prototypes with custom PCB design and CAN/I2C/SPI bus integration. Multi-instrumentalist musician (bassist, keyboardist, flutist) with Sargam The Band.",
    status: "Open for Full-time Roles & Embedded Engineering Projects",
    stats: [
      { label: "Prototypes Built", value: "13+" },
      { label: "Silicon Architectures", value: "5+" },
      { label: "Buses & Protocols", value: "4+" },
      { label: "Peer-Reviewed Papers", value: "1" }
    ]
  },

  publications: [
    {
      id: "pub-inti-2026",
      title: "Real-Time Fault Detection in Microcontrollers",
      authors: "Dr. M. Ezhilarasi & Vishal Nagarajan",
      year: "2026",
      journal: "INTI Journal",
      volume: "2026",
      pages: "224",
      doi: "10.61453/INTIj.20260227",
      doiUrl: "https://doi.org/10.61453/INTIj.20260227",
      citation: "Ezhilarasi, M. & Nagarajan, Vishal. (2026). Real-Time Fault Detection in Microcontrollers. INTI Journal. 2026. 224. 10.61453/INTIj.20260227.",
      abstract: "Microcontroller-based embedded systems deployed in automotive, aerospace, and industrial environments demand stringent fault detection mechanisms to prevent catastrophic systemic failure. This paper presents an active real-time fault identification platform engineered with ESP32-CAM visual monitoring and Arduino supervisory co-processors. The architecture benchmarks soft real-time system performance under induced physical electrical glitches and logical execution anomalies, validating resilient fault isolation and deterministic recovery behaviors.",
      bibtex: `@article{ezhilarasi2026realtime,
  author    = {Ezhilarasi, M. and Nagarajan, Vishal},
  title     = {Real-Time Fault Detection in Microcontrollers},
  journal   = {INTI Journal},
  volume    = {2026},
  pages     = {224},
  year      = {2026},
  doi       = {10.61453/INTIj.20260227}
}`
    }
  ],

  experience: [
    {
      id: "exp-hal-avionics",
      role: "Avionics Software Intern",
      organization: "Hindustan Aeronautics Limited (HAL)",
      location: "Bengaluru, Karnataka",
      period: "Jan 2024 – Feb 2024",
      badge: "Defense & Aerospace Avionics",
      type: "Internship",
      highlights: [
        "Optimized safety-critical embedded software algorithms, reducing processing latency by 1.04 seconds through algorithmic refactoring and memory alignment.",
        "Applied MISRA C safety coding guidelines to mission-critical embedded C firmware, significantly reducing undefined runtime states.",
        "Collaborated with aerospace engineering teams on research and system-level validation for the Terrain Avoidance Warning System (TAWS).",
        "Gained deep operational exposure to military avionics architectures, deterministic embedded software, and strict DO-178B/C safety frameworks."
      ]
    },
    {
      id: "exp-independent-dev",
      role: "Independent Embedded Systems Developer",
      organization: "Self-Employed / Freelance Engineering",
      location: "Coimbatore, Tamil Nadu",
      period: "Feb 2024 – Present",
      badge: "13 Prototypes Delivered • ₹1.5L Revenue",
      type: "Consulting & Development",
      highlights: [
        "Independently designed, engineered, and delivered 13 technical prototypes (7 hardware devices, 6 software/firmware suites) across IoT, robotics, and industrial sensing.",
        "Designed 2 custom 2-layer PCBs and fabricated multiple hardware integration prototypes using STM32, ESP32, Arduino, and Raspberry Pi platforms.",
        "Interfaced diverse camera modules, analog/digital sensor arrays, and automotive/industrial buses (CAN, I²C, SPI, UART).",
        "Managed end-to-end engineering lifecycles generating over ₹1.5 Lakh in commercial development revenue."
      ]
    }
  ],

  projects: [
    {
      id: "skyclean-robot",
      title: "SKYCLEAN: Low-Cost Window Cleaning Robot",
      category: "robotics",
      categoryLabel: "Robotics & Automation",
      date: "May 2025",
      badge: "Top 5 @ TECHgium LTTS (4,000+ Teams)",
      featured: true,
      summary: "Designed a high-reliability, low-cost window-cleaning robot utilizing BLDC-driven vacuum suction and dual-axis vertical wall-climbing locomotion.",
      description: "Designed and engineered an automated vertical wall-climbing robotic system for commercial and residential facade maintenance. The robot integrates a high-RPM BLDC impeller for negative-pressure vacuum adhesion coupled with high-traction omni-directional drive wheels. Features a dedicated manual control console for remote operator intervention and deterministic emergency fail-safe mechanics.",
      hardware: ["BLDC Motor & ESC", "Arduino Microcontroller", "RF Transceiver", "Custom Chassis", "Vacuum Chamber"],
      protocols: ["PWM", "UART", "RF 433MHz"],
      highlights: [
        "Ranked Top 5 among 4,000+ national engineering teams in TECHgium 8th Edition conducted by L&T Technology Services (LTTS).",
        "Engineered negative-pressure airflow dynamics delivering 4.5kg vertical adhesion with safety tether interlock.",
        "Programmed smooth PWM motor acceleration curves for stability and reduced mechanical vibration on vertical glass."
      ],
      githubUrl: "",
      demoUrl: ""
    },
    {
      id: "rfid-campus-ecosystem",
      title: "Unified RFID Smart Campus Ecosystem & Digital Wallet",
      category: "iot",
      categoryLabel: "IoT & Systems",
      date: "Feb 2025",
      badge: "Production Prototype",
      featured: true,
      summary: "Transformed student ID cards into a campus-wide multi-utility infrastructure spanning identity, bus attendance, self-service library, and contactless wallet payments.",
      description: "Architected an end-to-end distributed campus IoT ecosystem. Upgraded standard student RFID smartcards into a multi-application credential. Engineered a standalone self-service library checkout terminal combining high-frequency RFID reading with optical 1D/2D barcode scanners for instant zero-queue book issuing/returning. Extended the system to bus route attendance and an integrated food-court POS wallet backed by Razorpay online recharge.",
      hardware: ["ESP32 NodeMCU", "RC522 / EM-18 RFID Modules", "Barcode Scanner Module", "OLED Display", "POS Terminal"],
      protocols: ["SPI", "I²C", "UART", "HTTPS / REST API"],
      highlights: [
        "Built self-service library terminal reducing book issue transaction time from 2 minutes to under 5 seconds.",
        "Engineered Razorpay payment gateway integration for automated student account reloads and real-time ledger debit at campus food courts.",
        "Synchronized transit and classroom attendance logs to centralized database with offline caching during connectivity loss."
      ],
      githubUrl: "",
      demoUrl: ""
    },
    {
      id: "fault-detection-mcu",
      title: "Real-Time Microcontroller Fault Detection Platform",
      category: "safety",
      categoryLabel: "Firmware & Safety Diagnostics",
      date: "May 2024",
      badge: "Peer-Reviewed Publication (INTI Journal)",
      featured: true,
      summary: "Hardware-in-the-loop diagnostic harness for detecting physical and logical anomalies in real-time microcontroller architectures.",
      description: "Researched and built a dedicated diagnostic platform to investigate physical electrical failures (brownouts, clock jitter) and logical execution faults (memory stack overflow, watchdog timeouts) in embedded microcontrollers. Leveraged an ESP32-CAM for visual telemetry and an auxiliary Arduino co-processor to log deterministic soft real-time failure curves.",
      hardware: ["ESP32-CAM", "Arduino Uno / Nano", "Logic Interfacing", "Power Glitch Circuitry"],
      protocols: ["UART", "SPI", "GPIO Bit-banging"],
      highlights: [
        "Published research in INTI Journal (DOI: 10.61453/INTIj.20260227).",
        "Implemented deterministic heartbeat and memory integrity verification routines in Embedded C.",
        "Benchmarked recovery latency and fail-safe interrupt transition states under simulated electrical glitches."
      ],
      githubUrl: "",
      demoUrl: "https://doi.org/10.61453/INTIj.20260227"
    },
    {
      id: "buckle-up-car-safety",
      title: "Buckle Up: Automotive Safety Interlock & CAN Bus System",
      category: "automotive",
      categoryLabel: "Automotive & CAN Protocol",
      date: "Jun 2023",
      badge: "Top 5 @ SAFETYTHON Hackathon",
      featured: true,
      summary: "Automotive starter-relay interlock enforcing multi-point seatbelt compliance via real-time Controller Area Network (CAN) bus telemetry.",
      description: "Designed a vehicular active-safety interlock system that prevents engine cranking unless driver and passenger seatbelts are securely latched. Built using a PIC microcontroller with an MCP2515 CAN controller and MCP2551 transceiver to broadcast seatbelt telemetry across an automotive CAN network bus.",
      hardware: ["PIC18F / PIC16F Microcontroller", "MCP2515 CAN Controller", "MCP2551 Transceiver", "Automotive Relay Modules", "Hall-effect Buckle Sensors"],
      protocols: ["CAN 2.0B (500 kbps)", "SPI", "ADC"],
      highlights: [
        "Placed Top 5 at SAFETYTHON — Road Safety Hackathon conducted by Kumaraguru College of Technology.",
        "Programmed deterministic CAN message arbitration and cyclical telemetry broadcasts adhering to automotive frame standards.",
        "Engineered fail-safe bypass override with tamper-detection to prevent relay manipulation."
      ],
      githubUrl: "",
      demoUrl: ""
    },
    {
      id: "independent-prototypes",
      title: "Commercial Embedded Systems & IoT Engineering Suite",
      category: "freelance",
      categoryLabel: "Commercial Hardware & Freelance",
      date: "Feb 2024 - Present",
      badge: "13 Prototypes • ₹1.5L Revenue Generated",
      featured: false,
      summary: "End-to-end engineering of 13 independent prototypes (7 hardware, 6 software) with 2 custom PCB designs across computer vision, IoT, and industrial automation.",
      description: "Operated as an independent embedded systems engineering consultant. Handled full project lifecycles: schematic design, component sourcing, firmware architecture, breadboard/PCB fabrication, testing, and client delivery. Successfully engineered solutions for clients generating ₹1.5 Lakhs in commercial revenue.",
      hardware: ["STM32 (ARM Cortex-M)", "ESP32", "Raspberry Pi 4", "Custom 2-Layer PCBs", "Thermal/Optical Sensors"],
      protocols: ["CAN", "I²C", "SPI", "UART", "MQTT", "Modbus"],
      highlights: [
        "Delivered 13 turnkey engineering prototypes spanning smart agriculture, industrial monitoring, and automation.",
        "Designed and fabricated 2 custom printed circuit boards (PCBs) in KiCad/Proteus with optimized ground planes and signal integrity.",
        "Achieved 100% on-time project completion with comprehensive technical documentation and firmware test suites."
      ],
      githubUrl: "",
      demoUrl: ""
    }
  ],

  certifications: [
    {
      id: "cert-nptel-embedded",
      title: "Introduction to Embedded System Design",
      issuer: "NPTEL (IIT)",
      date: "2024",
      badge: "Elite / Verified",
      skills: "ARM Cortex, Timers, Interrupts, Memory Architecture, Peripheral Interfacing",
      url: ""
    },
    {
      id: "cert-nptel-iiot",
      title: "Introduction to Industry 4.0 and Industrial IoT",
      issuer: "NPTEL (IIT)",
      date: "2024",
      badge: "Elite / Verified",
      skills: "IIoT Protocols, SCADA, Sensor Networks, Cloud Gateway Architecture",
      url: ""
    },
    {
      id: "cert-google-cyber",
      title: "Foundations of Cybersecurity",
      issuer: "Google",
      date: "2023",
      badge: "Google Certified",
      skills: "Threat Modeling, Network Defense, Embedded System Security Principles",
      url: ""
    }
  ],

  education: [
    {
      degree: "Bachelor of Engineering (B.E.) in Electronics and Communication Engineering",
      institution: "Sri Ramakrishna Engineering College",
      location: "Coimbatore, Tamil Nadu",
      period: "Nov 2022 – May 2026",
      score: "CGPA: 7.69 / 10.0",
      details: "Core focus on Microcontroller Architectures, Embedded Systems Design, Digital Signal Processing, VLSI, and Real-Time Operating Systems. Active in collegiate technical clubs and hackathons."
    }
  ],

  achievements: [
    {
      title: "Top 5 Finalist — TECHgium 8th Edition",
      organization: "L&T Technology Services (LTTS)",
      date: "2025",
      detail: "Selected as Top 5 out of 4,000+ engineering teams nationwide for the SkyClean wall-climbing robotics innovation."
    },
    {
      title: "Top 5 — SAFETYTHON Road Safety Hackathon",
      organization: "Kumaraguru College of Technology",
      date: "Apr 2023",
      detail: "Recognized for Buckle Up automotive CAN bus starter safety interlock prototype."
    },
    {
      title: "1st Place — Technical Paper Presentation",
      organization: "Dept. of Science & Humanities, SREC",
      date: "2023",
      detail: "Awarded 1st place for novel research on embedded microcontroller telemetry."
    },
    {
      title: "Multi-Instrumentalist — Sargam The Band",
      organization: "Indie Musical Collective",
      date: "2024 – Present",
      detail: "Bassist, keyboardist, and classical flutist performing live indie productions, contemporary acoustic arrangements, and regional festivals."
    },
    {
      title: "Joint Secretary & Music Director — Fine Arts Club",
      organization: "Sri Ramakrishna Engineering College",
      date: "2024 – 2025",
      detail: "Directed and conducted 10+ live musical productions and college showcases, including flagship institutional mega-events 'Swagatham' and 'Elatio'."
    },
    {
      title: "Executive Member — Social Innovation Club (SIC)",
      organization: "Sri Ramakrishna Engineering College",
      date: "2024 – 2025",
      detail: "Spearheaded grassroots engineering solutions for rural community electrification and accessibility prototypes."
    }
  ],

  skills: {
    programming: [
      { name: "Embedded C", level: 95, tag: "Primary" },
      { name: "C++ / OOP", level: 90, tag: "Firmware" },
      { name: "C (C99/C11)", level: 92, tag: "Systems" },
      { name: "Python", level: 82, tag: "Automation" },
      { name: "Verilog HDL", level: 75, tag: "Digital Logic" },
      { name: "MISRA C:2012", level: 88, tag: "Safety-Critical" }
    ],
    protocols: [
      { name: "CAN Bus 2.0B", level: 90, desc: "Automotive frame arbitration & telemetry" },
      { name: "UART / USART", level: 95, desc: "Serial debug & sensor streaming" },
      { name: "SPI Protocol", level: 92, desc: "High-speed displays & flash memory" },
      { name: "I²C (Standard/Fast)", level: 92, desc: "Inter-IC sensor arrays & RTC" },
      { name: "PWM / Timers", level: 94, desc: "Motor drive & power modulation" },
      { name: "MQTT / HTTP", level: 85, desc: "IoT telemetry & cloud sync" }
    ],
    hardware: [
      { name: "STM32 (ARM Cortex-M)", desc: "STM32F4/F1 series, HAL & Low-Layer" },
      { name: "ESP32 / ESP8266", desc: "Dual-core RTOS, Wi-Fi/BLE, ESP32-CAM" },
      { name: "PIC Microcontrollers", desc: "PIC16F / PIC18F microcontrollers" },
      { name: "Arduino Platforms", desc: "Uno, Nano, Mega, Pro Mini" },
      { name: "Raspberry Pi", desc: "Linux embedded single-board computing" },
      { name: "Custom PCB Design", desc: "KiCad / Proteus 2-layer schematic & layout" }
    ],
    tools: [
      "Keil µVision",
      "STM32CubeIDE",
      "Arduino IDE",
      "Proteus VSM",
      "MATLAB / Simulink",
      "Git / GitHub",
      "Oscilloscope / Logic Analyzer",
      "Postman",
      "VS Code",
      "KiCad EDA"
    ]
  }
};

// Initial Clean CRM Leads (Empty for production release)
const DEFAULT_CRM_LEADS = [];

// LocalStorage Keys
const STORAGE_KEYS = {
  PROJECTS: "vishal_portfolio_projects_v2",
  EXPERIENCE: "vishal_portfolio_experience_v2",
  PUBLICATIONS: "vishal_portfolio_publications_v2",
  CERTIFICATIONS: "vishal_portfolio_certifications_v2",
  SKILLS: "vishal_portfolio_skills_v2",
  LEADS: "vishal_portfolio_crm_leads_v4_prod",
  SETTINGS: "vishal_portfolio_settings_v2"
};

function getStoredPortfolioData() {
  const localProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  const localExp = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
  const localPubs = localStorage.getItem(STORAGE_KEYS.PUBLICATIONS);
  const localCerts = localStorage.getItem(STORAGE_KEYS.CERTIFICATIONS);
  const localSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);

  return {
    ...DEFAULT_PORTFOLIO_DATA,
    projects: localProjects ? JSON.parse(localProjects) : DEFAULT_PORTFOLIO_DATA.projects,
    experience: localExp ? JSON.parse(localExp) : DEFAULT_PORTFOLIO_DATA.experience,
    publications: localPubs ? JSON.parse(localPubs) : DEFAULT_PORTFOLIO_DATA.publications,
    certifications: localCerts ? JSON.parse(localCerts) : DEFAULT_PORTFOLIO_DATA.certifications,
    skills: localSkills ? JSON.parse(localSkills) : DEFAULT_PORTFOLIO_DATA.skills
  };
}

function saveProjectsData(projectsArray) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsArray));
}

function saveExperienceData(expArray) {
  localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(expArray));
}

function savePublicationsData(pubsArray) {
  localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(pubsArray));
}

function saveCertificationsData(certsArray) {
  localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(certsArray));
}

function saveSkillsData(skillsObj) {
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skillsObj));
}

function getStoredLeads() {
  const localLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
  if (!localLeads) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(DEFAULT_CRM_LEADS));
    return DEFAULT_CRM_LEADS;
  }
  return JSON.parse(localLeads);
}

function saveLeadsData(leadsArray) {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leadsArray));
}
