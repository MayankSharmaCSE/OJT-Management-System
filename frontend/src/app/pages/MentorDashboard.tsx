import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ClipboardList, Users, FileCheck, Plus, LayoutDashboard, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, tasks, submissions, addTask, deleteTask, gradeSubmission } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [feedback, setFeedback] = useState({ grade: '', comment: '' });

  useEffect(() => {
    if (!user || user.role !== 'mentor') {
      navigate('/');
    }
  }, [user, navigate]);

  // Data from backend is already filtered by the API endpoints in DataContext
  const myStudents = students;
  const myTasks = tasks;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const stats = [
    {
      title: 'My Students',
      value: myStudents.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Tasks',
      value: myTasks.filter(t => t.status !== 'completed').length,
      icon: ClipboardList,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Reviews',
      value: pendingSubmissions.length,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Completed',
      value: submissions.filter(s => s.status === 'reviewed').length,
      icon: CheckCircle2,
      color: 'bg-purple-500',
    },
  ];

  const studentProgressData = myStudents.map((s, index) => ({
    name: `${s.full_name.split(' ')[0]}${index + 1}`, // Make names unique
    progress: 75, // Placeholder
    id: s.id,
  }));

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask({
      ...newTask,
      status: 'pending',
    });
    setNewTask({
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
    });
  };

  const handleSubmitFeedback = async (submissionId: number) => {
    const gradeVal = parseInt(feedback.grade);
    if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 100) {
      alert('Please enter a valid grade between 0 and 100.');
      return;
    }
    await gradeSubmission(submissionId, gradeVal, feedback.comment);
    setFeedback({ grade: '', comment: '' });
    setSelectedSubmissionId(null);
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
        variant={activeTab === 'tasks' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('tasks')}
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        My Tasks
      </Button>
      <Button
        variant={activeTab === 'submissions' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('submissions')}
      >
        <FileCheck className="mr-2 h-4 w-4" />
        Submissions
      </Button>
      <Button
        variant={activeTab === 'students' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('students')}
      >
        <Users className="mr-2 h-4 w-4" />
        My Students
      </Button>
    </nav>
  );

  return (
    <DashboardLayout title="Mentor Dashboard" sidebar={sidebar}>
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Track your students' progress</CardDescription>
              </CardHeader>
              <CardContent>
                {studentProgressData.length > 0 ? (
                  <div className="h-[250px] w-full relative">
                    <Bar 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        scales: {
                          y: { beginAtZero: true, max: 100, title: { display: true, text: 'Progress %' } }
                        }
                      }}
                      data={{
                        labels: studentProgressData.map(d => d.name),
                        datasets: [{
                          label: 'Progress %',
                          data: studentProgressData.map(d => d.progress),
                          backgroundColor: '#3b82f6',
                          borderRadius: 4,
                        }]
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No student data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>Submissions awaiting feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingSubmissions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No pending submissions</p>
                  ) : (
                    pendingSubmissions.slice(0, 5).map((submission) => {
                      const task = tasks.find(t => t.id === submission.task_id);
                      const student = students.find(s => s.id === submission.student_id);
                      return (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{task?.title}</p>
                            <p className="text-sm text-gray-500">{student?.full_name}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Tasks you've created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">Due: {task.deadline}</p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'destructive'
                          : task.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Task Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Assign a new task to your students</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-desc">Description</Label>
                    <Textarea
                      id="task-desc"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-deadline">Deadline</Label>
                      <Input
                        id="task-deadline"
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') =>
                          setNewTask({ ...newTask, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Task assignment is handled implicitly by batch or individually in a real system. 
                      Simplifying for now. */}
                  <Button type="submit" className="w-full">Create Task</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Title</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'destructive'
                              : task.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant="outline">All Students</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task? This will also delete all student submissions for it.')) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Student Submissions</h2>
          
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Review ({pendingSubmissions.length})</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending submissions
                  </CardContent>
                </Card>
              ) : (
                pendingSubmissions.map((submission) => {
                  const task = tasks.find(t => t.id === submission.task_id);
                  return (
                    <Card key={submission.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{task?.title}</CardTitle>
                            <CardDescription>
                              Submitted by {students.find(s => s.id === submission.student_id)?.full_name} on{' '}
                              {new Date(submission.submitted_at).toLocaleString()}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Submission Content</Label>
                          <p className="mt-1 text-sm text-gray-700">{submission.content}</p>
                        </div>

                         {selectedSubmissionId === submission.id ? (
                          <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                              <Label htmlFor={`grade-${submission.id}`}>Grade (0-100)</Label>
                              <Input
                                id={`grade-${submission.id}`}
                                type="number"
                                min="0"
                                max="100"
                                value={feedback.grade}
                                onChange={(e) => setFeedback({ ...feedback, grade: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
                              <Textarea
                                id={`feedback-${submission.id}`}
                                value={feedback.comment}
                                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleSubmitFeedback(submission.id)}>
                                Submit Feedback
                              </Button>
                              <Button variant="outline" onClick={() => setSelectedSubmissionId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => setSelectedSubmissionId(submission.id)}>
                            Review & Grade
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="reviewed">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {submissions
                        .filter(s => s.status === 'reviewed')
                        .map((submission) => {
                          const task = tasks.find(t => t.id === submission.task_id);
                          const student = students.find(s => s.id === submission.student_id);
                          return (
                            <TableRow key={submission.id}>
                              <TableCell className="font-medium">{task?.title}</TableCell>
                              <TableCell>{student?.full_name}</TableCell>
                              <TableCell>
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge>{submission.grade}/100</Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {submission.feedback}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Students</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myStudents.map((student) => (
               <Card key={student.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{student.full_name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `75%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Batch: {student.batch_id}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MentorDashboard;