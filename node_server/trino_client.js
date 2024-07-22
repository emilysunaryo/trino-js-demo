import {BasicAuth, QueryData, Trino, QueryResult, QueryIterator} from 'trino-client'

const trino= Trino.create({
    catalog: 'tpcds',
    schema: 'sf100000',
    auth: new BasicAuth('test'),
  });
å

  export const queryTrino = async (query) => {
    const iter = await trino.query(query);
    const results = [];
    for await (const queryResult of iter) {
      if (queryResult.data) {
        results.push(queryResult.data);
      }
        
    }
    return results;
  }

  export const queryTrinoAggregate = async (query) => {
    const iter = await trino.query(query);
    const data = await iter
        .map(results => results.data ?? [])
        .fold([], (row, acc) => [...acc, ...row]);
    return data;
  }
