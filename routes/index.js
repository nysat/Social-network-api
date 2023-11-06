const router = require('express').Router();
const apiRoutes = require('./api');


//indicates that all of the api routes will have /api prefeix and are imported from the /api directory
router.use('/api', apiRoutes);

//indicates that all other routes will return a 404 error
router.use((req, res) => {
    res.status(404).send('Wrong Route');
});

module.exports = router;