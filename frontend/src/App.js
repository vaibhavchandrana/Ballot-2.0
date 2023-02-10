import './App.css';
import { Header } from './components/Header';
import {Voting} from './components/Voting'

function App() {
  return (
    <div className="App">
      <Header/>
      <Voting/>
      {/* <Profile/> */}
      {/* <Home /> */}
    </div>
  );
}

export default App;
