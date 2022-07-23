<template>
  <div>
    <el-table
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :data="files"
      stripe
      border
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column
        prop="_id"
        :show-overflow-tooltip="true"
        label="文件编号"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="文件名称"
        width="300"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="size"
        label="文件大小"
        width="120"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="uploadDate"
        label="上传日期"
        width="220"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userid"
        label="上传者ID"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="username"
        label="上传用户"
        width="120"
        align="center"
        id="test"
        ><template slot-scope="scope">
          <span v-html="scope.row.username"></span></template
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isValid"
        label="是否可用"
        width="80"
        align="center"
        ><template slot-scope="scope">
          <span v-if="scope.row.isValid == 'true'" style="color: green">{{
            scope.row.isValid
          }}</span>
          <span
            v-else-if="scope.row.isValid == 'reject'"
            style="color: black"
            >{{ scope.row.isValid }}</span
          >
          <span v-else style="color: red">{{ scope.row.isValid }}</span>
        </template></el-table-column
      >
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row._id)" type="text" size="small"
            >审核</el-button
          >
          <el-button @click="remove(scope.row._id)" type="text" size="small"
            >删除</el-button
          >
        </template></el-table-column
      >
    </el-table>
    <el-dialog :visible.sync="dialogVisible2" title="提示" width="30%">
      <span>确定要删除吗</span>
      <span slot="footer">
        <el-button type="primary" @click="mulDelete">确 定</el-button>
        <el-button @click="dialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>
    <div>
      <div style="float: left" v-if="multipleSelectionFlag">
        <el-button size="mini" @click="popDelete" type="danger"
          >批量删除</el-button
        >
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
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form
        ref="file"
        :model="file"
        label-width="80px"
        class="demo-ruleForm"
        @submit.native.prevent="auditResource(file)"
      >
        <el-form-item label="文件编号">
          <el-input v-model="file._id" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input v-model="file.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="文件大小">
          <el-input v-model="file.size" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上传日期">
          <el-input v-model="file.uploadDate" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上传者ID">
          <el-input v-model="file.userid" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上传用户">
          <el-input v-model="file.username" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" size="mini">
          <el-radio v-model="file.isValid" label="true">是</el-radio>
          <el-radio v-model="file.isValid" label="false">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="success" native-type="submit">审核完成</el-button>
          <el-button type="success" @click="reject('reject', file._id)"
            >拒绝</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 9, // 每页条数
      files: [],
      file: {},
      dialogVisible: false,
      dialogVisible2: false,
      multipleSelection: "",
      multipleSelectionFlag: false,
      multiDeleteVisible: false,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionFlag = true;
      if (this.multipleSelection.length == 0) {
        // 如不进行判断则勾选完毕后批量删除按钮还是会在
        this.multipleSelectionFlag = false;
      }
    },
    popDelete() {
      this.dialogVisible2 = !this.dialogVisible2;
    },
    mulDelete() {
      let checkArr = this.multipleSelection;
      let params = [];
      let self = this;
      checkArr.forEach(function (item) {
        params.push(item._id); // 添加所有需要删除数据的id到一个数组，post提交过去
      });
      this.$http
        .post("file/rejectFile", {
          status: "mulDelete",
          params: params,
        })
        .then((res) => {
          let { data } = res.data;
          if (data.code == 200) {
            this.$message({
              type: "success",
              message: data.msg,
            });
            this.dialogVisible2 = !this.dialogVisible2;
            this.getFile();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 打开dialog传参
    openDialog(id) {
      this.dialogVisible = !this.dialogVisible;
      this.getFileById(id);
    },
    remove(id) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("file/rejectFile", {
              _id: id,
              status: "delete",
            })
            .then((res) => {
              let { data } = res.data;
              this.$message({
                type: "success",
                message: data.msg,
              });
              this.getFile();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // dialog展示
    getFileById(id) {
      this.$http
        .get("file/getFile", {
          params: {
            aWID: id,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.file = data[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表格展示
    getFile() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("file/getFile", {
          params: {
            pageSize,
            currentPage,
            zone: "all",
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.files = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getFile();
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
      this.getFile();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getFile();
    },
    // 清空表单
    resetForm(resource) {
      this.$refs[resource].resetFields();
    },
    // 审核通过
    auditResource(file) {
      this.$refs.file.validate((valid) => {
        if (valid) {
          this.$http
            .post("file/checkFile", {
              file: file,
            })
            .then((res) => {
              let { data } = res.data;
              this.$message({
                type: "success",
                message: data.msg,
              });
              this.dialogVisible = !this.dialogVisible;
              this.getFile();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reject(status, _id) {
      this.$http
        .post("file/rejectFile", {
          _id: _id,
          status: status,
        })
        .then((res) => {
          let { data } = res.data;
          this.$message({
            type: "success",
            message: data.msg,
          });
          this.dialogVisible = !this.dialogVisible;
          this.getFile();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // elementui dialog
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  created() {
    this.getFile();
  },
};
</script>
<style lang="scss" scoped>
.pagination {
  text-align: right;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>