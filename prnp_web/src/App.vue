<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {},
};
</script>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  background-color: rgb(242, 242, 242);

  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: #47b897;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
