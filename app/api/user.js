const bcrypt = require("bcrypt");
module.exports = (app, db) => {
    app.post("/addUser", (req, res, next) => {
        const pwd = req.body.password;
        const cnfPwd = req.body.confPassword;
        const hash = bcrypt.hashSync(pwd,10);
        if(pwd == cnfPwd){
        db.user.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        }).then((result) => {
            if (!result) {
                res.status(400).json({
                    message: "Error Occured"
                });
            }
            else {
                res.status(201).json({
                    message: 'User Added Successfully'
                });
            }
        });
        }
        else{
            res.status(400).json({
                message: "Password mis-match Occured"
            });
        }
        
    });

    app.get("/users", (req, res) => {
        db.user.findAll().then((result) => {
            const count = result.length;
            if (count > 0) {
                res.status(200).json({
                    response: result
                });
            }
            else {
                res.status(400).json({
                    response: 'There is no user found'
                })
            }
        })
    });

    app.get("/users/:id", (req, res) => {
        db.user.findByPk(req.params.id).then((result) => {
            if (result != null) {
                res.status(200).json({
                    UserDetails: result
                });
            }
            else {
                res.status(400).json({
                    response: 'There is no user found'
                })
            }
        })
    });

    app.put("/users/:id", (req, res) => {
        db.user.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confPassword: req.body.confPassword
        },
            {
                where: {
                    id: req.params.id
                }
            }).then((result) => {
                console.log(result);
                if (result != 0) {
                    res.status(200).json({
                        UserDetails: "User updated successfully!"
                        
                    });
                }
                else {
                    res.status(400).json({
                        response: 'There is no user found'
                    })
                }
            })
    });

    app.delete("/users/:id", (req, res) => {
        db.user.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) => {
            console.log(result);
            if (result != 0) {
                res.status(200).json({
                    UserDetails: result + " row deleted Successfully"
                });
            }
            else {
                res.status(400).json({
                    response: 'There is no user found'
                })
            }
        })
    });
}