// custom middleware to take care of input constraints
const constraints = (req, res, next) => {
    if (!req.query.budget || !req.query.days)
        res.json(400, {
            error: "Incomplete parameters."
        });
    else if (isNaN(req.query.budget) || isNaN(req.query.days))
        res.json(400, {
            error: "You didn't enter a valid number"
        });
    else if (req.query.budget < 100)
        res.json(400, {
            error: "You provided us with too little cash to plan your trip?"
        });
    else if (req.query.budget > 5000)
        res.json(400, {
            error: "You provided too much money?"
        });
    else if (req.query.days < 1)
        res.json(400, {
            error: "Seems like you don't want to go anywhere?"
        });
    else if (req.query.days > 5)
        res.json(400, {
            error: "You seem to want to spend too much time!"
        });
    else
        next();
};

exports.constraints = constraints;