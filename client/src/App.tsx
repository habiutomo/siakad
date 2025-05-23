import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import BasicLoginPage from "@/pages/basic-login";
import HomePage from "@/pages/home-page";
import StudentsPage from "@/pages/students-page";
import LecturersPage from "@/pages/lecturers-page";
import CoursesPage from "@/pages/courses-page";
import SchedulesPage from "@/pages/schedules-page";
import GradesPage from "@/pages/grades-page";
import AttendancePage from "@/pages/attendance-page";
import FinancePage from "@/pages/finance-page";
import DocumentsPage from "@/pages/documents-page";
import PDDiktiPage from "@/pages/pddikti-page";
import PDDiktiSettingsPage from "@/pages/pddikti-settings-page";
import SettingsPage from "@/pages/settings-page";
import ReportsPage from "@/pages/reports-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={BasicLoginPage} />
      <Route path="/login" component={BasicLoginPage} />
      <Route path="/mahasiswa" component={StudentsPage} />
      <Route path="/dosen" component={LecturersPage} />
      <Route path="/mata-kuliah" component={CoursesPage} />
      <Route path="/jadwal" component={SchedulesPage} />
      <Route path="/nilai" component={GradesPage} />
      <Route path="/kehadiran" component={AttendancePage} />
      <Route path="/keuangan" component={FinancePage} />
      <Route path="/dokumen" component={DocumentsPage} />
      <Route path="/pddikti" component={PDDiktiPage} />
      <Route path="/pengaturan" component={SettingsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/settings/pddikti" component={PDDiktiSettingsPage} />
      <Route path="/laporan" component={ReportsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
