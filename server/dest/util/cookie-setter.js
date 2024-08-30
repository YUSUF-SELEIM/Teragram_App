const cookieSetter = (req, res) => {
    const { token } = req.body;
    console.log("backend token"+token);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: '/',
        domain: 'teragram-app-8mzj.vercel.app',
    });
    res.status(200).send({ message: 'Cookie set' });
};
export default cookieSetter;
