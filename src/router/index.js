import Vue from 'vue'
import Router from 'vue-router'
import ProductionPlots from '@/components/ProductionPlots'
import RnpPlots from '@/components/RnpPlots'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ProductionPlots',
      component: ProductionPlots
    },
    {
      path: '/rnp-plots',
      name: 'RnpPlots',
      component: RnpPlots
    }
  ]
})
