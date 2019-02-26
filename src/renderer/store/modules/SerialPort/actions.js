const serialPort = require("serialport");

export default {
    async open({ commit }, path) {
        const { port } = await serialPort.open(path, { baudRate: 115200 });
        
        commit('OPEN', port);
    },
};