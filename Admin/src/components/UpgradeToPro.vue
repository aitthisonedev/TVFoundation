<template>
  <VBtn
    class="product-upgrade-to-pro"
    href="https://aitthisone.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    Contact Services

    <VMenu
      open-on-hover
      activator="parent"
      offset="15"
      max-width="400px"
      :close-on-content-click="false"
      transition="slide-y-reverse-transition"
    >
      <VCard>
        <VImg src="https://aitthisone.com" />
        <VCardTitle class="font-add"
          >ບໍລິການ ສ້າງເວບໄຊ໌ ແລະ ແອບພິເຄຊັ້ນ
          ຕ່າງໆຕາມຄວາມຕ້ອງການຂອງທ່ານ</VCardTitle
        >
        <VCardText class="font-add">
          ຄິກລີ່ງເພື່ອເບີ່ງລາຍລະອຽດ ຂ້າງລຸ່ມນີ້:
          <br />
          <br />
          Email: it@aitthisone.com
          <br />
          Tel: +856 20 788 666 95
        </VCardText>
        <VCardText
          >Address: Dongkhamxang Village, Hardxayfong District, Vientiane Lao
          PDR</VCardText
        >
        <VCardText>
          <VBtn
            class="me-4"
            href="https://www.facebook.com/itsarkhone"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </VBtn>
          <VBtn
            variant="outlined"
            href="https://wa.link/brju6b"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp links
          </VBtn>
        </VCardText>
      </VCard>
    </VMenu>
  </VBtn>
</template>

<style lang="scss" scoped>
.product-upgrade-to-pro {
  position: fixed;
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 79px;
  color: var(--v-primary-base);

  .v-application &.v-btn.v-btn--elevated {
    box-shadow: 0 4px 8px 0px rgb(var(--v-theme-info)) !important;

    &:hover {
      box-shadow: none !important;
    }
  }
}
.font-add {
  font-family: "Noto Serif Lao", serif;
}
</style>
