const config = require('config');
require('dotenv').config();//required to run .env variables
const User = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const _ = require('lodash');

const createTestObj = require('../../../util/testHelper');


describe('User model', ()=>{
    let objId = mongoose.Types.ObjectId().toHexString();
    let allCases = [1, '1', 'a', '!', ' ', '', true, undefined, NaN, null, {},[], moment().toDate()];
        
    const user = {
        _id: objId,
        activity: true,
        username: 'aaaa1234',
        password: 'aaAA11!!!!',
        passConfirm: 'aaAA11!!!!',
        profile: objId
    }

    it('should sign & verify valid JWT token',()=>{
        const data = new createTestObj({_id: objId, 
            username: user.username,
        profile: objId});
        const newUser = new User(data);
        const token = newUser.genAuthToken();
        const decode = jwt.verify(token, config.get('token'));
        expect(decode).toMatchObject(data);
    });
    it('should hash & match password correctly',async ()=>{
        const password = '1';
        const wrongPassword = '2';
        const newUser = new User({username: user.username, password: password})

        await newUser.hashPassword(); //hash using model method
        expect(newUser.password).not.toMatch(/^1$/);
        
        let result = await newUser.matchPassword(password);
        expect(result).toBeTruthy();
        
        result = await newUser.matchPassword(wrongPassword);
        expect(result).toBeFalsy();
    });

    describe('Input validation', ()=>{

        describe('Valid input - happy path',()=>{

            it(`should validate login`, ()=>{
                temp = new createTestObj({
                    username: user.username,
                    password: user.password,
                    profile: user.profile
                });
                const result = User.validate(temp);
                expect(result.error).toBe(null);
            });
            it(`should validate signup`, ()=>{
                temp = new createTestObj(user);
                delete temp._id;
                const result = User.validateSignup(temp);
                expect(result.error).toBe(null);
            });
            it(`should validate password `, ()=>{
                const result = User.validatePassword(user.password);
                expect(result.error).toBe(null);
            });
            it(`should validate user `, ()=>{
                const result = User.validateUser({username: user.username});
                expect(result.error).toBe(null);
            });
        });

        describe('invalid inputs', ()=>{
            temp = new createTestObj(user);

            temp.loopProperties((key)=>{
                describe(`user[${key}]`, ()=>{
                    let tempCase = [];
                    switch(key){
                        case 'activity':
                            tempCase = _.difference(allCases, [true, '', undefined]);
                            break;
                        case '_id':
                            tempCase = _.difference(allCases, ['', undefined]);
                            break;
                        default:
                            tempCase = _.union(allCases, []);
                    }

                    tempCase.forEach(element=>{
                        it(`ERROR on ${key} with input "${element}" typeof ${typeof element}`, ()=>{
                            temp[key] = element; //replace original value with testcase value
                            const result = User.validateSignup(temp);
                                expect(result.error).not.toBe(null);
                        });
                    })
                });

            });

        });
    });
});