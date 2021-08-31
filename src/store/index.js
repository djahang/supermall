import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  cartList:[]
}

const  store = new Vuex.Store({
  state,
  mutations: {
    addCart(state,payload){
      //payload新添加的商品，设置为空，
      // 如果有重复的就将重复的数据，放到oldPayload
      // let oldProduct = null
      //
      // for (let item of state.cartList){
      //   if (item.iid === payload.iid){
      //     oldProduct = item     //把iid重复的对象，赋值到oldProduct
      //   }
      //判断oldProduct，是否为空
      // if (oldProduct){    //如果不为空
      //   oldProduct.count += 1
      // }
      // else {    //如果oldProduct为空，就证明新增加的商品，不在购物车中，就对payload操作
      //   payload.count = 1
      //   state.cartList.push(payload)

      //1，通过find函数，来查找catList是否有payload中iid重复的商品
      let product  = state.cartList.find(item => { item.iid === payload.iid })

      if (product){    //如果不为空，将state.carList中的iid一样的数据，返回到product
        product.count += 1
      }else {    //如果product为空，就证明新增加的商品，不在购物车中，就对payload操作
        payload.count = 1
        state.cartList.push(payload)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})


export default store
