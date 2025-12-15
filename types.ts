export enum CourseType {
  MAJOR = 'Major',
  MINOR = 'Minor',
  SKILL = 'Skill Enhancement',
  ELECTIVE = 'Open Elective',
  VOCATIONAL = 'Vocational'
}

export interface Course {
  id: string;
  name: string;
  type: CourseType;
  credits: number;
}

export interface Faculty {
  id: string;
  name: string;
  expertise: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  hasLab: boolean;
}

export interface ScheduledClass {
  id: string;
  courseId: string;
  facultyId: string;
  roomId: string;
  day: string;
  timeSlot: string;
}

export interface ScheduleConstraint {
  startHour: number; // 9 for 9 AM
  endHour: number;   // 17 for 5 PM
  slotDuration: number; // in minutes, e.g., 60
  days: string[];
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const TIME_SLOTS = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'];
