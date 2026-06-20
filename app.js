// Updated main JavaScript Logic Engine for RAVAX NOVA TECHNOLOGIES website

document.addEventListener('DOMContentLoaded', () => {

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  /* ====================================================
     1. DUAL CUSTOM CURSOR TRACKER (GSAP + Lerp)
     ==================================================== */
  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');

  if (dot && ring) {
    // Hide native cursor on desktop
    document.documentElement.classList.add('md:cursor-none');

    // GSAP quickTo systems for ultimate coordinate precision
    let ringX = gsap.quickTo(ring, "x", {duration: 0.35, ease: "power3.out"});
    let ringY = gsap.quickTo(ring, "y", {duration: 0.35, ease: "power3.out"});
    let dotX = gsap.quickTo(dot, "x", {duration: 0.08, ease: "power2.out"});
    let dotY = gsap.quickTo(dot, "y", {duration: 0.08, ease: "power2.out"});

    window.addEventListener('mousemove', (e) => {
      // Offset translation coordinates (cursor is centered around coordinates)
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    });

    // Dynamic Hover expansions via event delegation
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .tech-card, .course-item, .why-card, .stat-card, [role="button"]');
      if (target) {
        dot.classList.add('cursor-active-dot');
        ring.classList.add('cursor-active-ring');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .tech-card, .course-item, .why-card, .stat-card, [role="button"]');
      if (target) {
        dot.classList.remove('cursor-active-dot');
        ring.classList.remove('cursor-active-ring');
      }
    });
  }


  /* ====================================================
     2. MOUSE SPOTLIGHT COORDINATES
     ==================================================== */
  const root = document.documentElement;
  window.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mouse-x', `${e.clientX}px`);
    root.style.setProperty('--mouse-y', `${e.clientY}px`);
  });


  /* ====================================================
     3. 3D CARD TILT & GLOW EFFECTS
     ==================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // relative x coordinate
      const y = e.clientY - rect.top;  // relative y coordinate
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (maximum of 8 degrees)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      // Apply 3D matrix transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Pass coordinates inside the card styling context
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });


  /* ====================================================
     4. MOBILE MENU NAVIGATION
     ==================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
      const spans = mobileToggle.querySelectorAll('span');
      if (!mobileNav.classList.contains('hidden')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        mobileToggle.querySelectorAll('span').forEach(s => s.style.transform = 'none');
        mobileToggle.querySelectorAll('span')[1].style.opacity = '1';
      });
    });
  }


  /* ====================================================
     5. HOLOGRAM CANVAS INTERACTIVE PARTICLES (Light Theme optimized)
     ==================================================== */
  const canvas = document.getElementById('hologram-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    class Particle {
      constructor(w, h) {
        this.canvasWidth = w;
        this.canvasHeight = h;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseSize = Math.random() * 1.5 + 0.8;
        this.size = this.baseSize;
        // Vibrant light-contrast particle colors
        const colorOpts = ['#0066cc', '#06b6d4', '#8b5cf6'];
        this.color = colorOpts[Math.floor(Math.random() * colorOpts.length)];
        this.density = (Math.random() * 25) + 15;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 1.5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvasWidth) this.vx = -this.vx;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Anti-gravity attraction physics
            const directionX = (dx / dist) * force * this.density * 0.07;
            const directionY = (dy / dist) * force * this.density * 0.07;
            
            this.x += directionX;
            this.y += directionY;
            this.size = this.baseSize * (1 + force * 1.2);
          } else {
            if (this.size > this.baseSize) {
              this.size -= 0.04;
            }
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const count = Math.min(Math.floor((w * h) / 11000), 85);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(w, h));
      }
    }

    function animateParticles() {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      
      // Draw Connections (Constellation links - translucent blue)
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = ((110 - dist) / 110) * 0.09;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(0, 102, 204, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  }


  /* ====================================================
     6. GSAP CINEMATIC SCROLL REVEALS
     ==================================================== */
  gsap.fromTo('#navbar', 
    { y: -80, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
  );

  const heroTl = gsap.timeline();
  heroTl.to('.hero-reveal', {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.2
  });

  gsap.utils.toArray('.about-reveal, .med-reveal, .course-item, .tech-reveal, .tech-card, .why-reveal, .why-card, .journey-reveal, .place-reveal, .stat-card, .cta-reveal').forEach((elem) => {
    gsap.fromTo(elem,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.fromTo('.statement-reveal',
    { scale: 0.96, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.statement-reveal',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );


  /* ====================================================
     7. STUDENT JOURNEY SCROLL ACTIVE TIMELINE
     ==================================================== */
  const timelineProgress = document.getElementById('timeline-progress');
  const steps = document.querySelectorAll('.timeline-step');

  if (timelineProgress && steps.length > 0) {
    const handleTimelineScroll = () => {
      const scrollTriggerElem = document.getElementById('journey');
      if (!scrollTriggerElem) return;

      const rect = scrollTriggerElem.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = rect.top + window.scrollY + 100;
      const end = rect.bottom + window.scrollY - 300;
      const currentScroll = window.scrollY + (windowHeight / 2);

      let percentage = 0;
      if (currentScroll > start) {
        percentage = ((currentScroll - start) / (end - start)) * 100;
        percentage = Math.max(0, Math.min(percentage, 100));
      }

      timelineProgress.style.height = `${percentage}%`;

      steps.forEach((step, index) => {
        const stepRect = step.getBoundingClientRect();
        const stepCenter = stepRect.top + window.scrollY + (stepRect.height / 2);
        
        if (currentScroll >= stepCenter) {
          if (index === 0 || index === 3) {
            step.classList.add('active');
          } else if (index === 1 || index === 4) {
            step.classList.add('active-cyan');
          } else {
            step.classList.add('active-purple');
          }
        } else {
          step.classList.remove('active', 'active-cyan', 'active-purple');
        }
      });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll();
  }


  /* ====================================================
     8. PLACEMENT NUMERICAL COUNT-UP METRICS
     ==================================================== */
  const counters = document.querySelectorAll('.counter-num');
  if (counters.length > 0) {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          let currentVal = 0;
          const duration = 2;
          const stepsCount = 60;
          const increment = target / stepsCount;
          const stepTime = (duration * 1000) / stepsCount;

          const timer = setInterval(() => {
            currentVal += increment;
            if (currentVal >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(currentVal);
            }
          }, stepTime);
        },
        once: true
      });
    });
  }


  /* ====================================================
     9. INTERACTIVE "ACCESS PROGRAM" SYLLABUS DATA DICTIONARY
     ==================================================== */
  const programDetails = {
    'ai-ml': {
      code: 'PROGRAM: AI-ML-900',
      title: 'Artificial Intelligence & Machine Learning',
      package: 'Up to 32 LPA',
      syllabus: [
        '<strong>Phase 01: ML & Mathematics Core</strong> Foundations of linear algebra, stats, data pre-processing, regression models, classification structures, and Python scripting pipelines.',
        '<strong>Phase 02: Neural Networks & Deep Learning</strong> Building Multi-Layer Perceptrons, Convolutional Networks (CNN), Recurrent models (RNN), and utilizing PyTorch for deep training.',
        '<strong>Phase 03: GenAI, NLP & Large Language Models</strong> Training Transformers, fine-tuning pre-trained pipelines (Llama/Mistral), prompt engineering, Vector databases, and RAG systems.',
        '<strong>Phase 04: Production MLOps Deployment</strong> Serving models via FastAPI, containerizing platforms with Docker, serverless cloud setups (AWS SageMaker), and monitoring telemetry.'
      ],
      benefits: [
        'Dedicated access to enterprise cloud GPU instances for deep training runs.',
        'Hands-on portfolio construction comprising 6 advanced AI research models.',
        'Coached by active machine learning scientists from top deep-tech hubs.'
      ]
    },
    'data-science': {
      code: 'PROGRAM: DS-ANALYTIC-800',
      title: 'Data Science & Big Data Analytics',
      package: 'Up to 24 LPA',
      syllabus: [
        '<strong>Phase 01: Statistical Telemetry & SQL</strong> Formulating deep data queries, relational constraints, probability models, descriptive analytics, and business forecasting tools.',
        '<strong>Phase 02: Machine Learning Classifiers</strong> Implementing decision trees, random forests, clustering techniques (K-means), predictive mapping, and statistical validation.',
        '<strong>Phase 03: Big Data Architectures</strong> Scaling computing pipelines via Apache Spark, Hadoop clusters, real-world stream processing, and distributed database layouts.',
        '<strong>Phase 04: Industrial Visualizations & Storytelling</strong> Deploying interactive web telemetry dashboards with Tableau, PowerBI, and custom Streamlit solutions.'
      ],
      benefits: [
        'Access to 20+ large-scale corporate data repositories for telemetry analysis.',
        'Preparation for major certifications including Microsoft Certified Data Analyst.',
        'Internship gates to active corporate consulting pipelines.'
      ]
    },
    'cyber-security': {
      code: 'PROGRAM: CYBER-SECURE-700',
      title: 'Cyber Security & Ethical Hacking',
      package: 'Up to 28 LPA',
      syllabus: [
        '<strong>Phase 01: Secure Operating Architectures</strong> In-depth Linux administration, command-line frameworks, active directory controls, and computer network defenses.',
        '<strong>Phase 02: Penetration Testing Methods</strong> Executing vulnerability scans, mapping system flaws (OWASP Top 10), port scanning, and privilege escalation labs.',
        '<strong>Phase 03: Modern Cryptography & Defenses</strong> Designing secure cipher architectures, public-key infrastructure, digital authentication systems, and encryption setups.',
        '<strong>Phase 04: Threat Intelligence & Incident Response</strong> Security Operations Center (SOC) procedures, digital forensics, firewall rules, and malware analysis.'
      ],
      benefits: [
        'Prepares you directly for Certified Ethical Hacker (CEH) certification.',
        'Access to customized cyber range sandboxes simulating multi-tiered attacks.',
        'Active consulting case files guided by security audit engineers.'
      ]
    },
    'cloud-computing': {
      code: 'PROGRAM: CLOUD-GITOPS-600',
      title: 'Cloud Computing & Enterprise DevOps',
      package: 'Up to 26 LPA',
      syllabus: [
        '<strong>Phase 01: Cloud Architecture Core</strong> Virtual private clouds (VPC), identity access systems (IAM), load balancers, and cloud database instances (AWS, Azure).',
        '<strong>Phase 02: Infrastructure as Code (IaC)</strong> Provisioning complex network nodes using Terraform and managing configurations via Ansible scripts.',
        '<strong>Phase 03: Container Clustering & Orchestration</strong> Designing high-availability container clusters utilizing Docker, Docker Compose, and Kubernetes.',
        '<strong>Phase 04: CI/CD GitOps Automation</strong> Engineering automated compilation and deployment loops with GitHub Actions, Jenkins, and ArgoCD.'
      ],
      benefits: [
        'Direct AWS and Azure sandbox credits for complex distributed cloud projects.',
        'Prepares you for AWS Solutions Architect & CKA Certified Kubernetes admin.',
        'Mentorship from enterprise cloud consultants active in fortune-500 operations.'
      ]
    },
    'vlsi': {
      code: 'PROGRAM: VLSI-EMBED-500',
      title: 'VLSI & Embedded Systems Design',
      package: 'Up to 22 LPA',
      syllabus: [
        '<strong>Phase 01: Digital Logic & Hardware Description</strong> HDL syntax structures, Verilog/VHDL configurations, sequential systems design, and testbench assemblies.',
        '<strong>Phase 02: FPGA Architectural Testing</strong> Compiling custom RTL codes, mapping logical operations to physical FPGAs, and measuring clock speeds.',
        '<strong>Phase 03: Embedded Firmware Assembly</strong> Integrating C/C++ libraries with microcontrollers, real-time operating systems (RTOS), and I/O registers.',
        '<strong>Phase 04: CMOS & ASIC Layout Standards</strong> Integrated circuit layouts, physical parameters verification, design rule checking (DRC), and testing routines.'
      ],
      benefits: [
        'Physical access to premium semiconductor FPGA prototyping boards in our labs.',
        'Core curriculum aligned directly with global semiconductor hiring panels.',
        'Placement partnerships with tier-1 VLSI silicon verification houses.'
      ]
    },
    'robotics': {
      code: 'PROGRAM: ROBOT-WEB3-400',
      title: 'Robotics, Automation & Web3 Blockchain',
      package: 'Up to 30 LPA',
      syllabus: [
        '<strong>Phase 01: Decentralized Cryptographic Systems</strong> Distributed consensus engines, public-key verification methods, and hash pointers.',
        '<strong>Phase 02: Smart Contract Assembly</strong> Scripting secure transaction agreements on Ethereum (Solidity) and high-speed ledgers (Rust).',
        '<strong>Phase 03: Mechanical Control Mechanics</strong> Actuator telemetry, kinematics calculations, sensor inputs, and automated controller scripting.',
        '<strong>Phase 04: Robotic Operating Systems (ROS)</strong> Integrating motor nodes, mapping navigation loops, and designing responsive automation.'
      ],
      benefits: [
        'Interactive learning kits featuring automated smart microcontrollers.',
        'Hands-on assembly of 3 production smart contracts and 2 robotic assemblies.',
        'Direct networks to seed capital venture portals and high-growth startups.'
      ]
    }
  };


  /* ====================================================
     10. DETAILS MODAL HANDLER
     ==================================================== */
  const modal = document.getElementById('program-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  
  const modalCode = document.getElementById('modal-program-code');
  const modalTitle = document.getElementById('modal-program-title');
  const modalSyllabus = document.getElementById('modal-program-syllabus');
  const modalBenefits = document.getElementById('modal-program-benefits');
  const modalPackage = document.getElementById('modal-program-package');

  function openProgramModal(programKey) {
    const data = programDetails[programKey];
    if (!data) return;

    // Set textual details
    modalCode.textContent = data.code;
    modalTitle.textContent = data.title;
    modalPackage.textContent = data.package;

    // Reset and build Syllabus Phases
    modalSyllabus.innerHTML = '';
    data.syllabus.forEach((phaseText, index) => {
      const phaseNum = index + 1;
      const phaseCard = document.createElement('div');
      phaseCard.className = 'p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start space-x-3.5 hover:border-slate-300 transition-colors shadow-sm';
      phaseCard.innerHTML = `
        <span class="shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold font-mono flex items-center justify-center">0${phaseNum}</span>
        <div><p class="leading-relaxed font-light text-slate-600 text-xs sm:text-sm">${phaseText}</p></div>
      `;
      modalSyllabus.appendChild(phaseCard);
    });

    // Reset and build Benefits Checkbox items
    modalBenefits.innerHTML = '';
    data.benefits.forEach(benefitText => {
      const benefitItem = document.createElement('li');
      benefitItem.className = 'flex items-start space-x-3 text-xs sm:text-sm text-slate-600 font-light';
      benefitItem.innerHTML = `
        <span class="shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</span>
        <span>${benefitText}</span>
      `;
      modalBenefits.appendChild(benefitItem);
    });

    // Trigger animations by adding active class
    modal.classList.add('active');
    
    // Animate inner drawer content floating in
    gsap.fromTo('#modal-drawer', 
      { x: '100%' }, 
      { x: '0%', duration: 0.5, ease: 'power3.out' }
    );
    gsap.fromTo('#modal-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
  }

  function closeProgramModal() {
    gsap.to('#modal-drawer', {
      x: '100%',
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        modal.classList.remove('active');
      }
    });
    gsap.to('#modal-backdrop', {
      opacity: 0,
      duration: 0.3
    });
  }

  // Attach button triggers
  const accessButtons = document.querySelectorAll('.access-program-btn');
  accessButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pKey = btn.getAttribute('data-program');
      openProgramModal(pKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProgramModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProgramModal);

  // Close modal on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProgramModal();
    }
  });

  /* ====================================================
     11. FORM SUBMISSION TO GOOGLE SHEETS
     ==================================================== */
  const form = document.getElementById('consultation-form');
  const submitText = document.getElementById('submit-text');

  // Replace this placeholder with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

  if (form && submitText) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        domain: formData.get('domain'),
        message: formData.get('message') || ''
      };

      const originalText = submitText.textContent;
      submitText.textContent = 'Sending...';

      if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        // Fallback simulation when the Web App URL is not set yet
        setTimeout(() => {
          alert('Consultation Request Submitted successfully! \n\n(Important: To link this to your Google Sheet, please set up the Google Apps Script Web App URL in app.js as described in the walkthrough instructions.)');
          form.reset();
          submitText.textContent = originalText;
        }, 1000);
        return;
      }

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(() => {
        alert('Thank you! Your request has been successfully recorded in the Google Sheet.');
        form.reset();
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        alert('There was an issue submitting your request. Please try again.');
      })
      .finally(() => {
        submitText.textContent = originalText;
      });
    });
  }

});
