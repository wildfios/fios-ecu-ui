<template>
  <div>
    <button v-on:click="uploadMapTest()">Store mew map</button>
    <button v-on:click="loadMapTest()">Load mew map</button>
    <modal-window v-for="map in maps"
      :window-title="map.msg">
      <map-table 
        :scale-text="map.scaleText"
        :axis-val-x="maps[0].axisValX"
        :axis-val-y="maps[0].axisValY"
        :min-val="maps[0].minVal"
        :max-val="map.maxVal"
        :map-data="maps[0].fuelMap"
        :hi-light-cel="maps[0].curSell"
        :map-index="maps[0].testIndex"
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
import FileService from "../services/FileService.js";

const fileServiceService = new FileService();

export default {
  name: "landing-page",
  components: {
    MapTable,
    modalWindow
  },
  data() {
    return { 
      maps: [{
        testIndex: 1, /* Remove this */
        scaleText: "RPM/LOAD",
        msg: "Fuel map",
        curSell: "",
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
        maxVal: 1000,
        fuelMap: []
      }]
    };
  },
  created() {
    let closesVal = [];
    let iterator = this.maps[0].axisValY.start;
    for (let i = 0; i < this.maps[0].fuelMap.length; i++ ) {
      closesVal.push(iterator);
      iterator += this.maps[0].axisValY.step;
    }
    SerialComm.fetchMap(1);   /* TODO: Fetch index should be changed */
    SerialComm.events.$on('data', (data) => {
      this.maps[0].fuelMap = data;
    });
    SerialComm.events.$on('state', res => {
      console.log(res);
      this.curSell = Helpers.closestIndex(closesVal, 8000000 / (res.rpm * 2)) + "-" + 0;
    });
  },
  methods: {
    /* Force set data to map */
    setMapData(i, j, data) {
      this.$set(this.maps[0].fuelMap[i], j, data);
    },

    /* Map data change */
    onChange(e) {
      SerialComm.editMap(e);
    },

    increment() {
      this.setMapData(3, 3, Math.floor(Math.random() * 100));
      this.maps[0].curSell = Math.floor(Math.random() * 10) + "-" + Math.floor(Math.random() * 10);
    },

    loadMapTest() {
      SerialComm.fetchMap(1);
    },

    uploadMapTest() {
      let map = [
        [100, 200, 30,  23, 123,  12, 32, 32,  3, 123, 123],
        [100, 200, 30,  23, 123, 123, 32, 32,  3, 123, 123],
        [100, 200, 30, 123, 123,  12, 32, 32,  3, 123, 123],
        [100, 200, 30,  23, 123, 123, 12, 31, 12,   3, 123],
        [100, 200, 23, 123, 123,  12, 32, 32,  3, 123, 123],
        [100, 200, 30, 123, 123,  12, 32, 31,  3, 123, 123],
        [100, 200, 30,  23, 123,  12, 32, 31,  3, 123, 123],
        [100, 200, 30,  23, 123, 123, 32, 31,  3, 123, 123],
        [100, 200, 30,  23, 123,  12, 32, 31,  3, 123, 123],
        [100,  42, 23, 123, 123,  12, 32, 31,  3, 123, 123],
        [ 50,  60, 70,  23, 123, 123, 12, 32,  3, 123, 123],
        [100, 200, 23, 123, 123,  12, 32, 12,  3, 123, 123],
        [100, 200, 30, 123, 123,  12, 32, 12,  3, 123, 123],
        [100, 200, 30,  23, 123,  12, 32, 12,  3, 123, 123],
        [100, 200, 30,  23, 123, 123, 32, 12,  3, 123, 123],
        [100,  20, 30,  23, 123,  12, 32, 32,  3, 123, 123],
        [100,  30,  2, 123, 123,  12, 32, 32,  3, 123, 123],
        [ 50,  60, 70,  23, 123, 123, 12, 32,  3, 123, 123],
        [ 50,  60, 70,  23, 123, 123, 12, 32,  3, 123, 123]
      ];
      SerialComm.upLaodMap(map);
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



<!--
    <h1 v-on:click="updateData()">{{msg}}</h1>
    <button v-on:click="test()">test</button>

      // fileServiceService.saveFile(this.fuelMap);

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

    test() {
      const self = this;
      fileServiceService.readFile(function(err, buf) {
        if (err) {
          return console.log(err);
        }
        self.fuelMap = JSON.parse(buf);
      });
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

    const Struct = require('js-struct/lib/Struct')
const Type = require('js-struct/lib/Type')
const engineState = Struct([
    Type.uint8('with'),
    Type.uint8('load'),
    Type.uint32('rpm'),
    Type.uint8('cmdCode'),
  ]);
-->