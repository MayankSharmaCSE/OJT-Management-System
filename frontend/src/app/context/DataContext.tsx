import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'completed';
  created_by: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Submission {
  id: number;
  task_id: number;
  student_id: number;
  content: string;
  status: 'pending' | 'reviewed';
  grade?: number;
  feedback?: string;
  submitted_at: string;
}

export interface Student {
  id: number;
  full_name: string;
  email: string;
  batch_id?: number;
  mentor_id?: number;
  role: 'student';
}

export interface Mentor {
  id: number;
  full_name: string;
  email: string;
  role: 'mentor';
}

interface DataContextType {
  tasks: Task[];
  submissions: Submission[];
  students: Student[];
  mentors: Mentor[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  addSubmission: (submission: { task_id: number; content: string }) => Promise<void>;
  gradeSubmission: (submissionId: number, grade: number, feedback: string) => Promise<void>;
  addStudent: (student: Partial<Student>) => Promise<void>;
  addMentor: (mentor: Partial<Mentor>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setIsLoading(true);
    try {
      const role = user.role;
      if (role === 'admin') {
        const usersRes = await apiClient.get('/admin/users');
        setStudents(usersRes.data.filter((u: any) => u.role === 'student'));
        setMentors(usersRes.data.filter((u: any) => u.role === 'mentor'));
        const tasksRes = await apiClient.get('/student/tasks'); // Admins see all for now
        setTasks(tasksRes.data);
      } else if (role === 'mentor') {
        const studentsRes = await apiClient.get('/mentor/students');
        setStudents(studentsRes.data);
        const submissionsRes = await apiClient.get('/mentor/submissions');
        setSubmissions(submissionsRes.data);
        const tasksRes = await apiClient.get('/student/tasks'); 
        setTasks(tasksRes.data);
      } else if (role === 'student') {
        const tasksRes = await apiClient.get('/student/tasks');
        setTasks(tasksRes.data);
        const submissionsRes = await apiClient.get('/student/my-submissions');
        setSubmissions(submissionsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addTask = async (task: Partial<Task>) => {
    await apiClient.post('/mentor/tasks', task);
    await refreshData();
  };

  const deleteTask = async (taskId: number) => {
    await apiClient.delete(`/mentor/tasks/${taskId}`);
    await refreshData();
  };

  const addSubmission = async (submission: { task_id: number; content: string }) => {
    await apiClient.post('/student/submissions', submission);
    await refreshData();
  };

  const gradeSubmission = async (submissionId: number, grade: number, feedback: string) => {
    await apiClient.post(`/mentor/submissions/${submissionId}/grade`, { grade, feedback });
    await refreshData();
  };

  const addStudent = async (student: Partial<Student>) => {
    await apiClient.post('/admin/users', { ...student, role: 'student' });
    await refreshData();
  };

  const addMentor = async (mentor: Partial<Mentor>) => {
    await apiClient.post('/admin/users', { ...mentor, role: 'mentor' });
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        submissions,
        students,
        mentors,
        isLoading,
        refreshData,
        addTask,
        deleteTask,
        addSubmission,
        gradeSubmission,
        addStudent,
        addMentor,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
