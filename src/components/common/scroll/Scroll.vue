<template>
<div class="wrapper" ref="wrapper">
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  data(){
    return {
      scroll:null,
    }
  },
  props:{
    probeType:{
      type:Number,
      default:0
    },
    pullUpLoad:{
      type:Boolean,
      defaults:true
    }
  },
  mounted() {
    //1,创建BSscroll对象
    this.scroll = new BScroll(this.$refs.wrapper,{
      probeType:this.probeType,
      //button无论是否设置,click:true都能点击,
      //但是div必须设置为true才能点击,父组件中,tab-control是div,所以必须设置
      click:true,
      pullUpLoad:this.pullUpLoad
    })

    //2,监听滚动的位置,显示回到顶部按钮
    if (this.probeType === 2 || this.probeType === 3){
      this.scroll.on('scroll',position=>{
        this.$emit('scroll',position)
      })
    }

    //3,上拉加载更多,只触发一次
    if (this.pullUpLoad){
      this.scroll.on('pullingUp',()=>{
        // console.log('上拉加载更多');
        this.$emit('pullingup')
      })
    }
  },
  methods:{
    //封装的思想,写一个方法,默认time为300毫秒,给父组件直接调用
    scrollTo(x, y, time=300){
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    //只要上拉,就加载更多
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp()
    },
    refresh(){
      // console.log('1111111');
      this.scroll && this.scroll.refresh()
    },
    saveActiveY(){

    },
    getScrollY(){
      return this.scroll.y ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
