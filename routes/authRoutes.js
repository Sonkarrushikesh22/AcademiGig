const router = require ('express').Router();
router.post("/register",async (req, res) => {
    try{
        const newUser = new User({
          username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
       await newUser.save();
       res.status(200).json({message: "User has been registered",
        data : newUser,
       });
    } catch (error){
        console.log(error);
        res.status(500).json({message: "User Creation Failed",
        error: error,
        });    
    }
});

module.exports = router;