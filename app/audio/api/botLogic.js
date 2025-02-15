const { fetchAvailableSlots, bookAppointment } = require('./assistantApi');

async function handleUserRequest(userRequest) {
  const { date, time } = parseUserRequest(userRequest); // Assume you have a function to parse user input

  // Fetch available slots
  const availableSlots = await fetchAvailableSlots(date);

  // Check if the requested time is available
  if (availableSlots.includes(time)) {
    const bookingResponse = await bookAppointment(date, time);
    console.log('Booking Successful:', bookingResponse);
    return `Your appointment has been booked for ${time} on ${date}.`;
  } else {
    console.log('Requested time is not available.');
    return 'Sorry, that time is not available. Please choose another slot.';
  }
}