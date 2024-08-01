# trino-js-client demo project

## Overview

This project leverages the trino-js-client library to demonstrate the power of Trino as a backend engine for data-driven applications. The project integrates open-source rideshare data into Starburst Galaxy, creating a web application dashboard designed to provide insights into rideshare and traffic data across major metropolitan areas. This dashboard inspired application is designed to highlight how variability—such as borough location and weather affects rideshare and traffic data points. By leveraging Trino as a powerful querying engine and integrating with Starburst Galaxy, the project showcases how modern JavaScript/TypeScript frameworks and libraries can be used to derive actionable insights from complex data sets.

## Key Technologies
- **JavaScript and TypeScript**: The project is primarily built using JavaScript and TypeScript, showcasing their effectiveness in developing modern, scalable web applications.
- **Node.js**: Utilized for server-side logic, api handling, and query management, enabling an efficient backend infrastructure.
- **React**: Used for building interactive and dynamic user interfaces of the dashboard, making use of its component-based architecture for a seamless user experience
- **trino-js-client**: For connecting to the Starburst Galaxy server and executing queries within Node.js server-side logic.
- **Starburst Galaxy**: For hosting the data.


## Features
- **Data Storage**: Manually uploaded data into an AWS S3 bucket
- **Trino Client**: Using a Trino client to query data from a Starburst Galaxy server.
- **Dynamic UI**: Includes a react frontend application visually displaying data queried from Data Source

## Datasets
The project uses the following Kaggle datasets:
- [NYC Rideshare Analysis Data](https://www.kaggle.com/datasets/aaronweymouth/nyc-rideshare-raw-data?select=rideshare_data.parquet)
- [NYC Weather Data](https://www.kaggle.com/datasets/danbraswell/new-york-city-weather-18692022)


## Replicating This Project

Follow these steps to replicate the project on your local machine:

### 1. Download Data from Kaggle
1. **Download Rideshare Data**:
    - Visit the [NYC Rideshare Analysis Data](https://www.kaggle.com/datasets/your-link-here) page on Kaggle.
    - Download the dataset files to your local machine.

2. **Download Weather Data**:
    - Visit the [NYC Weather Data](https://www.kaggle.com/datasets/your-link-here) page on Kaggle.
    - Download the dataset files to your local machine.

### 2. Upload Data to Starburst Galaxy Partnered Storage
1. **Upload to AWS S3**:
    - Log in to your AWS account.
    - Navigate to the S3 service.
    - Create a new bucket or use an existing bucket.
    - Upload the downloaded datasets to the S3 bucket.

2. **Upload to Snowflake** (optional):
    - Log in to your Snowflake account.
    - Navigate to the "Data" section.
    - Create a new database or use an existing one.
    - Use the Snowflake Web Interface or SnowSQL to load the datasets into Snowflake tables.
### 3. Schema Discovery and Table Creation in Starburst Galaxy
1. **Discovering Schemas**:
    - Log in to your Starburst Galaxy account.
    - Navigate to the Data section.
    - Use the schema discovery feature to detect and create schemas for your datasets in the AWS S3 or Snowflake storage.

2. **Creating Bronze Layer Tables**:
    - Create bronze layer tables using the discovered schemas. These tables will hold the raw data as it was uploaded.

3. **Creating Silver Layer Tables**:
    - Create silver layer tables to refine and organize the data for analysis. Use the following query to create the `nyc_rideshare_fare_analysis` table:
    ```sql
    CREATE TABLE nyc_rideshare_fare_analysis AS
    SELECT 
        date,
        hour_of_day,
        day_of_week(date) AS day_of_week,
        CEIL(passenger_fare) AS passenger_fare,
        CEIL(driver_total_pay) AS driver_total_pay,
        passenger_fare - (driver_total_pay + rideshare_profit) AS tip_amount,
        trip_length,
        total_ride_time,
        business, 
        pickup_location,
        dropoff_location
    FROM bronze_schema.rideshare_data
    WHERE YEAR(date) = 2022;
    ```
### 4. Clone This Repository
1. Open your terminal or command prompt.
2. Run the following command to clone the repository:
    ```bash
    git clone https://github.com/emilysunaryo/trino-js-demo.git
    cd demo_galaxy_app
    ```

### 5. Install Dependencies
1. Ensure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).
2. Install the project dependencies by running:
    ```bash
    npm install
    ```

### 6. Set Up Environment Variables
1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file, replacing the placeholder values with your actual credentials and settings:
    ```env
    TRINO_SERVER_URL=your-galaxy-server-url
    TRINO_USER=your-username
    TRINO_PASSWORD=your-password
    S3_BUCKET_NAME=your-s3-bucket-name
    SNOWFLAKE_ACCOUNT=your-snowflake-account
    SNOWFLAKE_USER=your-snowflake-username
    SNOWFLAKE_PASSWORD=your-snowflake-password
    ```

### 7. Run the Application
1. Start the application by cd'ing into the `node_server` directory to initialize the trino-js library:
    ```bash
    node trino_client_server
    ```
2. Start the application by cd'ing into the `demo_react_frontend` directory running:
    ```bash
    npm start
    ```
2. Open your web browser and navigate to the local server address provided in the terminal to view the application.

### Example Queries
Here are some example queries used in the project to fetch and analyze data:

```javascript
const trino = require('trino-js-client');

// Trino Client connected on Galaxy Server
const auth = new BasicAuth(process.env.GALAXY_USERNAME, process.env.GALAXY_PASSWORD);
const sslOptions = {
  rejectUnauthorized: true
};

const trino =  Trino.create({
  server: INCLUDE YOUR OWN GALAXY SERVER HERE,
  catalog: 'nyc_uber_rides',
  schema: '',
  auth: auth,
  ssl: sslOptions
});
```

Provided Test Query used in Project
```javascript 
const testQuery = 'SELECT
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
    ride_requests'
```

Query functions to access data through Trino-js Client 
```javascript
const executeQuery = async (query) => {
  const iter = await trino.query(query);
  const data = await iter
      .map(results => results.data ?? [])
      .fold([], (row, acc) => [...acc, ...row]);
  console.log("testing return of query on server:", data )
  return data;
}

executeQuery(testQuery);



