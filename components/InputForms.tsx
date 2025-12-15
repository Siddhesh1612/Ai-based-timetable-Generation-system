import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Users, Box, AlertCircle } from 'lucide-react';
import { Course, Faculty, Room, CourseType } from '../types';

interface InputFormsProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  faculty: Faculty[];
  setFaculty: React.Dispatch<React.SetStateAction<Faculty[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

export const InputForms: React.FC<InputFormsProps> = ({
  courses, setCourses,
  faculty, setFaculty,
  rooms, setRooms
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'faculty' | 'rooms'>('courses');
  const [error, setError] = useState<string | null>(null);

  // Local state for new entries
  const [newCourse, setNewCourse] = useState({ name: '', type: CourseType.MAJOR, credits: 3 });
  const [newFaculty, setNewFaculty] = useState({ name: '', expertise: '' });
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 40, hasLab: false });

  const clearError = () => setError(null);

  const handleTabChange = (tab: 'courses' | 'faculty' | 'rooms') => {
    setActiveTab(tab);
    clearError();
  };

  const addCourse = () => {
    const trimmedName = newCourse.name.trim();
    if (!trimmedName) {
      setError("Course name cannot be empty.");
      return;
    }
    if (isNaN(newCourse.credits) || newCourse.credits < 1 || newCourse.credits > 6) {
      setError("Credits must be between 1 and 6.");
      return;
    }

    setCourses([...courses, { ...newCourse, name: trimmedName, id: `c-${Date.now()}` }]);
    setNewCourse({ name: '', type: CourseType.MAJOR, credits: 3 });
    clearError();
  };

  const addFaculty = () => {
    if (!newFaculty.name.trim()) return;
    setFaculty([...faculty, { 
      id: `f-${Date.now()}`, 
      name: newFaculty.name, 
      expertise: newFaculty.expertise.split(',').map(s => s.trim()).filter(s => s) 
    }]);
    setNewFaculty({ name: '', expertise: '' });
  };

  const addRoom = () => {
    if (!newRoom.name.trim()) return;
    setRooms([...rooms, { ...newRoom, id: `r-${Date.now()}` }]);
    setNewRoom({ name: '', capacity: 40, hasLab: false });
  };

  const removeId = <T extends { id: string }>(list: T[], setList: (l: T[]) => void, id: string) => {
    setList(list.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTabChange('courses')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'courses' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={18} /> Courses
        </button>
        <button
          onClick={() => handleTabChange('faculty')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'faculty' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={18} /> Faculty
        </button>
        <button
          onClick={() => handleTabChange('rooms')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'rooms' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Box size={18} /> Rooms
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* COURSES INPUT */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Intro to AI"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Course Category</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value as CourseType })}
                >
                  {Object.values(CourseType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Credits (1-6)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="md:col-span-1">
                 <button onClick={addCourse} className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-md transition-colors">
                  <Plus size={18} />
                 </button>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Course List ({courses.length})</h3>
              {courses.length === 0 && <p className="text-sm text-slate-400 italic">No courses added yet.</p>}
              {courses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-medium text-slate-800">{course.name}</div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        course.type === CourseType.MAJOR ? 'bg-blue-100 text-blue-700' :
                        course.type === CourseType.SKILL ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{course.type}</span>
                      <span className="text-xs text-slate-400 flex items-center">{course.credits} Credits</span>
                    </div>
                  </div>
                  <button onClick={() => removeId(courses, setCourses, course.id)} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACULTY INPUT */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Name</label>
                <input
                  type="text"
                  placeholder="Dr. Smith"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Expertise (comma separated)</label>
                <input
                  type="text"
                  placeholder="AI, ML, Data Science"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFaculty.expertise}
                  onChange={(e) => setNewFaculty({ ...newFaculty, expertise: e.target.value })}
                />
              </div>
              <div className="md:col-span-1">
                 <button onClick={addFaculty} className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-md transition-colors">
                  <Plus size={18} />
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Faculty List ({faculty.length})</h3>
              {faculty.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium text-slate-800">{f.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Exp: {f.expertise.join(', ')}</div>
                  </div>
                  <button onClick={() => removeId(faculty, setFaculty, f.id)} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROOMS INPUT */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Room Name/No</label>
                <input
                  type="text"
                  placeholder="101-A"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Capacity</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="md:col-span-3">
                 <label className="flex items-center gap-2 text-sm text-slate-700 mt-6 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        checked={newRoom.hasLab}
                        onChange={(e) => setNewRoom({...newRoom, hasLab: e.target.checked})}
                    />
                    Is Lab?
                 </label>
              </div>
              <div className="md:col-span-1">
                 <button onClick={addRoom} className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-md transition-colors">
                  <Plus size={18} />
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Room List ({rooms.length})</h3>
              {rooms.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Cap: {r.capacity} • {r.hasLab ? 'Lab Equip' : 'Lecture Hall'}</div>
                  </div>
                  <button onClick={() => removeId(rooms, setRooms, r.id)} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};