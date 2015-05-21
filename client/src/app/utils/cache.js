var cache = null

exports.set = function (data) {
    cache = data
}

exports.get = function () {
    return cache
}

exports.file = null
