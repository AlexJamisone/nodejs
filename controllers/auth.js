exports.getLogin = (req, res, next) => {
    const isLoggedIn = req
        .get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1] === 'true';
        console.log(isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'LogIn',
        isAutenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggIn=true')
    res.redirect('/');
};