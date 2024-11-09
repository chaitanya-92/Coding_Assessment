const axios = require('axios');
const Transaction = require('../models/Transaction');

// TASK 1
exports.initializeDatabase = async (req, res) => {
  try {
    const { data } = await axios.get(process.env.THIRD_PARTY_API_URL);
    await Transaction.deleteMany();
    await Transaction.insertMany(data);
    res.status(200).json({ message: 'Database successfully populated with seed data' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to initialize database' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({
      transactions,
      total: transactions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving transactions from database' });
  }
};

// TASK 2
exports.getTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Please use YYYY-MM' });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const skip = (parseInt(page) - 1) * parseInt(perPage);

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate }
    }).skip(skip).limit(parseInt(perPage));

    res.status(200).json({
      transactions,
      page: parseInt(page),
      perPage: parseInt(perPage),
      total: transactions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve transactions' });
  }
};

// TASK 3
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const [result] = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalUnsoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
        }
      }
    ]);

    res.status(200).json({
      totalSaleAmount: result ? result.totalSaleAmount : 0,
      totalSoldItems: result ? result.totalSoldItems : 0,
      totalUnsoldItems: result ? result.totalUnsoldItems : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch statistics' });
  }
};

// TASK 4 - BAR CHART
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Please use YYYY-MM' });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    const result = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901-above",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve bar chart data' });
  }
};

// TASK 5
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Please use YYYY-MM' });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    const result = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: "$category", itemCount: { $sum: 1 } } },
      { $sort: { itemCount: -1 } }
    ]);

    const pieChartData = result.map(item => ({
      category: item._id,
      count: item.itemCount
    }));

    res.status(200).json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve pie chart data' });
  }
};

// TASK 6: Combined Data
exports.getCombinedData = async (req, res) => {
  try {
    const { month, page = 1, perPage = 10 } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Please use YYYY-MM' });
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    const skip = (parseInt(page) - 1) * parseInt(perPage);

    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lt: endDate } })
      .skip(skip)
      .limit(parseInt(perPage));

    const statistics = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalUnsoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
        }
      }
    ]);

    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 }
        }
      },
      { $sort: { itemCount: -1 } }
    ]);

    const combinedResponse = {
      transactions: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: transactions.length,
        data: transactions
      },
      statistics: {
        totalSaleAmount: statistics[0] ? statistics[0].totalSaleAmount : 0,
        totalSoldItems: statistics[0] ? statistics[0].totalSoldItems : 0,
        totalUnsoldItems: statistics[0] ? statistics[0].totalUnsoldItems : 0
      },
      pieChartData: pieChartData.map(item => ({
        category: item._id,
        count: item.itemCount
      }))
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Error combining data from multiple sources' });
  }
};
