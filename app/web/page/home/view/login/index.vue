<template>
  <div class="home-page">
    <h1>爆炸猫啊</h1>
    <div class="tab" @click="changeTab">
      {{tab}}
    </div>
    <div v-if="showLoginTab">
      <div class="form login-info">
        <input
          placeholder="请输入用户账号"
          v-model="account"
        />
      </div>
      <button
        type="button"
        style="width: 100%;margin-bottom: 18px"
        @click="login"
      >登录</button>
    </div>
    <div v-else>
      <div class="form register-info">
        <input
          placeholder="请输入用户账号"
          v-model="userId"
        />
        <input
          placeholder="请输入昵称"
          v-model="nickName"
        />
        <input
          placeholder="请输入头像连接"
          v-model="avatar"
        />
      </div>
      <button
        type="button"
        style="width: 100%;margin-bottom: 18px"
        @click="register"
      >注册</button>
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
