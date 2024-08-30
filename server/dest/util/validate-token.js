import jwt from 'jsonwebtoken';

const validateToken = (req, res) => {
    const token = req.cookies.token;
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Return user data or whatever you need for your frontend
        return res.status(200).json({ userId: decoded.id });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default validateToken;
