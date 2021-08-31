import {debounce} from "common/utils";
import BackTop from "@/components/content/backTop/BackTop";
export const itemListenerMixin ={
  data(){
    return {
      itemImgListener:null
    }
  },
  mounted(){
    //1,图片加载完成的事件监听，将函数本身传入防抖动, 再执行事件总线代码
    let refresh = debounce(this.$refs.scroll.refresh,30)

    //对监听的事件保存到函数中
    this.itemImgListener =()=>{ refresh() }     //执行防抖动

    // console.log('我是混入的mixin');
    this.$bus.$on('itemimgload',this.itemImgListener)
  }
}

export const backTopMixin = {
  data(){
    return {
      isBackTopShow:false
    }
  },
  components:{
    BackTop
  },
  methods:{
    bactopClick(){
      //获取scroll对象,再调用scroll对象的scrollTo方法
      // this.$refs.scroll.scrollTo(0,0,500)

      //在子组件内,封装了scrollTo方法,直接调用方法,不用获取对象,默认time为300毫秒
      this.$refs.scroll.scrollTo(0,0)
    },
    listenShouBackTop(position){
      //1, 判断BackTop是否显示
      this.isBackTopShow = (-position.y) > 1000
    }
  }
}

