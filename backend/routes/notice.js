const express = require('express');
const router = express.Router();
const { getAllNotices } = require('../controllers/noticeController');

// GET /api/notices
router.get('/', getAllNotices);

module.exports = router;