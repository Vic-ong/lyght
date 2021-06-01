<template>
  <v-card class="pos-relative mt-15 rounded-lg">
    <div class="text-center text-subtitle pa-3">
      {{ data.order.orderNumber }}
    </div>

    <router-link :to="{ name: 'users/:id', params: { id: user._id } }" target="_blank" style="text-decoration: none">
      <div class="text-center text-body cursor-pointer pa-3">
        <div class="text-subheading">{{ user.firstName }} {{ user.lastName }} ({{ user.displayName }})</div>
        <div>{{ user.email }}</div>
        <div>{{ user.phoneNumber }}</div>
      </div>
    </router-link>

    <div class="text-center pa-5">
      <div class="mt-3 px-3">
        <v-row dense>
          <v-col v-for="item in items" v-bind:key="item.icon" cols="12" md="6" lg="12" class="d-flex align-center">
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
      <record-timestamps :data="data.order"></record-timestamps>
    </div>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import { formatCurrency } from '@/utils/formats';

export default {
  name: 'SidePanel',
  props: {
    data: { type: Object, required: true },
    input: { type: Object, required: true },
  },
  computed: {
    user() {
      return this.data.user;
    },
    panelsTotal() {
      return get(this.data, 'project.panelsTotal');
    },
    panelsAssignedDesc() {
      return this.data.panels && this.data.panels.length > 0 ? `${this.data.panels.length} panels` : '-';
    },
    totalAmount() {
      const { value, currency } = get(this.data, 'project.unitCost');
      return formatCurrency({
        value: value * Number(this.input.quantity),
        currency,
      }).display;
    },
    items() {
      return [
        {
          title: 'Total panels offered',
          desc: this.panelsTotal,
          icon: '$fi-sr-grid',
        },
        {
          title: 'Panels assigned',
          desc: this.panelsAssignedDesc,
          icon: '$fi-sr-lock',
        },
        {
          title: 'Total amount',
          desc: this.totalAmount,
          icon: '$fi-sr-dollar',
        },
      ];
    },
  },
};
</script>
