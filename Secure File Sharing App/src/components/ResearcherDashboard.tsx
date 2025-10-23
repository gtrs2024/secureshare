import { useState } from 'react';
import { User, FileUpload } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Upload as FileUploadIcon, Send, LogOut, Plus, FileText, Calendar, Users, ArrowLeft, Paperclip } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface ResearcherDashboardProps {
  user: User;
  files: FileUpload[];
  users: User[];
  onFileUpload: (fileData: Omit<FileUpload, 'id' | 'uploadedBy' | 'uploadedAt' | 'isRead'>) => void;
  onLogout: () => void;
  onBack?: () => void;
}

export function ResearcherDashboard({ user, files, users, onFileUpload, onLogout, onBack }: ResearcherDashboardProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    caption: '',
    recipients: [] as string[],
    selectedFile: null as File | null
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const userFiles = files.filter(file => file.uploadedBy === user.username);
  const availableRecipients = users.filter(u => u.role !== 'researcher' && u.id !== user.id);

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.selectedFile || !uploadForm.caption || uploadForm.recipients.length === 0) {
      alert('Please select a file, add a caption, and select at least one recipient');
      return;
    }

    onFileUpload({
      fileName: uploadForm.selectedFile.name,
      caption: uploadForm.caption,
      recipients: uploadForm.recipients
    });

    setUploadForm({ fileName: '', caption: '', recipients: [], selectedFile: null });
    setShowUploadForm(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ 
        ...prev, 
        selectedFile: file,
        fileName: file.name
      }));
    }
  };

  const handleRecipientChange = (username: string, checked: boolean) => {
    setUploadForm(prev => ({
      ...prev,
      recipients: checked 
        ? [...prev.recipients, username]
        : prev.recipients.filter(r => r !== username)
    }));
  };

  const getRecipientNames = (recipients: string[]) => {
    return recipients.map(username => {
      const user = users.find(u => u.username === username);
      return user ? `${user.username} (${user.role})` : username;
    }).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            {onBack && (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="mr-4 hover:bg-white/50 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Researcher Dashboard</h1>
              <p className="text-xl text-gray-600 mt-2">Welcome back, {user.username}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-xl h-12 px-6"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>

        {uploadSuccess && (
          <Alert className="mb-8 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg">
            <AlertDescription className="text-green-800 font-medium text-lg">
              ✅ File uploaded successfully! Recipients have been notified.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        <Card className="mb-12 border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-lg">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900 mb-2">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-3 mr-4">
                    <FileUploadIcon className="h-6 w-6 text-white" />
                  </div>
                  Upload New File
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Share medical documents with doctors and patients securely
                </CardDescription>
              </div>
              {!showUploadForm && (
                <Button 
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Upload
                </Button>
              )}
            </div>
          </CardHeader>
          
          {showUploadForm && (
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleFileUpload} className="space-y-8">
                {/* File Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-900">Select File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-center">
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept=".pdf,.docx,.jpg,.jpeg,.png,.doc"
                        onChange={handleFileSelect}
                        required
                      />
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Paperclip className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {uploadForm.selectedFile ? uploadForm.selectedFile.name : 'Click to select a file'}
                        </p>
                        <p className="text-gray-600">
                          {uploadForm.selectedFile 
                            ? `${(uploadForm.selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
                            : 'PDF, DOCX, JPG, PNG files supported'
                          }
                        </p>
                      </label>
                    </div>
                  </div>
                  {uploadForm.selectedFile && (
                    <div className="flex justify-center">
                      <Badge className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                        File selected: {uploadForm.selectedFile.name}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Caption */}
                <div className="space-y-4">
                  <Label htmlFor="caption" className="text-lg font-medium text-gray-900">Caption / Medical Notes</Label>
                  <Textarea
                    id="caption"
                    placeholder="Brief description of the file contents and any important notes for the recipients..."
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                    required
                    className="min-h-[120px] rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {/* Recipients */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-900">Recipients (Select up to 3)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100">
                    {availableRecipients.map(recipient => (
                      <div key={recipient.id} className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                        <Checkbox
                          id={recipient.username}
                          checked={uploadForm.recipients.includes(recipient.username)}
                          onCheckedChange={(checked) => 
                            handleRecipientChange(recipient.username, checked as boolean)
                          }
                          disabled={uploadForm.recipients.length >= 3 && !uploadForm.recipients.includes(recipient.username)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <Label htmlFor={recipient.username} className="flex-1 cursor-pointer">
                          <div className="font-medium text-gray-900">{recipient.username}</div>
                          <div className="text-sm text-gray-600 capitalize">{recipient.role}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      Selected: <span className="font-medium text-green-600">{uploadForm.recipients.length}/3</span>
                    </p>
                    {uploadForm.recipients.length >= 3 && (
                      <Badge className="bg-orange-100 text-orange-800">Maximum recipients selected</Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send File
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowUploadForm(false);
                      setUploadForm({ fileName: '', caption: '', recipients: [], selectedFile: null });
                    }}
                    className="px-8 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Previous Uploads */}
        <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900 mb-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-3 mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Previous Uploads ({userFiles.length})
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Files you've shared with doctors and patients
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {userFiles.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="bg-gray-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 opacity-50" />
                </div>
                <p className="text-xl font-medium mb-2">No files uploaded yet</p>
                <p>Upload your first file to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userFiles.map(file => (
                  <div key={file.id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{file.fileName}</h4>
                      <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        {file.uploadedAt}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{file.caption}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
                        <Users className="h-4 w-4 mr-2" />
                        Recipients: {getRecipientNames(file.recipients)}
                      </div>
                      <Badge 
                        variant={file.isRead ? "default" : "secondary"}
                        className={`px-4 py-2 rounded-lg ${
                          file.isRead 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }`}
                      >
                        {file.isRead ? "✓ Read" : "● Unread"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}