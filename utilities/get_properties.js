function getProperties(object) {
    var properties = []
    do {
        Object.getOwnPropertyNames(object).forEach(function(p, I, a) {
            if (properties.indexOf(p) === -1) {
                properties.push(p)
            }
        })
    } while(object = Object.getPrototypeOf(object))
    return properties
}
