
import {BasicAuth, Trino} from 'trino-client';

const allCustomerQuery = 'select * from customer';
const limit = 1;
const singleCustomerQuery = `select * from customer limit ${limit}`;
const useSchemaQuery = 'use tpcds.sf100000';
const prepareListCustomerQuery =
  'prepare list_customers from select * from customer limit ?';
const listCustomersQuery = `execute list_customers using ${limit}`;
const prepareListSalesQuery =
  'prepare list_sales from select * from web_sales limit ?';
const listSalesQuery = `execute list_sales using ${limit}`;


const trino= Trino.create({
  server: 'http://localhost:8080',
  catalog: 'tpcds',
  schema: 'sf100000',
  auth: new BasicAuth('test'), 
});

// const trinoReal= Trino.create({
//   server: 'http://localhost:8080',
//   catalog: 'nyc_uber_rides',
//   schema: 'silver_schema', //how to access tables in my schema?
//   auth: new BasicAuth('test'), // should this be an object {username: '', password:''}
// });


const test = async () => {
  const iter = await trino.query(singleCustomerQuery);
  const data = await iter
    .map(r => r.data ?? [])
    .fold([], (row, acc) => [...acc, ...row]);
  console.log("testing data from single customer query:", data)

}


const test2 = async () => {
  await trino.query(prepareListCustomerQuery).then(qr => qr.next());
  const iter = await trino.query(listCustomersQuery);
  const data = await iter.fold([], (row, acc) => [
    ...acc,
    ...(row.data ?? []),
  ]);
  console.log("testing data from prepareListCustomerQuery:", data)

}

test();
test2();
 

  // test.concurrent('prepare statement', async () => {
  //   const trino = Trino.create({
  //     catalog: 'tpcds',
  //     schema: 'sf100000',
  //     auth: new BasicAuth('test'),
  //   });

  //   await trino.query(prepareListCustomerQuery).then(qr => qr.next());

  //   const iter = await trino.query(listCustomersQuery);
  //   const data = await iter.fold([], (row, acc) => [
  //     ...acc,
  //     ...(row.data ?? []),
  //   ]);
  //   expect(data).toHaveLength(limit);
  //   console.log("teseting prepare statement query:", data )
  // });

  // test.concurrent('multiple prepare statement', async () => {
  //   const trino = Trino.create({
  //     catalog: 'tpcds',
  //     schema: 'sf100000',
  //     auth: new BasicAuth('test'),
  //   });

  //   await trino.query(prepareListCustomerQuery).then(qr => qr.next());
  //   await trino.query(prepareListSalesQuery).then(qr => qr.next());

  //   const customersIter = await trino.query(listCustomersQuery);
  //   const customers = await customersIter.fold([], (row, acc) => [
  //     ...acc,
  //     ...(row.data ?? []),
  //   ]);
  //   expect(customers).toHaveLength(limit);

  //   const salesIter = await trino.query(listSalesQuery);
  //   const sales = await salesIter.fold([], (row, acc) => [
  //     ...acc,
  //     ...(row.data ?? []),
  //   ]);
  //   expect(sales).toHaveLength(limit);
  //   console.log("teseting multiple prepare statement query:", data )
  // });
