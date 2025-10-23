import { UserRole } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, FileText, Users, Stethoscope, FlaskConical, User } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: UserRole) => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 via-30% to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 mr-6 shadow-2xl border-2 border-white/50">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">SecureShare</h1>
          </div>
          <p className="text-2xl text-gray-800 mb-3 font-medium">Secure Medical File Sharing Platform</p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Encrypted file sharing between researchers, doctors, and patients with enterprise-grade security</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-green-200 hover:border-green-400 bg-white/90 backdrop-blur-sm" onClick={() => onRoleSelect('researcher')}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FlaskConical className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Researcher</CardTitle>
              <CardTitle className="text-lg text-gray-600 font-normal">Lab Specialist</CardTitle>
              <CardDescription className="text-base text-gray-600 leading-relaxed">Upload and share lab results, research data, and medical reports</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Upload medical files securely</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Share with doctors and patients</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Add detailed captions and notes</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Track file delivery status</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Login as Researcher
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-blue-200 hover:border-blue-400 bg-white/90 backdrop-blur-sm" onClick={() => onRoleSelect('doctor')}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Doctor</CardTitle>
              <CardTitle className="text-lg text-gray-600 font-normal">Medical Professional</CardTitle>
              <CardDescription className="text-base text-gray-600 leading-relaxed">Access patient files and lab results from researchers</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>View patient test results</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Download encrypted files</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Real-time notifications</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Login as Doctor
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-purple-200 hover:border-purple-400 bg-white/90 backdrop-blur-sm" onClick={() => onRoleSelect('patient')}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Patient</CardTitle>
              <CardTitle className="text-lg text-gray-600 font-normal">Healthcare Consumer</CardTitle>
              <CardDescription className="text-base text-gray-600 leading-relaxed">Access your medical files and test results securely</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>View your medical records</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Access lab test results</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Secure file downloads</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Healthcare team communication</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Login as Patient
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="bg-white/95 backdrop-blur-lg border-2 border-gray-200 shadow-2xl rounded-3xl mb-12">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold flex items-center justify-center text-gray-900 mb-4">
              <Shield className="h-8 w-8 mr-3 text-blue-600" />
              Why Choose SecureShare?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">Enterprise-grade security meets intuitive design</CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 mb-6 inline-block group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">End-to-End Encryption</h3>
                <p className="text-gray-600 leading-relaxed">All files are encrypted before upload and decrypted only for authorized viewers with military-grade security</p>
              </div>
              <div className="group">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 mb-6 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-12 w-12 text-green-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Role-Based Access</h3>
                <p className="text-gray-600 leading-relaxed">Tailored interfaces for researchers, doctors, and patients with granular permissions and access controls</p>
              </div>
              <div className="group">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 mb-6 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-12 w-12 text-purple-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">HIPAA Compliant</h3>
                <p className="text-gray-600 leading-relaxed">Built with medical data privacy and security regulations in mind, ensuring full compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}