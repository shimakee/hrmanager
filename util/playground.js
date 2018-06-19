const createTestObj = function (data){
    for (const key in data) {//assing existing properties as the only properties within the object
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            this[key] = element;
        }
    }
}

createTestObj.prototype.loopProperties = function(cb){
    for (const key in this) {
        if (this.hasOwnProperty(key)) {
            const element = this[key];
            cb();
        }
    }
}


const user = {
    _id: 123132,
    activity: true,
    username: '12345678',
    password: 'aaAA11!!!!',
    passConfirm: 'aaAA11!!!!',
    profile: 123,
    name:{
        first: '1',
        second: '2'
    }
}
let  profile = {
    _id: 1234,
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
spouse: 1234,
parents: {mother: 1234,
        father: 1234},
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


const newUser2 = new createTestObj(profile);
newUser2.name = new createTestObj(newUser2.name);