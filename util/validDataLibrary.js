const data = {
    gender: ['male', 'female', 'm', 'f'],
    civilStatus: ['single', 's',
        'widowed', 'widow', 'w',
        'married', 'm',
        'annulled', 'a',
        'divorced', 'd'],
    truthy:[1,'1','t','true','y','yes'],
    falsy:[0,'0','f','false','n','no'],
    accountType: ['profile', 'company', 'staff'],
    ownershipType: ['sole', 'partnership', 'corporation'],
    employeeStatus: ['applied', 'recruited', 'cancelled', 'wait-listed', 'hired', 'rejected', 'resigned', 'dismissed'],
    employeeSeparationClass : ['resigned', 'dismissed'],
    salaryRate: ['hour', 'day', 'week', 'month', 'quarter', 'semi-annual', 'annual']
}
//TODO: move to config

module.exports = data;