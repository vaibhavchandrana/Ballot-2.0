import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { Registration } from "./components/Registration";
import { Result } from "./components/Result";
import { Voting } from "./components/Voting";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegistration from "./components/admin/AdminRegistration";
import ElectionList from "./components/admin/ElectionList";
import ElectionComponent from "./components/admin/ElectionComponent";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NewElection from "./components/admin/NewElection";
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<Result />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_registration" element={<AdminRegistration />} />
        <Route path="/election_list" element={<ElectionList />} />
        <Route path="/election_card" element={<ElectionComponent />} />
        <Route path="/election_list/new_election" element={<NewElection/>} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
