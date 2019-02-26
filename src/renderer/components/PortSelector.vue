<template>
  <div>
    <button v-on:click="tryToConnect()">Test</button>
    <div v-if="ports.length > 0">
      <b-field label="Serial Port">
        <b-select placeholder="Select a port" v-model="selectedPort">
          <option
            v-for="port in ports"
            :value="port.comName"
            :key="'port-item-' + port.comName">
            {{ port.comName }}
          </option>
        </b-select>
      </b-field>
    </div>
  </div>
</template>

<script>
const serialPort = require("serialport");
const Delimiter = require('@serialport/parser-delimiter')

const Struct = require('js-struct/lib/Struct')
const Type = require('js-struct/lib/Type')
const engineState = Struct([
  Type.uint8('with'),
  Type.uint8('load'),
  Type.uint32('rpm'),
]);

export default {
  name: "port-selector",
  data: () => {
    return { 
      ports: [],
      selectedPort: '' 
    };
  },
  mounted() {
    this.getPortList();
  },
  methods: {
    async getPortList() {
      let ports = await serialPort.list();
      this.ports = ports;
      this.selectedPort = ports[0].comName;
    },
    tryToConnect () {
      let path = this.selectedPort
      let port = new serialPort(path, { baudRate: 115200 });

      //const parser = port.pipe(new Delimiter({ delimiter: [255, 255] }))
      port.on('data', (data) => {
        let res = engineState.read(data.reverse(), 0)
        console.log(data)
        console.log(8000000 / (res.rpm * 2))
      })
      //port.on('data', console.log)
    }
      //this.$router.push({ path: "main" });
  }
};
</script>

<style scoped>
</style>
