<template>
  <!-- 这里是侧边栏专区对应的公共页面 -->
  <div>
    <div class="container">
      <el-form ref="form" :model="sizeForm" label-width="80px" size="small">
        <el-form-item label="搜索">
          <el-input
            v-model="keyword"
            placeholder="按关键字搜索本专区的资源"
            @input="searchByKeyword(keyword)"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="排序">
          <el-radio
            v-for="(radio, i) in radioGroup"
            :key="i"
            v-model="radio1"
            :label="radio.label"
            border
            >{{ radio.radioname }}</el-radio
          >
        </el-form-item>
        <el-form-item label="精选">
          <el-checkbox v-model="checked" @change="jingxuan()"
            >只看精选</el-checkbox
          >
        </el-form-item> -->
      </el-form>
    </div>
    <MyCard v-bind:lists="lists"></MyCard>
    <!-- <Pagination></Pagination> -->
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
    <Footer></Footer>
  </div>
</template>
<script>
import MyCard from "@/components/card";
import Footer from "@/components/footer";
export default {
  components: {
    MyCard,
    Footer,
  },
  data() {
    return {
      lists: {},
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 12, // 每页条数
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      radio1: "1",
      radioGroup: [
        { radioname: "综合", label: "1" },
        { radioname: "时间", label: "2" },
        { radioname: "评价", label: "3" },
      ],
      checked: false,
      keyword: "",
    };
  },
  methods: {
    getDefaultResources() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("resources/getResources", {
          params: {
            page: "zoneAll",
            pageSize,
            currentPage,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.lists = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getDefaultResources();
          }
          this.$emit("getMessage", total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getResources() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("resources/getResources", {
          params: {
            zoneid: this.$route.query.zoneid,
            pageSize,
            currentPage,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.lists = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getResources();
          }
          this.$emit("getMessage", total);
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
      this.getDefaultResources();
      this.getResourcesByKeyword(keyword);
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.getResources();
      this.getDefaultResources();
      this.getResourcesByKeyword(keyword);
    },
    // 根据mainPage的keyword查找,
    getResourcesByKeyword(keyword) {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.keyword = keyword;
      this.$http
        .get("resources/getResources", {
          params: {
            page: "zoneAll",
            pageSize,
            currentPage,
            keyword,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.lists = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getResourcesByKeyword(keyword);
          }
          this.$emit("getMessage", total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchByKeyword(keyword) {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("resources/getResources", {
          params: {
            page: "zoneAll",
            pageSize,
            currentPage,
            keyword,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.lists = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.searchByKeyword(keyword);
          }
          this.$emit("getMessage", total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 只看精选
  },
  watch: {
    $route() {
      if (this.$route.path === "/resources/zone") {
        this.getResources();
      }
    },
  },
  created() {
    this.getDefaultResources();
    var len = this.lists.length;
    var keyword = this.$route.query.keyword;
    this.getResourcesByKeyword(keyword);
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: white;
  padding-top: 20px;
  padding-bottom: 10px;
  .el-input {
    width: 50%;
  }
}
.pagination {
  text-align: right;
}
</style>