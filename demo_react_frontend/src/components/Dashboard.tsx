import React, {useEffect, useState} from 'react';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, Container, SelectChangeEvent, Button} from '@mui/material'
import Heatmap  from './Heatmap'
import BubbleChart from './BubbleChart'
import RadarChart from './RadarChart'
import AreaChartUberLyft from './AreaChartUberLyft'
import SelectComponent from './SelectComponent';
import './styles/DashboardStyle.css'



function Dashboard() {
    const [date, setDate] = useState<string>('');
    const [borough, setBorough] = useState<string>('');
    const [filters, setFilters] = useState<{date: string, borough:string}>({date: '', borough: ''});


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
    <CssBaseline /> 
    <AppBar position="static" style={{backgroundColor: '#bebdb8'}}>
    <Toolbar>
        <Typography variant="h6" sx ={{flexGrow: 1, fontSize: 20, fontFamily:'Lato, Ariel, sans-serif', textAlign: 'left'}}>
            Rideshare Analysis in NYC Metropolitan Area
        </Typography>
    </Toolbar>
    </AppBar>

<Container sx = {{mt: 2}}>
    <Grid container spacing = {2}>
        <Grid item xs={12} md ={2}>
            <SelectComponent
                helperText = "Select Day of Week"
                value = {date}
                onChange = {handleDateChange}
                options={dateFilterOptions} 
            />
        </Grid>
        <Grid item xs={12} md ={2}>
            <SelectComponent
                helperText = "Select Boroughs"
                value = {borough}
                onChange = {handleBoroughChange}
                options={boroughFilterOptions} 
            />
        </Grid>

        <Button></Button>

    </Grid>

</Container>

<Grid container spacing={3} sx={{ padding: 2 }}>
    <Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2 }}>
        <AreaChartUberLyft />
    </Grid>
    <Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
        <AreaChartUberLyft />
    </Grid>
    <Grid item xs={12} md={4} sx={{ height: 450, marginBottom: 1, marginTop: 2  }}>
        <AreaChartUberLyft />
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
