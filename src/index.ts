import hitApi from './hit-api';
import express from 'express';
import cors from 'cors';
import Sentiment from 'sentiment';

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

app.post('/sentiment', (req, res) => {
    const result: number[] = req.body.map((mergedComments: string): number => {
        return new Sentiment().analyze(mergedComments).score;
    });
    res.send(result);
});

// listen for requests
app.listen(port, () => {
    console.log(`Diet Stonks listening...`);
});
