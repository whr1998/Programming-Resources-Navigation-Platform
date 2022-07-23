<template>
  <div>
    <el-table stripe :data="users" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions
            class="margin-top"
            title="更多信息"
            :column="3"
            border
          >
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user">注册时间</i>
              </template>
              {{ props.row.regDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user">所在地区</i>
              </template>
              {{ props.row.area }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user">积分</i>
              </template>
              {{ props.row.integration }}
            </el-descriptions-item>
            <el-descriptions-item :show-overflow-tooltip="true">
              <template slot="label">
                <i class="el-icon-user">介绍</i>
              </template>
              {{ props.row.intro }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user">兴趣</i>
              </template>
              <el-tag
                style="margin-right: 10px"
                v-for="i in props.row.interest"
                :key="i._id"
                >{{ i.tag }}</el-tag
              >
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户头像" prop="toux"
        ><template slot-scope="scope">
          <img
            :src="'http://localhost:3000/images/' + scope.row.toux"
            height="40"
            width="40"
            style="border-radius: 50%; object-fit: cover"
          /> </template
      ></el-table-column>
      <el-table-column label="用户 ID" prop="_id" align="center">
      </el-table-column>
      <el-table-column label="用户昵称" prop="username" align="center">
      </el-table-column>
      <el-table-column label="用户账号" prop="usermail" align="center">
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatBoolean"
        label="是否有效账号"
        prop="isLive"
      >
      </el-table-column>
    </el-table>
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
</template>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>

<script>
export default {
  data() {
    return {
      users: [],
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 12, // 每页条数
    };
  },
  methods: {
    formatBoolean: function (row, column, cellValue) {
      var ret = ""; //你想在页面展示的值
      if (cellValue) {
        ret = "true"; //根据自己的需求设定
      } else {
        ret = "false";
      }
      return ret;
    },
    getUsers() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("users/getUserInfo", {
          params: {
            pageSize,
            currentPage,
            zone: "all",
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.users = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getUsers();
          }
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
      this.getUsers();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getUsers();
    },
  },
  created() {
    this.getUsers();
  },
};
</script>