<template>
  <div>
    <el-table
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :data="resources"
      stripe
      border
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column prop="icon" label="资源图标" width="80" align="center"
        ><template slot-scope="scope">
          <img
            :src="'http://localhost:3000/images/' + scope.row.icon"
            min-width="40"
            height="40"
          /> </template
      ></el-table-column>
      <el-table-column
        prop="_id"
        label="资源编号"
        width="100"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="资源名称"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="intro"
        label="资源简介"
        width="240"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="link"
        label="资源链接"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="shareDate"
        label="推荐日期"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userid"
        label="推荐者"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="isValid" label="是否可用" width="80" align="center"
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
        ref="resource"
        :model="resource"
        label-width="80px"
        class="demo-ruleForm"
        :rules="rules"
        @submit.native.prevent="auditResource(resource)"
      >
        <el-form-item label="资源图标">
          <img
            style="width: 60px"
            :src="'http://localhost:3000/images/' + resource.icon"
            alt=""
          />
        </el-form-item>
        <el-form-item label="资源编号">
          <el-input v-model="resource._id" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" size="mini">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="资源简介" size="mini">
          <el-input v-model="resource.intro"></el-input>
        </el-form-item>
        <el-form-item label="资源链接" size="mini">
          <el-input v-model="resource.link"></el-input>
        </el-form-item>
        <el-form-item label="资源详情" size="mini">
          <el-input v-model="resource.detail"></el-input>
        </el-form-item>
        <el-form-item label="资源标签" size="mini">
          <el-tag
            type="success"
            style="margin-right: 10px"
            v-for="item in resource.tag_list"
            :key="item._id"
            >{{ item.tag }}</el-tag
          >
        </el-form-item>
        <el-form-item label="推荐日期">
          <el-input
            v-model="resource.shareDate"
            disabled
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="推荐id">
          <el-input v-model="resource.userid" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="设为精选" size="mini">
          <el-radio v-model="isSelected" label="true">是</el-radio>
          <el-radio v-model="isSelected" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可用" size="mini">
          <el-radio v-model="resource.isValid" label="true">是</el-radio>
          <el-radio v-model="resource.isValid" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="设置分区" prop="zoneid_list" size="mini">
          <el-select
            filterable
            multiple
            clearable
            value-key="zoneid"
            v-model="resource.zoneid_list"
            placeholder="请选择专区,至多五个"
            style="width: 500px"
          >
            <el-option
              v-for="item in routelist2"
              :key="item._id"
              :label="item.menuName"
              :value="item._id"
            >
            </el-option>
            <el-option-group
              v-for="group in routelist"
              :key="group._id"
              :label="group.menuName"
            >
              <el-option
                v-for="item in group.children"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" native-type="submit">审核完成</el-button>
          <el-button type="success" @click="reject('reject', resource._id)"
            >拒绝</el-button
          >
          <el-button @click="resetForm('resource')">重置</el-button>
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
      pageSize: 7, // 每页条数
      resources: [],
      resource: {},
      routelist: {},
      routelist2: {},
      dialogVisible: false,
      dialogVisible2: false,
      isSelected: false,
      rules: {
        zoneid_list: [
          { required: true, message: "请分配专区", trigger: "change" },
        ],
      },
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
        .post("resources/rejectResource", {
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
            this.getResources();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 打开dialog传参
    openDialog(id) {
      this.dialogVisible = !this.dialogVisible;
      this.getResourcesById(id);
      this.getSideZone();
    },
    remove(id) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("resources/rejectResource", {
              _id: id,
              status: "delete",
            })
            .then((res) => {
              let { data } = res.data;
              this.$message({
                type: "success",
                message: data.msg,
              });
              this.getResources();
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
    getResourcesById(id) {
      this.$http
        .get("resources/getResources", {
          params: {
            rid: id,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.resource = data[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表格展示
    getResources() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("resources/getResources", {
          params: {
            pageSize,
            currentPage,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.resources = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getResources();
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
      this.getResources();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getResources();
    },
    // 清空表单
    resetForm(resource) {
      this.$refs[resource].resetFields();
    },
    // 专区选择
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
    // 审核通过
    auditResource(resource) {
      this.$refs.resource.validate((valid) => {
        if (valid) {
          this.$http
            .post("resources/checkResources", {
              resource: resource,
              isSelected: this.isSelected,
            })
            .then((res) => {
              let { data } = res.data;
              this.$message({
                type: "success",
                message: data.msg,
              });
              this.dialogVisible = !this.dialogVisible;
              this.getResources();
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
        .post("resources/rejectResource", {
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
          this.getResources();
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
    this.getResources();
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