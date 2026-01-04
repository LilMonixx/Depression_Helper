const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' 
  : 'https://depression-helper.onrender.com';

export default API_URL;