<template>
  <div>
      <button v-on:click="tryToConnect()">connect</button>
      <b-field label="Serial Port">
        <b-select placeholder="Select a port">
          <option
            v-for="port in ports"
            :value="port.comName"
            :key="'port-item-' + port.comName">
            {{ port.comName }}
          </option>
        </b-select>
      </b-field>
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
