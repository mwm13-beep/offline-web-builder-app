import './App.css';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';

export default function App() {
  return (
    <div className="app">
      <div className="canvas-container">
        <CanvasArea />
      </div>
      <div className="sidebar-container">
        <Sidebar />
      </div>
    </div>
  );
}
