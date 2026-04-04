import Resume from '../models/Resume.js';
import { generatePdfFromHtml } from '../services/pdf.service.js';
import { uploadFile } from '../services/cloudinary.service.js';

// Create resume
export const createResume = async (req, res, next) => {
  try {
    const resumeData = { ...req.body, user: req.userId };
    const resume = await Resume.create(resumeData);
    res.status(201).json({ success: true, data: { resume }, message: 'Resume created.' });
  } catch (error) {
    next(error);
  }
};

// Get all resumes for current user
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.userId }).sort({ updatedAt: -1 }).select('-versions');
    res.json({ success: true, data: { resumes } });
  } catch (error) {
    next(error);
  }
};

// Get single resume
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({ success: true, data: { resume } });
  } catch (error) {
    next(error);
  }
};

// Update resume (creates a version entry)
export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    // Save current state as a version before updating
    const versionSnapshot = {
      personalInfo: resume.personalInfo,
      education: resume.education,
      technicalSkills: resume.technicalSkills,
      softSkills: resume.softSkills,
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications,
      certificationsText: resume.certificationsText,
      template: resume.template,
      accentColor: resume.accentColor,
      sectionOrder: resume.sectionOrder,
    };
    
    resume.versions.push({ data: versionSnapshot, savedAt: new Date(), label: `v${resume.versions.length + 1}` });
    
    // Keep last 20 versions only
    if (resume.versions.length > 20) {
      resume.versions = resume.versions.slice(-20);
    }

    // Update fields
    const updatableFields = [
      'title', 'template', 'accentColor', 'personalInfo', 'education',
      'technicalSkills', 'softSkills', 'experience', 'projects',
      'certifications', 'certificationsText', 'sectionOrder', 'atsScore', 'pdfUrl'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    await resume.save();
    res.json({ success: true, data: { resume }, message: 'Resume updated.' });
  } catch (error) {
    next(error);
  }
};

// Delete resume
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({ success: true, message: 'Resume deleted.' });
  } catch (error) {
    next(error);
  }
};

// Restore a version
export const restoreVersion = async (req, res, next) => {
  try {
    const { versionIndex } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    if (versionIndex < 0 || versionIndex >= resume.versions.length) {
      return res.status(400).json({ success: false, message: 'Invalid version index.' });
    }

    const versionData = resume.versions[versionIndex].data;
    
    // Restore version data
    Object.keys(versionData).forEach(key => {
      resume[key] = versionData[key];
    });

    await resume.save();
    res.json({ success: true, data: { resume }, message: 'Version restored.' });
  } catch (error) {
    next(error);
  }
};

// Get versions list
export const getVersions = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId }).select('versions');
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({
      success: true,
      data: {
        versions: resume.versions.map((v, i) => ({
          index: i,
          label: v.label,
          savedAt: v.savedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export to PDF server-side
export const exportPdf = async (req, res, next) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ success: false, message: 'HTML content is required.' });

    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const pdfBuffer = await generatePdfFromHtml(html);
    
    // Create unique filename
    const sanitizedName = (resume.personalInfo?.name || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const pdfUrl = await uploadFile(pdfBuffer, 'quickhire_resumes', 'raw');

    resume.pdfUrl = pdfUrl;
    await resume.save();

    res.json({ success: true, data: { pdfUrl }, message: 'PDF generated successfully.' });
  } catch (error) {
    next(error);
  }
};
