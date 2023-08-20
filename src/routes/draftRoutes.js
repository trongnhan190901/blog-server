const express = require('express');
const router = express.Router();
const draftController = require('../controllers/draftController');

router.post('/save', draftController.saveDraft);

router.put('/update/:id', draftController.updateDraft);

router.delete('/delete/:id', draftController.deleteDraft);

router.get('/:id', draftController.getDraftById);

module.exports = router;
