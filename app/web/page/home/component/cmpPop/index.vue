<template>
  <div
    class="normal-pop"
    :class="className"
  >
    <div class="pop-content">
      <h3 v-if="title">
        {{ title }}
      </h3>
      <slot />
    </div>
  </div>
</template>
<style lang="stylus">
.normal-pop
  box-sizing border-box
  display flex
  align-items center
  justify-content center
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(0,0,0,.5)
  animation: 1s hiddenPop 1;
  .pop-content
    display flex
    flex-direction column
    align-items center
    justify-content center
    padding 20px
    background-color white
.normal-pop-hidden
  display none
</style>
<script type="ts"  src="./index.ts"></script>
