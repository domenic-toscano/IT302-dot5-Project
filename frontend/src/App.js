import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BikesList from './components/bikesList';
import Bike from './components/bike';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<BikesList />} />
          <Route path="/dot5/" element={<BikesList />} />
          <Route path="/dot5/bikes" element={<BikesList />} />
          <Route path="/dot5/bikes/:id" element={<Bike />} />
          <Route path="/bikes" element={<BikesList />} />
          <Route path="/bikes/:id" element={<Bike />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
