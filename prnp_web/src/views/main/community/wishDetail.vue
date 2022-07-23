<template>
  <div style="display: flex">
    <div class="container">
      <div class="detail">
        <div class="title">心愿详情</div>
        <div class="info">
          <el-form
            ref="form"
            :model="form"
            label-position="left"
            label-width="80px"
          >
            <el-form-item label="内容">
              <span>{{ wish[0].content }}</span>
            </el-form-item>
            <el-form-item label="标签">
              <el-tag
                style="margin-right: 10px"
                v-for="i in wish[0].tag_list"
                :key="i._id"
                >{{ i.tag }}</el-tag
              >
            </el-form-item>
            <el-form-item label="浏览量">
              <span>{{ wish[0].browse }}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ wish[0].publishDate }}</span>
            </el-form-item>
            <el-form-item label="许愿人">
              <img
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50px;
                  object-fit: cover;
                  display: inline-block;
                  line-height: 40px;
                "
                :src="'http://localhost:3000/images/' + wish[0].toux"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="satisfied">
        <div class="title" style="border-top: 1px solid rgb(235, 235, 235)">
          满足列表
          <el-button type="primary" size="mini" @click="dialogVisible = true">
            <i class="el-icon-present"></i> 帮忙完成</el-button
          >
        </div>
        <el-empty
          description="暂无数据"
          v-if="comment.length ? false : true"
        ></el-empty>
        <div class="comments">
          <div class="comment" v-if="comment.length ? true : false">
            <div v-for="i in comment" :key="i._id">
              <div class="firComment">
                <div class="img">
                  <img :src="'http://localhost:3000/images/' + i.toux" alt="" />
                </div>
                <div class="info">
                  <p>
                    <span style="color: #585858; margin-right: 20px">{{
                      i.username
                    }}</span>
                    <span style="margin-right: 15px">推荐</span>
                    <router-link
                      tag="a"
                      target="_blank"
                      :to="{ path: '/cardDetail', query: { rid: i._id } }"
                      style="text-decoration: none; color: green"
                      >{{ i.name }}</router-link
                    >
                  </p>
                  <p style="margin: 5px 0">{{ i.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="satlist"></div>
      </div>
    </div>
    <!-- <div class="aside"><div class="title">相似心愿</div></div> -->
    <el-dialog
      title="满足心愿"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="sharewish" :model="sharewish" label-width="80px">
        <el-form-item label="资源" prop="tag">
          <el-select
            @focus="showTagsSelect"
            filterable
            default-first-option
            v-model="tag_id"
            placeholder="选择资源推荐"
            multiple
            style="width: 60%"
            clearable
          >
            <el-option
              v-for="item in taglist"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            :rows="4"
            type="textarea"
            v-model="sharewish.content"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="medium"
            style="width: 300px"
            type="primary"
            @click="submitForm"
            >帮助</el-button
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
      form: {
        name: "",
      },
      sharewish: {},
      wish: {},
      dialogVisible: false,
      tag_id: {},
      taglist: {},
      comment: [],
    };
  },
  methods: {
    getWish() {
      this.$http
        .get("wish/getWish", {
          params: {
            wid: this.$route.query.wid,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.wish = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showTagsSelect() {
      this.getAllResources();
    },
    // 推荐资源
    submitForm() {
      var rid = this.tag_id;
      var tag_name;
      this.$http
        .get("resources/getResources", {
          params: {
            rid: rid,
          },
        })
        .then((res) => {
          let { data } = res.data;
          tag_name = data[0].name;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$http
        .get("users/getUserInfo", {
          params: {
            userid: this.$store.state.USERID,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.info = data[0];
          var toux = data[0].toux;
          var username = data[0].username;
          var sharewish = {
            toux: toux,
            username: username,
            name: tag_name,
            content: this.sharewish.content,
            _id: rid,
          };
          this.comment.push(sharewish);
          console.log(sharewish);
        })
        .catch((err) => {
          console.log(err);
        });
      this.dialogVisible = !this.dialogVisible;
    },
    getAllResources() {
      this.$http
        .get("resources/getAllResources")
        .then((res) => {
          let data = res.data.data;
          this.taglist = data;
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getWish();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 65%;
  background-color: #fff;
  color: rgb(49, 49, 49);
  .info {
    padding: 20px;
    span {
      word-break: break-word;
      overflow-wrap: break-word;
    }
  }
  .comments {
    width: 100%;
    background-color: white;
    .comment {
      .firComment,
      .secComment {
        display: flex;
        margin-bottom: 20px;
        .img {
          width: 40px;
          padding: 20px;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .info {
          width: 95%;
          margin-left: 10px;
          p {
            margin: 0;
            padding: 0;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          span {
            font-size: 12px;
            color: #585858;
          }
        }
      }
      .secComment {
        width: 94%;
        margin-left: 5%;
        margin-top: 10px;
      }
    }
  }
}
.satisfied {
  width: 100%;
  background-color: #fff;
  color: rgb(49, 49, 49);
  .title {
    display: flex;
    justify-content: space-between;
    .el-button {
      height: 30px;
      margin-top: 15px;
    }
  }
}
.title {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  color: rgb(49, 49, 49);
  border-bottom: 1px solid rgb(235, 235, 235);
}
.aside {
  width: 33%;
  height: 300px;
  margin-left: 20px;
  background-color: #fff;
}
</style>