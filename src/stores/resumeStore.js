import { create } from 'zustand';
import api from '../services/api.js';

const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  isSaving: false,

  // Fetch all resumes
  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/resumes');
      set({ resumes: data.data.resumes, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      console.error('Failed to fetch resumes:', err);
    }
  },

  // Fetch single resume
  fetchResume: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/resumes/${id}`);
      set({ currentResume: data.data.resume, isLoading: false });
      return data.data.resume;
    } catch (err) {
      set({ isLoading: false });
      return null;
    }
  },

  // Create resume
  createResume: async (resumeData) => {
    set({ isSaving: true });
    try {
      const { data } = await api.post('/resumes', resumeData);
      set(state => ({
        resumes: [data.data.resume, ...state.resumes],
        currentResume: data.data.resume,
        isSaving: false,
      }));
      return data.data.resume;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  // Update resume
  updateResume: async (id, resumeData) => {
    set({ isSaving: true });
    try {
      const { data } = await api.put(`/resumes/${id}`, resumeData);
      set(state => ({
        resumes: state.resumes.map(r => r._id === id ? data.data.resume : r),
        currentResume: data.data.resume,
        isSaving: false,
      }));
      return data.data.resume;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  // Delete resume
  deleteResume: async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      set(state => ({
        resumes: state.resumes.filter(r => r._id !== id),
        currentResume: state.currentResume?._id === id ? null : state.currentResume,
      }));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Set current resume (from localStorage for non-auth mode)
  setCurrentResume: (resume) => set({ currentResume: resume }),

  // Get versions
  getVersions: async (id) => {
    try {
      const { data } = await api.get(`/resumes/${id}/versions`);
      return data.data.versions;
    } catch {
      return [];
    }
  },

  // Restore version
  restoreVersion: async (id, versionIndex) => {
    try {
      const { data } = await api.post(`/resumes/${id}/restore`, { versionIndex });
      set({ currentResume: data.data.resume });
      return true;
    } catch {
      return false;
    }
  },
}));

export default useResumeStore;
