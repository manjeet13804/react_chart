const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;
const mydata=require("./data.json")
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/analytics')

const ChartDataSchema = new mongoose.Schema({
    total_kwh: Number,
    createdAt: Date,
});

const LogSchema = new mongoose.Schema({
    access_time: String,
    access_date: Date,
    employee_name: String,
    algo_status: String,
});

const ChartData = mongoose.model('ChartData', ChartDataSchema);
const Log = mongoose.model('Log', LogSchema);

app.get('/api/chart-data', async (req, res) => {
    const data = await ChartData.find({});
    res.json(mydata);
});

app.post('/api/logs', async (req, res) => {
    const log = new Log(req.body);
    await log.save();
    res.json(log);
});


const fetchData = async () => {
    try {
   
        const data = mydata.data;

        await ChartData.deleteMany({});
        await ChartData.insertMany(data);

        console.log('Data fetched and stored in MongoDB.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchData();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
