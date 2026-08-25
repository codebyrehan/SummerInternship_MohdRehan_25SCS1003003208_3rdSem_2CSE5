import api from './api.js';

const mockDelay = (ms = 700) => new Promise(r => setTimeout(r, ms));

const handleAICall = async (endpoint, payload) => {
  try {
    const { data } = await api.post('/ai/' + endpoint, payload);
    return data.data;
  } catch (err) {
    if (!err.response) {
      return getMockResponse(endpoint, payload);
    }
    throw err;
  }
};

const getMockResponse = async (endpoint, payload) => {
  await mockDelay();
  const mocks = {
    'improve-bullet': { 
      original: payload.text, 
      improved: '• Architected and optimized ' + (payload.text ? payload.text.replace(/^[•\-\s*]+/, '') : 'core application modules') + ', accelerating runtime performance by 38% and reducing p95 latency across 5,000+ daily requests.' 
    },
    'improve-project': { 
      original: payload.text, 
      improved: 'Engineered a scalable cloud-native application featuring asynchronous event streaming. Achieved 99.9% uptime, reduced database query load by 45%, and verified reliability with 90%+ automated test coverage.' 
    },
    'ats-score': { 
      score: 89, 
      strengths: [
        'Strong action verbs (Architected, Engineered, Optimized)',
        'Quantified business and latency metrics (34%, 42ms, 200k+)',
        'Clean single-column ATS readable structure',
        'Relevant modern tech stack alignment'
      ], 
      weaknesses: [
        'Add 1-2 more domain-specific cloud keywords (e.g., CI/CD, AWS)',
        'Include LinkedIn profile link in header'
      ], 
      suggestions: [
        'Highlight distributed systems or caching experience if applying to backend roles',
        'Add links to live demo deployments to increase recruiter click-through by 60%'
      ] 
    },
    'match-job': { 
      matchScore: 88, 
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'Problem Solving'], 
      missingKeywords: ['Kubernetes', 'GraphQL', 'AWS ECS', 'Redis Caching'], 
      strengths: [
        'Direct overlap with required frontend and backend languages',
        'Demonstrated project complexity with measurable performance gains'
      ],
      recommendations: [
        'Explicitly mention Redis caching in your CollabSync or backend project bullet point',
        'Mention Docker containerization in the deployment workflow of your project'
      ]
    },
    'generate-summary': { 
      summary: 'High-impact ' + (payload.role || 'Software Engineer') + ' with hands-on experience building scalable applications, AI pipelines, and distributed systems. Proven track record of improving latency by 40%+ and shipping production-ready code with 90%+ test coverage.' 
    },
    'cover-letter': { 
      content: 'Dear Hiring Team at ' + (payload.companyName || 'the Organization') + ',\n\nI am writing to express my enthusiastic application for the ' + (payload.jobTitle || 'Software Engineer') + ' role. Having tracked ' + (payload.companyName || 'your company') + "\'s innovative work in building world-class products, I am eager to bring my technical skills in modern system design, full-stack development, and data-driven problem solving to your engineering team.\n\nIn my recent projects, I architected resilient solutions including high-throughput APIs and real-time collaborative applications, consistently focusing on performance, clean maintainable code, and quantified user impact. For instance, my work on optimizing database pipelines and client-server sync reduced latency by over 40% while sustaining high concurrency.\n\nWhat excites me most about " + (payload.companyName || 'your team') + ' is your commitment to engineering excellence and user-centric innovation. I look forward to the prospect of contributing to your core roadmap.\n\nThank you for your time and consideration.\n\nWarm regards,\n' + (payload.resumeData && payload.resumeData.personalInfo ? payload.resumeData.personalInfo.name : 'Applicant'), 
      coverLetter: { 
        _id: 'cl-' + Date.now(), 
        jobTitle: payload.jobTitle, 
        companyName: payload.companyName 
      } 
    },
    'linkedin': {
      headlines: [
        'Software Engineer | AI & Scalable Web Systems | Open Source Contributor',
        'Full-Stack Developer | React 19, TypeScript & Distributed Backends | Building High-Impact Products',
        'CS & AI Researcher | Deep Learning, RAG Architectures & Cloud Optimization'
      ],
      about: 'Passionate software engineer focused on building resilient full-stack systems and high-throughput AI pipelines. With a strong foundation in modern web architectures and algorithmic optimization, I strive to turn complex engineering problems into elegant, production-grade solutions.'
    },
    'interview-prep': {
      questions: [
        {
          id: 1,
          type: 'Technical Architecture',
          question: 'How did you handle concurrency and state synchronization in your collaborative project?',
          tips: 'Focus on conflict-free data types (CRDTs), WebSocket reconnection strategies, and Redis pub/sub backpressure.',
          sampleAnswer: 'In my collaborative application, I implemented CRDTs to resolve conflicting concurrent edits locally before broadcasting updates over WebSockets. For state persistence, updates were buffered in Redis memory before asynchronous flushing to PostgreSQL.'
        },
        {
          id: 2,
          type: 'System Performance',
          question: 'You mentioned reducing latency by over 30%. What profiling tools did you use and where was the bottleneck?',
          tips: 'Describe your diagnostic process (APM, flamegraphs, DB query analysis) before explaining the architectural fix.',
          sampleAnswer: 'We identified that unindexed relational queries and redundant API polling were generating 60% of database load. I replaced polling with server-sent events and added composite B-Tree indexes, dropping p95 query times from 210ms to 35ms.'
        },
        {
          id: 3,
          type: 'Behavioral & Leadership',
          question: 'Tell me about a time you faced an unexpected technical roadblock during a sprint.',
          tips: 'Use the STAR method: Situation, Task, Action, and Quantified Result.',
          sampleAnswer: 'During a hackathon sprint, an upstream API rate-limited our pipeline. I quickly designed a client-side local caching layer with exponential backoff, preventing application crashes and enabling the team to secure 1st place in the track.'
        }
      ]
    },
    'career-gap': {
      targetRole: payload.role || 'Full-Stack / AI Engineer',
      marketReadinessScore: 86,
      inDemandSkills: [
        { skill: 'Docker & Containerization', status: 'Proficient', impact: 'High' },
        { skill: 'Distributed Caching (Redis)', status: 'Proficient', impact: 'High' },
        { skill: 'Cloud CI/CD (GitHub Actions / AWS)', status: 'Intermediate', impact: 'High' },
        { skill: 'Kubernetes Orchestration', status: 'Learning Gap', impact: 'Medium' }
      ],
      recommendedProjects: [
        {
          title: 'Microservices Deployment on Minikube / K8s',
          description: 'Deploy a multi-container app with automated rolling updates and Horizontal Pod Autoscaling (HPA).',
          estimatedHours: '8 hours',
          badge: 'High ROI for Cloud Roles'
        }
      ]
    },
    'suggest-skills': { 
      technicalSkills: ['React 19', 'TypeScript', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'Redis', 'AWS', 'GraphQL', 'Next.js'], 
      softSkills: ['Cross-functional Collaboration', 'Technical Communication', 'Agile & Scrum', 'Problem Decomposition', 'Mentorship'] 
    }
  };
  return mocks[endpoint] || { message: 'Mock response' };
};

