<template>
  <div class="home-page">
    <h1>爆炸猫啊1</h1>
    <div
      class="tab"
      @click="changeTab"
    >
      {{ tab }}
    </div>
    <div v-if="showLoginTab">
      <div class="form login-info">
        <input
          v-model="account"
          placeholder="请输入用户账号"
        >
      </div>
      <button
        type="button"
        style="width: 100%;margin-bottom: 18px"
        @click="login"
      >
        登录
      </button>
    </div>
    <div v-else>
      <div class="form register-info">
        <input
          v-model="userId"
          placeholder="请输入用户账号"
        >
        <input
          v-model="nickName"
          placeholder="请输入昵称"
        >
        <input
          v-model="avatar"
          placeholder="请输入头像连接"
        >
      </div>
      <button
        type="info"
        @click="register"
      >
        注册
      </button>
    </div>
  </div>
</template>
<style scoped>
.tab {
  margin-bottom: 10px;
  padding: 2px 4px;
  border-radius: 10px;
  background-color: skyblue;
}
.form {
  margin-bottom: 10px;
}
</style>
<script type="ts"  src="./index.ts"></script>
