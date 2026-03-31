import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { GraduationCap, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const prefillCredentials = (role: UserRole) => {
    setActiveRole(role);
    switch (role) {
      case 'admin':
        setEmail('admin@ojt.com');
        setPassword('admin123');
        break;
      case 'mentor':
        setEmail('mentor@ojt.com');
        setPassword('mentor123');
        break;
      case 'student':
        setEmail('student@ojt.com');
        setPassword('student123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">OJT Management System</CardTitle>
          <CardDescription className="text-center">
            Select your role and login to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full" onValueChange={(v) => prefillCredentials(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">
                <GraduationCap className="h-4 w-4 mr-1" />
                Student
              </TabsTrigger>
              <TabsTrigger value="mentor">
                <UserCheck className="h-4 w-4 mr-1" />
                Mentor
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-student">Email</Label>
                  <Input
                    id="email-student"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-student">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-student"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login as Student'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="mentor">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-mentor">Email</Label>
                  <Input
                    id="email-mentor"
                    type="email"
                    placeholder="mentor@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-mentor">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-mentor"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login as Mentor'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin">Email</Label>
                  <Input
                    id="email-admin"
                    type="email"
                    placeholder="admin@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-admin"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
            <p className="text-blue-900">
              <strong>Demo Credentials:</strong> Click any role tab to auto-fill credentials
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;