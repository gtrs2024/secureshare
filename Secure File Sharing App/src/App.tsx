import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginForm } from "./components/LoginForm";
import { RegistrationForm } from "./components/RegistrationForm";
import { ResearcherDashboard } from "./components/ResearcherDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientDashboard } from "./components/PatientDashboard";

export type UserRole = "researcher" | "doctor" | "patient";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface FileUpload {
  id: string;
  fileName: string;
  caption: string;
  uploadedBy: string;
  uploadedAt: string;
  recipients: string[];
  isRead: boolean;
}

type AppView = "landing" | "login" | "register" | "dashboard";

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    username: "researcher1",
    email: "researcher@lab.com",
    phone: "+1 (555) 123-4567",
    role: "researcher",
  },
  {
    id: "2",
    username: "dr_smith",
    email: "smith@hospital.com",
    phone: "+1 (555) 234-5678",
    role: "doctor",
  },
  {
    id: "3",
    username: "patient_jane",
    email: "jane@email.com",
    phone: "+1 (555) 345-6789",
    role: "patient",
  },
  {
    id: "4",
    username: "dr_johnson",
    email: "johnson@clinic.com",
    phone: "+1 (555) 456-7890",
    role: "doctor",
  },
  {
    id: "5",
    username: "patient_john",
    email: "john@email.com",
    phone: "+1 (555) 567-8901",
    role: "patient",
  },
];

const mockFiles: FileUpload[] = [
  {
    id: "1",
    fileName: "blood_test_results.pdf",
    caption:
      "Complete blood panel results for routine checkup. All values within normal range except slight vitamin D deficiency.",
    uploadedBy: "researcher1",
    uploadedAt: "Oct 5, 2025",
    recipients: ["dr_smith", "patient_jane"],
    isRead: false,
  },
  {
    id: "2",
    fileName: "chest_xray_analysis.jpg",
    caption:
      "Chest X-ray analysis shows clear lungs with no signs of infection or abnormalities. Patient can continue normal activities.",
    uploadedBy: "researcher1",
    uploadedAt: "Oct 4, 2025",
    recipients: ["dr_smith"],
    isRead: true,
  },
  {
    id: "3",
    fileName: "mri_scan_report.pdf",
    caption:
      "MRI scan of knee joint. Shows minor cartilage wear consistent with age. Recommend physical therapy and follow-up in 6 months.",
    uploadedBy: "researcher1",
    uploadedAt: "Oct 3, 2025",
    recipients: ["dr_johnson", "patient_john"],
    isRead: false,
  },
  {
    id: "4",
    fileName: "lab_culture_results.docx",
    caption:
      "Bacterial culture results negative. No infection detected. Patient can discontinue antibiotic treatment as planned.",
    uploadedBy: "researcher1",
    uploadedAt: "Oct 2, 2025",
    recipients: ["dr_smith", "patient_jane"],
    isRead: true,
  },
  {
    id: "5",
    fileName: "ecg_reading.pdf",
    caption:
      "ECG reading shows normal sinus rhythm. Heart rate and electrical activity within normal parameters for patient age.",
    uploadedBy: "researcher1",
    uploadedAt: "Oct 1, 2025",
    recipients: ["dr_johnson"],
    isRead: false,
  },
];

export default function App() {
  const [currentView, setCurrentView] =
    useState<AppView>("landing");
  const [selectedRole, setSelectedRole] =
    useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [files, setFiles] = useState<FileUpload[]>(mockFiles);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentView("login");
  };

  const handleLogin = (username: string, password: string) => {
    // Simple authentication simulation
    const user = users.find(
      (u) => u.username === username && u.role === selectedRole,
    );
    if (user) {
      setCurrentUser(user);
      setCurrentView("dashboard");
    } else {
      alert(
        "Invalid credentials. Please check username and role, or register a new account.",
      );
    }
  };

  const handleRegister = (userData: Omit<User, "id">) => {
    // Check if username already exists
    if (users.some((u) => u.username === userData.username)) {
      alert(
        "Username already exists. Please choose a different username.",
      );
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView("dashboard");
  };

  const handleFileUpload = (
    fileData: Omit<
      FileUpload,
      "id" | "uploadedBy" | "uploadedAt" | "isRead"
    >,
  ) => {
    const newFile: FileUpload = {
      id: Date.now().toString(),
      uploadedBy: currentUser!.username,
      uploadedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isRead: false,
      ...fileData,
    };

    setFiles((prev) => [...prev, newFile]);
  };

  const handleFileRead = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, isRead: true } : file,
      ),
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setCurrentView("landing");
  };

  const handleBackToLanding = () => {
    setSelectedRole(null);
    setCurrentView("landing");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleShowRegister = () => {
    setCurrentView("register");
  };

  if (currentView === "landing") {
    return <LandingPage onRoleSelect={handleRoleSelect} />;
  }

  if (currentView === "login" && selectedRole) {
    return (
      <LoginForm
        role={selectedRole}
        onLogin={handleLogin}
        onBackToLanding={handleBackToLanding}
        onRegister={handleShowRegister}
      />
    );
  }

  if (currentView === "register" && selectedRole) {
    return (
      <RegistrationForm
        role={selectedRole}
        onRegister={handleRegister}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  if (currentView === "dashboard" && currentUser) {
    if (currentUser.role === "researcher") {
      return (
        <ResearcherDashboard
          user={currentUser}
          files={files}
          users={users}
          onFileUpload={handleFileUpload}
          onLogout={handleLogout}
        />
      );
    }

    if (currentUser.role === "doctor") {
      return (
        <DoctorDashboard
          user={currentUser}
          files={files}
          users={users}
          onLogout={handleLogout}
          onFileRead={handleFileRead}
        />
      );
    }

    if (currentUser.role === "patient") {
      return (
        <PatientDashboard
          user={currentUser}
          files={files}
          users={users}
          onLogout={handleLogout}
          onFileRead={handleFileRead}
        />
      );
    }
  }

  // Fallback
  return <LandingPage onRoleSelect={handleRoleSelect} />;
}