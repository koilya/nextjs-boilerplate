// assistantApi.js
const axios = require('axios');

// Adjust the base URL based on where your booking portal is deployed
const BASE_URL = 'https://your-booking-portal-url';

// Fetch available slots for a specific date
async function fetchAvailableSlots(date) {
  try {
    const response = await axios.get(`${BASE_URL}/api/bookings?date=${date}`);
    return response.data; // Return available slots
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
}

// Book an appointment
async function bookAppointment(date, time) {
  try {
    const response = await axios.post(`${BASE_URL}/api/bookings`, { date, time });
    return response.data; // Return confirmation of booking
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
}

// Export functions for use in other files
module.exports = { fetchAvailableSlots, bookAppointment };