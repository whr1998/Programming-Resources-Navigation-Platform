<template>
  <div>
    <el-container>
      <div class="emptycontainer" v-if="integrations.length ? false : true">
        <el-empty description="还没有产生积分哦"></el-empty>
      </div>
      <div class="recordItem" v-if="integrations.length ? true : false">
        <div class="item" v-for="item in integrations" :key="item._id">
          <p>{{ item.title }}</p>
          <div style="display: flex; justify-content: space-between">
            <span style="color: red">+{{ item.integration }}</span
            ><span>{{ item.getDate }}</span>
          </div>
        </div>
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
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      integrations: [],
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 10, // 每页条数
    };
  },
  methods: {
    getIntegration() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("common/getIntegration", {
          params: {
            pageSize,
            currentPage,
            userid: this.$store.state.USERID,
          },
        })
        .then((res) => {
          let { data, total } = res.data;
          this.integrations = data;
          this.total = total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // // 保存每页显示的条数
      this.pageSize = val;
      // // 调用分页函数
      this.getIntegration();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getIntegration();
    },
  },
  created() {
    this.getIntegration();
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  height: 50px;
  margin: 20px 10px 0 0;
  text-align: right;
}
.el-container {
  min-height: 400px;
  background-color: #fff;
  .emptycontainer {
    margin: 0 auto;
  }
  .recordItem {
    width: 100%;
    .item {
      height: 80px;
      border-bottom: 1px solid rgb(238, 236, 236);
      padding: 0 20px;
      font-size: 14px;
      color: rgb(85, 84, 84);
      p {
        padding: 15px 0;
        margin: 0;
      }
    }
  }
}
</style>