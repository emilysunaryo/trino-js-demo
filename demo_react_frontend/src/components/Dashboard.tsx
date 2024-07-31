import React, {useEffect, useState} from 'react';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, Container, SelectChangeEvent, Button, Box, CircularProgress} from '@mui/material'
import Heatmap  from './Heatmap'
import BubbleChart from './BubbleChart'
import StackedBarChart from './StackedBarChart'
import AreaChartUberLyft from './AreaChartUberLyft'
import CardComponent from './CardComponent';
import SelectComponent from './SelectComponent';
import './styles/DashboardStyle.css'
import axios from 'axios';
import WeatherLineChart from './WeatherLineChart';


function Dashboard() {
    const [date, setDate] = useState<string>('All');
    const [business, setBusiness] = useState<string>('All');
    const [borough, setBorough] = useState<string>('All');;
    const [areaChartData, setAreaChartData] = useState<[any, any, any][]>([]);
    const [bubbleChartData, setBubbleChartData] = useState<[any, any, any][]>([]);
    const [barChartData, setBarChartData] = useState<[any, any, any][]>([]);
    const [cardData1, setCardData1] = useState<[any, any, any][]>([]);
    const [cardData2, setCardData2] = useState<[any, any, any][]>([]);
    const [card1, setCard1] = useState<number>(0);
    const [card2, setCard2] = useState<string>('');
    const [card3, setCard3] = useState<number>(0);
    const [card4, setCard4] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [weatherData, setWeatherData] = useState<[number, number, number, number, number, number, number][]>([]);
    const [heatmapChartData, setHeatmapChartData] = useState<string[][]>([]);


 //TODO: interesting to see: send a call for a data product , managing queries within galaxy!!, call reference to query within a data product

 //Renders once when the page mounts, calls api in node server and passes data to child graph components as props. 
 //Currently hardcoding API endpoint into URL

  useEffect(() => {
    const handleQueries = async () => {
        try {
            const [driverPayResponseData, rideRequestsByBorough, rideRequestsByDistance, payRequestByDay, payRequestByBorough ] = await Promise.all([
                axios.get('http://localhost:3001/api/query?query=driverAvgPayByDay'),
                axios.get('http://localhost:3001/api/query?query=rideRequestsByBoroughPerHour'),
                axios.get('http://localhost:3001/api/query?query=rideRequestsByDistance'),
                axios.get('http://localhost:3001/api/query?query=payAndRequestsByDay'),
                axios.get('http://localhost:3001/api/query?query=payAndRequestsByBorough'),
                // axios.get('http://localhost:3001/api/query?query=weatherNormalization')
            ]);
            setAreaChartData(driverPayResponseData.data);
            setBubbleChartData(rideRequestsByBorough.data);
            setBarChartData(rideRequestsByDistance.data);
            setCardData1(payRequestByDay.data);
            setCardData2(payRequestByBorough.data);
            // setWeatherData(weatherNormalizationData.data);
            setLoading(false);



            //i need to set card 1 - 4 initial values in here first on mount 
        } catch(error) {
            console.log("error fetching data:", error)
        }
    
    };
    handleQueries();
  },[]);



  useEffect(() => {
    const handleDateChangesForCardComponent = (data: [any, any, any][]) => {
        const extractDayData = (day: string) => {
            const result = data.find(([dayOfWeek]) => dayOfWeek === date);
            return result
        };
        const finalData = extractDayData(date);
        if(finalData) {
            const [, avgPay, requests] = finalData;

            const commaSeparatedVal = parseInt(requests);
            setCard1(avgPay);
            setCard2(formatNumberWithCommas(commaSeparatedVal));
        }

    };
    handleDateChangesForCardComponent(cardData1);
  }, [cardData1, date])


  
  useEffect(() => {
    const handleBoroughChangesForCardComponent = (data: [any, any, any][]) => {
        const extractBoroughData = (borough: string) => {
            const result = data.find(([b]) => b === borough);
            return result
          };
      
          const finalData = extractBoroughData(borough);
          if (finalData) {
            const [, avgPay, requests] = finalData; // Destructure array
            const commaSeparatedVal = parseInt(requests);
            setCard3(avgPay);
            setCard4(formatNumberWithCommas(commaSeparatedVal));
          }
        
    }
    handleBoroughChangesForCardComponent(cardData2);
  }, [borough, cardData2])


  const formatNumberWithCommas = (number: number): string => {
    return new Intl.NumberFormat().format(number);
  };


    const handleAllInitialRender = () => {

    }

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
        {value: 'Bronx', label: 'Bronx'},
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


{/* {loading ?  (
    <CircularProgress /> 
) : ( */}

<Grid container spacing={2} sx={{ padding: 5 }}>
    <Grid item xs={12} md={3}>
        <CardComponent
        cardTitle = "Avg Driver Pay by Day Of Week"
        value =  {card1}
        description = {date}
        />
    </Grid>

    <Grid item xs={12} md={3} >
        <CardComponent
        cardTitle = "Avg Ride Requests by Day of Week"
        value = {card2}
        description = {date}
        />
    </Grid>

    <Grid item xs={12} md={3}>
        <CardComponent
        cardTitle = "Avg Driver Pay by Borough"
        value = {card3}
        description = {borough}
        />
    </Grid>

    <Grid item xs={12} md={3} >
        <CardComponent
        cardTitle = "Avg Ride Requests by Borough"
        value = {card4}
        description = {borough}
        />
    </Grid>
<Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 10, marginTop: 2 }}>
    <AreaChartUberLyft 
        rawData = {areaChartData}
        toggleOption={business}
    />
</Grid>
<Grid item xs={12} md={5} sx={{ height: 450, marginBottom: 10, marginTop: 2  }}>
    <BubbleChart 
    rawData = {bubbleChartData}
    toggleOption={borough}
    
    />
</Grid>
<Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 10, marginTop: 2  }}>
    <StackedBarChart 
    rawData= {barChartData}
    toggleOption = {business}
    
    />
</Grid>
<Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2 }}>
<WeatherLineChart />

</Grid>
<Grid item xs={12} md={8} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
<AreaChartUberLyft
    rawData = {areaChartData}
    toggleOption={business}
/>

</Grid>
</Grid>
{/* )} */}

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
