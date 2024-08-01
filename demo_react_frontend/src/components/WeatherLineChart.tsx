/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, CustomizedProps, LabelList, TooltipProps } from 'recharts';
import { Paper, Typography } from '@mui/material';



interface WeatherLineChartProps {
  rawData: [any, any, any, any, any, any, any][];
}


interface CustomizedWeatherDataProps {
 weather_index: number;
 days_count: number;
 total_ride_requests: number;
 avg_tmin: number;
 avg_tmax: number;
 avg_prcp: number;
 avg_snow: number;
}



interface WeatherLineLabelProps {
  x: number;
  y: number;
  value: number;
}



const transformData = (data: [number, number, number, number, number, number, number][]): CustomizedWeatherDataProps[] => {
  return data.map(([weather_index, days_count, total_ride_requests, avg_tmin, avg_tmax, avg_prcp, avg_snow]) => ({
    weather_index,
    days_count,
    total_ride_requests,
    avg_tmin,
    avg_tmax,
    avg_prcp,
    avg_snow
  }));
}



const WeatherLineChartCustomizedLabel: React.FC<any> = ({x, y, value}) => {
  return (
    <text x={x} y={y} dy={-15} fill='gray' fontSize={12} textAnchor="middle">
      {value}
    </text>
  )
}


const normalizeData = ( data: [number, number, number, number, number, number, number][]): [number, number, number, number, number, number, number][] => {
  const transformedData: [number, number, number, number, number, number, number][] = [];
  data.forEach(([weather_index, days_count, total_ride_requests, avg_tmin, avg_tmax, avg_prcp, avg_snow]) => {
    const normalizedVal = Math.round(total_ride_requests / 1000);
    transformedData.push([weather_index, days_count, normalizedVal, avg_tmin, avg_tmax, avg_prcp, avg_snow]);
  })
  return transformedData;
} 

const WeatherLineChart: React.FC<WeatherLineChartProps> = ({rawData}) => {
  const normalizedData = normalizeData(rawData);
  const chartData = transformData(normalizedData);
  const renderTooltip = (props: any) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #999',
            margin: 0,
            padding: 10,
            fontSize: 13
          }}
        >

          <p>
          <span> <strong>Weather Composite Index</strong> </span>
            {data.weather_index}
            </p>
          <p>
            <span><strong>Total Tide Requests</strong> </span>
            {data.total_ride_requests}
          </p>
          <p>
            <span> <strong>Average Min Temp F: </strong> </span>
            {data.avg_tmin}
            
            </p>
            <p>
            <span> <strong>Average Max Temp F:</strong> </span>
            {data.avg_tmax}
            </p>
            <p>
            <span> <strong>Average Percipitation: </strong> </span>
            {data.avg_prcp}
            </p>
            <p>
            <span><strong>Average Snow: </strong></span>
            {data.avg_snow}
            </p>
        </div>
      );
    }

    return null;
  };
    return (
    <Paper elevation={1} sx={{padding: 3, height: '100%'}}>
      <Typography variant = "h6" sx = {{color: 'gray', fontSize: 17, fontFamily: 'Lato, Ariel, sans-serif', marginBottom: 2}}> Average Ride Requests based on Weather Composite Index</Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          width={500}
          height={310}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weather_index" height={25} tick={{fontSize:10}}  />
          <YAxis  dataKey = "total_ride_requests" tick={{ fontSize: 13 }}/>
          <Tooltip  wrapperStyle={{fontSize: 13}} content={renderTooltip}/>
      
          <Line type="monotone" dataKey="total_ride_requests" stroke="#8884d8" strokeWidth={2}>
            <LabelList
              dataKey="total_ride_requests"
              content={(props: any) => {
                const { x, y, index } = props;
                if (index === undefined) return null;
                const dataPoint = chartData[index];
                return (
                  <WeatherLineChartCustomizedLabel
                    x={x}
                    y={y}
                    value={dataPoint.total_ride_requests}
                  />
                );
              }}
            />
          </Line>
          </LineChart>
      </ResponsiveContainer>
      <Typography variant = "h6" sx = {{color: 'gray', fontSize: 12, fontFamily: 'Lato, Ariel, sans-serif'}}> Weather Parameters (tmin, tmax, precipitation, snow)</Typography>
      <Typography variant = "h6" sx = {{color: 'gray', fontSize: 9, fontFamily: 'Lato, Ariel, sans-serif', marginBottom: 2, textAlign: 'left'}}> *Note: Data scaled down by 1000</Typography>
      </Paper>

    );
}



export default WeatherLineChart
