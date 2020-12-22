import hitApi from './hit-api';
import express from 'express';
const app = express();
const port = process.env.PORT || 4000;

app.get('/api', (req, res) => {
    hitApi('https://wall-street-analyzer.herokuapp.com/api/dietbot').then(
        (data) => {
            res.send(data);
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
