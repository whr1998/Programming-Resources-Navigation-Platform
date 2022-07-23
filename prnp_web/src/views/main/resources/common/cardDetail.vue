<template>
  <div class="container">
    <div class="left">
      <div class="detail">
        <div class="detail_title">资源详情</div>
        <div class="detail_func">
          <el-image
            style="width: 100px; height: 100px"
            :src="'http://localhost:3000/images/' + this.resource[0].icon"
            fit="fit"
          ></el-image>
          <div style="font-weight: bold; font-size: 18px">
            {{ this.resource[0].name }}
          </div>
          <div class="share">这里是分享按钮啦</div>
          <div>{{ this.resource[0].intro }}</div>
          <div>
            <el-tag
              style="margin: 0 5px; background-color: #47b897; color: #fff"
              v-for="(item, i) in this.resource[0].tag_list"
              :key="i"
              >{{ item.tag }}</el-tag
            >
          </div>
        </div>
        <div class="detail_content">
          <el-form ref="form" :model="form" label-width="55px">
            <el-form-item label="链接：">
              <a target="_blank" @click="copy" :href="this.resource[0].link">{{
                this.resource[0].link
              }}</a
              ><el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top"
                ><i
                  style="margin-left: 5px; color: #47b897; cursor: pointer"
                  @click="copy"
                  class="el-icon-document-copy"
                ></i
              ></el-tooltip>
            </el-form-item>
            <el-form-item label="详情：">
              {{ this.resource[0].detail || "荐者未说明资源详情。" }}
            </el-form-item>
            <el-form-item label="时间：">{{
              this.resource[0].shareDate
            }}</el-form-item>
            <el-form-item label="荐者：">{{
              this.resource[1].username
            }}</el-form-item>
          </el-form>
        </div>
        <div class="detail_share">
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="分享"
              placement="top"
            >
              <i class="el-icon-share"><span>分享</span></i>
            </el-tooltip>
          </div>

          <div>
            <a target="_blank"
              ><el-tooltip
                class="item"
                effect="dark"
                content="举报"
                placement="top"
              >
                <i class="el-icon-warning-outline"
                  ><span>举报</span></i
                ></el-tooltip
              ></a
            >
          </div>
        </div>
      </div>
      <div class="comments">
        <div class="title">
          评论<el-button
            type="primary"
            size="mini"
            @click="openDia('resource')"
          >
            <i class="el-icon-chat-dot-round"></i> 评论一下</el-button
          >
        </div>
        <el-empty
          description="暂无评论"
          v-if="comment.length ? false : true"
        ></el-empty>
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
                  <span style="color: #999999">{{ i.cDate }}</span>
                </p>
                <p style="margin: 5px 0">{{ i.content }}</p>
                <p
                  style="font-size: 12px; color: #999999; cursor: pointer"
                  @click="openDia('reply', i._id)"
                >
                  回复
                </p>
              </div>
            </div>
            <div v-if="i.reply.length > 0 ? true : false">
              <div class="secComment" v-for="item in i.reply" :key="item._id">
                <div class="img">
                  <img
                    :src="'http://localhost:3000/images/' + item.toux"
                    alt=""
                  />
                </div>
                <div class="info">
                  <p>
                    <span style="color: #585858; margin-right: 20px"
                      >{{ item.username }}@{{ i.username }}</span
                    >
                    <span style="color: #999999">{{ item.cDate }}</span>
                  </p>
                  <p style="margin: 5px 0">{{ item.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="发布评论" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="commentContent"
        :rules="rules"
        :model="commentContent"
        label-width="80px"
      >
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="6"
            v-model="commentContent.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="clear('wish')">取 消</el-button> -->
        <el-button type="primary" @click="pubComment('commentContent')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div class="alike">
      <div class="alike_title">相似资源</div>
      <el-empty
        v-if="alikeResource.length ? false : true"
        description="暂无相似资源"
      ></el-empty>
      <div v-if="alikeResource.length ? true : false">
        <div
          v-for="(list, i) in alikeResource"
          :key="i"
          class="card"
          :style="myCardWidth"
        >
          <router-link
            tag="a"
            target="_blank"
            :to="{ path: '/cardDetail', query: { rid: list[0]._id } }"
            style="text-decoration: none"
          >
            <div class="info">
              <div class="img">
                <img
                  :src="'http://localhost:3000/images/' + list[0].icon"
                  alt=""
                />
              </div>
              <div class="detail">
                <p>{{ list[0].name }}</p>
                <p>{{ list[0].intro }}</p>
              </div>
            </div>
            <div class="tag">
              <el-tag
                v-for="(tag, i) in list[0].tag_list"
                :key="i"
                type="primary"
                size="small"
                >{{ tag.tag }}</el-tag
              >
            </div>
          </router-link>
          <div class="share">
            <div>
              <el-tooltip
                class="item"
                effect="dark"
                content="分享"
                placement="top"
              >
                <i class="el-icon-share"></i>
              </el-tooltip>
            </div>

            <div>
              <a :href="list[0].link" target="_blank"
                ><el-tooltip
                  class="item"
                  effect="dark"
                  content="访问"
                  placement="top"
                >
                  <i class="el-icon-s-promotion"></i> </el-tooltip
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      alikeResource: [],
      commentContent: {},
      name: "", // 通过router-link传值
      rules: {
        content: [
          { required: true, message: "请输入评论内容", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      resource: {}, // 左侧对应_id的资源详情
      comment: [],
      zone: "",
      oid: "",
    };
  },
  methods: {
    openDia(zone, oid) {
      this.dialogVisible = !this.dialogVisible;
      this.zone = zone;
      if (zone == "resource") {
        this.oid = this.$route.query.rid;
      } else if (zone == "reply") {
        this.oid = oid;
      }
    },
    pubComment(commentContent) {
      this.$refs[commentContent].validate((valid) => {
        if (valid) {
          this.$http
            .post("comment/pubComment", {
              userid: this.$store.state.USERID,
              commentContent: this.commentContent,
              zone: this.zone,
              oid: this.oid,
            })
            .then((res) => {
              let { data } = res.data;
              if (data.code == 200) {
                this.$message({
                  type: "success",
                  message: data.msg,
                });
                this.getComment();
                this.dialogVisible = !this.dialogVisible;
                this.$refs[commentContent].resetFields();
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
    getResources() {
      this.$http
        .get("resources/getResources", {
          params: {
            rid: this.$route.query.rid,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.resource = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAlikeResources() {
      this.$http
        .get("resources/getAlikeResource", {
          params: {
            rid: this.$route.query.rid,
          },
        })
        .then((res) => {
          let { alikeResource } = res.data;
          this.alikeResource = alikeResource;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getComment() {
      this.$http
        .get("comment/getComment", {
          params: {
            zone: "resource",
            oid: this.$route.query.rid,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.comment = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    copy() {
      //创建input标签
      var input = document.createElement("input");
      //将input的值设置为需要复制的内容
      input.value = this.resource[0].link;
      //添加input标签
      document.body.appendChild(input);
      //选中input标签
      input.select();
      //执行复制
      document.execCommand("copy");
      //成功提示信息
      this.$message.success("复制成功！");
      //移除input标签
      document.body.removeChild(input);
    },
  },
  created() {
    this.name = this.$route.query.name; //获取上个页面传递的id,在下面获取数据的时候先提交id
    this.getResources();
    this.getComment();
    this.getAlikeResources();
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  display: flex;

  justify-content: space-between;
  .left {
    width: 69%;
    margin-right: 20px;
    .detail {
      background-color: white;
      .detail_title {
        height: 60px;
        line-height: 60px;
        color: rgb(68, 67, 67);
        border-bottom: 1px solid rgb(238, 238, 238);
        padding-left: 20px;
      }
      .detail_func {
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid rgb(238, 238, 238);
        .el-image {
          margin: 20px 0 30px 0;
          border-radius: 10px;
        }
        div {
          margin-bottom: 20px;
        }
      }
      .detail_content {
        padding: 20px;
        span {
          margin-bottom: 20px;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        a {
          text-decoration: none;
          color: #47b897;
        }
      }
      .detail_share {
        height: 20%;
        display: flex;
        line-height: 50px;
        justify-content: space-around;
        padding: 0 20px 0 20px;
        border-top: 1px solid #eeeeee;
        font-size: 16px;
        color: #6e6e6e;
        span {
          font-size: 16px;
          margin-left: 2px;
        }
      }
    }
    .comments {
      margin-top: 20px;
      width: 100%;
      background-color: white;
      .title {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid rgb(240, 234, 234);
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        .el-button {
          height: 30px;
          margin-top: 10px;
        }
      }
      .comment {
        padding: 20px;
        .firComment,
        .secComment {
          display: flex;
          margin-bottom: 20px;
          .img {
            width: 40px;
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
  .alike {
    width: 30%;
    height: 900px;
    background-color: white;
    .alike_title {
      height: 60px;
      line-height: 60px;
      color: rgb(68, 67, 67);
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-left: 20px;
    }
    .card {
      height: 250px;
      background-color: white;
      margin: 20px 20px 0 20px;
      border: 1px solid rgb(236, 235, 235);
      cursor: pointer;
      .info {
        height: 60%;
        display: flex;
        .img {
          width: 120px;
          height: 100%;
          text-align: center;
          img {
            width: 80px;
            height: 80px;
            margin-top: 20px;
          }
        }
        .detail {
          width: calc(100% - 120px);
          height: 100%;
          p {
            padding: 0;
            margin: 0;
          }
          p:first-child {
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
            color: rgb(61, 61, 61);
          }
          p:last-child {
            color: #999999;
            font-size: 14px;
            margin-top: 10px;
          }
        }
      }
      .tag {
        height: 20%;
        display: flex;
        justify-content: flex-end;
        .el-tag {
          margin-left: 10px;
        }
        .el-tag:first-child {
          margin-left: 10px;
        }
        .el-tag:last-child {
          margin-right: 20px;
        }
      }
      .share {
        height: 20%;
        display: flex;
        line-height: 50px;
        justify-content: space-between;
        padding: 0 20px 0 20px;
        border-top: 1px solid #eeeeee;
        font-size: 16px;
        color: #6e6e6e;
        span {
          font-size: 16px;
          margin-left: 2px;
        }
      }
    }
    .card:hover {
      box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
      border-color: #eee;
      transition: all 0.2s ease-in-out;
    }
  }
}
</style>