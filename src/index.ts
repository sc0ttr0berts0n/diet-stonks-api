import hitApi from './hit-api';
import express from 'express';
import cors from 'cors';
import Sentiment from 'sentiment';

const app = express();
const port = process.env.PORT || 4000;
const RELEASE = process.env.HEROKU_RELEASE_VERSION || 'prerelease';

// enable cors
app.use(cors());

// json support
app.use(express.json());

// respond to api requests
app.get('/api/v1/wsa', (req, res) => {
    hitApi('https://wall-street-analyzer.herokuapp.com/api/v1/dietbot').then(
        (data) => {
            res.send({ release: RELEASE, ...data });
        }
    );
});

app.post('api/v1/sentiment', (req, res) => {
    const result: number[] = req.body.map((mergedComments: string): number => {
        const sent = new Sentiment().analyze(mergedComments);
        return sent.score;
    });
    res.send(result);
});

app.post('api/v2/sentiment/', (req, res) => {
    const result: number[] = req.body.map((mergedComments: string) => {
        const sent = new Sentiment().analyze(mergedComments);
        return sent;
    });
    res.send(result);
});

// listen for requests
app.listen(port, () => {
    console.log(`Diet Stonks listening...`);
});
