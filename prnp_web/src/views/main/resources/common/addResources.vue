<template>
  <div>
    <div class="title">
      <p>我要推荐</p>
      <p>欢迎推荐优质编程学习资源，3Q。</p>
    </div>
    <div class="form">
      <el-form
        ref="resource"
        :model="resource"
        label-width="200px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="resource.name"
            placeholder="资源名称，最多30个字。"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="intro">
          <el-input
            v-model="resource.intro"
            placeholder="请用一段话描述资源，最多80字。"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input
            v-model="resource.link"
            placeholder="便于找到资源的网址，以http(s)开头。"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select
            @focus="showTagsSelect"
            filterable
            default-first-option
            v-model="tag_name"
            placeholder="可选择至多五个标签，支持搜索、自定义标签"
            multiple
            style="width: 60%"
            clearable
            @change="checkTagsNum(tag_name)"
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
        <el-form-item label="详情">
          <el-input
            style="width: 80%"
            type="textarea"
            :rows="4"
            v-model="resource.detail"
            placeholder="详细描述该资源，包括作用、使用方法等。"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="medium"
            style="width: 300px"
            type="primary"
            @click="submitForm('resource')"
            >推荐</el-button
          >
          <el-button @click="resetForm('resource')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      resource: {
        icon: "" || "default.png",
        userid: this.$store.state.USERID,
        shareDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          { min: 1, max: 30, trigger: "blur" },
        ],
        intro: [
          { required: true, message: "请输入资源描述", trigger: "blur" },
          { min: 1, max: 80, trigger: "blur" },
        ],
        link: [
          { required: true, message: "请填写资源链接", trigger: "blur" },
          { min: 1, trigger: "blur" },
        ],
      },
      taglist: {},
      tag_name: {},
    };
  },
  methods: {
    // 推荐资源
    submitForm(resource) {
      this.$refs[resource].validate((valid) => {
        if (valid) {
          this.$http
            .post("resources/upResources", {
              resource: this.resource,
              tag_list: this.tag_name,
            })
            .then((res) => {
              let { data } = res.data;
              if (data.code == 200) {
                this.$message({
                  type: "success",
                  message: data.msg,
                });
                this.$router.push("/addSuccess");
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

    showTagsSelect() {
      this.getAllTags();
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
    checkTagsNum(tag_name) {
      if (tag_name.length > 5) {
        this.$message({
          type: "warning",
          message: "最多只能添加五个标签。",
        });
        this.tag_name.splice(-1);
      }
    },
    resetForm(resource) {
      this.$refs[resource].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //前端地址
      this.resource.icon = res.data; //服务器地址
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
};
</script>
<style lang="scss" scoped>
.title {
  height: 100px;
  background-color: white;
  p {
    margin: 0;
    padding: 20px 0 0 20px;
  }
  p:first-child {
    font-weight: bold;
    font-size: 20px;
  }
  p:last-child {
    font-weight: 300;
    font-size: 16px;
  }
}
.form {
  width: 95%;
  background-color: rgba($color: white, $alpha: 0.9);
  margin: 20px auto;
  padding: 20px;
  .el-form-item {
    margin-bottom: 30px;
    .el-input {
      width: 80%;
    }
  }
}
.taglist {
  display: inline-block;
  width: 120px;
  position: sticky;
  div {
    white-space: normal;
  }
}
</style>