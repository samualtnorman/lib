console.warn(`\
Warning: Using deasync to synchronously import ECMAScript module
         Consider using ES module: https://nodejs.org/api/esm.html#enabling`
)

module.exports = null
import("./index.js").then(esModule => module.exports = esModule)
require("deasync").loopWhile(() => !module.exports)
