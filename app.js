const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./models");
const user = require("./app/api/user");
app.use(bodyParser.json());

user(app, db);

db.sequelize.sync().then(() => {
    app.use((req,res,next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    });
    
    app.use((error,req,res,next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message,
                status: error.status    
            }
        })
    });
});

module.exports = app;