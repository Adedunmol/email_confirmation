

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.roles;
        const newAllowedRoles = [...allowedRoles];

        const result = roles.map(role => newAllowedRoles.includes(role)).filter(role => role === true);
        if (!result) return res.status(403).json({ message: 'you do not have access to this route' });
        console.log(result)
        next();
    }
}

module.exports = verifyRoles;