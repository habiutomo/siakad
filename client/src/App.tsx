import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import BasicLoginPage from "@/pages/basic-login";
import HomePage from "@/pages/home-page";
import StudentsPage from "@/pages/students-page";
import LecturersPage from "@/pages/lecturers-page";
import CoursesPage from "@/pages/courses-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={BasicLoginPage} />
      <Route path="/login" component={BasicLoginPage} />
      <Route path="/mahasiswa" component={StudentsPage} />
      <Route path="/dosen" component={LecturersPage} />
      <Route path="/mata-kuliah" component={CoursesPage} />
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
