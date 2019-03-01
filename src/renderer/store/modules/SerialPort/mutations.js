import { link } from "fs";

export default {
    SET_PORT(state, port) {
        state.port = port;
    },

    SET_LIST(state, list) {
        state.portList = list;
    }
};