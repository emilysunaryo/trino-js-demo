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



function Dashboard() {
    const [date, setDate] = useState<string>('');
    const [borough, setBorough] = useState<string>('');
    const [filters, setFilters] = useState<{date: string, borough:string}>({date: '', borough: ''});
    const [testData, setTestData] = useState<number[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);



 //renders once when the page gets loaded fully
  useEffect(() => {
    const handleQuery = async () => {
        try {
            const responseData = await axios.get('http://localhost:3001/api/query1');
            console.log("testing data from server in react frontend:", responseData.data);
            setTestData(responseData.data);
            setLoading(false);
        } catch(error) {
            console.log("error fetching data:", error)
        }
    };
    handleQuery();
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

    const handleSubmit = () => {
        setFilters({ date, borough})
    }

    const dateFilterOptions = [
        {value: 'Monday', label: 'Monday'},
        {value: 'Tuesday', label: 'Tuesday'},
        {value: 'Wednesday', label: 'Wednesday'},
        {value: 'Thursday', label: 'Thursday'},
        {value: 'Friday', label: 'Friday'},
        {value: 'Saturday', label: 'Saturday'},
        {value: 'Sunday', label: 'Sunday'}
    ]

    const boroughFilterOptions = [
        {value: 'The Bronx', label: 'The Bronx'},
        {value: 'Brooklyn', label: 'Brooklyn'},
        {value: 'Manhattan', label: 'Manhattan'},
        {value: 'Queens', label: 'Queens'},
        {value: 'Staten Island', label: 'Staten Island'}, 
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
        <Box sx={{paddingLeft: 5}}>
            <SelectComponent
                helperText = "Select Boroughs"
                value = {borough}
                onChange = {handleBoroughChange}
                options={boroughFilterOptions} 
                />
         </Box>
     </Box>




<Grid container spacing={5} sx={{ padding: 5 }}>
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
    <Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 1, marginTop: 2 }}>
        <AreaChartUberLyft />
    </Grid>
    <Grid item xs={12} md={5} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
        <BubbleChart />
    </Grid>
    <Grid item xs={12} md={3.5} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
        <RadarChart />
    </Grid>
    <Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2 }}>
        <AreaChartUberLyft />
    </Grid>
    <Grid item xs={12} md={8} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
        <AreaChartUberLyft />
    </Grid>
</Grid>
</div>

    )
}




export default Dashboard
