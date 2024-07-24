import express from 'express';
import {BasicAuth, Trino} from 'trino-client';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env
dotenv.config();

// Express Configurations 
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Trino Client connected on Galaxy Server
const auth = new BasicAuth(process.env.GALAXY_USERNAME, process.env.GALAXY_PASSWORD);
const sslOptions = {
  rejectUnauthorized: true
};

const trino =  Trino.create({
  server:"https://emilysunaryo-free-cluster.trino.galaxy.starburst.io",
  catalog: 'nyc_uber_rides',
  schema: '',
  auth: auth,
  ssl: sslOptions
});

// Queries
const driverAvgPayByDay = `SELECT day_of_week,
 avg(driver_total_pay) as avg_driver_pay,
 avg(passenger_fare) as avg_passenger_fare 
 FROM silver_schema.nyc_rideshare_fare_analysis 
 GROUP BY day_of_week ORDER BY avg_driver_pay desc LIMIT 50`;


// Query functions to access data through Trino-js Client 
const executeQuery = async (query) => {
  const iter = await trino.query(query);
  const data = await iter
      .map(results => results.data ?? [])
      .fold([], (row, acc) => [...acc, ...row]);
  console.log("testing return of query on server:", data )
  return data;
}

executeQuery(driverAvgPayByDay);

// export const queryTrino = async (query) => {
//   const iter = await trino.query("select");
//   const results = [];
//   for await (const queryResult of iter) {
//     if (queryResult.data) {
//       results.push(queryResult.data);
//     }
      
//   }
//   return results;
// }

app.get('/api/query1', async (req, res) => {
  const query =  driverAvgPayByDay; //takes an input of query that gets passed in from the Dashboard Component in the react frontend 
  try {
    console.log(`Executing query: ${query}`)
    const data = await executeQuery(query)
    console.log("Successfully returned query data:", data);
    res.json(data);
  } catch(error) {
    console.log("error accessing query from galaxy:", error);
    res.status(500).send('Query failed');
  }
});


// Starting the node_js server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})




