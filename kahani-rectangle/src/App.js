import logo from './logo.svg';
import Canvas from './Rectangles/Canvas.tsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Kahani Rectangles</h1>
      </header>
      <Canvas />
    </div>
  );
}

export default App;
