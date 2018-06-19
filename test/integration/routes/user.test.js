let request = require('supertest');
let server;
let db;
// let server = require('../../../app');
// const mongoose = require('mongoose');
// const config = require('config');
// const User = require('../../../models/user');
// const Profile = require('../../../models/profile');

describe('User route - /user', ()=>{
    beforeEach(async ()=>{server = require('../../../app').server
        
        db = await require('../../../app').db;
    ;});
    afterEach(()=>{
            server.close();
            db.close();
    });
    describe(`Get`, ()=>{
        it(`/user/reset`, async ()=>{

            let response = await request(server).get('/user/reset');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'sample');
        });
    });
});


            // const res = await request(server)
            //     .post('/user/signup')
            //     .send({
            //         user:{
            //             username: "shimakeee",
            //             password:"13aaAA!!aa",
            //             passConfirm:"13aaAA!!aa"
            //         },
            //         profile:{
            //             name:{
            //                 first:"Kendrick",
            //                 last:"de leon"
            //             },
            //             gender:"male",
            //             birthdate: "10-18-1989",
            //             civilStatus: "s"
            //         }
            //     });