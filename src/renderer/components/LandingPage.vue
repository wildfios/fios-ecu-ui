<template>
  <div>
    <!--div class="side-bar-tree">
    </div-->
    <button v-on:click="uploadMapTest()">Store mew map</button>
    <button v-on:click="loadMapTest()">Load mew map</button>
    <button v-on:click="saveMapTest()">Save mew map</button>
    <button v-on:click="openMapTest()">Open mew map</button>
    <modal-window v-for="map in maps"
      :window-title="map.msg"
      :key="map.map">
      <map-table 
        :scale-text="map.scaleText"
        :axis-val-x="map.axisValX"
        :axis-val-y="map.axisValY"
        :min-val="map.minVal"
        :max-val="map.maxVal"
        :map-data="map.fuelMap"
        :hi-light-cel="map.curSell"
        :map-index="map.testIndex"
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

const {dialog} = require('electron').remote;
const fileServiceService = new FileService();

export default {
  name: "landing-page",
  components: {
    MapTable,
    modalWindow
  },
  data() {
    return { 
      maps: {
        0x0000:  {
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
          maxVal: 255,
          fuelMap: []
        },
        0x0100:  {
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
          maxVal: 225,
          fuelMap: []
        },
      }
    };
  },
  created() {
    let closesVal = [];
    let iterator = this.maps[0].axisValY.start;
    for (let i = 0; i < this.maps[0].fuelMap.length; i++ ) {
      closesVal.push(iterator);
      iterator += this.maps[0].axisValY.step;
    }
    SerialComm.fetchMap(0);   /* TODO: Fetch index should be changed */
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
      dialog.showSaveDialog({
          filters: [
            { name: 'Maps', extensions: ['map'] }
          ]
        },
        (fileName) => {
          if (fileName === undefined){
            return;
          }
          fileServiceService.saveFile(fileName, this.maps);
        });
    },

    openMapTest() {
      const self = this;
      dialog.showOpenDialog({
        filters: [
          { name: 'Maps', extensions: ['map'] }
        ]
      },
      (fileName) => {
        if (fileName === undefined){
          return;
        }
        fileServiceService.readFile(fileName[0], function(err, buf) {
        if (err) {
          alert('Can not open file');
        }
        self.maps = JSON.parse(buf);
      });

      });
    },

    uploadMapTest() {
      SerialComm.upLaodMap(this.maps[0]);
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
