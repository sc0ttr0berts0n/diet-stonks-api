import fetch from 'node-fetch';
import Sentiment from 'sentiment';
// import AsciiTable from 'ascii-table';

// from catcher
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
    price: IPrice;
    changePercent: number;
}

interface IRawApiData {
    data: IRawStock[];
    lastUpdate: string;
}

interface IPrice {
    current: number;
    open: number;
    high: number;
    low: number;
    previousClose: number;
    change: number;
    changePercentage: number;
}

interface IProcessedStockData {
    symbol: string;
    occurances: number;
    sentiment: number;
    index: number;
    lastUpdate: string;
    price: IPrice;
}

interface IProcessedStockComments {
    symbol: string;
    comment: string;
    sentiment: number;
    level: number;
}

interface IApiResponse {
    status: number;
    raw: IRawApiData | null;
    data: IProcessedStockData[];
    comments: IProcessedStockComments[];
}

const _handleResponse = (
    status: number,
    raw: IRawApiData | null,
    body: IRawApiData
): IApiResponse => {
    const _processApiData = (body: IRawApiData) => {
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
                    price: stonk.price,
                };
            }
        );
    };
    const _processComments = (stocks: IRawStock[]) => {
        return (
            stocks
                // dive into each stock
                .map((stock) => {
                    // dive into each comment
                    return stock.comments.map(
                        (comment): IProcessedStockComments => {
                            // map each comment to a processed comment
                            // with a sentiment score
                            return {
                                symbol: stock.symbol,
                                comment: comment.comment,
                                sentiment: new Sentiment().analyze(
                                    comment.comment
                                ).score,
                                level: comment.level,
                            };
                        }
                    );
                })
                // flatten down the array to a flat comment array
                .flat()
        );
    };
    return {
        status: status,
        raw: raw,
        data: _processApiData(body),
        comments: _processComments(body.data),
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
