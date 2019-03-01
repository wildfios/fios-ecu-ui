export default {
    portCount(state) {
        return state.portList.length
    },
    isPortOpen() {
        return state.port !== undefined
    }
};