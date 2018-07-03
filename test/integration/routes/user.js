let request = require('supertest');
let config = require('config');
let server;
// let db;
let jwt = require('jsonwebtoken');
// let server = require('../../../app');
const mongoose = require('mongoose');
// const config = require('config');
const User = require('../../../models/user');
const Profile = require('../../../models/profile');

describe('User route - /user', ()=>{
    beforeEach(async ()=>{server = require('../../../app');
    });
    afterEach(async ()=>{
        await User.collection.remove();
        await Profile.collection.remove();
        server.close();
    });
    afterAll(()=>{
        mongoose.connection.close();
    });

    let res;
    let token_header = config.get('token_header');
    let body   = {
        user:{
            username: "shimakeee",
            password:"13aaAA!!aa",
            passConfirm:"13aaAA!!aa"
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

    let sendSignup = ()=>{
        return request(server)
        .post('/user/signup')
        .send(body);
    }

    describe(`validation token middleware`, ()=>{
        afterEach(async ()=>{
            await User.collection.remove();
            await Profile.collection.remove();
        });
        it(`should return invalid token`, async ()=>{
            await sendSignup();
            res = await request(server)
                .get('/user/me')
                .set(token_header, 'a');
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Invalid token'});
        });
        it(`should return forbidden access denied`, async ()=>{
            await sendSignup();
            res = await request(server)
                .get('/user/me');
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({message: 'Access denied - no token provided'});
        });
    });

    describe(`/signup`, ()=>{
        afterEach(async ()=>{
            await User.collection.remove();
            await Profile.collection.remove();
        });

        it(`should signup successfuly and return token`, async ()=>{
            res = await sendSignup();

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({message:'Success'});
            expect(res.header).toHaveProperty(token_header);
        });
        it(`should return 400 existing username`, async ()=>{
            res = await sendSignup();
            expect(res.status).toBe(201);

            res = await sendSignup();

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Username already exist'});
        });
        it(`should return 400 existing profile`, async ()=>{
            res = await sendSignup();
            let temp = body.user.username;
            body.user.username = "abcde1234";
            res = await sendSignup();

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Profile already exist'});

            body.user.username = temp;
        });
        it(`should return 400 invalid entry on invalid username`, async ()=>{
            let temp = body.user.username ;
            body.user.username = 'a';
            res = await sendSignup();

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('name', 'ValidationError');

            body.user.username = temp;
        });
        it(`should return 400 invalid entry on invalid name`, async ()=>{
            let temp = body.profile.name;
            body.profile.name = '!';
            res = await sendSignup();

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('name', 'ValidationError');

            body.profile.name = temp;
        });
    });

    describe(`/login`, ()=>{
        afterEach(async ()=>{
            await User.collection.remove();
            await Profile.collection.remove();
        });

        it(`should login successfuly using token`, async ()=>{
            await sendSignup();
            let data = {username: body.user.username,
                password: body.user.password}

            res = await request(server)
                .post('/user/login')
                .send(data);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({username: data.username});
            expect(res.header).toHaveProperty(token_header);
        });
        it(`should return 400 invalid entry username`, async ()=>{
            await sendSignup();
            let data = {username: 'a',
                password: body.user.password}

            res = await request(server)
                .post('/user/login')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('name', 'ValidationError');
            expect(res.header).not.toHaveProperty(token_header);
        });
        it(`should return 400 invalid entry password`, async ()=>{
            await sendSignup();
            let data = {username: body.user.username,
                password: 'ab!'}

            res = await request(server)
                .post('/user/login')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('name', 'ValidationError');
            expect(res.header).not.toHaveProperty(token_header);
        });
        it(`should return 400 mismatch password`, async ()=>{
            await sendSignup();
            let data = {username: body.user.username,
                password: 'abcdEFG123!!!'}

            res = await request(server)
                .post('/user/login')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Invalid username or password.'});
            expect(res.header).not.toHaveProperty(token_header);
        });
        it(`should return 400 username not existing`, async ()=>{
            await sendSignup();
            let data = {username: 'aaaAAA123',
                password: body.user.password}

            res = await request(server)
                .post('/user/login')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Invalid username or password.'});
            expect(res.header).not.toHaveProperty(token_header);
        });
    });

    describe(`/reset`, ()=>{
        afterEach(async ()=>{
            await User.collection.remove();
            await Profile.collection.remove();
        });

        it(`should reset password to default`, async ()=>{
            res = await sendSignup();
            expect(res.status).toBe(201);

            let data = {username: body.user.username};

            res = await request(server)
                .post('/user/reset')
                .send(data);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({message: 'Success'});
        });
        it(`should return 400 invalid username entry`, async ()=>{
            res = await sendSignup();
            expect(res.status).toBe(201);

            let data = {username: '!',
                password: body.user.password};

            res = await request(server)
                .post('/user/reset')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('name', 'ValidationError');
        });
        it(`should return 400 username doesnt exist`, async ()=>{
            res = await sendSignup();
            expect(res.status).toBe(201);

            let data = {username: 'aaaaAAAA1111'};

            res = await request(server)
                .post('/user/reset')
                .send(data);
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({message: 'Bad request.'});
        });
    });

    describe(`/me`, ()=>{
        afterEach(async ()=>{
            await User.collection.remove();
            await Profile.collection.remove();
        });

        describe(`GET`, ()=>{ 
            it(`should get the username`, async ()=>{
                res = await sendSignup();
                expect(res.status).toBe(201);

                let token = res.header[token_header];

                res = await request(server)
                    .get('/user/me')
                    .set(token_header, token);
                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({username: body.user.username});
            });
        });
        describe(`PUT`, ()=>{
            it(`should update user data`, async ()=>{
                res = await sendSignup();
                let data = {username: body.user.username,
                    password: body.user.password};

                let token = res.header[token_header];
                    
                res = await request(server)
                    .put('/user/me')
                    .set(token_header, token)
                    .send(data);
                expect(res.body).toMatchObject({message: 'Success'});
                expect(res.status).toBe(200);
            });
            it(`should return 400 invalid entry username`, async ()=>{
                res = await sendSignup();
                let token = res.header[token_header];
                let data = {username: '!',
                    password: body.user.password};
                    
                res = await request(server)
                    .put('/user/me')
                    .set(token_header, token)
                    .send(data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({name: 'ValidationError'});
            });
            it(`should return 400 invalid entry password`, async ()=>{
                res = await sendSignup();
                let token = res.header[token_header];
                let data = {username: body.user.username,
                    password: '!'}
                    
                res = await request(server)
                    .put('/user/me')
                    .set(token_header, token)
                    .send(data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({name: 'ValidationError'});
            });
            it(`should return 404 bad request`, async ()=>{
                res = await sendSignup();
                let data = {username: 'fakeuser',
                password: body.user.password}
                let fakeUser = new User(data);
                let fakeToken = fakeUser.genAuthToken();

                res = await request(server)
                    .put('/user/me')
                    .set(token_header, fakeToken)
                    .send(data);
                expect(res.status).toBe(404);
                expect(res.body).toMatchObject({message: 'Bad request'});
            });
            it(`should return forbidden`, async ()=>{
                res = await sendSignup();
                let data = {username: 'anotherUsername',
                password: body.user.password}

                res = await request(server)
                    .put('/user/me')
                    .send(data);
                expect(res.status).toBe(401);
                expect(res.body).toMatchObject({message: 'Access denied - no token provided'});
            });
            it(`should return invalid token`, async ()=>{
                res = await sendSignup();
                let data = {username: 'anotherUsername',
                password: body.user.password}

                res = await request(server)
                    .put('/user/me')
                    .set(token_header, 'a')
                    .send(data);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Invalid token'});
            });
        });
        describe(`DELETE`, ()=>{
            it(`should delete user and profile data`, async ()=>{
                res = await sendSignup();
                expect(res.status).toBe(201);
                let token = res.header[token_header];

                const decode = await jwt.decode(token, config.get('token'));
                
                res = await request(server)
                .delete('/user/me')
                .set(token_header, token)
                .send(body);
                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({message: 'Success'});

                let result = await Profile.findOne({_id: decode.profile});
                expect(result).toBe(null);
            });
            it(`should return error - mismatch token`, async ()=>{
                res = await sendSignup();
                expect(res.status).toBe(201);

                let data = {username: 'fakeuser',
                password: body.user.password}
                let fakeUser = new User(data);
                let fakeToken = fakeUser.genAuthToken();
                
                res = await request(server)
                .delete('/user/me')
                .set(token_header, fakeToken);
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Sever error: Could not delete account'});
            });
            it(`should return error - forbiden access `, async ()=>{
                res = await sendSignup();
                
                res = await request(server)
                .delete('/user/me');
                expect(res.status).toBe(401);
                expect(res.body).toMatchObject({message: 'Access denied - no token provided'});
            });
            it(`should return error - invalid token`, async ()=>{
                res = await sendSignup();
                
                res = await request(server)
                .delete('/user/me')
                .set(token_header, 'a');
                expect(res.status).toBe(400);
                expect(res.body).toMatchObject({message: 'Invalid token'});
            });
        });
    });
});