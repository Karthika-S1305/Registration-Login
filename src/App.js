import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
     
        <Routes>
          <Route path='/' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
    </div>
  );
}

export default App;
