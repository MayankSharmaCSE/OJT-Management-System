import { createBrowserRouter } from 'react-router';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/mentor',
    Component: MentorDashboard,
  },
  {
    path: '/student',
    Component: StudentDashboard,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
