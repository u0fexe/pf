const dev  = require('./dev.js')
const prod = require('./prod.js')
const tools = require('./tools.js')

module.exports.dev = dev()
module.exports.prod = prod()
module.exports.prepareImages = tools.prepareImages
