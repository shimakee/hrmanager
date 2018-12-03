module.exports = function(app){
    if(!process.env.TOKEN){//make sure that token is set
        throw new Error('FATAL ERROR: TOKEN is not defined');
    }
}