<template>
  <v-card class="pos-relative mt-15 rounded-lg">
    <div class="text-center pa-5">
      <div class="text-center text-body pt-5 px-3">
        <div class="text-subtitle">{{ projectName }}</div>
        <div>{{ data.publicIdentifier }}</div>
      </div>
      <div class="mt-5 px-3">
        <v-row dense>
          <v-col v-for="item in checks" v-bind:key="item.icon" cols="12" md="6" lg="12" class="d-flex align-center">
            <v-card class="pa-3 bg-light rounded-btn" flat>
              <v-icon color="bg-dark" size="20">{{ item.icon }}</v-icon>
            </v-card>
            <div class="text-left ml-3">
              <div class="text-subheading">{{ item.title }}</div>
              <div class="text-hint bg-grey--text">{{ item.desc }}</div>
            </div>
          </v-col>
        </v-row>
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
import { projectScale, projectEstablishment, projectLength } from '@/ui/views/Projects/shared';

export default {
  name: 'ProjectGroup.SidePanel',
  props: {
    data: { type: Object, required: true },
  },
  computed: {
    projectName() {
      return get(this.data, 'nameTrans.en');
    },
    checks() {
      return [
        projectScale(this.data),
        projectEstablishment(this.data),
        projectLength({
          start: this.data.ppaContractStartDate,
          end: this.data.ppaContractEndDate,
        }),
      ];
    },
  },
};
</script>
