import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    duration: '',
    budget: '',
    preferences: ''
  });

  const [itinerary, setItinerary] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_itinerary', formData);
      setItinerary(response.data.itinerary_text);
      alert("Itinerary generated successfully!");
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong!');
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/download_pdf', {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a URL for the downloaded file and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Travel_Itinerary.pdf'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF.');
    }
  };

  return (
    <div className="App">
      <h1>Travel Itinerary Generator</h1>
      <form onSubmit={handleSubmit}>
        <input name="source" placeholder="Source" onChange={handleChange} required />
        <input name="destination" placeholder="Destination" onChange={handleChange} required />
        <input name="duration" placeholder="Duration (days)" type="number" onChange={handleChange} required />
        <input name="budget" placeholder="Budget (in ₹)" type="number" onChange={handleChange} required />
        <textarea name="preferences" placeholder="Preferences (comma-separated)" onChange={handleChange}></textarea>
        <button type="submit">Generate Itinerary</button>
      </form>

      {itinerary && (
        <div>
          <h2>Your Itinerary:</h2>
          <pre>{itinerary}</pre>
          <button onClick={handleDownloadPdf}>Download PDF</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
