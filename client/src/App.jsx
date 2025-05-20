import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import BlogView from "./pages/BlogView";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id?" element={<Editor />} />
        <Route path="/view/:id" element={<BlogView />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;