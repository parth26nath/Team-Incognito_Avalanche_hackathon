// API Configuration
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    apiUrl: isDevelopment ? 'http://localhost:8002' : (process.env.NEXT_PUBLIC_API_URL || 'https://heartly.live/api'),
    socketUrl: isDevelopment ? 'http://localhost:8002' : (process.env.NEXT_PUBLIC_SOCKET_URL || 'https://heartly.live'),
    baseApiPath: '',
  };
};

export const config = {
  api: getApiConfig(),
};

export default config;