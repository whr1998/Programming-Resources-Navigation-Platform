<template>
  <el-container>
    <div class="articleTitle">
      <i style="margin: 20px 20px 5px 20px" class="el-icon-magic-stick"></i
      >{{ this.$route.query.name }}
      <p style="margin: 10px 20px 10px 20px">
        找不到需要的资源？许个愿吧 ⭐️ 也欢迎帮他人实现愿望 ❤
      </p>
      <el-button
        @click="openDio"
        style="
          margin: 5px 20px 20px 20px;
          background-color: #47b897;
          color: white;
        "
        size="mini"
        >发布文章</el-button
      >
    </div>
    <div class="article">
      <router-link
        target="_blank"
        :to="{ path: '/articleDetail', query: { aid: i._id } }"
        class="item"
        v-for="i in articlelist"
        :key="i._id"
        style="text-decoration: none"
      >
        <div class="title">
          <span style="font-size: 18px">{{ i.title }}</span>
          <p
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
              text-indent: 2em;
            "
          >
            {{ i.content }}
          </p>
          <div class="person">
            <div style="display: flex">
              <img :src="'http://localhost:3000/images/' + i.toux" alt="" />
              <span>{{ i.username }}</span>
            </div>
            <span>{{ i.date }}</span>
          </div>
        </div>
      </router-link>
    </div>
    <el-dialog
      title="发布"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-form ref="article" :model="article" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input
            type="textarea"
            :rows="20"
            v-model="article.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pubArticle(article)">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      article: {},
      articlelist: {},
    };
  },
  methods: {
    openDio() {
      this.dialogVisible = !this.dialogVisible;
    },
    getArticle() {
      this.$http
        .get("wish/getArticle")
        .then((res) => {
          let { data } = res.data;
          this.articlelist = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pubArticle(article) {
      this.$http
        .post("wish/pubArticle", {
          userid: this.$store.state.USERID,
          article: this.article,
        })
        .then((res) => {
          let { data } = res.data;
          if (data.code == 200) {
            this.$message({
              type: "success",
              message: data.msg,
            });
            this.dialogVisible = !this.dialogVisible;
            this.$refs[article].resetFields();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getArticle();
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  flex-direction: row;
  justify-content: space-between;
  .articleTitle {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .article {
    width: 45%;
    margin-bottom: 10px;
    background-color: #fff;
    border: 1px solid rgb(238, 237, 237);
    .title {
      padding: 20px;
      color: rgb(51, 50, 50);
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      .person {
        display: flex;
        justify-content: space-between;
        line-height: 60px;
      }
    }
  }
  .article:hover {
    box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
    border-color: #eee;
    transition: all 0.2s ease-in-out;
  }
}
</style>