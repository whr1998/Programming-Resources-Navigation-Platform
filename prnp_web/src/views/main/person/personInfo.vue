<template>
  <div>
    <div class="toux">
      <img :src="'http://localhost:3000/images/' + info.toux" alt="" />
      <el-button
        style="
          margin: 60px 20px 0 0;
          height: 40px;
          background-color: #47b897;
          color: white;
        "
        icon="el-icon-s-promotion"
        @click="logout"
        >退出登录</el-button
      >
    </div>
    <div class="info">
      <el-descriptions class="margin-top" title="信息" :column="1" border>
        <template slot="extra">
          <i class="el-icon-edit" style="cursor: pointer"></i>
          <span style="cursor: pointer" @click="showInfoEdit">编辑</span>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <span>昵称</span>
          </template>
          {{ info.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>积分</span>
          </template>
          {{ info.integration || "0" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>邮箱</span>
          </template>
          {{ info.usermail }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>个人简介</span>
          </template>
          {{ info.intro || "暂未填写" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>兴趣</span>
          </template>
          <el-tag
            style="margin-right: 10px"
            v-for="item in info.interest"
            :key="item._id"
            size="small"
            >{{ item.tag }}</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>所在地区</span>
          </template>
          {{ info.area || "暂未填写" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>注册时间</span>
          </template>
          {{ info.regDate }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogVisible"
      width="37%"
      :before-close="handleClose"
    >
      <el-form
        ref="info"
        :model="info"
        label-width="80px"
        @submit.native.prevent="editUserInfo(info)"
      >
        <el-form-item label="头像">
          <el-upload
            class="upload-demo"
            drag
            action="http://localhost:3000/upload/img"
            name="image"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2M。建议上传长宽一致的图标。
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="info.username"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" prop="intro">
          <el-input v-model="info.intro"></el-input>
        </el-form-item>
        <el-form-item label="兴趣" prop="interest">
          <el-select
            @focus="showTagsSelect"
            filterable
            v-model="interest"
            placeholder="可选择至多十个标签"
            multiple
            style="width: 100%"
            clearable
            @change="checkTagsNum(interest)"
          >
            <el-option
              v-for="item in taglist"
              :key="item._id"
              :label="item.tag_name"
              :value="item.tag_name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在地区" prop="area">
          <el-input v-model="info.area"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit">点击修改</el-button>
          <el-button @click="resetForm('info')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      info: {},
      interest: {},
      taglist: {},
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("toux");
      localStorage.removeItem("userid");
      localStorage.removeItem("username");
      localStorage.removeItem("TOKEN");
      this.$message({
        type: "success",
        message: "已退出登录",
      });
    },
    getUserInfo() {
      this.$http
        .get("users/getUserInfo", {
          params: {
            userid: this.$store.state.USERID,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.info = data[0];
          this.$store.dispatch("set_toux", this.info.toux);
          // alert(this.$store.state.TOUX);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editUserInfo() {
      this.$http
        .post("users/editUserInfo", {
          userid: this.$store.state.USERID,
          info: this.info,
          interest: this.interest,
        })
        .then((res) => {
          let { data } = res.data;
          if (data.code == 200) {
            this.$message({
              type: "success",
              message: data.msg,
            });
            this.getUserInfo();
            this.dialogVisible = !this.dialogVisible;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkTagsNum(interest) {
      if (interest.length > 10) {
        this.$message({
          type: "warning",
          message: "最多只能添加十个标签。",
        });
        this.interest.splice(-1);
      }
    },
    getAllTags() {
      this.$http
        .get("common/getTags", {
          params: {
            apiType: "all",
          },
        })
        .then((res) => {
          let data = res.data;
          this.taglist = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showTagsSelect() {
      this.getAllTags();
    },
    showInfoEdit() {
      this.dialogVisible = !this.dialogVisible;
      this.getUserInfo(this.$store.state.USERID);
    },
    resetForm(info) {
      this.$refs[info].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //前端地址
      this.info.toux = res.data; //服务器地址
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    beforeAvatarUpload(file) {
      const isJPGPNG = file.type === "image/jpeg" || file.type == "image/png";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或者 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图标大小不能超过 2MB!");
      }
      return isJPGPNG && isLt2M;
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>

<style lang="scss" scoped>
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
.toux {
  display: flex;
  justify-content: space-between;
  height: 150px;
  background-color: white;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 25px 0 0 20px;
  }
}
.info {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  i,
  span {
    color: #47b897;
  }
}
</style>