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
                    cb(key);
            }
        }
    }

    module.exports = createTestObj;