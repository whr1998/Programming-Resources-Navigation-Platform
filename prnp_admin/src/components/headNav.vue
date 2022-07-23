<template>
  <div class="header">
    <span
      >{{
        this.$route.path == "/resourceAudit"
          ? "/ 资源审核"
          : false || this.$route.path == "/wishAudit"
          ? "/ 心愿审核"
          : false || this.$route.path == "/commentAudit"
          ? "/ 评论审核"
          : false || this.$route.path == "/fileAudit"
          ? "/ 上传文件审核"
          : false || this.$route.path == "/articleAudit"
          ? "/ 文章审核"
          : false || this.$route.path == "/userList"
          ? "/ 用户列表"
          : false || this.$route.path == "/homePageList"
          ? "/ 首页图片列表（点击图片进行修改）"
          : false || this.$route.path == "/integrationList"
          ? "/ 积分列表"
          : false || this.$route.path == "/zoneAndTag"
          ? "/ 专区与Tag"
          : false
      }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.header {
  background-color: #176f58;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  color: rgb(209, 238, 224);
}
</style>

<script>
export default {};
</script>