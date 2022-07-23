<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <LeftNav></LeftNav>
    </el-aside>
    <el-container>
      <el-header>
        <HeadNav></HeadNav>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftNav from "@/components/leftNav.vue";
import HeadNav from "@/components/headNav.vue";
export default {
  name: "home",
  components: {
    LeftNav,
    HeadNav,
  },
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="scss">
body,
html,
.el-header {
  margin: 0 !important;
  padding: 0 !important;
}
</style>