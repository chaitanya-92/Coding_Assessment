const express = require('express');
const { initializeDatabase , getTransactions,getStatistics,getBarChartData,getPieChartData,getCombinedData ,getAllTransactions  } = require('../controllers/TransactionController');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Test...');
  });



router.get('/all-transactions',getAllTransactions);
router.get('/initialize', initializeDatabase);
router.get('/transactions', getTransactions); 
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData); 
router.get('/pie-chart', getPieChartData); 
router.get('/combined-data',getCombinedData);
module.exports = router;
    