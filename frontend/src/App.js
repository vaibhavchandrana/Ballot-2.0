import { Header } from "./components/Common/Header";
import { Home } from "./components/user/Home";
import { Login } from "./components/user/Login";
import { Profile } from "./components/user/Profile";
import { Registration } from "./components/user/Registration";
import { Result } from "./components/user/Result";
import { Voting } from "./components/user/Voting";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegistration from "./components/admin/AdminRegistration";
import ElectionList from "./components/Common/ElectionList";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NewElection from "./components/admin/NewElection";
import ElectionDetails from "./components/admin/ElectionDetails";
import MyElctionList from "./components/admin/MyElection";
function App() {
  return (
    <div className="App">
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/election/detais/:id"
          element={<ElectionDetails />}
        />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/voting" element={<ElectionList />} />
        <Route path="/election_voting/:id" element={<Voting />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_registration" element={<AdminRegistration />} />
        <Route path="/election_list" element={<ElectionList />} />
        <Route path="/new_election" element={<NewElection />} />
        <Route path="/admin/electionList" element={<MyElctionList />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
