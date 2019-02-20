<template>
  <div>
      <button v-on:click="tryToConnect()">connect</button>
      <select>
          <option v-for="port in ports" :key="'port-item-' + port.comName" v-bind:value="port">{{port}}</option>
      </select>
  </div>
</template>

<script>
const serialPort = require("serialport");

export default {
  name: "port-selector",
  data: () => {
    return { ports: ["sdfdsfds"] };
  },
  mounted: () => {
    let self = this;
    serialPort.list((err, port) => {
      console.log(port, self);
      self.ports = port;
    });
  },
  methods: {
    tryToConnect() {
      serialPort.list((err, port) => {
        console.log(port);
        this.ports = port;
      });
      //this.$router.push({ path: "main" });
    }
  }
};
</script>

<style scoped>
</style>
