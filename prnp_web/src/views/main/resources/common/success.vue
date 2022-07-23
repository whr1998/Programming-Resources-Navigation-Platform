<template>
  <el-container>
    <el-main>
      <el-result
        icon="success"
        title="提交成功"
        subTitle="感谢您的推荐，我们将尽快审核！"
      >
        <template slot="extra">
          <router-link to="/addResources"
            ><el-button
              style="color: #fff; background-color: #47b897; margin-right: 20px"
              size="medium"
              >继续推荐</el-button
            ></router-link
          >
          <router-link to="/main"
            ><el-button size="medium">返回主页</el-button></router-link
          >
        </template>
      </el-result>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 80%;
  margin: 20px auto;
  .el-main {
    background-color: #fff;
  }
}
</style>