import OpenAI from 'openai';

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key') return null;
  return new OpenAI({ apiKey });
};

// Mock responses for when API key is not set
const mockResponses = {
  'improve-bullet': (text) => `• Spearheaded ${text.substring(0, 50)}... resulting in 40% improvement in key metrics, leveraging cross-functional collaboration and data-driven decision making`,
  'ats-score': () => JSON.stringify({
    score: 72,
    strengths: ['Good use of action verbs', 'Clear section formatting', 'Relevant technical skills listed'],
    weaknesses: ['Missing quantified achievements', 'No keywords from job description', 'Summary section could be stronger'],
    suggestions: ['Add measurable results (e.g., "increased sales by 30%")', 'Include industry-specific keywords', 'Add a professional summary section', 'Use more specific technical terms']
  }),
  'match-job': () => JSON.stringify({
    matchScore: 68,
    missingKeywords: ['agile', 'CI/CD', 'microservices', 'cloud computing', 'team leadership'],
    strongMatches: ['JavaScript', 'React', 'Node.js', 'problem-solving'],
    tailoredSuggestions: ['Add experience with agile methodologies', 'Highlight any CI/CD pipeline experience', 'Mention cloud platform experience (AWS/GCP/Azure)', 'Include team leadership examples']
  }),
  'generate-summary': (name, role) => `Results-driven ${role || 'professional'} with proven expertise in delivering high-impact solutions. Combining strong technical skills with strategic thinking to drive innovation and efficiency. Passionate about leveraging technology to solve complex problems and create meaningful user experiences.`,
  'cover-letter': (name, jobTitle, company) => `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle || 'position'} at ${company || 'your company'}. With my proven track record of delivering exceptional results and my passion for innovation, I am confident I would be a valuable addition to your team.\n\nThroughout my career, I have consistently demonstrated the ability to tackle complex challenges and drive meaningful outcomes. My technical expertise, combined with strong communication and leadership skills, positions me uniquely to contribute to ${company || 'your organization'}'s continued success. I am particularly drawn to your company's commitment to excellence and innovation.\n\nI would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application, and I look forward to the possibility of contributing to your team.\n\nSincerely,\n${name || 'Applicant'}`,
  'linkedin': () => JSON.stringify({
    headlines: [
      'Senior Software Engineer | Building Scalable Solutions | React & Node.js Expert',
      'Full-Stack Developer | AI Enthusiast | Turning Ideas into Impactful Products',
      'Tech Professional | Problem Solver | Passionate About Innovation & Growth'
    ],
    about: 'I am a passionate technology professional dedicated to building solutions that make a real difference. With expertise spanning modern web technologies and a deep commitment to continuous learning, I thrive in collaborative environments where innovation is valued. My approach combines technical excellence with strategic thinking, enabling me to deliver projects that exceed expectations. When I am not coding, you will find me exploring emerging technologies, mentoring aspiring developers, and contributing to the tech community.'
  }),
  'suggest-skills': (role) => JSON.stringify({
    technicalSkills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'AWS/Cloud Services', 'Docker', 'GraphQL', 'PostgreSQL', 'Git/GitHub Actions', 'REST APIs'],
    softSkills: ['Team Leadership', 'Communication', 'Problem Solving', 'Agile/Scrum', 'Critical Thinking', 'Time Management', 'Adaptability', 'Collaboration', 'Strategic Planning', 'Mentoring']
  }),
  'improve-project': (text) => `Engineered a high-performance ${text.substring(0, 40)}... utilizing modern architecture patterns. Implemented comprehensive testing achieving 95% code coverage, resulting in zero production incidents. Delivered 2 weeks ahead of schedule, receiving recognition from senior leadership.`,
};

export const callAI = async (systemPrompt, userContent, options = {}) => {
  const client = getClient();
  
  if (!client) {
    // Return mock response
    const type = options.type || 'improve-bullet';
    const mockFn = mockResponses[type];
    if (mockFn) {
      // Simulate delay
      await new Promise(r => setTimeout(r, 1000));
      return mockFn(userContent, options.name, options.role, options.company);
    }
    return `[Mock] AI response for: ${userContent.substring(0, 100)}...`;
  }

  try {
    const completion = await client.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    // Fallback to mock
    const type = options.type || 'improve-bullet';
    const mockFn = mockResponses[type];
    if (mockFn) {
      return mockFn(userContent, options.name, options.role, options.company);
    }
    throw new Error('AI service unavailable');
  }
};

export const streamAI = async (systemPrompt, userContent, res, options = {}) => {
  const client = getClient();
  
  if (!client) {
    // Mock streaming
    const type = options.type || 'cover-letter';
    const mockFn = mockResponses[type];
    const mockText = mockFn ? mockFn(userContent, options.name, options.jobTitle, options.company) : 'Mock AI response';
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const words = mockText.split(' ');
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`);
      await new Promise(r => setTimeout(r, 50));
    }
    res.write('data: [DONE]\n\n');
    res.end();
    return;
  }

  try {
    const stream = await client.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: true,
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI Streaming Error:', error.message);
    throw error;
  }
};
