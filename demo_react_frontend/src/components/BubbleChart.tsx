import React, { PureComponent } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { Paper, Typography } from '@mui/material';



interface BubbleChartProps {
  rawData: [string, string, number][];
  toggleOption: string;
}


interface TransformedDataItem {
  hour: string;
  index: number;
  value: number;
}


const parseDomain = (data: [string, string, number][]): number => {
  let maxValue: number = 0;
  data.forEach(([hour, location, value]) => {
    if (maxValue < value) {
      maxValue = value;
    }
  })
  return maxValue;
}
    


  

const transformData = (data: [string, string, number][]): { [location: string]: TransformedDataItem[] } => {
  const transformedData: { [location: string]: TransformedDataItem[] } = {};
  data.forEach(([hour, location, value]) => {
    if (!transformedData[location]) {
      transformedData[location] = [];
    }
    const index = 1;
    // Add the hour and value to the respective location
    transformedData[location].push({ hour, index, value });
  });

  return transformedData;
};

const normalizeData = ( data: [string, string, number][]): [string, string, number][] => {
  const transformedData: [string, string, number][] = [];
  data.forEach(([hour, location, value]) => {
    const normalizedVal = value / 1000;
    transformedData.push([hour, location, normalizedVal]);
  })
  return transformedData;
} 


const BubbleChart: React.FC<BubbleChartProps> = ({rawData, toggleOption}) => {
  const normalizedData = normalizeData(rawData);
  const domain = [0, parseDomain(normalizedData)];
  console.log("testing domain or max value from all data points:", domain);
  const range = [16, 300];

  const chartData = transformData(normalizedData);
  console.log("testing chart data after normalization AND transformation:", chartData)

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
  
          <p>{data.hour}</p>
          <p>
            <span>value: </span>
            {data.value}
          </p>
        </div>
      );
    }

    return null;
  };

    return (
      <div style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10 }}>
        <Paper elevation={1} sx={{padding: 3, height: '100%'}}>
        <Typography variant = "h6" sx = {{color: 'gray', fontSize: 15, fontFamily: 'Lato, Ariel, sans-serif', marginBottom: 2}}> Ride Requests in NY Boroughs By Hour</Typography>
          <ResponsiveContainer width="100%" height={66}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="hour"
                name="hour"
                interval={0}
                tick={{ fontSize: 0 }}
                tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Manhattan', position: 'insideRight', fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
              <Scatter data={chartData.Manhattan} fill="#78a5f8" />
            </ScatterChart>
          </ResponsiveContainer>
      

  
          <ResponsiveContainer width="100%" height={60}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="hour"
                name="hour"
                interval={0}
                tick={{ fontSize: 0 }}
                tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Staten Island', position: 'insideRight', fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
              <Scatter data={chartData["Staten Island"]} fill='#8b80f7' />
            </ScatterChart>
          </ResponsiveContainer>
   

          <ResponsiveContainer width="100%" height={60}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="hour"
                name="hour"
                interval={0}
                tick={{ fontSize: 0 }}
                tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Brooklyn', position: 'insideRight' , fontSize: 12}}
              />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
              <Scatter data={chartData.Brooklyn} fill='#E03FD8'/>
            </ScatterChart>
          </ResponsiveContainer>
  
          <ResponsiveContainer width="100%" height={60}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="hour"
                name="hour"
                interval={0}
                tick={{ fontSize: 0 }}
                tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Queens', position: 'insideRight' , fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
              <Scatter data={chartData.Queens} fill='#9b83f8'/>
            </ScatterChart>
          </ResponsiveContainer>
    
          <ResponsiveContainer width="100%" height={60}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                type="category"
                dataKey="hour"
                name="hour"
                interval={0}
                tickLine={{ transform: 'translate(0, -6)' }}
                tick={{ fontSize: 6 }}
              />
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{ value: 'The Bronx', position: 'insideRight', fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
              <Scatter data={chartData.Bronx} fill="#d2dbfc" />
            </ScatterChart>
          </ResponsiveContainer>
    

          <Typography variant = "h6" sx = {{color: 'gray', fontSize: 12, fontFamily: 'Lato, Ariel, sans-serif', textAlign: 'left'}}> * Note: Data scaled down by 1000 </Typography>
        </Paper>
      </div>
    );
}


export default BubbleChart