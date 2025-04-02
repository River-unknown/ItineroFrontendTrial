import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS for styling

function App() {
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        start_date: '',
        end_date: '',
        budget: '',
        preferences: '',
        trip_type: '' // New field for trip type
    });

    const [itinerary, setItinerary] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic form validation
        if (!formData.source || !formData.destination || !formData.start_date || !formData.end_date || !formData.budget || !formData.trip_type) {
            setError('Please fill in all required fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://itinerobackendtrial.onrender.com/generate_itinerary', formData);
            setItinerary(response.data.itinerary_text);
            alert("Itinerary generated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate itinerary. Please try again.');
            console.error('Error generating itinerary:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://itinerobackendtrial.onrender.com/download_pdf', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Travel_Itinerary.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to download PDF. Please try again.');
            console.error('Error downloading PDF:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>Travel Itinerary Generator</h1>
            
            <form onSubmit={handleSubmit} className="itinerary-form">
                <div className="form-group">
                    <label htmlFor="source">Source:</label>
                    <input type="text" id="source" name="source" placeholder="Enter source" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="destination">Destination:</label>
                    <input type="text" id="destination" name="destination" placeholder="Enter destination" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="start_date">Start Date:</label>
                    <input type="date" id="start_date" name="start_date" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="end_date">End Date:</label>
                    <input type="date" id="end_date" name="end_date" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="budget">Budget (in ₹):</label>
                    <input type="number" id="budget" name="budget" placeholder="Enter budget" onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="preferences">Preferences:</label>
                    <textarea id="preferences" name="preferences" placeholder="Enter preferences (comma-separated)" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="trip_type">Trip Type:</label>
                    <select id="trip_type" name="trip_type" onChange={handleChange} required>
                        <option value="">Select Trip Type</option>
                        <option value="solo">Solo</option>
                        <option value="group">Group</option>
                        <option value="family">Family</option>
                        <option value="friends">Friends</option>
                    </select>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Itinerary'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {itinerary && (
                <div className="itinerary-output">
                    <h2>Your Itinerary:</h2>
                    <pre>{itinerary}</pre>
                    <button onClick={handleDownloadPdf} disabled={isLoading}>
                        {isLoading ? 'Downloading...' : 'Download PDF'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
