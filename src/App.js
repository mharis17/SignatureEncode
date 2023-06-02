import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Connection from "./components/connection/connection";
import Reciever from "./components/connection/reciever";
import Send from "./components/connection/send";
function App() {
  return (
    <div className="md:p-[30px]">
      <h3
        className="text-[30px] font-bold text-center cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        BlockSend
      </h3>
      <Router>
        <Routes>
          <Route path="/" element={<Connection />} />
          <Route path="/send" element={<Send />} />
          <Route path="/reciever" element={<Reciever />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
