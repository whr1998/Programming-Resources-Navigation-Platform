<template>
  <el-container v-loading="loading">
    <Aside v-bind:routelist="routelist" v-bind:routelist2="routelist2"></Aside>
  </el-container>
</template>

<script>
import Aside from "@/components/aside.vue";
export default {
  components: {
    Aside,
  },
  data() {
    return {
      routelist2: {},
      routelist: {},
    };
  },
  methods: {
    getSideZone() {
      this.$http
        .get("common/getZone", {
          params: {
            page: "resources",
          },
        })
        .then((res) => {
          let { routelist, routelist2 } = res.data;
          this.routelist = routelist;
          this.routelist2 = routelist2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getSideZone();
  },
};
</script>

<style lang="scss" scoped></style>
