import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      // ... existing router content ...
    </BrowserRouter>
  );
}

export default App; 