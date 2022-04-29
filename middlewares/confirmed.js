

const userConfirmed = (req, res, next) => {
    const confirmed = req.userConfirmed;
    if (!confirmed) return res.status(403).json({ message: 'user not confirmed' });
    next();
}

module.exports = userConfirmed;