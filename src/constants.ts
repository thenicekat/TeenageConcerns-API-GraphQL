export const PORT = (process.env.PORT_NO && parseInt(process.env.PORT_NO)) || 5000;
export const COOKIE_KEY = "cookey";
export const __prod__ = process.env.NODE_ENV === 'production';
export const __test__ = process.env.NODE_ENV === 'test';
export const __local__ = false;
export const GAUTH_CLIENT_ID = "968274477291-ehl0pptitneekj42raqg2ims26k5uugi.apps.googleusercontent.com";
export const GAUTH_REDIRECT_URL = "http://localhost:5000";
export const GAUTH_CLIENT_SECRET = "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";