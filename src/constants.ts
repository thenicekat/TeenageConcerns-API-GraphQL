export const PORT = (process.env.PORT_NO && parseInt(process.env.PORT_NO)) || 5000;
export const COOKIE_KEY = "cookey";
export const __prod__ = process.env.NODE_ENV === 'production';
export const __test__ = process.env.NODE_ENV === 'test';
export const __local__ = false