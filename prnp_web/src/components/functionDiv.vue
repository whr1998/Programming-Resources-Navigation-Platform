<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      radio1: "1",
      radioGroup: [
        { radioname: "综合", label: "1" },
        { radioname: "时间", label: "2" },
        { radioname: "评价", label: "3" },
        { radioname: "收藏", label: "4" },
      ],
      checked: true,
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: white;
  padding-top: 20px;
  padding-bottom: 10px;
  .el-input {
    width: 50%;
  }
}
</style>