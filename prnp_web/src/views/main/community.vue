<template>
  <div>
    <Aside v-bind:routelist2="routelist2"></Aside>
  </div>
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
    };
  },
  methods: {
    getSideZone() {
      this.$http
        .get("common/getZone", {
          params: {
            page: "community",
          },
        })
        .then((res) => {
          let { routelist2 } = res.data;
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

<style lang="scss" scoped>
</style>