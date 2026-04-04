import Portfolio from '../models/Portfolio.js';
import Resume from '../models/Resume.js';

// Create portfolio from resume
export const createPortfolio = async (req, res, next) => {
  try {
    const { resumeId, slug, theme } = req.body;
    let resumeData = req.body.resumeData;

    // If resumeId provided, fetch from DB
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.userId });
      if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
      resumeData = resume;
    }

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data or resumeId is required.' });
    }

    // Generate slug
    const portfolioSlug = slug || 
      (resumeData.personalInfo?.name || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + 
      '-' + Date.now().toString(36);

    // Check slug uniqueness
    let portfolio = await Portfolio.findOne({ slug: portfolioSlug });
    if (portfolio) {
      if (portfolio.user.toString() !== req.userId) {
        return res.status(400).json({ success: false, message: 'Slug already taken. Try a different one.' });
      }
      // Update existing
      portfolio.theme = theme || portfolio.theme;
      portfolio.personalInfo = { ...resumeData.personalInfo, bio: resumeData.personalInfo?.summary || '' };
      portfolio.skills = [...(resumeData.technicalSkills || resumeData.skills || []), ...(resumeData.softSkills || [])];
      portfolio.projects = resumeData.projects || [];
      portfolio.experience = resumeData.experience || [];
      portfolio.certifications = resumeData.certifications || [];
      await portfolio.save();
      return res.status(200).json({ success: true, data: { portfolio }, message: 'Portfolio updated.' });
    }

    portfolio = await Portfolio.create({
      user: req.userId,
      resume: resumeId || undefined,
      slug: portfolioSlug,
      theme: theme || 'dark-navy',
      personalInfo: {
        ...resumeData.personalInfo,
        bio: resumeData.personalInfo?.summary || '',
      },
      skills: [...(resumeData.technicalSkills || resumeData.skills || []), ...(resumeData.softSkills || [])],
      projects: resumeData.projects || [],
      experience: resumeData.experience || [],
      certifications: resumeData.certifications || [],
    });

    res.status(201).json({ success: true, data: { portfolio }, message: 'Portfolio created.' });
  } catch (error) {
    next(error);
  }
};

// Get user's portfolios
export const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, data: { portfolios } });
  } catch (error) {
    next(error);
  }
};

// Get public portfolio by slug
export const getPublicPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublished: true });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    }

    // Increment view count
    portfolio.viewCount += 1;
    await portfolio.save();

    res.json({ success: true, data: { portfolio } });
  } catch (error) {
    next(error);
  }
};

// Update portfolio
export const updatePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, user: req.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    }

    const updatableFields = ['theme', 'personalInfo', 'skills', 'projects', 'experience', 'certifications', 'isPublished', 'githubRepos'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) portfolio[field] = req.body[field];
    });

    await portfolio.save();
    res.json({ success: true, data: { portfolio }, message: 'Portfolio updated.' });
  } catch (error) {
    next(error);
  }
};

// Delete portfolio
export const deletePortfolio = async (req, res, next) => {
  try {
    await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ success: true, message: 'Portfolio deleted.' });
  } catch (error) {
    next(error);
  }
};

// Fetch GitHub repos
export const fetchGithubRepos = async (req, res, next) => {
  try {
    const { githubUsername } = req.body;
    if (!githubUsername) {
      return res.status(400).json({ success: false, message: 'GitHub username is required.' });
    }

    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=10&type=owner`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    });

    if (!response.ok) {
      return res.status(400).json({ success: false, message: 'Failed to fetch GitHub repos.' });
    }

    const repos = await response.json();
    const formattedRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description || '',
      language: repo.language || '',
      stars: repo.stargazers_count,
      url: repo.html_url,
    }));

    // If portfolio ID provided, save repos
    if (req.body.portfolioId) {
      await Portfolio.findOneAndUpdate(
        { _id: req.body.portfolioId, user: req.userId },
        { githubRepos: formattedRepos }
      );
    }

    res.json({ success: true, data: { repos: formattedRepos } });
  } catch (error) {
    next(error);
  }
};
