<template>
    <div class="plots">                     
        <div class="plots-box">
            <div class="plots-box-header">                         
                <ul class="plots-list">
                    <!-- <li class="plots-list-item">
                        <span><i class="fas fa-chart-line" style="backgroundColor: #facc9d; color: rgb(245, 153, 32); border:1px solid rgb(245, 153, 32); padding: 0.1rem;"></i></span>
                    </li> -->
                    <li class="plots-list-item">
                        <router-link :to="{name: 'ProductionPlots'}" active-class="active" exact>Production Plots</router-link>
                    </li>
                    <li class="plots-list-item">
                        <router-link :to="{name: 'RnpPlots'}" active-class="active">Rate-Normalized Pressure Plots</router-link>
                    </li> 
                </ul>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { plotsMixin } from './plotsMixin.js';
import ProductionPlots from '@/components/ProductionPlots.vue'
import RnpPlots from '@/components/RnpPlots.vue'

export default {
  name: 'PlotsHeader',
    data() {
        return {            
        }
    },
  components: {
    ProductionPlots,
    RnpPlots
  }
}
</script>

<style>

</style>

