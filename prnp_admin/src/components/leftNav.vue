<template>
  <el-menu router :default-openeds="['审核管理', '信息管理']">
    <div class="logobox">PRNP ADMIN</div>
    <el-submenu
      v-for="menu in leftNav"
      :key="menu.menuid"
      :index="menu.menuname"
    >
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item
        :index="item.url"
        v-for="(item, i) in menu.menus"
        :key="i"
        >{{ item.menuname }}</el-menu-item
      >
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      leftNav: [],
      menuid: 1,
    };
  },
  created() {
    let leftNav = {
      data: [
        {
          menuid: 1,
          icon: "el-icon-message",
          menuname: "审核管理",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: "el-icon-message",
              menuname: "资源审核",
              hasThird: "N",
              url: "/resourceAudit",
              menus: null,
            },
            {
              menuid: 3,
              icon: "el-icon-message",
              menuname: "心愿审核",
              hasThird: "N",
              url: "/wishAudit",
              menus: null,
            },
            {
              menuid: 4,
              icon: "el-icon-message",
              menuname: "上传文件审核",
              hasThird: "N",
              url: "/fileAudit",
              menus: null,
            },
            {
              menuid: 3,
              icon: "el-icon-message",
              menuname: "文章审核",
              hasThird: "N",
              url: "/articleAudit",
              menus: null,
            },
          ],
        },
        {
          menuid: 11,
          icon: "el-icon-message",
          menuname: "信息管理",
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 12,
              icon: "el-icon-message",
              menuname: "用户列表",
              hasThird: "N",
              url: "/userList",
              menus: null,
            },
            // {
            //   menuid: 14,
            //   icon: "el-icon-message",
            //   menuname: "分类与标签",
            //   hasThird: "N",
            //   url: "/zoneAndTag",
            //   menus: null,
            // },
            {
              menuid: 13,
              icon: "el-icon-message",
              menuname: "首页图片列表",
              hasThird: "N",
              url: "/homePageList",
              menus: null,
            },
          ],
        },
      ],
    };
    this.leftNav = leftNav.data;
  },
};
</script>

<style lang="scss" scoped>
.logobox {
  height: 60px;
  background-color: #176f58;
  font-family: Avenir;
  color: rgb(240, 236, 236);
  line-height: 60px;
  text-align: center;
  font-size: 24px;
}
.el-menu {
  height: 100vh;
  background-color: #176f58;
  cursor: pointer;
  .el-submenu,
  .el-menu-item {
    color: #fff;
    background-color: #176f58 !important;
  }
  .el-menu-item:hover {
    outline: 0;
    color: #47b897;
  }
}
</style>

<style lang="scss">
.el-submenu__title {
  i,
  span {
    color: #fff !important;
  }
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0;
  i,
  span {
    color: #47b897;
  }
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>