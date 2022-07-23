<template>
  <el-container>
    <el-aside
      :width="isCollapse ? '64px' : '200px'"
      style="background-color: white"
    >
      <!-- 折叠按钮 -->
      <div class="toggleBtn" :style="myBtnStyle" @click="toggleCollapse">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>
      <!-- 侧边栏菜单 -->
      <el-menu
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        style="background-color: white"
      >
        <el-menu-item
          v-for="(item, index) in routelist2"
          :key="index + 'routelist2'"
          :index="{
            path: item.zindex,
            query: { zoneid: item._id, name: item.menuName },
          }"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
        <el-submenu
          v-for="(item, i) in routelist"
          :key="i"
          :index="item.zindex"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.menuName }}</span>
          </template>
          <el-menu-item
            v-for="(route, index) in item.children"
            :key="index"
            :index="{
              path: route.path,
              query: { zoneid: route._id, name: route.name },
            }"
            style="background-color: white"
            >{{ route.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container class="container" :style="myStyle">
      <el-header>
        <span
          >{{
            this.$route.query.name ||
            (this.$route.path == "/resources/zone"
              ? "资源中心"
              : false || this.$route.path == "/community/wish"
              ? "社区"
              : false || this.$route.path == "/person/personInfo"
              ? "个人中心"
              : false || this.$route.path == "/wishDetail"
              ? "社区"
              : false || this.$route.path == "/articleDetail"
              ? "社区"
              : false)
          }}
        </span>
        <span></span>
        <span v-if="this.$route.path == '/resources/zone'"
          >共有{{ resourcesLen }}个资源</span
        >
      </el-header>
      <el-main>
        <router-view @getMessage="showMsg"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
.el-icon-arrow-down:before {
  content: "\E790" !important;
}
.el-submenu__icon-arrow {
  font-size: 16px !important;
}
.el-container {
  .el-aside {
    position: fixed;
    top: 60px;
    bottom: 0;
    overflow-x: hidden;
    .toggleBtn {
      height: 60px;
      line-height: 60px;
      // position: fixed;
      // bottom: 0;
      padding-left: 20px;
      color: #47b897;
      font-size: 20px;
      background-color: white;
      cursor: pointer;
      z-index: 4;
      border-top: 1px solid rgb(238, 237, 237);
    }
    .el-menu-item,
    .el-submenu__title {
      color: #176f58;
    }
    .el-menu {
      cursor: pointer;
      // /deep/
      .el-submenu__title:hover {
        color: #47b897;
        background-color: white;
      }
      // /deep/
      .el-menu-item:hover {
        color: #47b897;
        background-color: white;
      }
      i {
        color: #47b897;
      }
    }
  }
  .container {
    .el-header {
      height: 60px;
      line-height: 60px;
      background-color: white;
      font-size: 18px;
      font-weight: bold;
      color: rgb(63, 62, 62);
      span:first-child {
        margin-right: 20px;
      }
      span:last-child {
        font-weight: 300;
        font-size: 16px;
      }
    }
  }
}
</style>

<script>
export default {
  props: ["routelist", "routelist2"],
  data() {
    return {
      isCollapse: false,
      myStyle: {
        margin: "0 0 0 200px",
      },
      // currentRouter: "",
      mysubmenu: {
        color: "white !importtant",
      },
      myBtnStyle: {
        width: "160px",
      },
      resourcesLen: "",
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.myStyle.margin == "0 0 0 200px") {
        this.myStyle.margin = "0 0 0 64px";
        this.myBtnStyle.width = "25px";
      } else if (this.myStyle.margin == "0 0 0 64px") {
        this.myStyle.margin = "0 0 0 200px";
        this.myBtnStyle.width = "160px";
      }
    },
    showMsg(val) {
      // methods方法  val即为子组件传过来的值
      this.resourcesLen = val;
    },
  },
  created() {},
};
</script>