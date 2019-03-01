<template>
  <div id="app">
    <!-- <main-menu></main-menu> -->
    <router-view class="main-outlet-frame"></router-view>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";

const serialPort = require("serialport");

export default {
  name: "fios-ecu-ui",
  components: {
    MainMenu
  },
  data: () => {
    return { comPort: null };
  }
};
</script>

<style scoped>
  .main-outlet-frame{
    padding-top: 30px;
  }
</style>
