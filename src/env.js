if (!process.env.REACT_APP_GMAPS_KEY) { throw new Error('Need to define REACT_APP_GMAPS_KEY env variable'); }

export default {
  apiUrl: 'http://localhost:3001' || process.env.NODEJS_ENV,
  GMAPS_KEY: process.env.REACT_APP_GMAPS_KEY,
};
