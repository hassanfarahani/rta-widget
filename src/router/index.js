import Vue from 'vue'
import Router from 'vue-router'
import ProductionPlots from '@/components/ProductionPlots'
import RnpPlots from '@/components/RnpPlots'
import Lessons from '@/components/Lessons'
import Lesson from '@/components/Lesson'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Lessons',
      component: Lessons
    },
    {
      path: '/:lessonId',
      name: 'Lesson',
      component: Lesson ,
      redirect: { name: 'ProductionPlots'},
      children: [
        { path: 'production-plot', name: 'ProductionPlots', component: ProductionPlots },
        { path: 'rta-plot', name: 'RnpPlots', component: RnpPlots }
      ]     
    }
  ]

})
