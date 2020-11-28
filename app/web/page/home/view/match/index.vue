<template>
  <div class="match-page">
    <h1>爆炸猫啊</h1>
    <van-card
      v-show="!roomId"
      :desc="getDesc(user.userId)"
      :title="user.nickName"
      :thumb="user.avatar"
    />
    <div v-if="roomId">
      <h3>游戏房间</h3>
      <van-card
        v-for="(player) in playerList"
        :key="player.userId"
        :tag="isMater(player.userId) ? '房主' : ''"
        :desc="getDesc(player.userId)"
        :title="player.nickName"
        :thumb="player.avatar"
      />
      <p class="matching">
        匹配中<em>...</em>
      </p>
      <van-button
        v-if="isMater(user.userId)"
        round
        block
        type="info"
        class="start-game"
        :disabled="!canStart"
        @click="startGame"
      >
        开始游戏
      </van-button>
      <van-button
        round
        block
        plain
        type="warning"
        @click="quitRoom"
      >
        取消匹配
      </van-button>
    </div>
    <van-button
      v-else
      round
      block
      type="info"
      @click="joinRoom"
    >
      开始匹配
    </van-button>
  </div>
</template>
<style scoped>
h1 {
  text-align: center;
}
.start-game {
  margin-bottom: 10px;
}
.matching {
  margin: 10px;
  color: #966;
  text-align: center;
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
