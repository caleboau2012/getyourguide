const express = require('express');
const planner = require('./planner');
const middleware = require('./constraints');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Welome to trips.com.ng")
}).get('/planner', middleware.constraints, (req, res) => {
    const response = planner(req.query.budget, req.query.days);

    if (response == -1)
        res.json("400", {
            error: "You do not have sufficient money to really have a good experience. Can you add a few more dollars?"
        });
    else
        res.json(200, response);
});

app.listen(3000, (err) => {
    console.log('PS Project Running on port 3000!');
});