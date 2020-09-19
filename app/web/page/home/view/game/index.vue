<template>
  <div class="game-page">
    <h1>爆炸猫啊</h1>
    <div class="user-info">
      <p>昵称：{{user.nickName}}</p>
      <img :src="user.avatar" />
    </div>
    <button
      type="button"
      style="width: 100%;margin-bottom: 18px"
      @click="startGame"
    >开始游戏</button>
  </div>
</template>
<style scoped>
img {
  max-height: 100px;
}
</style>>

</style>
<script type="ts"  src="./index.ts"></script>
