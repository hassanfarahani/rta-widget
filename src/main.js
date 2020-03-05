// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import Fragment from 'vue-fragment'

// import * as d3 from 'd3';

// if (process.env.NODE_ENV === 'development') {
//   /**
//    * ^ Assigning to dev object so they are not global
//    */
//   Object.assign(window, {
//     dev: {
//       d3: require('d3'),
//       // _:           require('lodash'),
//       // SuffixTree:  require('./utils/suffix-tree').default,
//       // html2canvas: require('html2canvas'),
//       store,
//       Vue
//     }
//   })

//   /**
//    * ^ Provide a global method to open a component in the editor
//    */

//   /*
//   .########..########...#######..########..##.....##..######..########.####..#######..##....##
//   .##.....##.##.....##.##.....##.##.....##.##.....##.##....##....##.....##..##.....##.###...##
//   .##.....##.##.....##.##.....##.##.....##.##.....##.##..........##.....##..##.....##.####..##
//   .########..########..##.....##.##.....##.##.....##.##..........##.....##..##.....##.##.##.##
//   .##........##...##...##.....##.##.....##.##.....##.##..........##.....##..##.....##.##..####
//   .##........##....##..##.....##.##.....##.##.....##.##....##....##.....##..##.....##.##...###
//   .##........##.....##..#######..########...#######...######.....##....####..#######..##....##
//   */
// } else {
//   /**
//    * ^ Adding to production as well
//    */
//   Object.assign(window, {
//     dev: {
//       d3: require('d3'),
//       store,
//       Vue
//     }
//   })
// }



Vue.config.productionTip = false
Vue.component('VueSlider', VueSlider)
Vue.use(Fragment.Plugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
