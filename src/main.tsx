import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installAuthFetch } from './authFetch';

installAuthFetch();

createRoot(document.getElementById('root')!).render(<App />);
