import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router'

// ReactDOM.render(<App />, document.getElementById('root'));
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);