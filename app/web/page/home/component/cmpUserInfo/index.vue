<template>
  <div class="cmp-user-info">
    <p>{{ nickName }}</p>
    <van-image
      round
      width="50px"
      height="50px"
      :src="avatar"
    />
  </div>
</template>
<style lang="stylus" scoped>
.cmp-user-info
  display flex
  flex-direction column
  align-items center
  > p
    padding 0 10px
    font-size 12px
    line-height 20px
    color #fff
    border-radius 0.5rem
    background-color rgba(25,137,250,.8)
</style>
<script type="ts"  src="./index.ts"></script>
