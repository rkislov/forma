module.exports = function(req,res,next) {
    if (!req.session.isChecked) {
        return res.redirect('/auth/profile')
    }

    next()
}