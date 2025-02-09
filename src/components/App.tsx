import React from 'react';
import { UserData } from '../types';

interface AppProps {
    user?: UserData;
}

const App: React.FC<AppProps> = ({ user }) => {
    return (
        <div className="app">
            <header>
                <h1>ReSyncIQ Compliance Engine</h1>
                {user && <span>Welcome, {user.role}</span>}
            </header>
            <main>
                {/* Main content will go here */}
            </main>
        </div>
    );
};

export default App; 