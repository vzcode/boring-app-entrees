const express = require('express');
const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk'));
const config = require('../config/config');
var isDev = process.env.NODE_ENV !== 'production';
isDev = false;
const router = express.Router();

// Health Check
router.get('/', (req, res) => {
    AWSXray.captureFunc('entreesApiHealth', function (subsegment) {
        res.set('Content-Type', 'application/json');
        let data = {
            message: 'API: Up'
        };
        res.send(JSON.stringify(data, null, 2));
        subsegment.close();
    });
})

router.get('/entrees', (req, res, next) => {
    AWSXray.captureFunc('getEntrees', function (subsegment) {
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
        })
    subsegment.close();
    })
});


router.post('/add-entree', (req, res, next) => {
    AWSXray.captureFunc('getEntrees', function (subsegment) {
        isDev ? AWS.config.update(config.aws_local_config) : AWS.config.update(config.aws_remote_config);
        
        const { entree, description } = req.query;
    
        const entreeId = (Math.random() * 1000).toString();
        const docClient = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName: config.aws_table_name,
            Item: {
                'entreeId': entreeId,
                'entree': entree,
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
        subsegment.close(); 
    });
});


module.exports = router;