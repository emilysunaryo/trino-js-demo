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
const queryList = {
  driverAvgPayByDay : `select 
    case 
        when day_of_week = 1 then 'Sunday'
        when day_of_week = 2 then 'Monday'
        when day_of_week = 3 then 'Tuesday'
        when day_of_week = 4 then 'Wednesday'
        when day_of_week = 5 then 'Thursday'
        when day_of_week = 6 then 'Friday'
        when day_of_week = 7 then 'Saturday'
    end as days_of_week,
    round(avg(driver_total_pay), 2) as avg_driver_pay,
    business
from 
    silver_schema.nyc_rideshare_fare_analysis
group by 
    day_of_week,business
order by 
    business`,

  rideRequestsByDay: `SELECT 
    dayofweek,
    COUNT(*) AS ride_requests,
    ROUND(AVG(passenger_fare), 2) AS avg_passenger_fare,
    ROUND(AVG(driver_total_pay), 2) AS avg_driver_total_pay,
    ROUND(AVG(trip_length), 2) AS avg_trip_length
FROM 
    silver_schema.nyc_rideshare_peak_request_times
GROUP BY 
    dayofweek
ORDER BY 
    ride_requests DESC`,

  avgPayByDistance: `SELECT 
    CASE 
        WHEN trip_length <= 1 THEN '0-1 miles'
        WHEN trip_length > 1 AND trip_length <= 3 THEN '1-3 miles'
        WHEN trip_length > 3 AND trip_length <= 5 THEN '3-5 miles'
        WHEN trip_length > 5 AND trip_length <= 10 THEN '5-10 miles'
        ELSE '10+ miles'
    END AS distance_range,
    avg(driver_total_pay) as avg_driver_pay,
    avg(driver_total_pay / trip_length) as avg_payper_mile,
    count(*) as ride_requests
FROM
    silver_schema.nyc_rideshare_fare_analysis
WHERE
    trip_length > 0 AND business = 'Uber'
GROUP BY
    CASE 
        WHEN trip_length <= 1 THEN '0-1 miles'
        WHEN trip_length > 1 AND trip_length <= 3 THEN '1-3 miles'
        WHEN trip_length > 3 AND trip_length <= 5 THEN '3-5 miles'
        WHEN trip_length > 5 AND trip_length <= 10 THEN '5-10 miles'
        ELSE '10+ miles'
    END
ORDER BY
    CASE 
        WHEN trip_length <= 1 THEN '0-1 miles'
        WHEN trip_length > 1 AND trip_length <= 3 THEN '1-3 miles'
        WHEN trip_length > 3 AND trip_length <= 5 THEN '3-5 miles'
        WHEN trip_length > 5 AND trip_length <= 10 THEN '5-10 miles'
        ELSE '10+ miles'
    END`,

   weatherNormalization :
    `WITH min_max_values AS (
    SELECT 
        MIN(min_temperature) AS min_tmin, 
        MAX(min_temperature) AS max_tmin,
        MIN(max_temperature) AS min_tmax, 
        MAX(max_temperature) AS max_tmax,
        MIN(precipitation) AS min_precipitation, 
        MAX(precipitation) AS max_precipitation,
        MIN(snow) AS min_snow, 
        MAX(snow) AS max_snow
    FROM 
        nyc_uber_rides.silver_schema.nyc_weather_data_2022
),
aggregated_weather AS (
    SELECT 
        r.date, 
        COUNT(*) AS total_ride_requests,
        AVG(w.min_temperature) AS avg_min_temperature,
        AVG(w.max_temperature) AS avg_max_temperature,
        AVG(w.precipitation) AS avg_precipitation,
        AVG(w.snow) AS avg_snow
    FROM 
        silver_schema.nyc_rideshare_fare_analysis r
    JOIN 
        nyc_uber_rides.silver_schema.nyc_weather_data_2022 w
    ON 
        r.date = w.date
    GROUP BY
        r.date
),
normalized_weather AS (
    SELECT 
        date,
        total_ride_requests,
        ( (avg_min_temperature - mv.min_tmin) / (mv.max_tmin - mv.min_tmin) ) AS tmin_norm,
        ( (avg_max_temperature - mv.min_tmax) / (mv.max_tmax - mv.min_tmax) ) AS tmax_norm,
        ( (avg_precipitation - mv.min_precipitation) / (mv.max_precipitation - mv.min_precipitation) ) AS prcp_norm,
        ( (avg_snow - mv.min_snow) / (mv.max_snow - mv.min_snow) ) AS snow_norm,
        avg_min_temperature AS min_temperature,
        avg_max_temperature AS max_temperature,
        avg_precipitation AS precipitation,
        avg_snow AS snow
    FROM 
        aggregated_weather
    CROSS JOIN 
        min_max_values mv
),
weather_index_data AS (
    SELECT 
        date,
        total_ride_requests,
        ROUND((tmin_norm + tmax_norm + prcp_norm + snow_norm) / 4, 2) AS weather_index,
        ROUND(min_temperature, 2) as min_temperature,
        ROUND(max_temperature, 2) as max_temperature,
        ROUND(precipitation, 2) as precipitation,
        ROUND(snow, 2) as snow
    FROM 
        normalized_weather
)
SELECT 
    weather_index,
    COUNT(date) AS days_count,
    SUM(total_ride_requests) AS total_ride_requests,
    ROUND(AVG(min_temperature), 2) AS avg_tmin,
    ROUND( AVG(max_temperature), 2) AS avg_tmax,
    ROUND(AVG(precipitation), 2) AS avg_prcp,
    ROUND(AVG(snow), 2) AS avg_snow
FROM 
    weather_index_data
GROUP BY 
    weather_index
ORDER BY 
    weather_index`
};


// Query functions to access data through Trino-js Client 
const executeQuery = async (query) => {
  const iter = await trino.query(query);
  const data = await iter
      .map(results => results.data ?? [])
      .fold([], (row, acc) => [...acc, ...row]);
  console.log("testing return of query on server:", data )
  return data;
}


app.get('/api/query', async (req, res) => {
  const queryType =  req.query.query; //takes an input of query that gets passed in from the Dashboard Component in the react frontend 
  if (!queryType || !queryList[queryType]) {
    res.status(400).send('Invalid Query Type')
  }
  const query = queryList[queryType];
  try {
    console.log(`Executing query: ${query}`)
    const data = await executeQuery(query);
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




