import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Connection from "./components/connection/connection";
import Reciever from "./components/connection/reciever";
import Home from "./components/connection/home";
import SigSecret from "./components/publicKey";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connection />} />
        <Route path="/reciever" element={<Reciever />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    // <SigSecret />
  );
}

export default App;
