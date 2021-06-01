<template>
  <v-card class="pos-relative mt-15 rounded-lg project-card-container">
    <div class="pos-absolute top-n15 stretch-width d-flex justify-center">
      <v-hover v-if="primaryImg">
        <template v-slot:default="{ hover }">
          <v-card :width="imgSize.width" :height="imgSize.height" class="elevation-5 bg-grey">
            <v-img :src="primaryImg" :height="imgSize.height"></v-img>
            <transition name="transition-fade">
              <v-overlay v-if="hover" absolute color="bg-dark">
                <v-card
                  @click="routeToProject"
                  class="pa-4 transparent text-center disable-ripple"
                  v-ripple="false"
                  flat
                >
                  <v-icon size="24" color="accent">$fi-sr-zoom-in</v-icon>
                  <div class="text-body bg-light--text mt-1">Go to project</div>
                </v-card>
              </v-overlay>
            </transition>
          </v-card>
        </template>
      </v-hover>

      <v-card v-else :width="imgSize.width" :height="imgSize.height" class="elevation-5 bg-grey">
        <div class="d-flex align-center justify-center stretch-height">
          <v-icon :size="50" color="white">mdi-image-off</v-icon>
        </div>
      </v-card>
    </div>

    <div class="text-center pa-5">
      <div @click="routeToProject" class="text-subtitle cursor-pointer">{{ projectName }}</div>

      <div class="mt-7">
        <div class="text-subtitle">{{ totalPartition }}</div>
        <div class="text-hint bg-grey--text">Total partition</div>
      </div>

      <div class="mt-7">
        <div class="text-subtitle">{{ outstandingAmount }}</div>
        <div class="text-hint bg-grey--text">Outstanding amount</div>
      </div>

      <div class="mt-7">
        <div class="text-subtitle">{{ totalTaxApplied }}</div>
        <div class="text-hint bg-grey--text">Total tax applied</div>
      </div>
    </div>

    <slot></slot>

    <div class="divider-line my-5 mx-5"></div>

    <div class="pb-5">
      <record-timestamps :data="data"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { formatCurrency, formatDisplayVal } from '@/utils/formats';
import { calcOutstanding, calcTotalTax } from '../../shared';

export default {
  name: 'PaymentProvisionProfile.SidePanel',
  props: {
    data: { type: Object, required: true },
    project: { type: Object, required: true },
  },
  computed: {
    primaryImg() {
      return get(this.project, 'imagePrimary.url');
    },
    imgSize() {
      return {
        width: 250,
        height: 150,
      };
    },
    projectName() {
      return get(this.project, 'nameTrans.en');
    },
    totalPartition() {
      const sum = this.data.distributions.reduce((acc, curr) => acc + curr.partition, 0);
      return formatDisplayVal(sum, { format: '0.[00]%' });
    },
    outstandingAmount() {
      return this.currencyDisplay(calcOutstanding(this.data));
    },
    totalTaxApplied() {
      return this.currencyDisplay(calcTotalTax(this.data));
    },
  },
  methods: {
    currencyDisplay(value) {
      if (!value) return '-';
      return formatCurrency({ value, currency: get(this.data, 'cash.currency') }).display;
    },
    routeToProject() {
      this.$router.push({
        name: 'projects/:id',
        params: {
          id: this.project._id,
        },
        query: {
          projectGroup: this.project.projectGroupId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.project-card-container {
  padding-top: 80px;
}
</style>
