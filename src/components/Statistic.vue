<template>
  <v-card width="380">
    <v-card-text class="pa-0" >
      <apexchart width="380" type="donut" :options="options" :series="series"></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import { GET_RACK_STATS } from "@/plugins/api";
export default {
  mounted: function() {
    console.log("created");
    this.updateChart()
  },
  methods: {
    updateChart() {
      let _this = this
      this.$store.dispatch(GET_RACK_STATS, function(data) {
      var y = []
      var x = []
      for (var i = 0; i < data.length; i++) {

        y.push(data[i].count);
        x.push(data[i].rack_name);
      }
    console.log(y,x)
      _this.options.push( {
            dataLabels: {
            enabled: true
          },
          labels:x
        })
      _this.series = y
    });
    }
  },
  data() {
    return {
      options: {
      },
      series:  [30, 40, 45, 50, 49, 60, 70, 81]
    };
  }
};
</script>

<style>
</style>
