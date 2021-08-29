<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive" ><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>

<!--    使用div + v-if,v-else来判定icon的显示,-->
<!--    使用:class="{active:isActive}"来绑定div的 active的样式-->

    <div  :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  data(){
    return {
      // isActive:true
    }
  },
  props:{
    path:String,
    activeColor:{
      type:String,
      default:'red'
    }
  },
  computed:{
    isActive(){
      //indexof 如果包含就返回0,下面就return true
      return this.$route.path.indexOf(this.path) ==0
    },
    activeStyle(){
       // console.log(this.isActive);
      return this.isActive ? {color:this.activeColor}:{}
    }
  },
  methods:{
    itemClick(){
      // console.log(this.path);
      this.$router.push(this.path).catch(()=>{})
    }
  }
}
</script>

<style scoped>
.tab-bar-item{
  /*设置均等分,并且居中*/
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img{
  width: 24px;
  height: 24px;
  margin-top: 3px;

  vertical-align: middle;

  margin-bottom: 2px;
}

.active{
color: red;
}
</style>
