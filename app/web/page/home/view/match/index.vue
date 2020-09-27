<template>
  <div class="match-page">
    <h1>爆炸猫啊</h1>
    <div class="user-info">
      <p>昵称：{{user.nickName}}</p>
      <img :src="user.avatar" />
    </div>
    <div v-if="roomId">
      <h3>游戏房间</h3>
      <ul>
        <li v-for="(player) in playerList" :key="player.userId">
          <strong v-if="isMater(player.userId)">《房主》</strong>
          <span>{{player.nickName}}</span>
        </li>
      </ul>
      <p>匹配中<em>...</em></p>
      <button
        v-if="isMater(user.userId)"
        :class="startClass"
        @click="startGame"
      >开始游戏</button>
      <button
        v-if="roomId"
        @click="quitRoom"
      >取消匹配</button>
    </div>
    <button
      v-else
      type="button"
      style="width: 100%;margin-bottom: 18px"
      @click="joinRoom"
    >开始匹配</button>
  </div>
</template>
<style scoped>
img {
  max-height: 100px;
}
.start-btn {
  opacity: 0.5;
}
.start-btn.active {
  opacity: 1;
}
p > em {
  display: inline-block;
  width: 3ch;
  text-align: left;
  text-indent: -1ch;
  vertical-align: bottom;
  overflow: hidden;
  animation: dotAnim 3s infinite step-start both;
  /* 等宽字体很重要 */
  font-family: Consolas, Monaco, monospace;
}
@keyframes dotAnim {
  33% { text-indent: 0; }
  66% { text-indent: -2ch; }
}
</style>

<script type="ts"  src="./index.ts"></script>
