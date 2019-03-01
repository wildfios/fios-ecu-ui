const serialPort = require("serialport");

export default {
    async list({ commit }) {
        const portList = await serialPort.list();

        commit('SET_LIST', portList);
    },

    setPort({ commit }, port) {
        commit('SET_PORT', port);
    }
};