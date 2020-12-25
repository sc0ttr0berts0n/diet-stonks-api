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

// hit catchers api and respond with parsed data
app.get('/api/v1/wsa', (req, res) => {
    hitApi('https://wall-street-analyzer.herokuapp.com/api/v1/dietbot')
        .then((apiResponse) => {
            const data = { release: RELEASE, ...apiResponse };
            res.send(data);
            console.log(req);
        })
        .catch((error) => res.send(error.message));
});

// give sentiment analysis of array in JSON body
app.post('/api/v1/sentiment', (req, res) => {
    const result: number[] = req.body.map((mergedComments: string): number => {
        const sent = new Sentiment().analyze(mergedComments);
        return sent.score;
    });
    res.send(result);
});

app.post('/api/v2/sentiment/', (req, res) => {
    const result: number[] = req.body.map((mergedComments: string) => {
        const sent = new Sentiment().analyze(mergedComments);
        return sent;
    });
    res.send({ release: RELEASE, ...result });
});

// listen for requests
app.listen(port, () => {
    console.log(`Diet Stonks listening...`);
});
