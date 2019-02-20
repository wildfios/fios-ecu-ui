<template>
  <div>
    <div 
      v-bind:style="{'left': leftPos + 'px', 'top': topPos + 'px'}"
      class="window-body"  
    >
      <div class="window-header" v-on:mousedown="onDragStart($event)">
        <p class="window-title-text">{{windowTitle}}</p>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-window',
  data() {
    return {
      leftPos: 10,
      topPos: 10,
      leftPosStart: 0,
      topPosStart: 0,
      windowTitle: 'Title'
    };
  },
  methods: {
    onDragStart(event) {
      event.preventDefault();
      this.leftPosStart = event.clientX;
      this.topPosStart = event.clientY;
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.onDragStop);
    },
    onDrag(event) {
      event.preventDefault();
      
      let posX = event.clientX - this.leftPosStart;
      let posY = event.clientY - this.topPosStart;
    
      this.leftPosStart = event.clientX;
      this.topPosStart = event.clientY; 

      this.leftPos += posX;
      this.topPos += posY;
    },
    onDragStop(event) {
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.onDragStop);
    }
  }
};
</script>

<style scoped>
  .window-header {
    padding-top: 26px;
    background: lightblue;
    border: 1px solid gray;
    display: block;
  }

  .window-title-text {
    margin: 0;
    top: 0px;
    position: absolute;
    padding-left: 5px;
  }

  .window-body {
    position: absolute;
    background: white;
    border-radius: 2px;
    border: solid 1px lightgray;
  }
</style>
