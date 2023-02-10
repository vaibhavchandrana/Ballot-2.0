import { Header } from './components/Header';
import {Home} from './components/Home'
import {Login} from './components/Login'
import {Profile} from './components/Profile'
import {Registration} from './components/Registration'
import {Result} from './components/Result'
import {Voting} from './components/Voting'
import {
  Route,Routes 
} from "react-router-dom";

function App() {
  return (
    <div className="App">

      <Header/>
      <Routes> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/result" element={<Result />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/" element={<Home />} />
        </Routes>
       
    </div>
  );
}

export default App;
