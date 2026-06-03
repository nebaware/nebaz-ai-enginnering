/**
 * Nebaz AI Academy — single source of truth for site configuration.
 * Load before common.js, navigation.js, certificate.js, and aitutor-widget.js.
 */
const SITE_CONFIG = {
    siteName: 'Nebaz AI Academy',
    siteShortName: 'Nebaz AI',
    siteSlug: 'nebaz-ai',
    founderName: 'Nebaz',
    tagline: 'Original AI engineering academy for Ethiopia — founded by Nebaz',
    legalNotice: 'Educational content © Nebaz. Third-party names are trademarks of their owners. No affiliation with external tutorial sites.',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    siteURL: typeof window !== 'undefined' && window.location.protocol !== 'file:'
        ? window.location.origin
        : '',
    supportEmail: 'hello@nebaz-ai.local',
    certPrefix: 'NEBAZAI-',
    curriculumVersion: '2026.06',
    enableMonetization: false,
    enableComments: false,
    enableAITeacher: true,
    aiTier: 'offline',
    ollamaURL: 'http://localhost:11434',
    aiTeacherAPI: '/api/ai-teacher',
    commentsAPI: '/api/comments',
    storageKeys: {
        progress: 'nebaz_learningProgress',
        certs: 'nebaz_certs',
        tutor: 'nebaz_tutor_requests',
        theme: 'nebaz_theme'
    },
    social: {
        github: '',
        linkedin: '',
        twitter: ''
    }
};

if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
}
