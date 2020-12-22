import hitApi from './hit-api';
import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 4000;

// enable cors
app.use(cors());

// respond to api requests
app.get('/api', (req, res) => {
    hitApi('https://wall-street-analyzer.herokuapp.com/api/dietbot').then(
        (data) => {
            res.send(data);
        }
    );
});

// listen for requests
app.listen(port, () => {
    console.log(`Diet Stonks listening...`);
});
