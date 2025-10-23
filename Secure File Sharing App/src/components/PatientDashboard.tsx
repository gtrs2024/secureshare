import { useState } from 'react';
import { User, FileUpload } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { LogOut, FileText, Download, MessageSquare, Calendar, User as UserIcon, Heart, ArrowLeft, Paperclip } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PatientDashboardProps {
  user: User;
  files: FileUpload[];
  users: User[];
  onLogout: () => void;
  onFileRead: (fileId: string) => void;
  onBack?: () => void;
}

export function PatientDashboard({ user, files, users, onLogout, onFileRead, onBack }: PatientDashboardProps) {
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const receivedFiles = files.filter(file => file.recipients.includes(user.username));
  
  // Debug logging
  console.log('PatientDashboard Debug:');
  console.log('Current user:', user.username);
  console.log('All files:', files);
  console.log('Received files:', receivedFiles);
  
  // Group files by sender and sort by most recent
  const filesBySender = receivedFiles.reduce((acc, file) => {
    if (!acc[file.uploadedBy]) {
      acc[file.uploadedBy] = [];
    }
    acc[file.uploadedBy].push(file);
    return acc;
  }, {} as Record<string, FileUpload[]>);

  // Sort senders by most recent file
  const senderUsernames = Object.keys(filesBySender).sort((a, b) => {
    const latestA = Math.max(...filesBySender[a].map(f => new Date(f.uploadedAt).getTime()));
    const latestB = Math.max(...filesBySender[b].map(f => new Date(f.uploadedAt).getTime()));
    return latestB - latestA;
  });

  // Sort files within each conversation by most recent
  const selectedFiles = selectedSender ? 
    (filesBySender[selectedSender] || []).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ) : [];

  const handleFileDownload = (file: FileUpload) => {
    // Mark as read
    onFileRead(file.id);
    
    // Simulate download
    setDownloadSuccess(file.fileName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const getSenderInfo = (username: string) => {
    return users.find(u => u.username === username);
  };

  const getUnreadCount = (senderFiles: FileUpload[]) => {
    return senderFiles.filter(f => !f.isRead).length;
  };

  const getSenderIcon = (role: string) => {
    return role === 'doctor' ? Heart : UserIcon;
  };

  const getSenderColor = (role: string) => {
    return role === 'doctor' ? 'blue' : 'green';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Patient Portal</h1>
              <p className="text-xl text-gray-600 mt-2">Welcome, {user.username}</p>
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

        {downloadSuccess && (
          <Alert className="mb-8 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg">
            <AlertDescription className="text-green-800 font-medium text-lg">
              ✅ "{downloadSuccess}" downloaded successfully and decrypted for viewing.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Healthcare Providers List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Your Healthcare Team ({senderUsernames.length})
              </CardTitle>
              <CardDescription>
                Doctors and specialists sharing your files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {senderUsernames.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files received yet</p>
                  <p className="text-sm">Your medical files will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {senderUsernames.map(senderUsername => {
                    const senderInfo = getSenderInfo(senderUsername);
                    const senderFiles = filesBySender[senderUsername];
                    const unreadCount = getUnreadCount(senderFiles);
                    const isSelected = selectedSender === senderUsername;
                    const senderRole = senderInfo?.role || 'researcher';
                    const SenderIcon = getSenderIcon(senderRole);
                    const colorClass = getSenderColor(senderRole);

                    return (
                      <div
                        key={senderUsername}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-purple-50 border-purple-200' 
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                        onClick={() => setSelectedSender(senderUsername)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 bg-${colorClass}-100 rounded-full flex items-center justify-center mr-3`}>
                              <SenderIcon className={`h-4 w-4 text-${colorClass}-600`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {senderRole === 'doctor' ? 'Dr. ' : ''}{senderUsername}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {senderRole === 'researcher' ? 'Lab Specialist' : senderRole}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs mb-1">
                                {unreadCount} new
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {senderFiles.length} files
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files from Selected Provider */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {selectedSender ? `Medical Files from ${selectedSender}` : 'Select a healthcare provider'}
              </CardTitle>
              <CardDescription>
                {selectedSender 
                  ? `${selectedFiles.length} medical files shared with you`
                  : 'Choose a provider from the left to view your medical files'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedSender ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Select a healthcare provider to view your files</p>
                  <p className="text-sm">Click on a provider from the left panel</p>
                </div>
              ) : selectedFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>No files from this provider</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedFiles.map(file => (
                    <div
                      key={file.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        file.isRead ? 'bg-white' : 'bg-purple-50 border-purple-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{file.fileName}</h4>
                            {!file.isRead && (
                              <Badge variant="destructive" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            Received: {file.uploadedAt}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleFileDownload(file)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View File
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h5 className="font-medium text-sm text-gray-900 mb-1">Notes from your healthcare provider:</h5>
                        <p className="text-gray-700 text-sm">{file.caption}</p>
                      </div>

                      <Separator />
                      
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>🔒 Encrypted medical file • Secure view-only access</span>
                        <span className={file.isRead ? 'text-green-600' : 'text-orange-600'}>
                          {file.isRead ? '✓ Viewed' : '● New'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{receivedFiles.length}</p>
                  <p className="text-sm text-gray-600">Medical Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{senderUsernames.length}</p>
                  <p className="text-sm text-gray-600">Healthcare Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Badge className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 mr-3 flex items-center justify-center">
                  {receivedFiles.filter(f => !f.isRead).length}
                </Badge>
                <div>
                  <p className="text-2xl font-bold">{receivedFiles.filter(f => !f.isRead).length}</p>
                  <p className="text-sm text-gray-600">New Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Info Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Your Medical File Security</h3>
                <p className="text-blue-800 text-sm">
                  All your medical files are encrypted and can only be viewed by you and your authorized healthcare providers. 
                  Files are automatically decrypted when you download them and are provided in view-only format for your security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}