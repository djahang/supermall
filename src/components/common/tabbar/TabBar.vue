<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar"
}
</script>

<style scoped>

#tab-bar{
  /*使用flex布局*/
  display: flex;
  background-color: #f6f6f6;

  /*以body为定位时的对象,定位到最下面*/
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  /*设置一点点阴影*/
  box-shadow: 0 -1px 1px rgba(15,20,44,0.13);
}
</style>
