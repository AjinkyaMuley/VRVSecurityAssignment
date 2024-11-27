import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sidebar from './sidebar';
import Dashboard from './dashboard';
import Admission from './admin/admission';
import Payment from './admin/payment';
import Stream from './admin/stream';
import Student from './admin/student';
import ContactForm from './feedback/contactfrom';
import Feedback from './feedback/feedback';
import Grievance from './feedback/Grievance';
import Inquiries from './feedback/Inquiries';
import BookIssue from './Library/bookissue';
import Fine from './Library/fine';
import Inventory from './Library/inventory';
import Member from './Library/member';
import Faculty from './website/faculty';
import News from './website/news';
import Slider from './website/slider';
import Ticker from './website/ticker';
import InputAdmission from './admin/inputAdmission';
import ViewAdmission from './admin/viewAdmission';
import ViewStudent from './admin/ViewStudent';
import InputPayment from './admin/inputPayment';
import InputStream from './admin/inputStream';
import InputNews from './website/inputNews';
import ViewNews from './admin/ViewNews';
import InputFaculty from './website/inputFaculty';
import ViewFaculty from './website/ViewFaculty';
import InputInventory from './Library/inputInventory';
import ViewBook from './Library/ViewBook';
import FineForm from './Library/inputfine';
import ViewFine from './Library/ViewFine';
import LoginPage from './login';
import BookIssueForm from './Library/inputBookissue';
import ViewBookIssue from './Library/ViewBookIssue';
import MemberForm from './Library/inputMember';
import GradeStatistics from './student/grades';
import AttendanceManagement from './student/attendance';
import GradeEditForm from './student/editGrades';
import GradeDisplay from './student/viewGrades';
import GradeEntryForm from './student/inputGrades';
import EditAttendanceForm from './student/editAttendance';
import AttendanceView from './student/viewAttendance';
import ProtectedRoutes from './ProtectedRoutes';
import StudentERP from './StudentERP';
import FacultyERP from './FacultyERP';
import AdminPanel from './admin/adminPanel';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="w-64 fixed h-full" />
        <div className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoutes>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/student/erp-student" element={<StudentERP/>} />
                    <Route path="/faculty/erp-faculty" element={<FacultyERP/>} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin/admission" element={<Admission />} />
                    <Route path="/admin/admission/new-application" element={<InputAdmission />} />
                    <Route path="/admin/admission/view-application" element={<ViewAdmission />} />
                    <Route path="/admin/payment" element={<Payment />} />
                    <Route path="/admin/payment/new-payment" element={<InputPayment />} />
                    <Route path="/admin/stream" element={<Stream />} />
                    <Route path="/admin/stream/add-stream" element={<InputStream />} />
                    <Route path="/admin/student" element={<Student />} />
                    <Route path="/admin/student/view-student" element={<ViewStudent isEditPossible={false} />} />
                    <Route path="/admin/student/edit-student" element={<ViewStudent isEditPossible={true} />} />
                    <Route path="/admin/panel" element={<AdminPanel/>} />
                    <Route path="/feedback/contact" element={<ContactForm />} />
                    <Route path="/feedback/feedback" element={<Feedback />} />
                    <Route path="/feedback/grievance" element={<Grievance />} />
                    <Route path="/feedback/inquiries" element={<Inquiries />} />
                    <Route path="/library/bookissue" element={<BookIssue />} />
                    <Route path="/library/bookissue/add" element={<BookIssueForm />} />
                    <Route path="/library/bookissue/view" element={<ViewBookIssue isEditPossible={false} />} />
                    <Route path="/library/bookissue/edit" element={<ViewBookIssue isEditPossible={true} />} />
                    <Route path="/library/fine" element={<Fine />} />
                    <Route path="/library/fine/add-new" element={<FineForm />} />
                    <Route path="/library/fine/view" element={<ViewFine isEditPossible={false} />} />
                    <Route path="/library/fine/edit" element={<ViewFine isEditPossible={true} />} />
                    <Route path="/library/inventory" element={<Inventory />} />
                    <Route path="/library/inventory/add-new" element={<InputInventory />} />
                    <Route path="/library/inventory/view" element={<ViewBook isEditPossible={false} />} />
                    <Route path="/library/inventory/edit" element={<ViewBook isEditPossible={true} />} />
                    <Route path="/library/member" element={<Member />} />
                    <Route path="/library/members/add" element={<MemberForm />} />
                    <Route path="/website/faculty" element={<Faculty />} />
                    <Route path="/website/faculty/view-faculty" element={<ViewFaculty isEditPossible={false} />} />
                    <Route path="/website/faculty/edit-faculty" element={<ViewFaculty isEditPossible={true} />} />
                    <Route path="/website/faculty/add-new" element={<InputFaculty />} />
                    <Route path="/website/news" element={<News />} />
                    <Route path="/website/news/view-news" element={<ViewNews isEditPossible={false} />} />
                    <Route path="/website/news/edit-news" element={<ViewNews isEditPossible={true} />} />
                    <Route path="/website/news/add-new-article" element={<InputNews />} />
                    <Route path="/website/slider" element={<Slider />} />
                    <Route path="/website/ticker" element={<Ticker />} />
                    <Route path="/student/grades" element={<GradeStatistics />} />
                    <Route path="/student/editGrades/:id" element={<GradeEditForm />} />
                    <Route path="/student/viewgrades/:id" element={<GradeDisplay />} />
                    <Route path="/student/inputGrades" element={<GradeEntryForm />} />
                    <Route path="/student/attendance" element={<AttendanceManagement />} />
                    <Route path="/student/editAttendance/:id" element={<EditAttendanceForm />} />
                    <Route path="/student/viewAttendance/:id" element={<AttendanceView />} />
                  </Routes>
                </ProtectedRoutes>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
