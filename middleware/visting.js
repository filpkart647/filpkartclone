exports.visiting  = (req, res, next) => {
    const currentHour = new Date().getHours();

    // Check if current time is between 9 AM (9) and 5 PM (17)
    if (currentHour >= 9 && currentHour < 17) {
        next(); // Proceed to the next middleware/route handler
    } else {
        res.status(403).json({ error: 'Access is allowed only between 9 AM and 5 PM.' });
    }
};