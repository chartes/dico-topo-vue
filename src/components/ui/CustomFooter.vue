<template>
  <v-footer app padless absolute height="150" color="grey lighten-2">
    <v-col class="justify-space-around d-flex footer-logos">
        <a href="https://www.archives-nationales.culture.gouv.fr/" target="_blank">
          <img src="@/assets/logo-an-couleur.png" height="60" alt="Logo Archives Nationales"/>
        </a>
      <a href="https://www.chartes.psl.eu/" target="_blank">
        <img src="../../assets/logo-enc-couleur.svg" height="60" alt="Logo École nationale des chartes" />
      </a>
      <a href="https://cths.fr/" target="_blank">
        <img src="../../assets/logo-cths-couleur.png" height="60" alt="Logo CTHS"/>
      </a>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'CustomFooter'
}
</script>

<style scoped>
  /*.v-footer {margin-top: 200px;}*/
  .footer-logos img {
    transform-origin: 50% 50%;
    transition: transform ease-in-out 0.35s;
  }
  .footer-logos img:hover {
    transform: scale(1.25);
  }

  @media screen and (max-width: 760px) {
    .v-footer {
      height: 260px !important;
    }
    .footer-logos {
      flex-direction: column;
      align-items: center;
    }
    .footer-logos > * {
      margin-bottom: 5px;
      transform-origin: 50%;
      transform: scale(0.8, 0.8);
    }
  }

</style>
