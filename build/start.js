const logger = require('./logger');
const server = require('./server');
const os = require('os');

logger.info('Starting server...');

function getIPV4() {
    let iptable = {};
    let ifaces = os.networkInterfaces();
    
    for (let dev in ifaces) {
        ifaces[dev].forEach(function(details,alias){
            if (details.family=='IPv4') {
                iptable[dev+(alias?':'+alias:'')] = details.address;
            }
        });
    }

    return iptable['en0:1'];
}

server.listen(3000, () => {
    logger.success(`Server is running at http://${getIPV4()}:3000`);
});