const express = require('express');
const router = express.Router();
const {
  healthCheck, generateContent, summarize, suggestTitle, improveContent,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/health',           healthCheck);
router.post('/generate-content', protect, generateContent);
router.post('/summarize',        protect, summarize);
router.post('/suggest-title',    protect, suggestTitle);
router.post('/improve-content',  protect, improveContent);

module.exports = router;
