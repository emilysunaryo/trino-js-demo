import React, {useEffect, useState, PureComponent} from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import { Paper, Typography } from '@mui/material';

//can be toggled by business only!!!!!


interface AreaChartUberLyftProps {
  rawData: [any, any, any][];
  toggleOption: string;
}
interface TransformedDataItem {
  name: string;
  Lyft: number;
  Uber: number;
}



const transformData = (data: [string, number, string][]): TransformedDataItem[] => {
  const daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize result array with all days and default values
  const result: TransformedDataItem[] = daysOfWeek.map(day => ({
    name: day,
    Lyft: 0,
    Uber: 0
  }));

  // Populate the result array with the actual values from raw data
  data.forEach(([day, value, type]) => {
    const dayData = result.find(d => d.name === day);
    if (dayData) {
      dayData[type as 'Lyft' | 'Uber'] = value;
    }
  });

  return result;
};

const domain: number[] = [30, 50];

const AreaChartUberLyft: React.FC<AreaChartUberLyftProps> = ({rawData, toggleOption}) => {

    const chartData = transformData(rawData);

  return (
  <Paper elevation={1} sx={{padding: 3, height: '84%'}}>
    <Typography variant = "h6" sx = {{color: 'gray', fontSize: 15, fontFamily: 'Lato, Ariel, sans-serif'}}>Avg Driver Pay/Ride Based on Day of Week</Typography>
      <ResponsiveContainer width="100%" height='85%'>
        <AreaChart
      
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick = {{fontSize: 10}}/>
          <YAxis tick = {{fontSize: 12}} domain ={domain}/>
          <Tooltip contentStyle = {{fontSize: 13}}/>
          {(toggleOption === 'All' || toggleOption === 'Uber') && <Area type="monotone" dataKey="Uber" stackId="2" stroke="#82ca9d" fill="#82ca9d" />}
          {(toggleOption === 'All' || toggleOption === 'Lyft') && <Area type="monotone" dataKey="Lyft" stackId="2" stroke="#8884d8" fill="#8884d8" />}
          <Legend wrapperStyle={{fontSize: 13}}/>
        </AreaChart>
      </ResponsiveContainer>
  </Paper>
       
  
    );
  
}




export default AreaChartUberLyft