const express = require('express');
const router = express.Router();
const AWSXray = require('aws-xray-sdk');

router.get('/entrees', require('./entrees'))
// router.post('/add-entrees', require('./entrees'))

// Health Check
router.get('/', (req, res) => {
    AWSXray.captureFunc('entreesApiHealth', function (subsegment) {
        res.set('Content-Type', 'application/json');
        let data = {
            message: 'Entree API: Up'
        };
        res.send(JSON.stringify(data, null, 2));
        subsegment.close();
    });
})

module.exports = router;