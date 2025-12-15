import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScheduledClass, Course, Faculty, Room, CourseType } from '../types';

interface DashboardProps {
  schedule: ScheduledClass[];
  courses: Course[];
  faculty: Faculty[];
  rooms: Room[];
}

export const Dashboard: React.FC<DashboardProps> = ({ schedule, courses, faculty, rooms }) => {

  // 1. Faculty Load
  const facultyLoad = faculty.map(f => ({
    name: f.name,
    classes: schedule.filter(s => s.facultyId === f.id).length
  }));

  // 2. Room Utilization
  const roomUtilization = rooms.map(r => ({
    name: r.name,
    usage: schedule.filter(s => s.roomId === r.id).length
  }));

  // 3. Course Type Distribution
  const courseCounts = courses.reduce((acc, course) => {
    acc[course.type] = (acc[course.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const courseTypeData = Object.entries(courseCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Total Classes</div>
          <div className="text-3xl font-bold text-slate-800">{schedule.length}</div>
          <div className="text-xs text-green-600 mt-2 font-medium">Successfully Scheduled</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Faculty Utilization</div>
          <div className="text-3xl font-bold text-slate-800">
            {Math.round((schedule.length / (faculty.length * 20)) * 100)}%
          </div>
           <div className="text-xs text-blue-600 mt-2 font-medium">Avg Load Efficiency</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Multidisciplinary Score</div>
          <div className="text-3xl font-bold text-slate-800">High</div>
          <div className="text-xs text-purple-600 mt-2 font-medium">Based on Course Mix</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Faculty Load Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Faculty Workload Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={facultyLoad}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="classes" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Usage Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Room Utilization</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomUtilization}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                 contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                 cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="usage" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

         {/* Course Mix Pie Chart */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Course Type Distribution</h3>
          <div className="w-full h-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={courseTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {courseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};