export const improveBullet = (text) => handleAICall('improve-bullet', { text });
export const checkAtsScore = (resumeText, resumeId) => handleAICall('ats-score', { resumeText, resumeId });
export const matchJob = (resumeText, jobDescription) => handleAICall('match-job', { resumeText, jobDescription });
export const generateSummary = (name, role, skills, experience) => handleAICall('generate-summary', { name, role, skills, experience });
export const generateCoverLetter = (resumeData, jobTitle, companyName, jobDescription, tone = 'confident') => handleAICall('cover-letter', { resumeData, jobTitle, companyName, jobDescription, tone });
export const generateLinkedin = (role, skills, experienceSummary) => handleAICall('linkedin', { role, skills, experienceSummary });
export const generateInterviewPrep = (resumeData, role, jobDescription) => handleAICall('interview-prep', { resumeData, role, jobDescription });
export const analyzeCareerGap = (skills, role) => handleAICall('career-gap', { skills, role });
export const suggestSkills = (role, existingSkills) => handleAICall('suggest-skills', { role, existingSkills });
export const improveProject = (text) => handleAICall('improve-project', { text });

export const getCoverLetters = async () => {
  try {
    const { data } = await api.get('/ai/cover-letters');
    return data.data.coverLetters;
  } catch { return []; }
};

export const getAtsHistory = async () => {
  try {
    const { data } = await api.get('/ai/ats-history');
    return data.data.scores;
  } catch { return []; }
};
