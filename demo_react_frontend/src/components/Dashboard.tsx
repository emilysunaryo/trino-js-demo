import React, {useEffect, useState} from 'react';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, Container, SelectChangeEvent, Button, Box, CircularProgress} from '@mui/material'
import BubbleChart from './BubbleChart'
import StackedBarChart from './StackedBarChart'
import AreaChartUberLyft from './AreaChartUberLyft'
import CardComponent from './CardComponent';
import SelectComponent from './SelectComponent';
import './styles/DashboardStyle.css'
import axios from 'axios';
import WeatherLineChart from './WeatherLineChart';


function Dashboard() {
//We use useState react hooks to store the data being returned from our trino_client_server backend
    const [date, setDate] = useState<string>('All');
    const [business, setBusiness] = useState<string>('All');
    const [borough, setBorough] = useState<string>('All');;
    const [areaChartData, setAreaChartData] = useState<[string, number, string][]>([]);
    const [bubbleChartData, setBubbleChartData] = useState<[string, string, number][]>([]);
    const [barChartData, setBarChartData] = useState<[string, string, number][]>([]);
    const [cardData1, setCardData1] = useState<[string, number, number][]>([]);
    const [cardData2, setCardData2] = useState<[string, number, number][]>([]);
    const [card1, setCard1] = useState<number>(0);
    const [card2, setCard2] = useState<string>('0');
    const [card3, setCard3] = useState<number>(0);
    const [card4, setCard4] = useState<string>('0');
    const [weatherData, setWeatherData] = useState<[number, number, number, number, number, number, number][]>([]);

 //The useEffect() react hook below will render once when the page mounts. We use axios to pass query name parameters to our backend server to grab data for specific graphs 
 // NOTE: We are currently hardcoding our url rather than dynamically calling our API due to the static nature of our data

  useEffect(() => {
    const handleQueries = async () => {
        try {
            const [driverPayResponseData, rideRequestsByBorough, rideRequestsByDistance, payRequestByDay, payRequestByBorough, weatherNormalizationData ] = await Promise.all([
                axios.get('http://localhost:3001/api/query?query=driverAvgPayByDay'),
                axios.get('http://localhost:3001/api/query?query=rideRequestsByBoroughPerHour'),
                axios.get('http://localhost:3001/api/query?query=rideRequestsByDistance'),
                axios.get('http://localhost:3001/api/query?query=payAndRequestsByDay'),
                axios.get('http://localhost:3001/api/query?query=payAndRequestsByBorough'),
                axios.get('http://localhost:3001/api/query?query=weatherNormalization')
            ]);
        //We are storing our returned data into our useState variables
            setAreaChartData(driverPayResponseData.data);
            setBubbleChartData(rideRequestsByBorough.data);
            setBarChartData(rideRequestsByDistance.data);
            setCardData1(payRequestByDay.data);
            setCardData2(payRequestByBorough.data);
            setWeatherData(weatherNormalizationData.data);
    

        } catch(error) {
            console.log("error fetching data:", error)
        }
    };
    handleQueries();
  },[]);


  //This useEffect will run when there are changes to cardData based on the user interacting with the drop down component.
  useEffect(() => {
    const handleDateChangesForCardComponent = (data: [any, any, any][]) => {
        const extractDayData = (day: string) => {
            if (date === 'All') {
                let avgPayAllDays = 0;
                let avgReqAllDays = 0;
                data.forEach((row) => {
                    const [, avgPay, requests] = row;
                    avgPayAllDays += avgPay;
                    avgReqAllDays += requests;
                })
                setCard1(Math.round(avgPayAllDays / 7 * 100) / 100);
                setCard2(formatNumberWithCommas(Math.round(avgReqAllDays / 7)))
            }
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
            if (borough === 'All') {
                let avgPayAllBoroughs = 0;
                let avgReqAllBoroughs = 0;
                data.forEach((row) => {
                    const [, avgPay, requests] = row;
                    avgPayAllBoroughs += avgPay;
                    avgReqAllBoroughs += requests;
                })
                setCard3(Math.round(avgPayAllBoroughs / 7 * 100) / 100);
                setCard4(formatNumberWithCommas(Math.round(avgReqAllBoroughs / 7)))
            }
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


 //In the code below, we are rendering the graphs and charts on our page. We are passing in correct props that are defined for each component
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

<Grid container spacing={2} sx={{ padding: 7 }}>
    <Grid item xs={12} md={3}>
        <CardComponent
        cardTitle = "Average Driver Pay/Ride by Day Of Week"
        value =  {card1}
        description = {date === 'All' ? 'All Days of Week' : date }
       
        />
    </Grid>

    <Grid item xs={12} md={3} >
        <CardComponent
        cardTitle = "Average Ride Requests by Day of Week"
        value = {card2}
        description = {date === 'All' ? 'All Days of Week' : date }
        />
    </Grid>

    <Grid item xs={12} md={3}>
        <CardComponent
        cardTitle = "Average Driver Pay/Ride by Borough"
        value = {card3}
        description = {borough === 'All' ? 'All Boroughs' : borough }
        />
    </Grid>

    <Grid item xs={12} md={3} >
        <CardComponent
        cardTitle = "Average Ride Requests by Borough"
        value = {card4}
        description = {borough === 'All' ? 'All Boroughs' : borough }
        />
    </Grid>
<Grid item xs={12} md={3.5} sx={{ height: 450, marginTop: 2 }}>
    <AreaChartUberLyft 
        rawData = {areaChartData}
        toggleOption={business}
    />
</Grid>
<Grid item xs={12} md={5} sx={{ height: 450, marginTop: 2  }}>
    <BubbleChart 
    rawData = {bubbleChartData}
    toggleOption={borough}
    
    />
</Grid>
<Grid item xs={12} md={3.5} sx={{ height: 450,  marginTop: 2  }}>
    <StackedBarChart 
    rawData= {barChartData}
    toggleOption = {business}
    
    />
</Grid>
<Grid item xs={12} md={12} sx={{ height: 450, marginBottom: 1}}>
<WeatherLineChart
    rawData = {weatherData}
/>

</Grid>

</Grid>


</div>

    )
}




export default Dashboard
