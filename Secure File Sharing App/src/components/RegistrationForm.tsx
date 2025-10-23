import { useState } from 'react';
import { User, UserRole } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, UserPlus, FlaskConical, Stethoscope, User as UserIcon } from 'lucide-react';

interface RegistrationFormProps {
  role: UserRole;
  onRegister: (userData: Omit<User, 'id'>) => void;
  onBackToLogin: () => void;
}

export function RegistrationForm({ role, onRegister, onBackToLogin }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s|-|\(|\)/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    onRegister({
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: role
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleInfo = () => {
    switch (role) {
      case 'researcher':
        return {
          title: 'Register as Researcher / Lab Specialist',
          description: 'Create an account to upload and share medical files with healthcare providers',
          icon: FlaskConical,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          textColor: 'text-green-600 hover:text-green-700'
        };
      case 'doctor':
        return {
          title: 'Register as Doctor',
          description: 'Create an account to access patient files and collaborate with your medical team',
          icon: Stethoscope,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
          textColor: 'text-blue-600 hover:text-blue-700'
        };
      case 'patient':
        return {
          title: 'Register as Patient',
          description: 'Create an account to securely access your medical records and test results',
          icon: UserIcon,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          buttonBg: 'bg-purple-600 hover:bg-purple-700',
          textColor: 'text-purple-600 hover:text-purple-700'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className={`mx-auto ${roleInfo.iconBg} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4`}>
              <Icon className={`h-8 w-8 ${roleInfo.iconColor}`} />
            </div>
            
            <CardTitle className="text-xl">{roleInfo.title}</CardTitle>
            <CardDescription>{roleInfo.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${roleInfo.buttonBg}`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
              
              <p className="text-sm text-center text-gray-600 mt-2">
                After registration, you'll be automatically logged in to your dashboard.
              </p>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Account Role:</h4>
              <p className="text-sm text-gray-600 capitalize">{role}</p>
              {role === 'researcher' && (
                <p className="text-xs text-gray-500 mt-1">
                  You'll be able to upload and share medical files with doctors and patients
                </p>
              )}
              {role === 'doctor' && (
                <p className="text-xs text-gray-500 mt-1">
                  You'll be able to access patient files shared by researchers
                </p>
              )}
              {role === 'patient' && (
                <p className="text-xs text-gray-500 mt-1">
                  You'll be able to access your medical files shared by healthcare providers
                </p>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className={`${roleInfo.textColor} font-medium`}
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}