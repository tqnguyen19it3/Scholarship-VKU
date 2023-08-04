
function adminController() {
    return {
        // [GET] / ADMIN DASHBOARD
        index(req, res) {
            res.status(200).render('admin/dashboard/adminHome' , { layout: 'admin/adminLayout' });
        },
    }
}

module.exports = adminController