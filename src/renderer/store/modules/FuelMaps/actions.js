export default {
    async fetch({ commit }) {
        const portList = await serialPort.list();

        commit('SET_LIST', portList);
    },
};