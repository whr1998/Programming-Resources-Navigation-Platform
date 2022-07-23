<template>
  <div class="container">
    <!-- 左侧内容 -->
    <div class="content">
      <!-- 标签 -->
      <div class="taglist">
        <div style="width: 90%">
          <div
            @click="getResources(tag.tag)"
            class="tag"
            v-for="(tag, i) in taglist"
            :key="i"
          >
            {{ tag.tag }}
          </div>
        </div>
      </div>
      <!-- 过渡 -->
      <div class="tagselect">
        <div class="cardlisttitle">{{ radio }}</div>
        <div class="selecttag">
          <el-radio-group
            @change="getResources(radio)"
            v-model="radio"
            size="small"
          >
            <el-radio-button label="推荐"></el-radio-button>
            <el-radio-button label="最新"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <MyCard v-bind:lists="listsByRadio"></MyCard>
      <!-- <div style="float: right; margin-top: 15px">
        <router-link target="_blank" to="/resources/zone">
          <el-button
            style="background-color: #47b897; color: white"
            icon="el-icon-s-promotion"
            >点击查看更多</el-button
          ></router-link
        >
      </div> -->
      <div class="upload">
        <div class="title">
          技术资源专区<el-button
            style="background-color: #47b897; color: white"
            @click="dialogVisible = true"
            >点击上传技术资源</el-button
          >
        </div>
        <el-empty
          v-if="file.length ? false : true"
          description="暂无用户上传资源"
        ></el-empty>
        <div v-if="file.length ? true : false" class="fileList">
          <div v-for="item in file" :key="item._id" class="file">
            <div class="info">
              <div style="font-size: 20px">{{ item.name }}</div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                  margin-top: 5px;
                  color: rgb(116, 116, 116);
                "
              >
                <span>上传用户：{{ item.username }}</span>
                <span>上传时间：{{ item.uploadDate }}</span>
              </div>
              <!-- {{ item.path }} -->
            </div>
            <div
              class="download"
              @click="download(item.path, item.name, item._id, item.size)"
            >
              <i title="点击下载" class="el-icon-download"></i>
              <div style="font-size: 12px">文件大小{{ change(item.size) }}</div>
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
      </div>
    </div>

    <!-- 右侧贡献列表 -->
    <div class="contribute">
      <div class="contrilist">
        <div class="title">
          <p>本周贡献排行</p>
        </div>
        <div class="list" v-for="item in integration" :key="item._id">
          <div class="toux">
            <img :src="'http://localhost:3000/images/' + item.toux" alt="" />
          </div>
          <div class="id">{{ item.username || "未知用户" }}</div>
          <div class="jifen">{{ item.integration }}分</div>
        </div>
      </div>
    </div>
    <el-dialog
      title="上传文件"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form>
        <el-form-item>
          <el-upload
            class="upload-demo"
            drag
            name="files"
            :action="
              'http://localhost:3000/upload/uploadFiles?userid=' +
              this.$store.state.USERID
            "
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              支持上传.txt .doc .docs .pdf .ppt .pptx .xls .xlsx .mp3 .mp4文件.
            </div>
            <div class="el-upload__tip" slot="tip">不超过200MB.</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import MyCard from "../../components/card";
import UploadFiles from "../../components/uploadFiles";

