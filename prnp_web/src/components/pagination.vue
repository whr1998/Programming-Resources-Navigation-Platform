<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 4, // 每页条数
    };
  },
  methods: {
    // 按照分页显示数据的函数
    getcarlist() {
      // // 收集当前页码 和 每页显示条数
      // let pageSize = this.pageSize;
      // let currentPage = this.currentPage;
      // // 发送ajax请求 把分页数据发送给后端
      // this.$http
      //   .get("carlistshow", {
      //     params: {
      //       pageSize,
      //       currentPage,
      //     },
      //   })
      //   .then((res) => {
      //     // 接收后端返回的数据总条数 total 和 对应页码的数据 data
      //     let { total, result } = res.data;
      //     // 赋值给对应的变量即可
      //     this.total = total;
      //     this.carlist = result;
      //     // 如果当前页没有数据 且 排除第一页
      //     if (!data.length && this.currentPage !== 1) {
      //       // 页码减去 1
      //       this.currentPage -= 1;
      //       // 再调用自己
      //       this.getcarlist();
      //     }
      //   })
      //   .catch((err) => {
      //     // console.log(err);
      //   });
    },
    // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // // 保存每页显示的条数
      // this.pageSize = val;
      // // 调用分页函数
      // this.getcarlist();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      // this.currentPage = val;
      // // 调用分页函数
      // this.getcarlist();
    },
  },
  created() {
    this.getcarlist();
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  text-align: center;
}
</style>