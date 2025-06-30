import { Request, Response } from "express";


async function logout(req: Request, res: Response): Promise<void> {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ error: 'Could not log out' });
            }

            // Clear the session cookie
            res.clearCookie('connect.sid'); // Default session cookie name (adjust if needed)

            // Redirect to login or send success response
            return res.status(200).json({ success: true, message: 'Logged out successfully' });
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });

    }
}

export default { logout };