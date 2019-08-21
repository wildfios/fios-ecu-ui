<template>
  <div class="port-selector-body">
    <div v-if="portList.length > 0">
      <h1 class="port-selector-title">CONNECT TO ECU</h1>
      <b-field label="Serial Port">
        <b-select placeholder="Select a port" v-model="selectedPort" class="port-selector-list">
          <option
            v-for="port in portList"
            :value="port.comName"
            :key="'port-item-' + port.comName">
            {{ port.comName }}
          </option>
        </b-select>
      </b-field>
    </div>
    <p class="port-selector-text">
      Select port and press Connect button
    </p>
    <section class="port-selector-wrapper-inline">
      <b-message v-if="errorMsg !== ''" type="is-danger" class="port-selector-err-msg">
        {{errorMsg}}
      </b-message>
    </section>
    <section class="port-selector-wrapper-block">
      <button class="button is-medium is-info port-selector-wrapper" @click="tryToConnect()">
        Connect
      </button>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import SerialComm from '../services/SerialComm'

export default {
  name: "port-selector",
  data: () => {
    return {
      portList: [],
      selectedPort: '',
      errorMsg: ''
    };
  },
  mounted() {
    this.getPortList();
  },
  methods: {
    async getPortList() {
      this.portList = await SerialComm.fetchPortList();
      this.selectedPort = this.portList[0].comName;
    },
    async tryToConnect () {
      this.errorMsg = '';
      let res = await SerialComm.open(this.selectedPort);
      if (!res.open) {
        this.errorMsg = res.msg;
      } else {
        SerialComm.startListen();
        this.$router.push({ path: "main" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.port-selector {
  &-body {
    padding: 20px;
    text-align: center;
  }
  &-title {
    font-size: xx-large;
  }
  &-list {
    text-align: center;
  }
  &-text {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  &-wrapper-inline{
    display: inline-block;
    padding: 10px;
  }
  &-wrapper-block{
    display: block;
  }
  &-err-msg {
    max-width: 400px;
  }
}

</style>
