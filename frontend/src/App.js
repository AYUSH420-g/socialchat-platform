import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/home';
import Chat from './pages/Chat';
import Profile from './pages/profile';
import Edit from './pages/Edit';
import Otherprofile from './pages/otherprofile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/users" element={<UserList />} /> */}
        <Route path="/chat/:receiverId" element={<Chat />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/Edit" element={<Edit />} />
         <Route path="/otherprofile/:userId" element={<Otherprofile />} />
      </Routes>
    </Router>
  );
}

export default App;
