import express from 'express';
import {BasicAuth, Trino} from 'trino-client';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env, usually password and username information
dotenv.config();

// Express Configurations to set up our backend server
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Authorization parameters, including username and password from Starburst Galaxy Account
const auth = new BasicAuth(process.env.GALAXY_USERNAME, process.env.GALAXY_PASSWORD);
const sslOptions = {
  rejectUnauthorized: true
};

//Instantiated Trino object populated by correct parameters 
const trino =  Trino.create({
  server:"https://emilysunaryo-free-cluster.trino.galaxy.starburst.io",
  catalog: 'nyc_uber_rides',
  schema: '',
  auth: auth,
  ssl: sslOptions
});

// List of static queries. Referenced by name in the object
const queryList = {
  driverAvgPayByDay : `SELECT 
    CASE 
        when day_of_week = 1 then 'Sunday'
        when day_of_week = 2 then 'Monday'
        when day_of_week = 3 then 'Tuesday'
        when day_of_week = 4 then 'Wednesday'
        when day_of_week = 5 then 'Thursday'
        when day_of_week = 6 then 'Friday'
        when day_of_week = 7 then 'Saturday'
    END AS days_of_week,
    ROUND(AVG(driver_total_pay), 2) as avg_driver_pay,
    business
FROM 
    silver_schema.nyc_rideshare_fare_analysis
GROUP BY 
    day_of_week,business
ORDER BY 
    business`,
  rideRequestsByDistance: `SELECT 
    CASE 
        WHEN trip_length <= 1 THEN '0-1 miles'
        WHEN trip_length > 1 AND trip_length <= 3 THEN '1-3 miles'
        WHEN trip_length > 3 AND trip_length <= 5 THEN '3-5 miles'
        WHEN trip_length > 5 AND trip_length <= 10 THEN '5-10 miles'
        ELSE '10+ miles'
    END AS distance_range,
    business,
    count(*) as ride_requests
FROM
    silver_schema.nyc_rideshare_fare_analysis
GROUP BY
    CASE 
        WHEN trip_length <= 1 THEN '0-1 miles'
        WHEN trip_length > 1 AND trip_length <= 3 THEN '1-3 miles'
        WHEN trip_length > 3 AND trip_length <= 5 THEN '3-5 miles'
        WHEN trip_length > 5 AND trip_length <= 10 THEN '5-10 miles'
        ELSE '10+ miles'
    END,
    business
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
    weather_index`,
    
  rideRequestsByBoroughPerHour: `SELECT 
    CASE 
        when hour_of_day = 0 then '12AM'
        when hour_of_day = 1 then '1AM'
        when hour_of_day = 2 then '2AM'
        when hour_of_day = 3 then '3AM'
        when hour_of_day = 4 then '4AM'
        when hour_of_day = 5 then '5AM'
        when hour_of_day = 6 then '6AM'
        when hour_of_day = 7 then '7AM'
        when hour_of_day = 8 then '8AM'
        when hour_of_day = 9 then '9AM'
        when hour_of_day = 10 then '10AM'
        when hour_of_day = 11 then '11AM'
        when hour_of_day = 12 then '12PM'
        when hour_of_day = 13 then '1PM'
        when hour_of_day = 14 then '2PM'
        when hour_of_day = 15 then '3PM'
        when hour_of_day = 16 then '4PM'
        when hour_of_day = 17 then '5PM'
        when hour_of_day = 18 then '6PM'
        when hour_of_day = 19 then '7PM'
        when hour_of_day = 20 then '8PM'
        when hour_of_day = 21 then '9PM'
        when hour_of_day = 22 then '10PM'
        when hour_of_day = 23 then '11PM'
    END AS hour_of_days,
    d.borough as dropoff_borough,
    COUNT(*) AS ride_requests
FROM
   silver_schema.nyc_rideshare_fare_analysis r
JOIN
    taxi_zone_lookup.taxi_zones.zone_lookup d ON r.dropoff_location = d.location_id
WHERE 
    d.borough != 'Unknown'
GROUP BY
     d.borough, hour_of_day
ORDER BY
    hour_of_day`,

  payAndRequestsByDay: `select 
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
    count(*) as ride_requests
from 
    silver_schema.nyc_rideshare_fare_analysis
group by 
    day_of_week
order by 
    day_of_week`,

  payAndRequestsByBorough: `select 
    d.borough as borough,
    round(avg(driver_total_pay), 2) as avg_driver_pay,
    count(*) as ride_requests
FROM
   silver_schema.nyc_rideshare_fare_analysis r
JOIN
    taxi_zone_lookup.taxi_zones.zone_lookup d ON r.dropoff_location = d.location_id
WHERE 
    d.borough != 'Unknown'
GROUP BY
     d.borough
ORDER BY
    ride_requests`
};


// Query functions to access data through Trino-js Client.  
const executeQuery = async (query) => {
  const iter = await trino.query(query);
  const data = await iter
      .map(results => results.data ?? [])
      .fold([], (row, acc) => [...acc, ...row]);
  console.log("testing return of query on server:", data )
  return data;
}

executeQuery(queryList.weatherNormalization);


//API Architecture, reads in the name of the query from url parameters, checks existence of query.
app.get('/api/query', async (req, res) => {
  const queryType =  req.query.query; //Takes an input of query that gets passed in from the Dashboard Component in the react frontend 
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




