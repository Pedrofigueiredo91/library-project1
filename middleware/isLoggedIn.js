function isLoggedIn(req, res, next){
    if(req.session.userDetails){
        next();
    } else {
        res.send("hey buddy, nice try but youre not allowed")
    }
}



module.exports = isLoggedIn;