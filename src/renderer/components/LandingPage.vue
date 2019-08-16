<template>
  <div>
    <!--div class="side-bar-tree">
    </div-->
    <button @click="$refs.fileInput.click()" class="trigger">Click me</button>

    <button v-on:click="uploadMapTest()">Store mew map</button>
    <button v-on:click="loadMapTest()">Load mew map</button>
    <button v-on:click="saveMapTest()">Save mew map</button>
    <button v-on:click="openMapTest()">Open mew map</button>
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
        index: 0, /* Remove this */
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
        xDemention: 11,
        maxVal: 1000,
        fuelMap: []
      },]
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
      this.maps[data.meta.index].index = data.meta.index;
      this.maps[data.meta.index].fuelMap = data.map;
      this.maps[data.meta.index].axisValX.start = data.meta.xStart;
      this.maps[data.meta.index].axisValX.step = data.meta.xStep;
      this.maps[data.meta.index].axisValY.start = data.meta.yStart;
      this.maps[data.meta.index].axisValY.step = data.meta.yStep;
      this.maps[data.meta.index].xDemention = data.meta.demention;
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

    saveMapTest() {
      fileServiceService.saveFile(this.maps);
    },

    openMapTest() {
      const self = this;
      fileServiceService.readFile(function(err, buf) {
        if (err) {
          return console.log(err);
        }
        self.maps = JSON.parse(buf);
      });
    },

    uploadMapTest() {
      SerialComm.upLaodMap(this.maps[1]);
    }
  }
};
</script>

<style scoped>
.test-1 {
  position: absolute;
  transition: left 100ms;
}

.side-bar-tree {
  position: absolute;
  width: 300px;
  height: 100%;
  background: lightgray;
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