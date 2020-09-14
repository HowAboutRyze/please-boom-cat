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
  </div>
</template>
<style>

</style>
<script type="ts"  src="./index.ts"></script>
