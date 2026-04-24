import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ClipboardList, CheckCircle2, Clock, FileText, LayoutDashboard, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
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

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, submissions, addSubmission } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  // Helper function to get color based on grade
  const getGradeColor = (grade: number) => {
    if (grade >= 85) return '#10b981'; // Green - Excellent
    if (grade >= 70) return '#3b82f6'; // Blue - Good
    if (grade >= 60) return '#f59e0b'; // Yellow - Satisfactory
    return '#ef4444'; // Red - Needs improvement
  };

  // Helper function to get performance tier
  const getPerformanceTier = (grade: number) => {
    if (grade >= 85) return 'Excellent';
    if (grade >= 70) return 'Good';
    if (grade >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  // Data from backend is already filtered by the API endpoints in DataContext
  const myTasks = tasks;
  const mySubmissions = submissions;
  
  const pendingTasks = myTasks.filter(t => {
    const hasSubmitted = mySubmissions.some(s => s.task_id === t.id);
    return !hasSubmitted;
  });

  const submittedTasks = myTasks.filter(t => {
    const hasSubmitted = mySubmissions.some(s => s.task_id === t.id);
    return hasSubmitted;
  });

  const stats = [
    {
      title: 'Total Tasks',
      value: myTasks.length,
      icon: ClipboardList,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Submitted',
      value: submittedTasks.length,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Reviewed',
      value: mySubmissions.filter(s => s.status === 'reviewed').length,
      icon: CheckCircle2,
      color: 'bg-purple-500',
    },
  ];

  const progressData = mySubmissions
    .filter(s => s.grade)
    .map((s, index) => {
      return {
        name: `Task${index + 1}`, // Make names unique with simple numbering
        grade: s.grade || 0,
        id: s.id,
      };
    });

  const overallProgress = myTasks.length > 0 
    ? Math.round((submittedTasks.length / myTasks.length) * 100)
    : 0;

  const handleSubmitWork = async (taskId: number) => {
    await addSubmission({
      task_id: taskId,
      content: submissionContent,
    });
    setSubmissionContent('');
    setSelectedTaskId(null);
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
        <FileText className="mr-2 h-4 w-4" />
        Submissions
      </Button>
      <Button
        variant={activeTab === 'feedback' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('feedback')}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Feedback
      </Button>
      <Button
        variant={activeTab === 'progress' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('progress')}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        My Progress
      </Button>
    </nav>
  );

  return (
    <DashboardLayout title="Student Dashboard" sidebar={sidebar}>
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

          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your completion rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Task Completion</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{myTasks.length}</p>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{submittedTasks.length}</p>
                  <p className="text-sm text-gray-500">Submitted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tasks due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 5)
                    .map((task) => {
                      const daysLeft = Math.ceil(
                        (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {task.deadline}
                            </p>
                          </div>
                          <Badge variant={daysLeft <= 2 ? 'destructive' : 'secondary'}>
                            {daysLeft} days
                          </Badge>
                        </div>
                      );
                    })}
                  {pendingTasks.length === 0 && (
                    <p className="text-gray-500 text-sm">No pending tasks</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest reviews from mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mySubmissions
                    .filter(s => s.status === 'reviewed')
                    .slice(0, 5)
                    .map((submission) => {
                      const task = tasks.find(t => t.id === submission.task_id);
                      return (
                        <div key={submission.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">{task?.title}</p>
                            <Badge variant="default">{submission.grade}/100</Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{submission.feedback}</p>
                        </div>
                      );
                    })}
                  {mySubmissions.filter(s => s.status === 'reviewed').length === 0 && (
                    <p className="text-gray-500 text-sm">No feedback yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending tasks
                  </CardContent>
                </Card>
              ) : (
                pendingTasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <CardDescription>Due: {task.deadline}</CardDescription>
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <p className="mt-1 text-sm text-gray-700">{task.description}</p>
                      </div>

                       {selectedTaskId === task.id ? (
                        <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                            <Label htmlFor={`submission-${task.id}`}>Your Submission</Label>
                            <Textarea
                              id={`submission-${task.id}`}
                              value={submissionContent}
                              onChange={(e) => setSubmissionContent(e.target.value)}
                              rows={5}
                              placeholder="Enter your work details, findings, or attach links to your submission..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleSubmitWork(task.id)}>
                              Submit Work
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedTaskId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setSelectedTaskId(task.id)}>
                          Submit Work
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {submittedTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No submitted tasks
                  </CardContent>
                </Card>
              ) : (
                submittedTasks.map((task) => {
                  const submission = mySubmissions.find(s => s.task_id === task.id);
                  return (
                    <Card key={task.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription>
                              Submitted on {submission && new Date(submission.submitted_at).toLocaleString()}
                            </CardDescription>
                          </div>
                          <Badge variant={submission?.status === 'reviewed' ? 'default' : 'secondary'}>
                            {submission?.status === 'reviewed' ? 'Reviewed' : 'Pending Review'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <Label>Your Submission</Label>
                            <p className="mt-1 text-sm text-gray-700">{submission?.content}</p>
                          </div>
                          {submission?.status === 'reviewed' && (
                            <div className="border-t pt-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <Label>Grade:</Label>
                                <Badge variant="default">{submission.grade}/100</Badge>
                              </div>
                              <div>
                                <Label>Mentor Feedback</Label>
                                <p className="mt-1 text-sm text-gray-700">{submission.feedback}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Submissions</h2>
          
          <div className="space-y-4">
            {mySubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No submissions yet
                </CardContent>
              </Card>
            ) : (
              mySubmissions.map((submission) => {
                const task = tasks.find(t => t.id === submission.task_id);
                return (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{task?.title}</CardTitle>
                          <CardDescription>
                            Submitted: {new Date(submission.submitted_at).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge variant={submission.status === 'reviewed' ? 'default' : 'secondary'}>
                          {submission.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Content</Label>
                        <p className="mt-1 text-sm text-gray-700">{submission.content}</p>
                      </div>
                      {submission.status === 'reviewed' && (
                        <>
                          <div>
                            <Label>Grade</Label>
                            <div className="mt-1">
                              <Badge variant="default" className="text-base">
                                {submission.grade}/100
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label>Feedback</Label>
                            <p className="mt-1 text-sm text-gray-700">{submission.feedback}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Mentor Feedback</h2>
          
          <div className="space-y-4">
            {mySubmissions.filter(s => s.status === 'reviewed').length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No feedback available yet
                </CardContent>
              </Card>
            ) : (
              mySubmissions
                .filter(s => s.status === 'reviewed')
                .map((submission) => {
                  const task = tasks.find(t => t.id === submission.task_id);
                  return (
                    <Card key={submission.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{task?.title}</CardTitle>
                        <CardDescription>
                          Reviewed on {new Date(submission.submitted_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Your Grade</p>
                            <p className="text-3xl font-bold text-blue-600">{submission.grade}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">out of</p>
                            <p className="text-2xl font-bold text-gray-400">100</p>
                          </div>
                        </div>
                        <div>
                          <Label>Mentor's Comments</Label>
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{submission.feedback}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Progress</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Overall Completion</CardTitle>
              <CardDescription>Track your task completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-6xl font-bold text-blue-600">{overallProgress}%</p>
                  <p className="text-gray-500 mt-2">Tasks Completed</p>
                </div>
                <Progress value={overallProgress} className="h-4" />
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{myTasks.length}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{submittedTasks.length}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
                    <p className="text-sm text-gray-500">Remaining</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {progressData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Grade Performance</CardTitle>
                <CardDescription>Your grades across reviewed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                    <span className="text-sm text-gray-600">Excellent (85-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-sm text-gray-600">Good (70-84)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span className="text-sm text-gray-600">Satisfactory (60-69)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                    <span className="text-sm text-gray-600">Needs Improvement (&lt;60)</span>
                  </div>
                </div>
                <div className="h-[300px] w-full relative">
                  <Bar 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const grade = context.raw as number;
                              return `Grade: ${grade}% (${getPerformanceTier(grade)})`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: { 
                          beginAtZero: true, 
                          max: 100,
                          title: { display: true, text: 'Grade %' }
                        }
                      }
                    }}
                    data={{
                      labels: progressData.map(d => d.name),
                      datasets: [{
                        label: 'Grade',
                        data: progressData.map(d => d.grade),
                        backgroundColor: progressData.map(d => getGradeColor(d.grade as number)),
                        borderRadius: 4,
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;