export default {
  components: {
    MyCard,
    UploadFiles,
  },
  data() {
    return {
      activeName: "first",
      taglist: {},
      listsByRadio: [],
      integration: [],
      radio: "推荐",
      dialogVisible: false,
      imageUrl: "",
      file: [],
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 5, // 每页条数
      info: {},
      cintegration: "",
    };
  },
  methods: {
    change(limit) {
      var size = "";
      if (limit < 0.1 * 1024) {
        //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      if (dou == "00") {
        //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      }
      return size;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.getFile();
          done();
        })
        .catch((_) => {});
    },
    // 获取编程资源，允许根据用户兴趣、推荐、最新三种选项进行获取
    getResources(radio) {
      this.$http
        .get("resources/getResources", {
          params: {
            radioName: radio,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.listsByRadio = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserInterest() {
      this.$http
        .get("users/getUserInfo", {
          params: {
            userid: this.$store.state.USERID,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.taglist = data[0].interest;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIntegration() {
      this.$http
        .get("users/getUserInfo")
        .then((res) => {
          let { data } = res.data;
          this.integration = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取技术资源

    getFile() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("file/getFile", {
          params: {
            pageSize,
            currentPage,
            zone: "mainPage",
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.file = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            this.currentPage -= 1;
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
    download(url, fileName, _id, size) {
      var totalintegration = this.cintegration;
      if (totalintegration <= 0) {
        this.$message({
          type: "warning",
          message: "您尚未取得积分，分享编程资源可得积分",
        });
        return false;
      } else {
        var curSize = size / 1024 / 1024;
        let curIntegration;
        if (curSize > 50 && curSize < 500) {
          curIntegration = Math.floor(curSize / 10);
        } else {
          curIntegration = 25;
        }
        if (totalintegration < curIntegration) {
          this.$message({
            type: "warning",
            message: "积分不足，分享编程资源可得积分",
          });
        } else {
          this.$message({
            type: "success",
            message: "尝试下载中，请稍后",
          });
          var updateIntegration = totalintegration - curIntegration;
          console.log(totalintegration);
          this.$http
            .get("http://localhost:3000/upload/downloadFile", {
              params: {
                url: url,
                _id: _id,
                userid: this.$store.state.USERID,
                integration: updateIntegration,
              },
              responseType: "blob",
            })
            .then((res) => {
              let blob = new Blob([res.data]);
              let url = window.URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //前端地址
      // this.resource.icon = res.data; //服务器地址
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.msg,
        });
      } else if (res.code == 1) {
        this.$message({
          type: "warning",
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
      const fileType =
        file.type === "text/plain" ||
        file.type == "application/msword" ||
        file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type == "application/pdf" ||
        file.type == "application/vnd.ms-powerpoint" ||
        file.type ==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.type == "application/vnd.ms-excel" ||
        file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "audio/mpeg" ||
        file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 200;

      if (!fileType) {
        this.$message.error("不支持该格式的文件");
      }
      if (!isLt2M) {
        this.$message.error("上传图标大小不能超过 20MB!");
      }
      return fileType && isLt2M;
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
          this.cintegration = data[0].integration;
          this.$store.dispatch("set_toux", this.info.toux);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getResources("推荐");
    this.getUserInfo();
    this.getIntegration();
    this.getFile();
    this.getUserInterest();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .pagination {
    text-align: right;
  }
  width: 97%;
  // height: 1300px;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  .content {
    width: 75%;
    margin-top: 15px;
    .tagselect {
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 3px;
    }
    .taglist {
      background-color: rgb(243, 243, 243);
      display: flex;
      line-height: 40px;
      .tag {
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: white;
        background-color: #47b897;
        margin-right: 5px;
        display: inline-block;
        cursor: pointer;
        border-radius: 3px;
      }
      .el-button {
        background-color: #47b897;
        color: white;
      }
      .el-button:hover,
      .tag:hover {
        background-color: #62be9d;
      }
    }
    .tagselect {
      height: 80px;
      line-height: 80px;
      background-color: #fff;
      color: #176f58;
      border: 1px solid rgba(71, 184, 151, 0.2);
      .cardlisttitle {
        margin-left: 20px;
        font-weight: bold;
        font-size: 22px;
      }
      .selecttag {
        margin-right: 20px;
      }
    }
    .upload {
      width: 100%;
      background-color: #fff;
      margin-top: 20px;
      .title {
        height: 80px;
        color: #176f58;
        font-weight: bold;
        font-size: 22px;
        border-bottom: 1px solid rgb(236, 235, 235);
        line-height: 80px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        // /deep/
        .el-button {
          height: 40px;
          margin-top: 20px;
        }
      }
    }
    .fileList {
      padding: 20px;
      .file:hover {
        box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
        border-color: #eee;
        transition: all 0.2s ease-in-out;
      }
      .file {
        border: 1px solid rgb(235, 234, 234);
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 20px;
        .info {
          width: 85%;
          cursor: pointer;
        }
        .info:hover {
          color: #176f58;
        }
        .download {
          width: 10%;
          font-size: 28px;
          text-align: center;
          cursor: pointer;
        }
        .download:hover {
          color: #47b897;
        }
      }
    }
  }
  .contribute {
    width: 24%;
    margin-left: 1%;
    margin-top: 0;
    color: #176f58;
    .contrilist {
      width: 100%;
      background-color: white;
      .title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid rgb(226, 225, 225);
        p {
          margin-left: 15px;
          font-size: 18px;
        }
      }
      .list {
        height: 40px;
        line-height: 40px;
        display: flex;
        padding: 15px;
        justify-content: space-between;
        .toux {
          line-height: 60px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            // margin: 25px 0 0 20px;
          }
        }
        .id {
          width: 50%;
          margin-left: 15px;
          font-size: 16px;
        }
        .jifen {
          width: 30%;
          color: rgb(124, 123, 123);
          text-align: right;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
