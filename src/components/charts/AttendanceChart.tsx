import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { mockMonthlyAttendanceStats } from '../../data/mockAttendance';
import { mockSubjectPerformance } from '../../data/mockTests';

export const AttendanceChart: React.FC<{ data?: typeof mockMonthlyAttendanceStats }> = ({
  data = mockMonthlyAttendanceStats,
}) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6B57" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2E6B57" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE6D8" vertical={false} />
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
          <YAxis domain={[70, 100]} stroke="#888888" fontSize={12} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFDF8',
              borderRadius: '12px',
              border: '1px solid #E6DDCF',
              boxShadow: '0 10px 25px rgba(23,63,53,0.08)',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value}% Attendance`, 'Rate']}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#173F35"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#attendanceColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceChart: React.FC<{ data?: typeof mockSubjectPerformance }> = ({
  data = mockSubjectPerformance,
}) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE6D8" vertical={false} />
          <XAxis dataKey="subject" stroke="#888888" fontSize={11} tickLine={false} interval={0} />
          <YAxis domain={[0, 100]} stroke="#888888" fontSize={12} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFDF8',
              borderRadius: '12px',
              border: '1px solid #E6DDCF',
              boxShadow: '0 10px 25px rgba(23,63,53,0.08)',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="score" name="Student Score" fill="#173F35" radius={[6, 6, 0, 0]} />
          <Bar dataKey="classAvg" name="Batch Average" fill="#C99A3D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FeeCollectionChart: React.FC = () => {
  const collectionData = [
    { month: 'Apr', collected: 160000, target: 180000 },
    { month: 'May', collected: 175000, target: 185000 },
    { month: 'Jun', collected: 190000, target: 195000 },
    { month: 'Jul', collected: 205000, target: 210000 },
    { month: 'Aug', collected: 198000, target: 210000 },
    { month: 'Sep', collected: 184500, target: 210000 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={collectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="feeColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B85C45" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#B85C45" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE6D8" vertical={false} />
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            tickFormatter={(val) => `₹${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFDF8',
              borderRadius: '12px',
              border: '1px solid #E6DDCF',
              boxShadow: '0 10px 25px rgba(23,63,53,0.08)',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collection']}
          />
          <Area
            type="monotone"
            dataKey="collected"
            stroke="#B85C45"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#feeColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
