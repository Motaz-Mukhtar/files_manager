import { createRoot } from 'react-dom/client';
import './index.css';
import App from './component/App';

// ReactDOM.render(<App />, document.getElementById('root'));
createRoot(document.getElementById('root')).render(
    <App />
);