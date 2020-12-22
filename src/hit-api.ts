import fetch from 'node-fetch';
import Sentiment from 'sentiment';
// import AsciiTable from 'ascii-table';

interface IRawStockComments {
    comment: string;
    level: number;
}

interface IRawStock {
    symbol: string;
    name: string;
    score: number;
    change: number;
    comments: IRawStockComments[];
}

interface IRawStockData {
    data: IRawStock[];
    lastUpdate: string;
}

interface IRawResponse {
    status: number;
    json(): IRawStockData;
}

interface IProcessedStockData {
    symbol: string;
    occurances: number;
    sentiment: number;
    index: number;
    lastUpdate: string;
}

interface IResponse {
    status: number;
    raw: IRawStockData | null;
    data: IProcessedStockData[];
}

const _handleResponse = (
    status: number,
    raw: IRawStockData | null,
    body: IRawStockData
): IResponse => {
    const _processApiData = (body: IRawStockData) => {
        return body.data.map(
            (stonk: IRawStock): IProcessedStockData => {
                const mergedComments = stonk.comments.reduce((acc, comment) => {
                    return `${acc} ${comment.comment}`;
                }, '');
                const sentiment = new Sentiment().analyze(mergedComments).score;
                const index = stonk.score * sentiment;
                return {
                    symbol: stonk.symbol,
                    occurances: stonk.score,
                    index: index,
                    sentiment: sentiment,
                    lastUpdate: body.lastUpdate,
                };
            }
        );
    };
    return {
        status: status,
        raw: raw,
        data: _processApiData(body),
    };
};

const hitAPI = async (url: string) => {
    let status = 404;
    let raw = null;
    return await fetch(url, { timeout: 60000 })
        .then((res) => {
            status = res.status;
            return res.json();
        })
        .then((body) => {
            raw = body;
            return _handleResponse(status, raw, body);
        });
};

export default hitAPI;
