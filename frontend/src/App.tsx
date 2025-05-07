import './App.css';
import './index.css'
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import './elementLoader';

declare global {
  interface Window {
    showSaveFilePicker?: ({}) => Promise<any>;
  }
}

export default function App() {
  const handleSaveToDisk = async () => {
    if (!window.showSaveFilePicker) {
      alert('Saving to disk is not supported in this environment.');
      return;
    }
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'my-web-builder-project.json',
        types: [
          {
            description: 'Web Builder Project File',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });
  
      const writable = await fileHandle.createWritable();
  
      // Sample content - replace with your actual canvas/project data
      const projectData = {
        canvasElements: [], // You’ll populate this from canvas state
        metadata: {
          created: new Date().toISOString(),
        },
      };
  
      await writable.write(JSON.stringify(projectData, null, 2));
      await writable.close();
      alert('Project saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };
  
  const handleSaveToCloud = () => {
    alert('Cloud saving not implemented yet.');
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Menu Bar */}
      <div className="bg-gray-800 text-white p-2 flex items-center space-x-2 w-full shrink-0">
        <button>Save</button>
        <div className="relative group">
          <button>Save ▼</button>
          <div className="absolute hidden group-hover:block bg-white text-black shadow-md mt-1">
            <button onClick={handleSaveToDisk}>Save to disk</button>
            <button onClick={handleSaveToCloud}>Save to cloud</button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 w-full overflow-hidden">
        <div className="flex-1 canvas-container bg-white">
          <CanvasArea />
        </div>
        <div className="sidebar-container bg-gray-700 text-white">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
