import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Connection from "./components/connection/connection";
import Home from "./components/connection/home";
import Reciever from "./components/connection/reciever";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reciever" element={<Reciever />} />
      </Routes>
    </Router>
  );
}

export default App;
