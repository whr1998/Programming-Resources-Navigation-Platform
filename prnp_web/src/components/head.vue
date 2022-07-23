<template>
  <div class="head">
    <div class="imgDiv">
      <img
        :style="toggleImgSize2"
        :src="'http://localhost:3000/images/' + 'icon.png'"
        alt=""
      />
    </div>
    <div class="navDiv">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        router
      >
        <el-menu-item index="/main">
          <i class="el-icon-s-home"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <el-menu-item index="/resources"
          ><i class="el-icon-menu"></i>
          <span slot="title">资源中心</span></el-menu-item
        >
        <el-menu-item index="/community"
          ><i class="el-icon-s-help"></i>
          <span slot="title">社区</span></el-menu-item
        >
        <el-menu-item index="/person"
          ><i class="el-icon-user-solid"></i>
          <span slot="title">个人中心</span></el-menu-item
        >
      </el-menu>
    </div>
    <div class="search">
      <input
        class="input"
        v-model="keyword"
        type="text"
        name="wd"
        autocomplete="new-password"
        placeholder="按关键字搜索本站编程资源"
      />

      <router-link
        target="_blank"
        :to="{
          path: '/resources/zone',
          query: { keyword: this.keyword },
        }"
        ><el-button
          class="btn"
          icon="el-icon-search"
          native-type="submit"
          value="Search"
      /></router-link>
    </div>
    <div class="touxDiv">
      <el-tooltip
        class="item"
        effect="dark"
        content="推荐资源 共同学习"
        placement="bottom-end"
      >
        <router-link
          :to="{
            path: '/addResources',
            requireAuth: true,
          }"
        >
          <el-button>推荐</el-button></router-link
        >
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="你好呀！"
        placement="bottom-end"
      >
        <img
          :src="'http://localhost:3000/images/' + this.$store.state.TOUX"
          alt=""
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyHead",
  data() {
    return {
      activeIndex: "/main", // nav默认高亮
      screenWidth: "",
      screenHeight: "",
      img: true,
      toggleImgSize2: {
        width: "120px",
        height: "40px",
      },
      keyword: "",
    };
  },
  methods: {
    handleSelect(key, keyPath) {},
  },
  created() {
    this.$nextTick(() => {
      document.oncontextmenu = new Function("event.returnValue=false");
      document.onselectstart = new Function("event.returnValue=false");
    });
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.head {
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  height: 60px;
  justify-content: space-between;
  // 图片
  .imgDiv {
    margin-left: 10px;
    margin-top: 10px;
  }
  // 导航栏
  .navDiv {
    width: 600px;
    .el-menu--horizontal > .el-menu-item.is-active {
      border-bottom: 2px solid #47b897;
      color: #47b897;
    }
    .el-menu-item:hover {
      color: rgb(23, 128, 105);
      i {
        color: rgb(23, 128, 105);
      }
    }
  }
  //   搜索框
  .search {
    display: flex;
    width: 40%;
    .input,
    .btn {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      margin-top: 10px;
      height: 40px;
      background-color: transparent;
      border: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 16px;
      outline: none;
      color: rgba(0, 0, 0, 0.8);
    }
    .btn:hover {
      color: #62be9d;
    }
    .input {
      width: 90%;
      padding-left: 12px;
      border-radius: 5px 0px 0px 5px;
      border-right: none;
    }
    .btn {
      width: 40px;
      border-radius: 0px 5px 5px 0px;
      padding: 0;
    }
    .input:hover {
      border-left: 1px solid #62be9d;
      border-top: 1px solid #62be9d;
      border-bottom: 1px solid #62be9d;
    }
    .btn:hover {
      border: 1px solid #62be9d;
    }
  }
  //   头像
  .touxDiv {
    width: 10%;
    display: flex;
    justify-content: flex-end;
    img {
      width: 40px;
      height: 40px;
      margin-top: 10px;
      margin-right: 10px;
      object-fit: cover;
      border-radius: 50%;
    }
    .el-button {
      height: 40px;
      margin: 10px 10px 0 0;
      color: #fff;
      background-color: #47b897;
    }
    .el-button:hover {
      background-color: #62be9d;
      color: #f3f3f3;
    }
  }
  .el-menu.el-menu--horizontal {
    border: 0;
  }
  .grid-content {
    min-height: 60px;
  }
  .el-input {
    margin-top: 10px;
  }
  i {
    width: 40px;
  }
}
</style>