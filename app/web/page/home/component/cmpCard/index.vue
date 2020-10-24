<template>
  <div :class="className">
    {{ cardName }}
  </div>
</template>
<style lang="stylus" scoped>
$cardImg = ({ 'background-image': '', 'background-color': #cc6699 }) ({ 'background-image': '', 'background-color': #cc6699 }) ({ 'background-image': '', 'background-color': #ff99cc }) ({ 'background-image': '', 'background-color': #cc99ff }) ({ 'background-image': '', 'background-color': #99ccff }) ({ 'background-image': '', 'background-color': #9999ff }) ({ 'background-image': '', 'background-color': #58bc58 }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc }) ({ 'background-image': '', 'background-color': #ffffcc });

for $item, $i in $cardImg
  .cmp-card-{$i + 1}
    for $name, $value in $item
      {$name} $value

.cmp-card
  box-sizing border-box
  width 91px
  height 140px
  padding 3px
  border 1px solid #cccccc
  &.selected
    transform translateY(-10%)

</style>
<script type="ts"  src="./index.ts"></script>
