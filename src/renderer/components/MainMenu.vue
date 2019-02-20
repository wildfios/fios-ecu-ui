<template>
  <div class="main-menu-cmp" >
    <ul>
      <li><a>Connect to ECU</a></li>
      <li><a>Status</a></li>
    </ul>
  </div>
</template>

<script>
import modalWindow from './modalWindow.vue';
import MapTable from './mapTable.vue';
import { setInterval } from 'timers';
import { throws } from 'assert';
import FileService from '../services/FileService.js';

const fileServiceService = new FileService();
const serialPort = require('serialport-js');

export default {
  name: 'main-menu',
  data() {
    return {
      aaa: 0,
    };
  },
  methods: {
    test() {

    },
  }
};
</script>

<style scoped>
    .main-menu-cmp {
        position: fixed;
        top: 0;
        left: 0;
        height: 30px;
        width: 100%;
        z-index: 10000;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #eee;
    }

    li {
        float: left;
    }

    li a, .dropbtn {
        display: inline-block;
        color: white;
        text-align: center;
        padding: 6px 8px;
        text-decoration: none;
    }

    li a:hover, .dropdown:hover .dropbtn {
        background-color: grey;
    }

    li a:active {
        background-color: blue;
    }
</style>
