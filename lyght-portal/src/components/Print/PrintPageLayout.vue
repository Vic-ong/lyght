<template>
  <div class="print-page-layout background">
    <div class="print-page-container">
      <div class="print-page-header">
        <img :src="appLogo" height="45" />
      </div>

      <hr class="rounded" />

      <div class="print-page-body">
        <slot></slot>
      </div>
    </div>

    <div class="print-page-footer">
      <img :src="footerGraphics" height="160" />

      <div class="contact-info-container">
        <div>
          <div class="footer-text">
            <div>
              <b>{{ $t('CompanyName') }}</b>
            </div>
            <div>{{ $t('CompanyAddress') }}</div>
            <div>info@lyght.com.tw | lyght.com.tw</div>
          </div>

          <hr class="rounded" style="margin-bottom: 24px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appLogo from '@/assets/trademarks/lyght_logo_green.png';
import footerGraphics from '@/assets/trademarks/graphics_presentation.png';

export default {
  data() {
    return {
      appLogo,
      footerGraphics,
    };
  },
};
</script>

<style scoped>
.print-page-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.print-page-container {
  padding: 0 48px;
}
.print-page-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 36px 0;
}
.print-page-body {
  padding: 24px 0;
}
.print-page-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
hr.rounded {
  border: none;
  border-top: 3px solid var(--v-primary-base);
  -webkit-print-color-adjust: exact;
  border-radius: 1px;
}
.contact-info-container {
  width: 50%;
  display: flex;
  flex-direction: column-reverse;
}
.footer-text {
  color: var(--v-primary-base);
  -webkit-print-color-adjust: exact;
  font-size: 11px;
  text-align: right;
  padding: 0 48px 18px 0;
}
/* for child components */
.print-title {
  font-size: 24px;
  font-weight: bold;
}
.print-section {
  padding: 24px 0;
}
</style>
