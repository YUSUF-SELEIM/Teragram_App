const cookieSetter = (req, res) => {
    const { token } = req.body;
    console.log("backend token"+token);
    res.cookie('token', token, {
        httpOnly: false,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: '/',
    });
    res.status(200).send({ message: 'Cookie set' });
};
export default cookieSetter;
