<template>
  <div :class="className">
    {{ cardName }}
    <van-icon
      v-show="isSteal"
      name="cart-circle"
      color="#f33"
    />
  </div>
</template>
<style lang="stylus" scoped>
$cardImg = ({ 'background-image': '', 'background-color': #cc6699 }) ({ 'background-image': '', 'background-color': #cc6699 }) ({ 'background-image': '', 'background-color': #ff99cc }) ({ 'background-image': url('../../../../asset/images/cards/attack.jpg'), 'background-color': #cc99ff }) ({ 'background-image': '', 'background-color': #99ccff }) ({ 'background-image': '', 'background-color': #9999ff }) ({ 'background-image': url('../../../../asset/images/cards/nope.jpg'), 'background-color': #58bc58 }) ({ 'background-image': url('../../../../asset/images/cards/future.png'), 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc });

for $item, $i in $cardImg
  .cmp-card-{$i}
    for $name, $value in $item
      {$name} $value

.cmp-card
  position relative
  box-sizing border-box
  // 130*200 为基准
  width 91px
  height 140px
  padding 3px
  border-radius 5px
  box-shadow 2px 2px 10px 0 #ccc
  background-position 0 0
  background-size 100% 100%
  background-repeat no-repeat
  &.selected
    transform translateY(-10%)

  .van-icon-cart-circle
    position absolute
    top: 24px
    left: 3px
    font-size: 22px;
</style>
<script type="ts"  src="./index.ts"></script>
