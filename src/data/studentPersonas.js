export const STUDENT_PERSONAS = [
  {
    id: 'ai-ml',
    title: 'AI & ML Engineer Intern',
    icon: '🤖',
    badge: 'Popular for AI Roles',
    data: {
      personalInfo: {
        name: 'Alex Rivera',
        email: 'alex.rivera@cs.university.edu',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alex-rivera-ai',
        github: 'github.com/alexrivera-ml',
        jobTitle: 'AI / Machine Learning Engineer Intern',
        summary: 'Driven Computer Science junior with a strong foundation in deep learning, LLM fine-tuning, and scalable data pipelines. Proven experience implementing RAG architectures, optimizing PyTorch models for edge inference, and publishing open-source AI tooling.'
      },
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science (AI/ML Specialization)',
          year: '2023 - 2026 (Expected)',
          cgpa: '3.91 / 4.00'
        }
      ],
      skills: [
        'Python', 'PyTorch', 'TensorFlow', 'LangChain', 'FastAPI', 'CUDA',
        'Hugging Face', 'Vector DBs (Chroma, Pinecone)', 'Docker', 'PostgreSQL',
        'Git & CI/CD', 'RAG Pipelines', 'MLflow', 'Data Structures & Algorithms'
      ],
      experience: [
        {
          title: 'Machine Learning Research Intern',
          company: 'Berkeley AI Research (BAIR)',
          duration: 'May 2025 - Aug 2025',
          description: '• Engineered high-throughput RAG retrieval pipeline using hybrid dense-sparse vector search, boosting retrieval recall by 34% across 200k+ research papers.\n• Fine-tuned Llama-3-8B using LoRA on domain-specific datasets, cutting hallucination rates by 28% and achieving 89.4% F1-score.\n• Profiled and optimized PyTorch model inference using ONNX Runtime and TensorRT, reducing latency from 180ms to 42ms per request.'
        }
      ],
      projects: [
        {
          name: 'AgenticRAG - Autonomous Research Assistant',
          tech: 'Python, LangGraph, FastAPI, ChromaDB, Next.js',
          link: 'github.com/alexrivera-ml/agentic-rag',
          liveUrl: 'agentic-rag-demo.vercel.app',
          description: '• Developed a multi-agent autonomous system capable of decomposing complex queries, browsing real-time web sources, and synthesizing verified citations.\n• Integrated semantic vector chunking with re-ranking algorithms, improving answer precision by 41%.\n• Benchmarked against 1,000 synthetic technical questions with automated evaluation pipelines.'
        },
        {
          name: 'VisionGuard - Real-time Edge Object Detection',
          tech: 'PyTorch, YOLOv8, OpenCV, C++, WebSockets',
          link: 'github.com/alexrivera-ml/vision-guard',
          liveUrl: 'visionguard.dev',
          description: '• Built low-latency safety monitoring system processing 60 FPS video streams on resource-constrained Jetson Nano hardware.\n• Implemented custom lightweight model quantization, shrinking memory footprint by 65% with <1.5% mAP drop.'
        }
      ],
      certifications: '• Deep Learning Specialization (DeepLearning.AI / Coursera)\n• AWS Certified Machine Learning - Specialty (MLS-C01)\n• 1st Place - CalHacks AI Track 2025'
    }
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Software Engineer',
    icon: '💻',
    badge: 'High Industry Demand',
    data: {
      personalInfo: {
        name: 'Jordan Chen',
        email: 'jordan.chen@tech.edu',
        phone: '+1 (555) 876-5432',
        location: 'Seattle, WA',
        linkedin: 'linkedin.com/in/jordanchen-dev',
        github: 'github.com/jordanchen-swe',
        jobTitle: 'Full-Stack Software Engineer',
        summary: 'Proactive Full-Stack Software Engineer with expertise in building responsive, accessible web applications and resilient microservices. Skilled in modern React ecosystems, Node.js/Go backends, distributed caching, and cloud deployment.'
      },
      education: [
        {
          institution: 'University of Washington',
          degree: 'B.S. in Computer Science & Software Engineering',
          year: '2022 - 2026',
          cgpa: '3.85 / 4.00'
        }
      ],
      skills: [
        'TypeScript', 'JavaScript (ES6+)', 'React 19', 'Next.js', 'Node.js', 'Express',
        'Go (Golang)', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'GraphQL', 'Docker',
        'AWS (S3, ECS, Lambda)', 'Jest & Playwright', 'RESTful API Design'
      ],
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'CloudScale Technologies',
          duration: 'Jun 2025 - Sep 2025',
          description: '• Architected and shipped an automated webhook integration dashboard using Next.js and Redis Pub/Sub, serving 15,000+ daily active developer accounts.\n• Optimized database query execution plans and implemented multi-tier caching, reducing 99th-percentile API response times by 55%.\n• Implemented end-to-end testing suites with Playwright, raising CI/CD deployment confidence and test coverage from 64% to 92%.'
        }
      ],
      projects: [
        {
          name: 'CollabSync - Real-Time Document Canvas',
          tech: 'React, WebSockets, CRDTs (Yjs), Node.js, Redis, Tailwind',
          link: 'github.com/jordanchen-swe/collabsync',
          liveUrl: 'collabsync.live',
          description: '• Created a Google Docs-style real-time collaborative workspace supporting conflict-free peer synchronization for up to 50 concurrent editors per room.\n• Designed modular rich-text canvas with optimistic UI updates and sub-15ms WebSocket propagation.\n• Deployed on AWS ECS with auto-scaling groups and zero-downtime rolling deployments.'
        },
        {
          name: 'FinFlow - Personal Finance & Budgeting SaaS',
          tech: 'Next.js, TypeScript, PostgreSQL, Prisma, Stripe API',
          link: 'github.com/jordanchen-swe/finflow-saas',
          liveUrl: 'finflow-app.com',
          description: '• Engineered complete SaaS app with Stripe subscription billing, secure bank sync integration via Plaid, and automated spending categorization.\n• Achieved 100/100 Lighthouse performance and accessibility scores via server-side rendering.'
        }
      ],
      certifications: '• AWS Certified Solutions Architect - Associate\n• Meta Certified Front-End Developer\n• Winner - HackMIT 2024 Developer Tooling Track'
    }
  },
  {
    id: 'data-science',
    title: 'Data Scientist & Analyst',
    icon: '📊',
    badge: 'Analytical & BI',
    data: {
      personalInfo: {
        name: 'Maya Patel',
        email: 'maya.patel@analytics.edu',
        phone: '+1 (555) 345-6789',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/mayapatel-data',
        github: 'github.com/mayapatel-ds',
        jobTitle: 'Data Scientist & Analytics Intern',
        summary: 'Analytical Data Science student passionate about turning complex datasets into actionable business intelligence and predictive models. Experienced in statistical modeling, econometric analysis, exploratory data analysis, and dashboard visualization.'
      },
      education: [
        {
          institution: 'New York University (NYU)',
          degree: 'B.S. in Data Science & Applied Statistics',
          year: '2023 - 2027',
          cgpa: '3.88 / 4.00'
        }
      ],
      skills: [
        'Python', 'R', 'SQL (Advanced Window Functions)', 'Pandas & NumPy', 'Scikit-learn',
        'Tableau & PowerBI', 'Statistical Hypothesis Testing', 'A/B Testing', 'BigQuery',
        'Apache Spark', 'Data Storytelling', 'Feature Engineering'
      ],
      experience: [
        {
          title: 'Data Analytics Intern',
          company: 'MetricPulse Analytics',
          duration: 'Jun 2025 - Aug 2025',
          description: '• Built automated customer churn prediction pipeline utilizing XGBoost and SHAP explainability, identifying at-risk cohorts with 84% ROC-AUC.\n• Designed interactive executive Tableau dashboard tracking  ARR metrics and cohort retention, eliminating 15 hours of weekly manual reporting.\n• Analyzed 40+ A/B test experiments using Bayesian inference, driving a 6.2% lift in checkout conversion rates.'
        }
      ],
      projects: [
        {
          name: 'UrbanMobility - Smart City Transit Forecasting',
          tech: 'Python, Prophet, Scikit-learn, Streamlit, Folium',
          link: 'github.com/mayapatel-ds/urban-mobility',
          liveUrl: 'urban-mobility-forecast.streamlit.app',
          description: '• Developed time-series forecasting model predicting bike-share demand across 800+ stations with a 91.2% accuracy rate.\n• Visualized geospatial heatmaps and dynamic rebalancing routes to prevent station depletion during rush hours.'
        }
      ],
      certifications: '• Google Advanced Data Analytics Professional Certificate\n• IBM Data Science Professional Certificate\n• Tableau Desktop Specialist'
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    icon: '☁️',
    badge: 'Infrastructure & SRE',
    data: {
      personalInfo: {
        name: 'David Kim',
        email: 'david.kim@cloud.edu',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        linkedin: 'linkedin.com/in/davidkim-cloud',
        github: 'github.com/davidkim-infra',
        jobTitle: 'Cloud Platform & DevOps Engineer',
        summary: 'Cloud Infrastructure & DevOps enthusiast specializing in Infrastructure-as-Code, container orchestration, CI/CD pipeline automation, and zero-trust security postures across multi-cloud environments.'
      },
      education: [
        {
          institution: 'University of Texas at Austin',
          degree: 'B.S. in Computer Science & Cloud Computing',
          year: '2023 - 2026',
          cgpa: '3.82 / 4.00'
        }
      ],
      skills: [
        'Terraform', 'Kubernetes (K8s)', 'Docker', 'AWS', 'GCP', 'GitHub Actions',
        'Prometheus & Grafana', 'Linux / Bash Scripting', 'Go', 'Python', 'Helm',
        'ArgoCD (GitOps)', 'Nginx', 'Vault'
      ],
      experience: [
        {
          title: 'DevOps & Cloud Intern',
          company: 'ScaleOps Networks',
          duration: 'May 2025 - Aug 2025',
          description: '• Migrated monolithic microservices to Kubernetes EKS cluster using Helm and Terraform, achieving 99.98% uptime.\n• Implemented automated GitHub Actions CI/CD pipelines with security scanning (Trivy, SonarQube), reducing deployment cycle time from 45 min to 6 min.\n• Configured Prometheus alerting and custom Grafana dashboards for proactive SRE incident resolution.'
        }
      ],
      projects: [
        {
          name: 'KubeGuard - Automated Cluster Security Auditing',
          tech: 'Go, Kubernetes Client-go, OPA/Gatekeeper, Docker',
          link: 'github.com/davidkim-infra/kubeguard',
          liveUrl: 'kubeguard.io',
          description: '• Authored an open-source CLI that scans Kubernetes manifests against CIS benchmarks and enforces RBAC least-privilege policies.\n• Starred by 400+ developers on GitHub with automated regression testing and multi-arch binary releases.'
        }
      ],
      certifications: '• Certified Kubernetes Administrator (CKA)\n• HashiCorp Certified: Terraform Associate\n• AWS Certified Developer - Associate'
    }
  }
];
