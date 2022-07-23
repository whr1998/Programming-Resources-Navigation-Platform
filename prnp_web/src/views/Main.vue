<template>
  <el-container>
    <el-header>
      <MyHead></MyHead>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>
      <Footer v-if="this.$route.path == '/main'"></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Footer from "../components/footer";
import MyHead from "../components/head";
export default {
  components: {
    MyHead,
    Footer,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-header,
.el-footer {
  height: 60px;
  line-height: 60px;
  margin: 0;
  padding: 0;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
}
.el-main {
  margin: 0;
  padding: 0;
  // height: 1400px;
}
</style>