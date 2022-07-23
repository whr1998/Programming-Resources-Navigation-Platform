<template>
  <div>
    <div class="title">
      <i style="margin: 20px 20px 5px 20px" class="el-icon-magic-stick"></i
      >{{ this.$route.query.name }}
      <p style="margin: 10px 20px 10px 20px">
        找不到需要的资源？许个愿吧 ⭐️ 也欢迎帮他人实现愿望 ❤
      </p>
      <el-button
        @click="openDialog()"
        style="
          margin: 5px 20px 20px 20px;
          background-color: #47b897;
          color: white;
        "
        size="mini"
        >❤许个心愿吧</el-button
      >
    </div>
    <div class="wishList">
      <router-link
        target="_blank"
        :to="{ path: '/wishDetail', query: { wid: i._id } }"
        class="item"
        v-for="i in wishlist"
        :key="i._id"
      >
        <div class="info">
          <div>
            <img :src="'http://localhost:3000/images/' + i.toux" alt="" />
          </div>
          <div>
            <p style="font-size: 16px">{{ i.username }} 的心愿</p>
            <p style="color: rgb(90, 90, 90); font-size: 14px">
              {{ i.content }}
            </p>
          </div>
        </div>
        <div class="tag">
          <el-tag v-for="item in i.tag_list" :key="item._id" size="mini">{{
            item.tag
          }}</el-tag>
        </div>
        <div class="date">发布时间：{{ i.publishDate }}</div>
      </router-link>
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

    <el-dialog title="发布心愿" :visible.sync="dialogVisible" width="30%">
      <el-form ref="wish" :model="wish" :rules="rules" label-width="80px">
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :rows="6" v-model="wish.content"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select
            @focus="showTagsSelect"
            filterable
            default-first-option
            v-model="tag_name"
            placeholder="可选择至多五个标签，支持搜索、自定义标签"
            multiple
            style="width: 100%"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="clear('wish')">取 消</el-button> -->
        <el-button type="primary" @click="pubWish('wish')">确 定</el-button>
      </span>
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
      wish: {},
      wishlist: {},
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 12, // 每页条数
      dialogVisible: false,
      taglist: {},
      tag_name: {},
      rules: {
        content: [
          { required: true, message: "请输入心愿内容", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = !this.dialogVisible;
      this.getAllTags();
    },
    getWish() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("wish/getWish", {
          params: {
            pageSize,
            currentPage,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.wishlist = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getWish();
          }
          // this.$emit("getMessage", total);
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
      this.getWish();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getWish();
    },
    pubWish(wish) {
      this.$refs[wish].validate((valid) => {
        if (valid) {
          this.$http
            .post("wish/pubWish", {
              userid: this.$store.state.USERID,
              tag_list: this.tag_name,
              wish: this.wish,
            })
            .then((res) => {
              let { data } = res.data;
              if (data.code == 200) {
                this.$message({
                  type: "success",
                  message: data.msg,
                });
                this.dialogVisible = !this.dialogVisible;
                this.$refs[wish].resetFields();
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
      if (tag_name.length > 3) {
        this.$message({
          type: "warning",
          message: "最多只能添加三个标签。",
        });
        this.tag_name.splice(-1);
      }
    },
  },
  created() {
    this.getWish();
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  text-align: right;
}
.title {
  width: 100%;
  background-color: #fff;
}
.function {
  width: 100%;
  background-color: #fff;
  margin-top: 20px;
  height: 100px;
}
.wishList {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: flex-start;
  flex-direction: row;
  .item {
    width: 32%;
    height: 180px;
    background-color: #fff;
    margin-bottom: 20px;
    text-decoration: none;
    color: black;
    .info {
      margin-left: 20px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      div {
        display: inline-block;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50px;
      }
      p {
        margin: 15px 0 0 20px;
        padding: 0;
      }
    }
    .tag {
      margin-top: 30px;
      padding-left: 20px;
      .el-tag {
        margin-right: 10px;
      }
    }
    .date {
      margin: 20px 0 0 20px;
      color: rgb(95, 95, 95);
      font-size: 12px;
    }
  }
  .item:hover {
    box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
    border-color: #eee;
    transition: all 0.2s ease-in-out;
    .detail {
      p:first-child {
        color: #47b897;
      }
    }
  }
}
</style>