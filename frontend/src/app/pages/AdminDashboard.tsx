import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);
import { Users, UserCheck, GraduationCap, ClipboardList, TrendingUp, Plus, LayoutDashboard, Settings, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, mentors, tasks, submissions, addStudent, addMentor } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [newStudent, setNewStudent] = useState({ full_name: '', email: '', password: '', batch_id: 1, mentor_id: 1 });
  const [newMentor, setNewMentor] = useState({ full_name: '', email: '', password: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Mentors',
      value: mentors.length,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter(t => t.status !== 'completed').length,
      icon: ClipboardList,
      color: 'bg-orange-500',
    },
    {
      title: 'Submissions',
      value: submissions.length,
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  const progressData = students.map((s, index) => ({
    name: `${s.full_name.split(' ')[0]}${index + 1}`, // Make names unique
    progress: 75, // Placeholder since backend User model doesn't have progress yet
    id: s.id,
  }));

  const batchData = students.reduce((acc, student) => {
    const batch = `Batch ${student.batch_id || 'N/A'}`;
    const existing = acc.find(item => item.name === batch);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: batch, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      ...newStudent,
      role: 'student' as const
    });
    setNewStudent({ full_name: '', email: '', password: '', batch_id: 1, mentor_id: 1 });
  };

  const handleAddMentor = (e: React.FormEvent) => {
    e.preventDefault();
    addMentor({
      ...newMentor,
      role: 'mentor' as const
    });
    setNewMentor({ full_name: '', email: '', password: '' });
  };

  const sidebar = (
    <nav className="p-4 space-y-2">
      <Button
        variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('overview')}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Overview
      </Button>
      <Button
        variant={activeTab === 'students' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('students')}
      >
        <GraduationCap className="mr-2 h-4 w-4" />
        Students
      </Button>
      <Button
        variant={activeTab === 'mentors' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('mentors')}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Mentors
      </Button>
      <Button
        variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('analytics')}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button
        variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('settings')}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </nav>
  );

  return (
    <DashboardLayout title="Admin Dashboard" sidebar={sidebar}>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Latest registered students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                   {students.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <Badge variant="outline">Batch {student.batch_id}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Overview</CardTitle>
                <CardDescription>Current task status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-sm text-gray-500">Due: {task.deadline}</p>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Student Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student details to create a new account</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input
                      id="student-name"
                      value={newStudent.full_name}
                      onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input
                      id="student-password"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-batch">Batch ID</Label>
                    <Input
                      id="student-batch"
                      type="number"
                      value={newStudent.batch_id}
                      onChange={(e) => setNewStudent({ ...newStudent, batch_id: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-mentor">Assign Mentor</Label>
                    <Select value={newStudent.mentor_id.toString()} onValueChange={(value) => setNewStudent({ ...newStudent, mentor_id: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id.toString()}>
                            {mentor.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Add Student</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const mentor = mentors.find(m => m.id === student.mentor_id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.full_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>Batch {student.batch_id}</TableCell>
                        <TableCell>{mentor?.full_name || 'Unassigned'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `75%` }}
                              />
                            </div>
                            <span className="text-sm">75%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mentor Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Mentor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Mentor</DialogTitle>
                  <DialogDescription>Enter mentor details to create a new account</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMentor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentor-name">Full Name</Label>
                    <Input
                      id="mentor-name"
                      value={newMentor.full_name}
                      onChange={(e) => setNewMentor({ ...newMentor, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor-email">Email</Label>
                    <Input
                      id="mentor-email"
                      type="email"
                      value={newMentor.email}
                      onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor-password">Password</Label>
                    <Input
                      id="mentor-password"
                      type="password"
                      value={newMentor.password}
                      onChange={(e) => setNewMentor({ ...newMentor, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Mentor</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Students Assigned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentors.map((mentor) => {
                    return (
                      <TableRow key={mentor.id}>
                        <TableCell className="font-medium">{mentor.full_name}</TableCell>
                        <TableCell>{mentor.email}</TableCell>
                        <TableCell>Academic</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Assigned</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Overview</CardTitle>
                <CardDescription>Progress comparison across students</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <div className="h-[300px] relative">
                    <Bar 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true },
                          tooltip: { enabled: true },
                        },
                        scales: {
                          y: { beginAtZero: true, title: { display: true, text: 'Progress %' } },
                        }
                      }}
                      data={{
                        labels: progressData.map(d => d.name),
                        datasets: [{
                          label: 'Progress %',
                          data: progressData.map(d => d.progress),
                          backgroundColor: '#3b82f6',
                          borderRadius: 4,
                        }]
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-8 text-center">No student data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students by Batch</CardTitle>
                <CardDescription>Distribution of students across batches</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {batchData.length > 0 ? (
                  <div className="h-[300px] w-full relative flex justify-center">
                    <Pie 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: { enabled: true },
                        }
                      }}
                      data={{
                        labels: batchData.map(d => d.name),
                        datasets: [{
                          data: batchData.map(d => d.value),
                          backgroundColor: COLORS,
                        }]
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-8">No batch data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">System Settings</h2>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">Settings panel - Configure email notifications, deadlines, and system preferences</p>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;