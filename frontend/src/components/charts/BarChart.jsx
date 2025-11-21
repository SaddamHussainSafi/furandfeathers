import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <p className="text-white text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-white/80 text-xs">
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarChart = ({ data, dataKey = 'value', color = '#10b981', height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[8, 8, 0, 0]}
        />
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChart;