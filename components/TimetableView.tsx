import React from 'react';
import { Download, Printer } from 'lucide-react';
import { ScheduledClass, DAYS_OF_WEEK, TIME_SLOTS, Course, Faculty, Room, CourseType } from '../types';

interface TimetableViewProps {
  schedule: ScheduledClass[];
  courses: Course[];
  faculty: Faculty[];
  rooms: Room[];
}

export const TimetableView: React.FC<TimetableViewProps> = ({ schedule, courses, faculty, rooms }) => {
  
  const getCellData = (day: string, slot: string) => {
    return schedule.filter(s => s.day === day && s.timeSlot === slot);
  };

  const getCourse = (id: string) => courses.find(c => c.id === id);
  const getFaculty = (id: string) => faculty.find(f => f.id === id);
  const getRoom = (id: string) => rooms.find(r => r.id === id);

  const getCourseColor = (type?: CourseType) => {
    switch (type) {
      case CourseType.MAJOR: return 'bg-blue-50 border-blue-200 text-blue-800';
      case CourseType.MINOR: return 'bg-purple-50 border-purple-200 text-purple-800';
      case CourseType.SKILL: return 'bg-amber-50 border-amber-200 text-amber-800';
      case CourseType.ELECTIVE: return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case CourseType.VOCATIONAL: return 'bg-rose-50 border-rose-200 text-rose-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const downloadCSV = () => {
    const headers = ['Day', 'Time Slot', 'Course Name', 'Category', 'Credits', 'Faculty', 'Room'];
    
    // Sort schedule by Day then Time for better readability
    const sortedSchedule = [...schedule].sort((a, b) => {
      const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return TIME_SLOTS.indexOf(a.timeSlot) - TIME_SLOTS.indexOf(b.timeSlot);
    });

    const rows = sortedSchedule.map(cls => {
      const course = getCourse(cls.courseId);
      const fac = getFaculty(cls.facultyId);
      const room = getRoom(cls.roomId);
      
      return [
        cls.day,
        cls.timeSlot,
        course?.name || 'Unknown',
        course?.type || '',
        course?.credits || '',
        fac?.name || 'Unknown',
        room?.name || 'Unknown'
      ].map(field => `"${field}"`).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `edutime_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Generated Master Timetable</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-xs no-print">
            {Object.values(CourseType).map(type => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${getCourseColor(type).split(' ')[0]} border ${getCourseColor(type).split(' ')[1]}`}></span>
                <span className="text-slate-600">{type}</span>
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-300 no-print"></div>

          <div className="flex gap-2 no-print">
            <button 
              onClick={downloadCSV} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              title="Download as CSV"
            >
              <Download size={14} /> <span>CSV</span>
            </button>
            <button 
              onClick={handlePrint} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer size={14} /> <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
            
            {/* Header Row */}
            <div className="bg-slate-100 p-3 rounded-md font-bold text-slate-500 text-center text-xs uppercase tracking-wider flex items-center justify-center">
              Time / Day
            </div>
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="bg-slate-100 p-3 rounded-md font-bold text-slate-700 text-center text-sm">
                {day}
              </div>
            ))}

            {/* Time Slots Rows */}
            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot}>
                <div className="bg-slate-50 p-3 rounded-md font-semibold text-slate-500 text-xs flex items-center justify-center border border-slate-100">
                  {slot}
                </div>
                {DAYS_OF_WEEK.map((day) => {
                  const classes = getCellData(day, slot);
                  return (
                    <div key={`${day}-${slot}`} className="bg-white border border-slate-200 rounded-md min-h-[120px] p-1.5 space-y-1.5 hover:bg-slate-50 transition-colors">
                      {classes.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-300 text-xs italic">
                          Free Slot
                        </div>
                      ) : (
                        classes.map(cls => {
                          const course = getCourse(cls.courseId);
                          const fac = getFaculty(cls.facultyId);
                          const room = getRoom(cls.roomId);
                          return (
                            <div 
                              key={cls.id} 
                              className={`p-2 rounded border text-xs shadow-sm ${getCourseColor(course?.type)}`}
                            >
                              <div className="font-bold truncate">{course?.name || 'Unknown Course'}</div>
                              <div className="flex justify-between items-center mt-1 opacity-80 text-[10px] uppercase tracking-wide font-semibold">
                                <span className="truncate max-w-[50%]">{fac?.name || 'Staff'}</span>
                                <span>{room?.name || 'TBA'}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};