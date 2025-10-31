import { travelManagementApi } from './api';

// Fetch all bookings (you might need to adjust the endpoint based on your API)
export const fetchAllBookings = async () => {
  try {
    // If your API has an endpoint to get all bookings
    const data = await travelManagementApi.get('/travel-bookings');
    return data;
  } catch (error) {
    console.error('❌ Error fetching all bookings:', error);
    throw error;
  }
};

// Fetch bookings by request ID
export const fetchBookingsByRequestId = async (requestId) => {
  try {
    const data = await travelManagementApi.get(`/travel-bookings/by-request/${requestId}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching bookings by request ID:', error);
    throw error;
  }
};

// Fetch travel requests that have bookings
export const fetchTravelRequestsWithBookings = async () => {
  try {
    // This would need to be implemented in your backend
    // For now, we'll use a mock implementation
    const response = await fetch('/api/travel-requests/with-bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching travel requests with bookings:', error);
    // Return mock data for demonstration
    return getMockTravelRequestsWithBookings();
  }
};

// Mock data for demonstration
const getMockTravelRequestsWithBookings = () => {
  return [
    {
      travelRequestId: '6bd50ab2-92fd-45d6-b222-9d9ddd9cd1a2',
      employeeName: 'Rajesh Kumar',
      employeeId: 'E1001',
      department: 'Engineering',
      destination: 'Bangalore',
      travelDates: '2024-01-15 to 2024-01-18',
      purpose: 'Client Meeting',
      status: 'APPROVED',
      bookingCount: 3,
      lastBookingDate: '2024-01-10'
    },
    {
      travelRequestId: '84df6c78-d82c-446a-a1e5-6e337e5283cc',
      employeeName: 'Priya Sharma',
      employeeId: 'E1002',
      department: 'Sales',
      destination: 'Mumbai',
      travelDates: '2024-01-20 to 2024-01-22',
      purpose: 'Sales Conference',
      status: 'APPROVED',
      bookingCount: 2,
      lastBookingDate: '2024-01-15'
    },
    {
      travelRequestId: 'b54fc953-dad5-48f9-907b-80ae895e0505',
      employeeName: 'Amit Patel',
      employeeId: 'E1003',
      department: 'Marketing',
      destination: 'Delhi',
      travelDates: '2024-01-25 to 2024-01-28',
      purpose: 'Product Launch',
      status: 'APPROVED',
      bookingCount: 1,
      lastBookingDate: '2024-01-18'
    }
  ];
};