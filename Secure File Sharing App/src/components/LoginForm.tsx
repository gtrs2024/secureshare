import { useState } from 'react';
import { UserRole } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, LogIn, FlaskConical, Stethoscope, User } from 'lucide-react';

interface LoginFormProps {
  role: UserRole;
  onLogin: (username: string, password: string) => void;
  onBackToLanding: () => void;
  onRegister: () => void;
}

export function LoginForm({ role, onLogin, onBackToLanding, onRegister }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  const getRoleInfo = () => {
    switch (role) {
      case 'researcher':
        return {
          title: 'Researcher / Lab Specialist Login',
          description: 'Access your lab management dashboard to upload and share medical files',
          icon: FlaskConical,
          color: 'green'
        };
      case 'doctor':
        return {
          title: 'Doctor Login',
          description: 'Access patient files and lab results from your medical team',
          icon: Stethoscope,
          color: 'blue'
        };
      case 'patient':
        return {
          title: 'Patient Login',
          description: 'Securely access your medical records and test results',
          icon: User,
          color: 'purple'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-lg relative">
          <CardHeader className="text-center pb-8 pt-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLanding}
              className="absolute top-6 left-6 hover:bg-gray-100 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className={`mx-auto bg-gradient-to-br ${
              roleInfo.color === 'green' ? 'from-green-400 to-emerald-600' :
              roleInfo.color === 'blue' ? 'from-blue-400 to-blue-600' :
              'from-purple-400 to-purple-600'
            } rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 shadow-lg`}>
              <Icon className="h-10 w-10 text-white" />
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{roleInfo.title}</CardTitle>
            <CardDescription className="text-lg text-gray-600">{roleInfo.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Button 
                type="submit" 
                className={`w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  roleInfo.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                  roleInfo.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                  'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  className={`font-medium hover:underline ${
                    roleInfo.color === 'green' ? 'text-green-600 hover:text-green-700' :
                    roleInfo.color === 'blue' ? 'text-blue-600 hover:text-blue-700' :
                    'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}