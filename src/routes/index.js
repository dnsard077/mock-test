const express = require('express');
const response = require('../utils/response');
const v1Routes = require('./v1');
const viewRoutes = require('./view');

const router = express.Router();

const defaultResp = (req, res) => {
  response.res404(res);
};

router.use('/api/v1', v1Routes);
router.use('/view', viewRoutes);
router.all('*', defaultResp);

module.exports = router;
