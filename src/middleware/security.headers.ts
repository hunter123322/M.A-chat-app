// src/middleware/securityHeaders.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to set security-related HTTP headers.
 * Specifically, it sets 'X-Content-Type-Options: nosniff' to prevent
 * browsers from MIME-sniffing a response away from the declared Content-Type.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 */
export const setSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Prevent MIME type sniffing
    // Browsers are instructed to strictly follow the Content-Type header
    // provided by the server. This helps prevent XSS attacks where
    // a malicious script might be incorrectly interpreted if the
    // Content-Type is missing or generic.
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // You could add other security headers here if desired, for example:
    // res.setHeader('X-Frame-Options', 'DENY'); // Prevents clickjacking
    // res.setHeader('X-XSS-Protection', '1; mode=block'); // Enables XSS filter in browsers
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // HSTS (Requires HTTPS)

    next(); // Pass control to the next middleware or route handler
};