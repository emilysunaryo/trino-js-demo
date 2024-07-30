import React, {useEffect, useState} from 'react';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, Container, SelectChangeEvent, Button, Box} from '@mui/material'
import Heatmap  from './Heatmap'
import BubbleChart from './BubbleChart'
import RadarChart from './RadarChart'
import AreaChartUberLyft from './AreaChartUberLyft'
import CardComponent from './CardComponent';
import SelectComponent from './SelectComponent';
import './styles/DashboardStyle.css'
import axios from 'axios';
import { alignProperty } from '@mui/material/styles/cssUtils';
import WeatherLineChart from './WeatherLineChart';

function Dashboard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [date, setDate] = useState<string>('');
    const [business, setBusiness] = useState<string>('');
    const [borough, setBorough] = useState<string>('');
    const [testData, setTestData] = useState<number[][]>([]);
    const [areaChartData, setAreaChartData] = useState<[number, number, number, number, number][]>([]);
    const [weatherData, setWeatherData] = useState<[number, number, number, number, number, number, number][]>([]);
    const [bubbleChartData, setBubbleChartData] = useState<string[][]>([]);
    const [radarChartData, setRadarChartData] = useState<string[][]>([]);
    const [heatmapChartData, setHeatmapChartData] = useState<string[][]>([]);
    const [card1, setCard1] = useState<any>();
    const [card2, setCard2] = useState<any>();
    const [card3, setCard3] = useState<any>();
    const [card4, setCard4] = useState<any>();

 //TODO: interesting to see: send a call for a data product , managing queries within galaxy!!, call reference to query within a data product


 //Renders once when the page mounts, calls api in node server and passes data to child graph components as props

  useEffect(() => {
    const handleQueries = async () => {
        try {
            const [driverPayResponseData, rideRequestsByDayResponseData, avgPayByDistanceData, weatherNormalizationData ] = await Promise.all([
                axios.get('http://localhost:3001/api/query?query=driverAvgPayByDay'),
                axios.get('http://localhost:3001/api/query?query=rideRequestsByDay'),
                axios.get('http://localhost:3001/api/query?query=avgPayByDistance'),
                axios.get('http://localhost:3001/api/query?query=weatherNormalization')
            ]);
            setAreaChartData(driverPayResponseData.data);
            setRadarChartData(avgPayByDistanceData.data);
            setWeatherData(weatherNormalizationData.data);
            setCard1(rideRequestsByDayResponseData);

            console.log("testing data from server in react frontend:", driverPayResponseData.data);
            console.log("testing second query from server, does promise.all work in this case?:", rideRequestsByDayResponseData.data);
            setTestData(driverPayResponseData.data);
            setLoading(false);
        } catch(error) {
            console.log("error fetching data:", error)
        }
    
    };
    handleQueries();
  },[]);

  console.log("testing testdata:", testData);


    const handleDateChange = (event: SelectChangeEvent<string>) => {
        setDate(event.target.value);
        console.log("testing date that is being set by handle date change:", date);
    }

    const handleBoroughChange = (event: SelectChangeEvent<string>) => {
        setBorough(event.target.value);
        console.log("testing date that is being set by handle date change:", borough);
    }

    const handleBusinessChange = (event: SelectChangeEvent<string>) => {
        setBusiness(event.target.value);
        console.log("testing date that is being set by handle business change:", business);
    }

    const dateFilterOptions = [
        {value: 'All', label: 'All'},
        {value: 'Monday', label: 'Monday'},
        {value: 'Tuesday', label: 'Tuesday'},
        {value: 'Wednesday', label: 'Wednesday'},
        {value: 'Thursday', label: 'Thursday'},
        {value: 'Friday', label: 'Friday'},
        {value: 'Saturday', label: 'Saturday'},
        {value: 'Sunday', label: 'Sunday'}
    ]

    const boroughFilterOptions = [
        {value: 'All', label: 'All'},
        {value: 'The Bronx', label: 'The Bronx'},
        {value: 'Brooklyn', label: 'Brooklyn'},
        {value: 'Manhattan', label: 'Manhattan'},
        {value: 'Queens', label: 'Queens'},
        {value: 'Staten Island', label: 'Staten Island'}, 
    ]

    const businessFilterOptions = [
        {value: 'All', label: 'All'},
        {value: 'Uber', label: 'Uber'},
        {value: 'Lyft', label: 'Lyft'},

    ]


return (
<div>

    <Toolbar>
        <Typography variant="h6" 
                    sx ={{flexGrow: 1, 
                    fontSize: 25, 
                    textAlign: 'left', color: '#616161',
                    marginTop: 4, marginLeft: 3}}>
            2022 Rideshare Analysis in NYC Metropolitan Area
        </Typography>
    </Toolbar>


    <Box display = "flex" justifyContent= "flex-start" alignItems="center" sx={{mt:2, marginLeft: 5}}>
        <Box>
            <SelectComponent
                helperText = "Select Day of Week"
                value = {date}
                onChange = {handleDateChange}
                options={dateFilterOptions} 
                />
            </Box>

            <Box sx = {{paddingLeft: 5}}>
            <SelectComponent
                helperText = "Select Business"
                value = {business}
                onChange = {handleBusinessChange}
                options={businessFilterOptions} 
                />
            </Box>
        <Box sx={{paddingLeft: 5}}>
            <SelectComponent
                helperText = "Select Boroughs"
                value = {borough}
                onChange = {handleBoroughChange}
                options={boroughFilterOptions} 
                />
         </Box>
     </Box>

<Grid container spacing={2} sx={{ padding: 5 }}>
        <Grid item xs={12} md={3}>
            <CardComponent
            cardTitle = "example title"
            value = {1000}
            description = "example description"
            />
        </Grid>

        <Grid item xs={12} md={3} >
            <CardComponent
            cardTitle = "example title"
            value = {1000}
            description = "example description"
            />
        </Grid>

        <Grid item xs={12} md={3}>
            <CardComponent
            cardTitle = "example title"
            value = {1000}
            description = "example description"
            />
        </Grid>

        <Grid item xs={12} md={3} >
            <CardComponent
            cardTitle = "example title"
            value = {1000}
            description = "example description"
            />
        </Grid>
    <Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 10, marginTop: 2 }}>
        <AreaChartUberLyft 
            rawData = {areaChartData}
        />
    </Grid>
    <Grid item xs={12} md={5} sx={{ height: 450, marginBottom: 10, marginTop: 2  }}>
        <BubbleChart />
    </Grid>
    <Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 10, marginTop: 2  }}>
        <RadarChart />
    </Grid>
    <Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2 }}>
    <WeatherLineChart />
  
    </Grid>
    <Grid item xs={12} md={8} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
    <AreaChartUberLyft
        rawData = {areaChartData}
    />

    </Grid>
</Grid>


<Heatmap
       rideData = 
       {[{ boro_name: 'Manhattan', value: 10 },
        { boro_name: 'Brooklyn', value: 8 },
        { boro_name: 'The Bronx', value: 6 },
        { boro_name: 'Queens', value: 4 },
        { boro_name: 'Staten Island', value: 2}
        ]}
        
        
        />
</div>

    )
}




export default Dashboard
