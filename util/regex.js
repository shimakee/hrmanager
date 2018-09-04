const regex = {
    common:/^([A-z][\s]{0,1}){1,255}$/,
    commonAlphaNum:/^([A-z0-9][\s]{0,1}){1,255}$/,
    address:/^([A-z0-9.#\-,][\s]{0,1}){1,255}$/i
}

module.exports = regex;