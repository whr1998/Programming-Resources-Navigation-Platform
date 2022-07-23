<template>
  <div style="display: flex">
    <div class="container">
      <div class="detail">
        <div class="title">文章详情</div>
        <div class="info">
          <el-form ref="form" :model="form" label-position="left">
            <el-form-item>
              <span style="font-size: 18px">{{ article[0].title }}</span>
            </el-form-item>
            <el-form-item>
              <span style="text-indent: 24px">{{ article[0].content }}</span>
            </el-form-item>
            <el-form-item style="text-align: right">
              <span style="margin-right: 20px">{{ article[0].username }}</span>
              <span>{{ article[0].date }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
      },
      article: {},
    };
  },
  methods: {
    getArticle() {
      this.$http
        .get("wish/getArticle", {
          params: {
            aid: this.$route.query.aid,
          },
        })
        .then((res) => {
          let { data } = res.data;
          this.article = data;
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
.container {
  background-color: #fff;
  color: rgb(49, 49, 49);
  .info {
    padding: 20px;
    span {
      word-break: break-word;
      overflow-wrap: break-word;
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