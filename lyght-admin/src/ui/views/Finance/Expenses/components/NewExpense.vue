<template>
  <div>
    <btn-main @click="setCreateAction" color="primary">
      New Expense
      <v-icon class="ml-2">mdi-plus-circle</v-icon>
    </btn-main>

    <general-dialog
      v-model="dialogProps.show"
      :text="dialogProps.text"
      :status="dialogProps.status"
      @close="clearData"
      max-width="700"
    >
      <template #header>New Expense</template>

      <template #body>
        <v-form ref="form" v-model="valid" class="text-left" lazy-validation>
          <new-expense-form :input="input" :list="list" :loading="loading"></new-expense-form>
        </v-form>
      </template>

      <template #actions>
        <btn-main @click="submitHandler" :loading="loading" color="primary">Submit</btn-main>
      </template>
    </general-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dialog from '@/mixins/dialog';
import NewExpenseForm from './Forms/NewExpenseForm.vue';

export default {
  components: {
    NewExpenseForm,
  },
  props: {
    list: { type: Object, required: true },
  },
  mixins: [dialog],
  data() {
    return {
      valid: true,
      loading: false,
      router: {
        id: null,
        projectGroupId: null,
      },
      input: {
        date: new Date(new Date().getTime()).toISOString().substr(0, 7),
        projectGroupId: null,
        currency: 'TWD',
        revenue: null,
        valueAddedTax: null,
        approvedBy: [],
        remarks: null,
        status: 'open',
      },
    };
  },
  methods: {
    ...mapActions('expenses', ['createExpense']),

    setCreateAction() {
      this.setAction({
        name: null,
        handler: this.submitHandler,
      });
    },
    clearData() {
      this.input = {
        date: new Date(new Date().getTime()).toISOString().substr(0, 7),
        projectGroupId: null,
        currency: 'TWD',
        revenue: null,
        valueAddedTax: null,
        approvedBy: [],
        remarks: null,
        status: 'open',
      };
      this.clearDialog();

      if (this.router.id) {
        this.$router.push({
          name: 'finance/expenses/:id',
          params: { id: this.router.id },
          query: {
            projectGroup: this.router.projectGroupId,
          },
        });
      }
    },
    validate() {
      this.valid = this.$refs.form.validate();
    },
    async submitHandler() {
      this.validate();
      if (this.valid) {
        try {
          this.loading = true;

          const res = await this.createExpense(this.input);

          this.router = {
            id: res.id,
            projectGroupId: this.input.projectGroupId,
          };

          this.loading = false;
          this.setActionSuccess('Created a new expense.');
        } catch (err) {
          this.loading = false;
          this.setActionError(err);
        }
      }
    },
  },
};
</script>
