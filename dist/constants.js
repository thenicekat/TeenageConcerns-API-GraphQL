"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWITTER_API_KEY = exports.TWITTER_TOKEN = exports.TWITTER_SECRET = exports.GAUTH_CLIENT_SECRET = exports.GAUTH_REDIRECT_URL = exports.GAUTH_CLIENT_ID = exports.__local__ = exports.__test__ = exports.__prod__ = exports.COOKIE_KEY = exports.PORT = void 0;
exports.PORT = (process.env.PORT_NO && parseInt(process.env.PORT_NO)) || 5000;
exports.COOKIE_KEY = "cookey";
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__test__ = process.env.NODE_ENV === 'test';
exports.__local__ = false;
exports.GAUTH_CLIENT_ID = "968274477291-ehl0pptitneekj42raqg2ims26k5uugi.apps.googleusercontent.com";
exports.GAUTH_REDIRECT_URL = "http://localhost:5000";
exports.GAUTH_CLIENT_SECRET = "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";
exports.TWITTER_SECRET = "dWWnWW1M4LBOH23X2GYTC6DbEnGx6ggVJvpKOdFpHgRpcL9CYN";
exports.TWITTER_TOKEN = "AAAAAAAAAAAAAAAAAAAAABXThAEAAAAA8H984nY%2Ft5nMSvbCpqXe7xp3FxM%3DZuCL19n3mROxDLhUjBGL1bR3JcjPIloXL6GOzPBJT18Mtw2pf4";
exports.TWITTER_API_KEY = "ApWLJ9qRgmUx9c7cCB2tE6vTE";
//# sourceMappingURL=constants.js.map