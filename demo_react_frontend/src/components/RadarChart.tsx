import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer} from 'recharts';
import { Typography, Paper } from '@mui/material';

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default class Example extends PureComponent {

  render() {
    return (
    <div style = {{backgroundColor: '#fff'}}>
      <Paper elevation={1} sx={{padding: 2, height: '100%'}}>
    <Typography sx={{color: 'gray'}}> Something to do with Distance I forgot...</Typography>
      <ResponsiveContainer width={400} height={425}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick = {{fontSize: 12}} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick = {{fontSize: 10}} />
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Legend  wrapperStyle={{fontSize: 13}}/>
        </RadarChart>
      </ResponsiveContainer>
      </Paper>
      </div>
    );
  }
}