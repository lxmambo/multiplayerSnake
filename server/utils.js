module.exports = {
    makeid,
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVXZabcdefghijklmnopqrstuvxz0123456789';
    var charactersLength = characters.length;
    for(var i = 0; i < length; i++){
        result+=characthers.charAt(Math.floor(Math.random()*charactersLength));

    }
    return result;
}