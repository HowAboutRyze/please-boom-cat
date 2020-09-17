<template>
  <div class="home-page">
    <h1>爆炸猫啊</h1>
    <div class="login-info">
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
    <div class="user-info">
      <p>昵称：{{user.nickName}}</p>
      <p>头像链接：{{user.avatar}}</p>
    </div>
  </div>
</template>
<style>

</style>
<script type="ts"  src="./index.ts"></script>
