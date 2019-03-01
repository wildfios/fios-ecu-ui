<template>
  <div>
    <button v-on:click="tryToConnect()">Connect</button>
    <div v-if="portCount > 0">
      <b-field label="Serial Port">
        <b-select placeholder="Select a port" v-model="selectedPort">
          <option
            v-for="port in portList"
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
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapState('serialPort', ['portList', 'port']),
    ...mapGetters('serialPort', ['portCount'])
  },
  mounted() {
    this.getPortList();
  },
  methods: {
    async getPortList() {
      await this.$store.dispatch('serialPort/list');
      this.selectedPort = this.portList[0].comName;
    },
    async tryToConnect () {
      let path = this.selectedPort
      let port = new serialPort(path, { baudRate: 115200 });
      await this.$store.dispatch('serialPort/setPort', this.selectedPort);
      this.$router.push({ path: "main" });
      //const parser = port.pipe(new Delimiter({ delimiter: [255, 255] }))
     // await this.$store.dispatch('serialPort/open', this.selectedPort);
      
      port.on('data', (data) => {
        let res = engineState.read(data.reverse(), 0)
        console.log(data)
        console.log(8000000 / (res.rpm * 2))
      })
    }
      //this.$router.push({ path: "main" });
  }
};
</script>

<style scoped>
</style>
