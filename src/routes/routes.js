const express = require('express')
const router = express.Router();
const XRay = require('aws-xray-sdk');
const app = express();


XRay.config([XRay.plugins.EC2Plugin]);

// Health Check
app.use(XRay.express.openSegment('entreesApiHealth'));
router.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    let data = {
        message: 'API: Up'
    };
    res.send(JSON.stringify(data, null, 2));
})
app.use(XRay.express.closeSegment());

// Entrees
app.use(XRay.express.openSegment('entrees'));
router.get('/entrees', (req, res) => {
    res.set('Content-Type', 'application/json');
    let data = {
        message: 'Entrees API'
    };
    res.send(JSON.stringify(data, null, 2));
});
app.use(XRay.express.closeSegment());


module.exports = router;