import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import Client from './components/Client/Client';
import Freelancer from './components/Freelancer/Freelancer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/client" element={<Client />} />
      <Route path="/freelancer" element={<Freelancer />} />
    </Routes>
  );
}

export default App;
