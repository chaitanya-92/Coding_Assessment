const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const transactionRoutes = require('./routes/route_transaction');

//db
connectDB();
//ev variables
dotenv.config();

//middleware
const app = express();
app.use(express.json());


//cors
app.use(cors());


//Routes initialize
app.use('/api/', transactionRoutes);


const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 