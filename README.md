# dico-topo-vue

<h1>The <a target="_blank" href="https://dicotopo.cths.fr/">DicoTopo</a> application <image height="45" align="right" src="https://github.com/user-attachments/assets/f65ff1c0-ac0f-410d-8fe8-1bc0d6a3f2fe"/></h1>

>:warning: (Install) / Launch first the API and Elasticsearch :  
> See the [API Readme](https://github.com/chartes/dico-topo-app)

**Master dependencies**:

[![Node](https://img.shields.io/badge/node-16.20_to_22.9-blue?style=for-the-badge&logo=Node.js)](https://nodejs.org)

[![package - vue](https://img.shields.io/github/package-json/dependency-version/chartes/dico-topo-vue/vue/master?logo=vue.js&logoColor=white)](https://www.npmjs.com/package/vue)
[![package - eslint](https://img.shields.io/github/package-json/dependency-version/chartes/dico-topo-vue/dev/eslint/master?logo=eslint&logoColor=white)](https://www.npmjs.com/package/eslint)


[![package - Vuetify](https://img.shields.io/github/package-json/dependency-version/chartes/dico-topo-vue/vuetify/master?logo=vuetify&logoColor=white)](https://www.npmjs.com/package/vuetify)
[![package - Mirador](https://img.shields.io/github/package-json/dependency-version/chartes/dico-topo-vue/mirador/master)](https://www.npmjs.com/package/mirador)



## Project setup
### Clone the GitHub repository:  
in a local folder dedicated to the project
  ```bash
  git clone https://github.com/chartes/dico-topo-vue.git
  ```

From the app folder (`cd path/to/dico-topo-vue`)
### Install
```
yarn
```

### Compiles and hot-reloads for development

For a local development server, reads `.env.development` variables:

```
yarn serve
```

### Compiles and minifies for staging

For a staging server (preproduction), reads `.env.staging` variables:

```
yarn build:staging
```

### Compiles and minifies for production

For a production server, reads `.env.production` variables:

```
yarn build:prod
```

### Run preview server

After a `yarn build:prod` or `yarn build:staging` you can run a server to serve the produced `dist` folder with:

```
cd dist/
python3 -m http.server
```

### Matomo tracking configuration

Matomo tracking is optional and driven by two environment variables (set them in the `.env.*` files or in the deployment environment):

- `VUE_APP_MATOMO_URL` — the Matomo instance base URL (e.g. `https://matomo.example.com/matomo`)
- `VUE_APP_MATOMO_SITE_ID` — the Matomo site ID

Tracking is enabled only when **both** variables are set and non-empty. When enabled, page views are tracked automatically on every router navigation and link tracking is active. When they are empty (or absent), the Matomo plugin is not loaded at all, so development builds are not tracked by default.

### Lints and fixes files
```
yarn lint
```

```
yarn lint-fix
```