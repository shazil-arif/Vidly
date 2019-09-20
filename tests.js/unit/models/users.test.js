const {users} = require('../../../models/users');
const jwt = require('jsonwebtoken');
const config = require("config");
const mongoose = require("mongoose");

describe(`generateAuthToken`,()=>{
    it('should return a jwt token when given a payload containing an id and isAdmin boolean property',()=>{
        const originalObject = {
            _id:mongoose.Types.ObjectId().toHexString(),
            isAdmin:false
        }
        const testUser = new users(originalObject);
        const token = testUser.generateAuthToken();
        const decodedPayload = jwt.verify(token,config.get('jwtPrivateKey'))

        expect(decodedPayload).toMatchObject(originalObject);
    })
})