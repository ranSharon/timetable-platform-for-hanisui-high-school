if (process.env.NODE_ENV === 'production') {
    // we are in production - return keys of prod.js
    module.exports = require('./prod');
}
else {
    // we are in devlopment - return keys of dev.js
    module.exports = require('./dev');
}

