import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Paper } from '@mui/material';


interface RadarChartProps {
  rawData: [any, any, any][];
  toggleOption: string;

}

interface TransformedRadarChartData {
  distance: string;
  Uber: number;
  Lyft: number;
}

const transformData = (data: [string, string, number][]):  (TransformedRadarChartData[]) => {
  const distance: string[] = ['0-1 miles', '1-3 miles', '3-5 miles', '5-10 miles', '10+ miles'];

  const resultDistance: TransformedRadarChartData[] = distance.map(distanceRange => ({
    distance: distanceRange, 
    Uber: 0,
    Lyft: 0
  }));
  
  data.forEach(([distance_range, business, value]) => {
    const distanceData = resultDistance.find(d => d.distance === distance_range);
    if (distanceData) {
      distanceData[business as 'Lyft' | 'Uber'] = value
    }

  });

  return resultDistance
};



const StackedBarChartDistance: React.FC<RadarChartProps> = ({rawData, toggleOption}) => {
const chartData = transformData(rawData);

 return (
    <div style = {{backgroundColor: '#fff', height: '92%'}}>
    <Paper elevation={1} sx={{padding: 3, height: '92%'}}>
      <Typography sx={{color: 'gray'}}> Ride Requests based on Trip Distance</Typography>
      <ResponsiveContainer width="100%" height="95%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="distance" tick = {{fontSize: 11}}  tickFormatter={(distance) => distance} />
         
          <YAxis tick = {{fontSize: 12}} />
          <Tooltip contentStyle = {{fontSize: 15}}/>
          <Legend wrapperStyle={{fontSize: 11}}/>
         {(toggleOption === 'All' || toggleOption === 'Uber') && <Bar dataKey="Uber" stackId="a" fill="#ffc658" />}
          {(toggleOption === 'All' || toggleOption === 'Lyft') && <Bar dataKey="Lyft" stackId="a" fill='#82ca9d' />}
        </BarChart>
      </ResponsiveContainer>
      </Paper>
    </div>
    );

}

export default StackedBarChartDistance