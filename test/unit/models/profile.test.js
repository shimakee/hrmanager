require('dotenv').config();//required to run .env variables
const Profile = require('../../../models/profile');
const mongoose = require('mongoose');
const moment = require('moment');
const validDataLibrary = require('../../../util/validDataLibrary');
const createTestObj = require('../../../util/helper');
const _ = require('lodash');

describe('Profile model', ()=>{
    let objId = mongoose.Types.ObjectId().toHexString();
    let  profile = {
        _id: objId,
        alive:true,
        name:   {
            first: 'a',
            middle: 'b',
            maiden: 'c',
            last: 'd',
            suffix: 'e'
        },
    gender: 'male',
    birthdate: '10-18-1989',
    nationality: 'filipino',
    civilStatus: 'single',
    spouse: objId,
    parents: {mother: objId,
            father: objId},
    contact:    [{main: true,
                description: 'home', 
                countryCode: 63, 
                areaCode: 82, 
                number: 9228401018}],
    email:      [{main: true,
                address: 'sample@email.com'}],
    address:    [{main: true,
                description: 'office',
                street: 'sample address 1.-#',
                city:'sample city',
                province: 'sample province',
                zipcode: 1234}],
    government: [{key: 'sss',  
                number: 1234567891011}]
    }
    
    let date = moment().toDate();
    let temp;
    let allCases = [1, '1', 'a', '!', ' ', '', true, undefined, NaN, null, {},[], date];

    it('get full name correctly', ()=>{
        let data = new Profile(profile);
        data = data.getFullName();
        expect(data).toMatch(/a b c d e/);
    });

    it('should validate data profile with correct input -happy path', ()=>{
        const result = Profile.validate(profile);
        expect(result.error).toBe(null);
    });

    describe('validation on profile properties',()=>{
        

        temp = new createTestObj(profile);
        temp.name = new createTestObj(profile.name);
        
        temp.name.loopProperties((key)=>{
            describe(`Profile.name.${key} validation`,()=>{
                afterEach(()=>{//reset to original value after
                    temp.name[key] = profile.name[key];
                });

                allCases.forEach(element=>{
                    it(`Case basis on input "${element}" typeof <${typeof element}>`, ()=>{
                        temp.name[key]=element;
        
                        function runIt(value){
                            const result = Profile.validate(temp);//run validation test

                            if(key != 'first' && key != 'last'){
                                if(element === '' || element === undefined || element === 'a'){
                                    expect(result.error).toBe(null);
                                }else{
                                    expect(result.error).not.toBe(null);
                                }
                            }else{
                                if(element == 'a'){
                                    expect(result.error).toBe(null);
                                }else{
                                    expect(result.error).not.toBe(null);
                                }
                            }
                        
                        }
                            runIt(element);
                    });

                });
            });
        });

        
        describe(`Gender validation`, ()=>{
            let allInvalidCases = allCases;
            let allValidCases = validDataLibrary.gender;

            afterEach(()=>{
                temp.gender = profile.gender;
            });

            allInvalidCases.forEach(element=>{
                it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.gender = element;

                    let result = Profile.validate(temp);
                    expect(result.error).not.toBe(null);
                });

            });

            allValidCases.forEach(element=>{
                it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.gender = element;
                    let result = Profile.validate(temp);
                    expect(result.error).toBe(null);
                });
            });
        });


        describe(`Birthdate validation`, ()=>{
            let allInvalidCases = [moment().add(7, 'd').toDate(), moment().subtract(200, 'y').toDate()];
            let allValidCases = [1, '1', '10-18-1989',moment().subtract(18, 'y').toDate(), date];
            let tempCase = _.difference(allCases, allValidCases);
            allInvalidCases = _.union(tempCase, allInvalidCases);

            afterEach(()=>{
                temp.birthdate = profile.birthdate;
            });

            allInvalidCases.forEach(element=>{
                it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.birthdate = element;
                    let result = Profile.validate(temp);
                    expect(result.error).not.toBe(null);
                });
            });

            allValidCases.forEach(element=>{
                it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.birthdate = element;
                    let result = Profile.validate(temp);
                    expect(result.error).toBe(null);
                });
            });
        });

        describe('Nationality validation',()=>{
            let allValidCases = ['a', "", undefined];
            let allInvalidCases = _.difference(allCases, allValidCases);

            afterEach(()=>{
                temp.nationality = profile.nationality;
            });

            allValidCases.forEach(element=>{
                it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.nationality = element;
                    let result = Profile.validate(temp);
                    expect(result.error).toBe(null);
                });
            });
            allInvalidCases.forEach(element=>{
                it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.nationality = element;
                    let result = Profile.validate(temp);
                    expect(result.error).not.toBe(null);
                });
            });
        });

        describe('CivilStatus validation',()=>{
            let allInvalidCases = _.difference(allCases, ['a']);;
            let allValidCases = validDataLibrary.civilStatus;
            
            afterEach(()=>{
                temp.civilStatus = profile.civilStatus;
            });

            allValidCases.forEach(element=>{
                it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.civilStatus = element; 
                    let result = Profile.validate(temp);
                    expect(result.error).toBe(null);
                });
            });
            allInvalidCases.forEach(element=>{
                it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.civilStatus = element;
                    let result = Profile.validate(temp);
                    expect(result.error).not.toBe(null);
                });
            });
        });

        describe('Spouse validation',()=>{
            let allInvalidCases = _.difference(allCases, ['', undefined]);
            let allValidCases = [objId, '', undefined];

            afterEach(()=>{
                temp.spouse = profile.spouse;
            });

            allValidCases.forEach(element=>{
                it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.spouse = element; 
                    let result = Profile.validate(temp);
                    expect(result.error).toBe(null);
                });
            });
            allInvalidCases.forEach(element=>{
                it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                    temp.spouse = element;
                    let result = Profile.validate(temp);
                    expect(result.error).not.toBe(null);
                });
            });
        });

        
        temp.parents = new createTestObj(profile.parents);
        temp.parents.loopProperties((key)=>{

            describe(`Parents[${key}] validation`,()=>{
                let allInvalidCases =_.difference(allCases, ['', undefined]);
                let allValidCases = [objId, '', undefined];
                afterEach(()=>{
                    temp.parents[key] = profile.parents[key];//reassign original profile value back
                });
        
                allInvalidCases.forEach(element => {//test all input cases
                    it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.parents[key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).not.toBe(null);
                    });
                });
                allValidCases.forEach(element => {//test all input cases
                    it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.parents[key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).toBe(null);
                    });
                });
            });
        });

        temp.contact[0] = new createTestObj(profile.contact[0]);
        temp.contact[0].loopProperties((key)=>{

            describe(`Contact[0][${key}] validation`,()=>{
                let allValidCases = [];
                let allInvalidCases = [];
                
                afterEach(()=>{
                    temp.contact[0][key] = profile.contact[0][key];//store original profile value on temp
                    allValidCases = [];
                    allInvalidCases = [];
                });
                
                switch(key){
                    case 'main':
                        allInvalidCases = _.difference(allCases, [true, '', undefined]);
                        allValidCases.push(true, '', undefined);
                        break;
                    case 'description':
                        allInvalidCases = _.difference(allCases,['a', '', undefined]);
                        allValidCases.push('a', '', undefined);
                        break;
                    case 'countryCode':
                        allInvalidCases = _.difference(allCases, [1, '1', '', undefined]);
                        allValidCases.push(1, '1', '', undefined);
                        break;
                    case 'areaCode':
                        allInvalidCases = _.difference(allCases, [1, '1', '', undefined]);
                        allValidCases.push(1, '1', '', undefined);
                        break;
                    case 'number':
                        allInvalidCases = _.difference(allCases, [1, '1', '', undefined]);
                        allValidCases.push(1, '1', '', undefined);
                        break;
                }
        
                allInvalidCases.forEach(element => {//test all input cases
                    it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.contact[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).not.toBe(null);
                    });
                });
                allValidCases.forEach(element => {//test all input cases
                    it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.contact[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).toBe(null);
                    });
                });
            });
        });

        temp.email[0] = new createTestObj(profile.email[0]);
        temp.email[0].loopProperties((key)=>{

            describe(`email[0][${key}] validation`,()=>{
                let allValidCases = [];
                let allInvalidCases = [];
                
                afterEach(()=>{
                    temp.email[0][key] = profile.email[0][key];//store original profile value on temp
                    allValidCases = [];
                    allInvalidCases = [];
                });
                
                switch(key){
                    case 'main':
                        allInvalidCases = _.difference(allCases, [true, '', undefined]);
                        allValidCases.push(true, '', undefined);
                        break;
                    case 'address':
                        allInvalidCases = _.difference(allCases, ['', undefined]);
                        allValidCases.push('', undefined);
                        break;
                }
        
                allInvalidCases.forEach(element => {//test all input cases
                    it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.email[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).not.toBe(null);
                    });
                });
                allValidCases.forEach(element => {//test all input cases
                    it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.email[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).toBe(null);
                    });
                });
            });
        });

        temp.address[0] = new createTestObj(profile.address[0]);
        temp.address[0].loopProperties((key)=>{

            describe(`Address[0][${key}] validation`,()=>{
                let allInvalidCases = [];
                let allValidCases = [];
    
                afterEach(()=>{
                    temp.address[0][key] = profile.address[0][key];//store original profile value on temp
                    allInvalidCases = [];
                    allValidCases = [];
                });
    
                switch(key){
                    case 'main':
                        allInvalidCases = _.difference(allCases, [true, '', undefined]);
                        allValidCases.push(true,'', undefined);
                        break;
                    case 'description':
                        allInvalidCases = _.difference(allCases, ['a', '', undefined]);
                        allValidCases.push('a', '', undefined);
                        break;
                    case 'street':
                        allInvalidCases = _.difference(allCases, ['a', '1', '', undefined]);
                        allValidCases.push('a', '1', '', undefined);
                        break;
                    case 'city':
                        allInvalidCases = _.difference(allCases, ['a', '', undefined]);
                        allValidCases.push('a', '', undefined);
                        break;
                    case 'province':
                        allInvalidCases = _.difference(allCases, ['a', '', undefined]);
                        allValidCases.push('a', '', undefined);
                        break;
                    case 'zipcode':
                        allInvalidCases = _.difference(allCases, ['', undefined]);
                        allValidCases.push('1111', '', undefined);
                        break;
                }
    
                allInvalidCases.forEach(element => {//test all input cases
                    it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.address[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).not.toBe(null);
                    });
                });
                allValidCases.forEach(element => {//test all input cases
                    it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.address[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).toBe(null);
                    });
                });
                
            });
        });

        temp.government[0] = new createTestObj(profile.government[0]);
        temp.government[0].loopProperties((key)=>{

            describe(`Government[0][${key}] validation`,()=>{
                let allInvalidCases = [];
                let allValidCases = [];
    
                afterEach(()=>{
                    temp.government[0][key] = profile.government[0][key];//store original profile value on temp
                    allInvalidCases = [];
                    allValidCases = [];
                });

                switch(key){
                    case 'key':
                        allInvalidCases = _.difference(allCases, ['a','1', '', undefined]);
                        allValidCases.push('1','a','', undefined);
                        break;
                    case 'number':
                        allInvalidCases = _.difference(allCases, [1, '1','', undefined]);
                        allValidCases.push(1,'1','', undefined);
                        break;
                }
    
    
                allInvalidCases.forEach(element => {//test all input cases
                    it(`ERROR on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.government[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).not.toBe(null);
                    });
                });
                allValidCases.forEach(element => {//test all input cases
                    it(`no error on input "${element}" typeof ${typeof element}`, ()=>{
                        temp.government[0][key]=element;
                        const result = Profile.validate(temp);
                        expect(result.error).toBe(null);
                    });
                });
                
            });
        });
    });
});