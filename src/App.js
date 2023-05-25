import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Connection from "./components/connection/connection";
import Reciever from "./components/connection/reciever";
import Home from "./components/connection/home";
import Dhky from "./components/connection/DHKY";
import AES from "./components/connection/AES";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connection />} />
        <Route path="/reciever" element={<Reciever />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dhky" element={<Dhky />} />
        <Route path="/aes" element={<AES />} />
      </Routes>
    </Router>
  );
}

export default App;
