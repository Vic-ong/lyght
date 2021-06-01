<template>
  <div>
    <div v-if="!panels || panels.length === 0">
      <div class="text-subheading primary--text ml-2 mt-3 mb-5">Panels Assignment</div>
      <v-card class="bg-light d-flex align-center justify-center" height="150" flat>
        <div class="text-center">
          <div class="text-body mb-3">No panels assigned to this order.</div>
          <btn-main v-if="!disabled" @click="$emit('assign-panels')" color="primary">
            Assign Panels
            <v-icon class="ml-2">mdi-plus-circle</v-icon>
          </btn-main>
        </div>
      </v-card>
    </div>

    <div v-else class="ml-2">
      <div class="text-subheading primary--text mt-3 mb-5">Panels Assigned</div>
      <div class="text-body">
        <v-row no-gutters>
          <v-col :cols="panelsCol(panels)" v-for="panel in panels" v-bind:key="panel._id">
            {{ panel._id }}
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelsAssignment',
  props: {
    data: { type: Object, required: true },
    input: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    panels() {
      return this.data.panels;
    },
    panelsAssigned() {
      const { panels } = this.data;
      if (panels) return panels.length > 0 && panels.length === this.input.quantity;
      return false;
    },
  },
  methods: {
    panelsCol(item) {
      const count = item.length;
      if (count > 100) return 4;
      if (count > 25) return 6;
      return 12;
    },
  },
};
</script>
