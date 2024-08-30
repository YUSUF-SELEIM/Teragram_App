const cookieSetter = (req, res) => {
    const { token } = req.body;
    res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: '/',
    });
    res.status(200).send({ message: 'Cookie set' });
};
export default cookieSetter;
