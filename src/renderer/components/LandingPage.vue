<template>
  <div>
    <h1 v-on:click="updateData()">{{msg}}</h1>
    <button v-on:click="test()">test</button>
    <button v-on:click="serial()">test serial</button>
    <h1 class="test-1" v-bind:style="{'left': aaa + 'px'}">{{aaa}}</h1>
    <modal-window>
      <map-table 
        :scale-text="scaleText"
        :axis-val-x="axisValX"
        :axis-val-y="axisValY"
        :min-val="minVal"
        :max-val="maxVal"
        :map-data="fuelMap"
        :hi-light-cel="val"
        @change="onChange($event)"
      ></map-table>
    </modal-window>
    <button v-on:click="increment()">increment</button>
  </div>
</template>

<script>
import modalWindow from "./modalWindow.vue";
import MapTable from "./mapTable.vue";
import SerialComm from '../services/SerialComm';
import Helpers from '../services/Helpers';

import { setInterval } from "timers";

import FileService from "../services/FileService.js";

const Struct = require('js-struct/lib/Struct')
const Type = require('js-struct/lib/Type')
const engineState = Struct([
  Type.uint8('with'),
  Type.uint8('load'),
  Type.uint32('rpm'),
]);

const fileServiceService = new FileService();

export default {
  name: "landing-page",
  components: {
    MapTable,
    modalWindow
  },
  data() {
    return {
      aaa: 0,
      mapReady: false,
      scaleText: "RPM/LOAD",
      msg: "Fuel map",
      val: "s",
      axisValX: {
        start: 0,
        step: 10,
        postfix: "%"
      },
      axisValY: {
        start: 800,
        step: 400,
        postfix: " rpm"
      },
      minVal: 0,
      maxVal: 25,
      timer: Object,
      fuelMap: [
        [100, 200, 300, 23, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 123, 312, 312, 3, 123, 123],
        [100, 200, 300, 123, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 123, 12, 312, 312, 3, 123],
        [100, 200, 23, 123, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 123, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 123, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 12, 312, 312, 3, 123, 123],
        [100, 300, 23, 123, 123, 12, 312, 312, 3, 123, 123],
        [500, 600, 700, 23, 123, 123, 12, 312, 3, 123, 123],
        [100, 200, 23, 123, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 123, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 12, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 123, 312, 312, 3, 123, 123],
        [100, 200, 300, 23, 123, 12, 312, 312, 3, 123, 123],
        [100, 300, 23, 123, 123, 12, 312, 312, 3, 123, 123],
        [500, 600, 700, 23, 123, 123, 12, 312, 3, 123, 123],
        [500, 600, 700, 23, 123, 123, 12, 312, 3, 123, 123]
      ]
    };
  },
  methods: {
    test() {
      const self = this;
      fileServiceService.readFile(function(err, buf) {
        if (err) {
          return console.log(err);
        }
        self.fuelMap = JSON.parse(buf);
      });
    },
    setMapData(i, j, data) {
      this.$set(this.fuelMap[i], j, data);
    },
    updateData() {
      var x = 1,
        y = 1;
      for (var i = 0; i < this.fuelMap.length; i++) {
        x += 0.1;
        for (var j = 0; j < this.fuelMap[0].length; j++) {
          y += 0.1;
          this.setMapData(i, j, Math.floor(x + y));
        }
      }
    },
    onChange(e) {

    },

    serial() {
      SerialComm.port.on('data', (data) => {
        let res = engineState.read(data.reverse(), 0)
        console.log(8000000 / (res.rpm * 2))
      })
    },

    increment() {
      let values = [10, 12, 5, 9, 13, 6];
      console.log(Helpers.closest(values, 4));


      //this.setMapData(3, 3, Math.floor(Math.random() * 100));
      this.val =
        Math.floor(Math.random() * 10) + "-" + Math.floor(Math.random() * 10);
      // fileServiceService.saveFile(this.fuelMap);
    }
  }
};
</script>

<style scoped>
.test-1 {
  position: absolute;
  transition: left 100ms;
}
</style>
