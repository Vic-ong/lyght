<template>
  <v-card class="pa-5">
    <div v-if="data.status === 'active'" class="d-flex align-center justify-space-between text-subheading black--text">
      <div @click="expand = !expand" class="cursor-pointer">{{ $t('Project-Details-ExpandTitle') }}</div>
      <v-btn small @click="expand = !expand" icon>
        <v-icon color="primary">{{ expand ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
      </v-btn>
    </div>
    <v-expand-transition>
      <v-card v-show="expand" class="transparent mt-3" flat title>
        <div class="text-body black--text mb-5">{{ data.description }}</div>
        <flex-row v-for="field in generalFields" v-bind:key="field.key">
          <template #label>
            <div class="text-subheading black--text">{{ $t(field.textKey) }}</div>
          </template>
          <template #value>
            {{ renderValue(data, field) }}
          </template>
        </flex-row>

        <div v-if="data.status === 'active'">
          <div class="d-flex align-center text-subheading black--text mb-1 mt-5">
            {{ $t('Project-Details-ManufacturerTitle') }}
          </div>
          <flex-row v-for="item in data.projectGroup.manufacturers" v-bind:key="item.part" class="ml-3">
            <template #label>
              <div class="text-subheading black--text">{{ getPartName(item.part) }}</div>
            </template>
            <template #value>
              {{ getManufacturerName(item.company) }}
            </template>
          </flex-row>

          <div class="d-flex align-center text-subheading black--text mb-1 mt-5">
            {{ $t('Project-Details-InsuranceTitle') }}
          </div>
          <v-card
            v-for="item in data.projectGroup.insurances"
            v-bind:key="`${item.date}${item.type}`"
            class="background pa-3 mb-2"
            flat
          >
            <flex-row v-for="field in insuranceFields" v-bind:key="field.key">
              <template #label>
                <div class="text-subheading black--text">{{ $t(field.textKey) }}</div>
              </template>
              <template #value>
                {{ renderValue(item, field) }}
              </template>
            </flex-row>
            <div class="d-flex align-center">
              <v-spacer></v-spacer>
              <v-icon small color="primary" class="mr-2">mdi-file-document-outline</v-icon>
              <a :href="item.file.url" target="_blank" class="primary--text">
                <div class="text-hint">Attachment</div>
              </a>
            </div>
          </v-card>
        </div>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import get from 'lodash/get';
import statusList from '@/constants/projects/statusList.json';
import electricityPurchaserList from '@/constants/projects/electricityPurchaserList.json';
import solarPanelClassificationList from '@/constants/projects/solarPanelClassificationList.json';
import solarPanelGradeList from '@/constants/projects/solarPanelGradeList.json';
import insuranceProviderList from '@/constants/projects/insuranceProviderList.json';
import insuranceTypeList from '@/constants/projects/insuranceTypeList.json';
import manufacturerList from '@/constants/projects/manufacturerList.json';
import { getTranslationList } from '@/utils/locale';
import { formatDate } from '@/utils/date';
import { formatDisplayVal, formatShortAddress, formatAddress } from '@/utils/formats';
import { FlexRow } from '@/components/Grid';

export default {
  name: 'ProjectDetails',
  components: {
    FlexRow,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    defaultExpand: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.expand = this.defaultExpand;
  },
  data() {
    return {
      expand: true,
      partTextKeys: {
        circuit_breaker: 'Field-ProjectDetails-ManufacturerGpt',
        power_inverter: 'Field-ProjectDetails-ManufacturerConverter',
        solar_panels: 'Field-ProjectDetails-ManufacturerPanel',
      },
      insuranceFields: [
        {
          key: 'provider',
          textKey: 'Field-ProjectDetails-InsuranceProvider',
          getValue: (val) => this.getSelectionText(val, insuranceProviderList),
        },
        {
          key: 'type',
          textKey: 'Field-ProjectDetails-InsuranceType',
          getValue: (val) => this.getSelectionText(val, insuranceTypeList),
        },
      ],
    };
  },
  computed: {
    address() {
      return formatShortAddress(this.projectDetails.data.address, this.$i18n.locale);
    },
    generalFields() {
      return [
        {
          key: 'projectGroup.entity.name',
          textKey: 'Field-ProjectDetails-SpvCompany',
        },
        {
          key: 'projectGroup.entity.incorporatedDate',
          textKey: 'Field-ProjectDetails-SpvYearOfIncorporation',
          getValue: (val) => formatDate(val, 'YYYY'),
        },
        {
          key: 'projectGroup.entity.capital',
          textKey: 'Field-ProjectDetails-SpvCapital',
          getValue: (val) => formatDisplayVal(val, { format: '0,0', suffix: 'NTD' }),
          show: this.data.status === 'active',
        },
        {
          key: 'projectGroup.entity.address',
          textKey: 'Field-ProjectDetails-SpvAddress',
          getValue: (val) => formatAddress(val),
          show: this.data.status === 'active',
        },
        {
          key: 'projectGroup.electricityPurchaser',
          textKey: 'Field-ProjectDetails-ElectricityPurchaser',
          getValue: (val) => this.getSelectionText(val, electricityPurchaserList),
        },
        {
          key: 'projectGroup.ppaSerialNumber',
          textKey: 'Field-ProjectDetails-PpaSerialNumber',
          show: this.data.status === 'active',
        },
        {
          key: 'projectGroup.ppaContractStartDate',
          textKey: 'Field-ProjectDetails-PpaStartDate',
        },
        {
          key: 'projectGroup.ppaContractEndDate',
          textKey: 'Field-ProjectDetails-PpaEndDate',
          show: this.data.status === 'active',
        },
        {
          key: 'status',
          textKey: 'Field-ProjectDetails-CurrentStatus',
          getValue: (val) => this.getSelectionText(val, statusList),
        },
        {
          key: 'projectGroup.classification',
          textKey: 'Field-ProjectDetails-SolarProjectClassification',
          getValue: (val) => this.getSelectionText(val, solarPanelClassificationList),
        },
        {
          key: 'projectGroup.grade',
          textKey: 'Field-ProjectDetails-LyghtSolarGrade',
          getValue: (val) => this.getSelectionText(val, solarPanelGradeList),
          show: this.data.status === 'active',
        },
      ].filter(({ show }) => show !== false);
    },
  },
  methods: {
    formatDisplayVal,

    getSelectionText(val, list) {
      const item = getTranslationList({ list, locale: this.$i18n.locale }).find((x) => x.value === val);
      return item ? item.text : 'Invalid';
    },
    renderValue(data, field) {
      const { key, getValue, config = {} } = field;
      const value = get(data, key);

      return getValue ? getValue(value) : formatDisplayVal(value, config);
    },
    getPartName(key) {
      return this.$t(this.partTextKeys[key]);
    },
    getManufacturerName(key) {
      return this.getSelectionText(key, manufacturerList);
    },
  },
};
</script>
