const express = require('express');
const AWS = require('aws-sdk');
const XRay = require('aws-xray-sdk');
 

const config = require('../config/config');
const isDev = process.env.NODE_ENV !== 'production';
const router = express.Router();
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

app.use(XRay.express.openSegment('getEntrees'));
router.get('/entrees', (req, res, next) => {
    
    isDev ? AWS.config.update(config.aws_local_config) : AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_table_name
    }

    docClient.scan(params, function(err,data) {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error'
            });
        } else {
                const { Items } = data;
                res.send({ 
                    success: true,
                    message: 'Loaded entrees',
                    entrees: Items
                });
            }
        })}
);
app.use(XRay.express.closeSegment());

app.use(XRay.express.openSegment('addEntree'));

router.post('/add-entree', (req, res, next) => {

    isDev ? AWS.config.update(config.aws_local_config) : AWS.config.update(config.aws_remote_config);
    
    const { name, description } = req.query;
   
    const entreeId = (Math.random() * 1000).toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    const params = {
        TableName: config.aws_table_name,
        Item: {
            'entreeId': entreeId,
            'name': name,
            'description': description
        }
    };
    docClient.put(params, function (err, data) {
        console.log(req.body);
        if (err) {
            res.send({
                success: false,
                message: 'Error: Can not add item'
            });
        } else {
            console.log('data', data);
            const { Items } = data;
            res.send({
                success: true,
                message: 'Added entree',
                entreeId: entreeId
            });
        }
    });
});
app.use(XRay.express.closeSegment());


module.exports = router;