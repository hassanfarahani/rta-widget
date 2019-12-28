
<template>
                
    <div class="sliderRange">
        <label class="labeltext">{{ sliderTitle }}:</label> 
        <vue-slider v-model="initVal" :min="minimum" :max="maximum" @change="sliderInput"></vue-slider>
    </div>

</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'RangeSlider',
  props: {
      label: {
          type: String,
          required: true
      },
      min: {
          type: Number,
          required: true
      },
      max: {
          type: Number,
          required: true
      },
      initVal: {
          type: Array,
          required: true
      },
      sliderTitle: {
          type: String,
          required: true
      }
  },
  data() {
      return {
        values: [50, 400]
      }
  },
  created() {
      this.$store.dispatch('getSliderValues', this.initVal);
  },
  computed: {
      minimum() {
          return this.min;
      },
      maximum() {
          return this.max;
      },
    //   initValues: {
    //       get() {
    //           return this.initVal;
    //       },
    //       set(newValue) {
    //           return newValue;
    //       }
    //   }
  },
  methods: {
      sliderInput() {
          let data = {
              label: this.label,
              values: this.initVal
          };
          this.$store.dispatch('getSliderValues', data);
        //   console.log(data)
      }
  }
}

</script>