let request = require('supertest');
let config = require('config');

const _ = require('lodash');
let jwt = require('jsonwebtoken');
// let server = require('../../../app');
const mongoose = require('mongoose');
// const config = require('config');
const User = require('../../../models/user');
const Profile = require('../../../models/profile');

describe('Profile route - /profile', ()=>{
    let res;
    let token_header = config.get('token_header');
    let server;
    let db;
    let body;
    let sendSignup = ()=>{
        return request(server)
        .post('/user/signup')
        .send(body);
    }

    beforeEach(()=>{
        server = require('../../../app');
        body = {
            user:{
                username: "shimakeeee",
                password:"13aaAA!!aaa",
                passConfirm:"13aaAA!!aaa"
            },
            profile:{
                name:{
                    first:"Kendrick",
                    last:"de leon"
                },
                gender:"male",
                birthdate: "10-18-1989",
                civilStatus: "s"
            }}    
    });
    afterEach( async ()=>{
        await User.collection.remove();
        await Profile.collection.remove();
        server.close();
    });
    afterAll(()=>{
        mongoose.connection.close();
    });


    describe(`/me`, ()=>{
        describe(`GET`, ()=>{
    
            it(`should return profile data`, async ()=>{
                res = await sendSignup();

                let token = res.header[token_header];
                
                res = await request(server)
                    .get('/profile/me')
                    .set(token_header, token);
    
                expect(res.status).toBe(200);
                expect(res.body).toMatchObject(_.omit(body.profile,['birthdate']));
            });
            it(`should return bad request`, async ()=>{
                res = await sendSignup();
                let user = new User({username: 'fakeUsername',
                    password: body.user.password});
    
                let fakeToken = user.genAuthToken();
    
                res = await request(server)
                    .get('/profile/me')
                    .set(token_header, fakeToken);
    
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Bad request.'});
            });
            it(`should return invalid`, async ()=>{
                res = await sendSignup();
    
                res = await request(server)
                    .get('/profile/me')
                    .set(token_header, 'a');
    
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Invalid token'});
            });
            it(`should return forbidden`, async ()=>{
                res = await sendSignup();
    
                res = await request(server)
                    .get('/profile/me');
    
                expect(res.status).toBe(401);
                expect(res.body).toMatchObject({message: 'Access denied - no token provided'});
            });
        });

        describe(`PUT`, ()=>{

            it(`should update profile`, async ()=>{
                res = await sendSignup();
                let token = res.header[token_header];
                body.profile.name.first = 'Another Name';

                res = await request(server)
                    .put('/profile/me')
                    .set(token_header, token)
                    .send(body.profile);

                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({message: 'Success'});
            });
            it(`should return 400 invalid entry on profile`, async ()=>{
                res = await sendSignup();
                body.profile.name.first = 'Another !Name';

                let token = res.header[token_header];

                res = await request(server)
                    .put('/profile/me')
                    .set(token_header, token)
                    .send(body.profile);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty('name','ValidationError');
            });
            it(`should return 400 Bad request - mismatch on token`, async ()=>{
                res = await sendSignup();
                body.profile.name.first = 'Another Name';

                let user = new User(body.user);
                let fakeToken = user.genAuthToken();

                res = await request(server)
                    .put('/profile/me')
                    .set(token_header, fakeToken)
                    .send(body.profile);

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: "Bad request."});
            });
            it(`should return invalid token`, async ()=>{
                res = await sendSignup();

                res = await request(server)
                    .put('/profile/me')
                    .set(token_header, 'a')
                    .send(body.profile);

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Invalid token'});
            });
        });

        describe(`/DELETE`, ()=>{
            it(`should delete profile`, async ()=>{
                res = await sendSignup();

                const  token = res.header[token_header];
                const decode = jwt.decode(token, config.get('token'));

                res = await request(server)
                    .delete('/profile/me')
                    .set(token_header, token);

                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({message: 'Success'});

                let profile = await Profile.findOne({_id: decode.profile});
                let user = await User.findOne({_id: decode._id});

                expect(profile).toBe(null);
                expect(user).toBe(null);
            });
            it(`should return 404 user no longer exist`, async ()=>{
                res = await sendSignup();

                const  token = res.header[token_header];
                const decode = jwt.decode(token, token);

                await User.remove(); //remove user to gain 404 on profile

                res = await request(server)
                    .delete('/profile/me')
                    .set(token_header, token);

                expect(res.status).toBe(404);
                expect(res.body).toMatchObject({message: 'Sever error: Could not delete account'});

                let profile = await Profile.findOne({_id: decode.profile});
                let user = await User.findOne({_id: decode._id});

                expect(profile).not.toBe(null);
                expect(user).toBe(null);
            });
            it(`should return 404 not exist`, async ()=>{
                res = await sendSignup();

                const  token = res.header[token_header];
                const decode = jwt.decode(token, token);

                await Profile.remove(); //remove profile to gain 404 on profile

                res = await request(server)
                    .delete('/profile/me')
                    .set(token_header, token);

                expect(res.status).toBe(404);
                expect(res.body).toMatchObject({message: 'Sever error: Could not delete account'});

                let profile = await Profile.findOne({_id: decode.profile});
                let user = await User.findOne({_id: decode._id});

                expect(profile).toBe(null);
                expect(user).not.toBe(null);
            });
            it(`should return invalid`, async ()=>{
                res = await sendSignup();

                let token = res.header[token_header];
                const decode = jwt.decode(token, token);

                res = await request(server)
                    .delete('/profile/me')
                    .set(token_header, 'a');

                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Invalid token'});

                let profile = await Profile.findOne({_id: decode.profile});
                let user = await User.findOne({_id: decode._id});

                expect(profile).not.toBe(null);
                expect(user).not.toBe(null);
            });
            it(`should return forbidden`, async ()=>{
                res = await sendSignup();

                let token = res.header[token_header];
                const decode = jwt.decode(token, token);

                res = await request(server)
                    .delete('/profile/me');

                expect(res.status).toBe(401);
                expect(res.body).toMatchObject({message: 'Access denied - no token provided'});

                let profile = await Profile.findOne({_id: decode.profile});
                let user = await User.findOne({_id: decode._id});

                expect(profile).not.toBe(null);
                expect(user).not.toBe(null);
            });
        });
    });
});