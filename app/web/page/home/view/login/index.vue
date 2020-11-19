<template>
  <div class="home-page">
    <h1>
      爆炸猫啊
      <van-icon
        name="question-o"
        class="icon-rule"
        color="#58bc58"
        @click="gotoRule"
      />
    </h1>
    <van-tabs v-model="tab">
      <van-tab title="登录">
        <van-form @submit="login">
          <van-field
            v-model="account"
            name="用户账号"
            label="用户账号"
            placeholder="用户账号"
            :rules="[{ required: true, message: '请输入用户账号' }]"
          />
          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
            >
              登录
            </van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="注册">
        <van-form @submit="register">
          <van-field
            v-model="userId"
            name="用户账号"
            label="用户账号"
            placeholder="用户账号"
            :rules="[{ required: true, message: '请输入用户账号' }]"
          />
          <van-field
            v-model="nickName"
            name="昵称"
            label="昵称"
            placeholder="昵称"
            :rules="[{ required: true, message: '请输入昵称' }]"
          />
          <van-field
            v-model="avatar"
            name="头像链接"
            label="头像链接"
            placeholder="头像链接"
            :rules="[{ required: true, message: '请输头像链接' }]"
          />
          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
            >
              登录
            </van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
  </div>
</template>
<style scoped>
h1 {
  text-align: center;
}
.icon-rule {
  float: right;
  margin-right: 10px;
}
.tab {
  margin: 0 0 10px 10px;
}
</style>
<script type="ts"  src="./index.ts"></script>
