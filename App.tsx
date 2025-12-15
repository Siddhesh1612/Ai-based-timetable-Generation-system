import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Settings2, Sparkles, AlertCircle } from 'lucide-react';
import { Course, Faculty, Room, ScheduledClass, CourseType } from './types';
import { InputForms } from './components/InputForms';
import { TimetableView } from './components/TimetableView';
import { Dashboard } from './components/Dashboard';
import { generateTimetableWithGemini } from './services/geminiService';

const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Artificial Intelligence', type: CourseType.MAJOR, credits: 4 },
  { id: 'c2', name: 'Machine Learning', type: CourseType.MAJOR, credits: 4 },
  { id: 'c3', name: 'Data Ethics', type: CourseType.MINOR, credits: 2 },
  { id: 'c4', name: 'Python Programming', type: CourseType.SKILL, credits: 3 },
  { id: 'c5', name: 'Design Thinking', type: CourseType.VOCATIONAL, credits: 3 },
  { id: 'c6', name: 'Cognitive Psychology', type: CourseType.ELECTIVE, credits: 3 },
  { id: 'c7', name: 'Cloud Computing', type: CourseType.MAJOR, credits: 4 }
];

const MOCK_FACULTY: Faculty[] = [
  { id: 'f1', name: 'Dr. A. Sharma', expertise: ['AI', 'ML', 'Python'] },
  { id: 'f2', name: 'Prof. J. Doe', expertise: ['Ethics', 'Psychology', 'Design'] },
  { id: 'f3', name: 'Dr. K. Lee', expertise: ['Cloud', 'Networks', 'Security'] }
];

const MOCK_ROOMS: Room[] = [
  { id: 'r1', name: 'LH-101', capacity: 60, hasLab: false },
  { id: 'r2', name: 'Lab-A', capacity: 30, hasLab: true },
  { id: 'r3', name: 'LH-102', capacity: 45, hasLab: false }
];

const App: React.FC = () => {
  const [view, setView] = useState<'inputs' | 'schedule' | 'dashboard'>('inputs');
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [schedule, setSchedule] = useState<ScheduledClass[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDemoData = () => {
    setCourses(MOCK_COURSES);
    setFaculty(MOCK_FACULTY);
    setRooms(MOCK_ROOMS);
    setSchedule([]); // Clear any previous schedule
    setView('inputs');
  };

  const handleGenerate = async () => {
    if (courses.length === 0 || faculty.length === 0 || rooms.length === 0) {
      setError("Please add at least one course, faculty, and room before generating.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTimetableWithGemini(courses, faculty, rooms);
      setSchedule(result);
      setView('schedule');
    } catch (err: any) {
      setError("Failed to generate schedule. Make sure API Key is set and try again. Details: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <Sparkles className="text-indigo-400" />
            <span>EduTime AI</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">AI Powered</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('inputs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'inputs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800'}`}
          >
            <Settings2 size={20} />
            <span>Configuration</span>
          </button>
          <button 
            onClick={() => setView('schedule')}
            disabled={schedule.length === 0}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'schedule' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'}`}
          >
            <Calendar size={20} />
            <span>Timetable</span>
          </button>
          <button 
            onClick={() => setView('dashboard')}
            disabled={schedule.length === 0}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'}`}
          >
            <LayoutDashboard size={20} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Status</p>
            <p>Courses: {courses.length}</p>
            <p>Faculty: {faculty.length}</p>
            <p>Rooms: {rooms.length}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            {view === 'inputs' && 'Data Configuration'}
            {view === 'schedule' && 'Master Timetable'}
            {view === 'dashboard' && 'Usage Analytics'}
          </h1>
          
          <div className="flex gap-3">
            {view === 'inputs' && (
               <>
                <button 
                  onClick={loadDemoData}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Load Demo Data
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Timetable
                    </>
                  )}
                </button>
               </>
            )}
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="mx-8 mt-4 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* View Content */}
        <div className="flex-1 p-8 overflow-hidden h-full">
           {view === 'inputs' && (
             <InputForms 
               courses={courses} setCourses={setCourses}
               faculty={faculty} setFaculty={setFaculty}
               rooms={rooms} setRooms={setRooms}
             />
           )}
           {view === 'schedule' && (
             <TimetableView 
                schedule={schedule}
                courses={courses}
                faculty={faculty}
                rooms={rooms}
             />
           )}
           {view === 'dashboard' && (
             <Dashboard 
               schedule={schedule}
               courses={courses}
               faculty={faculty}
               rooms={rooms}
             />
           )}
        </div>

      </main>
    </div>
  );
};

export default App;