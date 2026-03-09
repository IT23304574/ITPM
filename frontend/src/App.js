import React from 'react';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
//import PostTrip from './PostTrip';
import CreateTrip from './components/CreateTrip';

function App() {
  return (
    <div className="App">
      <header style={{ background: '#007bff', color: 'white', padding: '10px' }}>
        <h1>Tuk Ride Share - Student Project</h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        <AboutUs />
        <hr />
        <ContactUs />
        <hr />
        <PostTrip />
      </main>
    </div>
  );
}

export default App;