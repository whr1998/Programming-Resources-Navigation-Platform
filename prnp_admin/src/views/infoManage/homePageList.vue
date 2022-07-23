<template>
  <div class="container">
    <el-card
      class="card"
      v-for="i in imgList"
      :key="i._id"
      :body-style="{ padding: '20px', cursor: 'pointer' }"
    >
      <div @click="openDia(i._id)">
        <el-image
          style="width: 150px; height: 150px; object-fit: cover"
          :src="'http://localhost:3000/images/' + i.imgName"
        >
        </el-image>
        <div style="padding: 14px; text-align: center">
          <span>{{ i.website }}</span>
        </div>
      </div>
    </el-card>
    <el-dialog title="修改信息" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="homePages"
        :model="homePages"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="图标">
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
        <el-form-item label="URL" prop="url">
          <el-input v-model="homePages.url"></el-input>
        </el-form-item>
        <el-form-item label="网站名称" prop="website">
          <el-input v-model="homePages.website"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="medium"
            style="width: 300px"
            type="primary"
            @click="submitForm('homePages')"
            >修改</el-button
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
      imgList: {},
      dialogVisible: false,
      currentID: "",
      homePages: {},
      imageUrl: "",
      rules: {
        url: [
          { required: true, message: "请输入URL", trigger: "blur" },
          { min: 1, max: 80, trigger: "blur" },
        ],
        website: [
          { required: true, message: "请输入网站名称", trigger: "blur" },
          { min: 1, max: 80, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(homePages) {
      this.$refs[homePages].validate((valid) => {
        if (valid) {
          this.$http
            .post("common/changeHomePageIcon", {
              homePages: this.homePages,
              _id: this.currentID,
            })
            .then((res) => {
              let { data } = res.data;
              if (data.code == 200) {
                this.$message({
                  type: "success",
                  message: data.msg,
                });
                this.getHomePageIcon();
                this.dialogVisible = !this.dialogVisible;
              }
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
    getHomePageIcon() {
      this.$http
        .get("common")
        .then((res) => {
          let data = res.data;
          this.imgList = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDia(id) {
      this.dialogVisible = !this.dialogVisible;
      this.currentID = id;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //前端地址
      this.homePages.imgName = res.data; //服务器地址
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.msg,
        });
      } else {
        this.$message({
          type: "warning",
          message: res.msg,
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPGPNG = file.type === "image/jpeg" || file.type == "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式 和 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGPNG && isLt2M;
    },
  },
  created() {
    this.getHomePageIcon();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  .card:hover {
    box-shadow: 0 10px 100px rgba(44, 44, 44, 0.1);
    border-color: #eee;
    transition: all 0.2s ease-in-out;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
}
</style>