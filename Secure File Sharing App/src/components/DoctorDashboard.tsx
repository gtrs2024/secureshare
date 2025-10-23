import { useState } from 'react';
import { User, FileUpload } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { LogOut, FileText, Download, MessageSquare, Calendar, User as UserIcon, ArrowLeft, Paperclip } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface DoctorDashboardProps {
  user: User;
  files: FileUpload[];
  users: User[];
  onLogout: () => void;
  onFileRead: (fileId: string) => void;
  onBack?: () => void;
}

export function DoctorDashboard({ user, files, users, onLogout, onFileRead, onBack }: DoctorDashboardProps) {
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const receivedFiles = files.filter(file => file.recipients.includes(user.username));
  
  // Debug logging
  console.log('DoctorDashboard Debug:');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Doctor Dashboard</h1>
              <p className="text-xl text-gray-600 mt-2">Welcome, Dr. {user.username}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <Card className="lg:col-span-1 border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 mb-2">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl p-3 mr-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                Conversations ({senderUsernames.length})
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Researchers who have sent you files
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {senderUsernames.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="bg-gray-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <MessageSquare className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="text-xl font-medium mb-2">No files received yet</p>
                  <p>Files from researchers will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {senderUsernames.map(senderUsername => {
                    const senderInfo = getSenderInfo(senderUsername);
                    const senderFiles = filesBySender[senderUsername];
                    const unreadCount = getUnreadCount(senderFiles);
                    const isSelected = selectedSender === senderUsername;
                    const latestFile = senderFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

                    return (
                      <div
                        key={senderUsername}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-lg' 
                            : 'bg-white hover:bg-gray-50 border-gray-200 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedSender(senderUsername)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                              <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{senderUsername}</p>
                              <p className="text-sm text-gray-600 capitalize">
                                {senderInfo?.role || 'Researcher'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Latest: {latestFile.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs mb-2 px-2 py-1 rounded-full">
                                {unreadCount} new
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
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

          {/* Chat Messages */}
          <Card className="lg:col-span-2 border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 mb-2">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-3 mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                {selectedSender ? `Messages from ${selectedSender}` : 'Select a conversation'}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {selectedSender 
                  ? `${selectedFiles.length} files shared with you (sorted by latest)`
                  : 'Choose a researcher from the left to view their files'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {!selectedSender ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="bg-gray-100 rounded-full p-12 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-16 w-16 opacity-30" />
                  </div>
                  <p className="text-2xl font-medium mb-2">Select a conversation</p>
                  <p className="text-lg">Click on a researcher from the left panel to view their files</p>
                </div>
              ) : selectedFiles.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="bg-gray-100 rounded-full p-12 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-16 w-16 opacity-30" />
                  </div>
                  <p className="text-2xl font-medium mb-2">No files from this researcher</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {selectedFiles.map(file => (
                    <div
                      key={file.id}
                      className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                        file.isRead ? 'bg-white border-gray-200' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                              <Paperclip className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{file.fileName}</h4>
                              {!file.isRead && (
                                <Badge className="bg-red-500 text-white text-xs mt-1">
                                  New File
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded-lg w-fit">
                            <Calendar className="h-4 w-4 mr-2" />
                            Received: {file.uploadedAt}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleFileDownload(file)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 mb-4">
                        <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Medical Notes:
                        </h5>
                        <p className="text-gray-700 leading-relaxed">{file.caption}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-gray-600 flex items-center">
                          🔒 Encrypted file • View-only access
                        </span>
                        <span className={`flex items-center font-medium ${file.isRead ? 'text-green-600' : 'text-orange-600'}`}>
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


      </div>
    </div>
  );
}