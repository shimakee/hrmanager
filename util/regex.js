const regex = {
    common:/^([A-z][\s]{0,1}){1,255}$/,
    commonAlphaNum:/^([A-z0-9][\s]{0,1}){1,255}$/,
    address:/^([A-z0-9.#\-,][\s]{0,1}){1,255}$/i,
    imgName:/^([A-z0-9.#\-,]+[\s]*){1,255}(.JPG|.jpg|.JPEG|.jpeg|.PNG|.png)$/
    // imgNameExt:/^([A-Za-z\s0-9-_.]{1,255})(.JPG|.jpg|.JPEG|.jpeg|.PNG|.png)$/
}

module.exports = regex;