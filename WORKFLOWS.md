# Game repository workflows

This bundle is prepared for a future import into the repository root. It does not enable Pages, change repository visibility, or publish the site. Keep the repository private until its owner explicitly makes it public.

## English

### Continuous integration

`game-ci.yml` runs on pushes and pull requests that change `game/**` or either workflow file. It checks out source without retaining the token, builds the static site, runs the Python standard-library suite, and syntax-checks the vendored VCDIFF JavaScript with the runner's existing Node.js.

No ROM or secret is supplied. Tests requiring `SACRED_GOLD_CLEAN_ROM` are expected to report as skipped. The syntax check does not replace the positive ROM-backed VCDIFF integration test.

### GitHub Pages, prepared for a public repository

`game-pages.yml` has only a manual `workflow_dispatch` trigger. Before calling the official Pages deploy action it checks the live repository metadata and stops unless the repository is public and the selected ref is the default branch. It uses GitHub's read-only [Get a repository endpoint](https://docs.github.com/en/rest/repos/repos#get-a-repository) only for this guard; it does not call a Pages endpoint itself. The deploy job explicitly requests only `pages: write` and `id-token: write`. The visibility guard uses the automatically created `GITHUB_TOKEN` to read repository metadata; `metadata` is not a supported key in the workflow `permissions` map. This matches GitHub’s [official permission-key list](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). The deploy action contacts Pages only during an allowed manual run.

When the repository is deliberately made public, GitHub Free supports Pages for that public repository, so no Pro plan is needed ([availability](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)). The workflow follows GitHub's [custom-workflow deployment requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Then:

1. Merge these files into the default branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Open **Actions → Prepare and deploy game site**, select the default branch, and run the workflow manually.
4. Review the deployment result and the `github-pages` environment URL.

Changing repository visibility does not trigger a deployment. The workflow stays manual, and a private repository run fails before the deploy action with a clear message. No Pages configuration or deployment has been performed by preparing this bundle.

### Pinned official actions

| Action | Version | Full commit pin |
| --- | --- | --- |
| `actions/checkout` | `v7.0.1` | [`3d3c42e5aac5ba805825da76410c181273ba90b1`](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1) |
| `actions/upload-pages-artifact` | `v5.0.0` | [`fc324d3547104276b827a68afc52ff2a11cc49c9`](https://github.com/actions/upload-pages-artifact/commit/fc324d3547104276b827a68afc52ff2a11cc49c9) |
| `actions/deploy-pages` | `v5.0.1` | [`368f82528645a54fb793d4d04e342629a3f51346`](https://github.com/actions/deploy-pages/commit/368f82528645a54fb793d4d04e342629a3f51346) |

### Local checks

From the repository root:

```sh
cd game
python3 tools/build_site.py
python3 -m unittest discover -s tests -v
node --check web/vendor/rompatcher/vcdiff.js
```

These commands do not need a ROM. The ROM-backed positive integration check remains a separate local test requiring a clean ROM with the exact expected hash.

## Español

### Integración continua

`game-ci.yml` se ejecuta en cambios de `game/**` y de cualquiera de los dos workflows, tanto en pushes como en pull requests. Hace checkout sin conservar el token, genera el sitio estático, ejecuta la suite estándar de Python y comprueba la sintaxis JavaScript de VCDIFF con el Node.js que ya trae el runner.

No se proporcionan ROMs ni secretos. Las pruebas que requieren `SACRED_GOLD_CLEAN_ROM` deben quedar omitidas. La comprobación sintáctica no sustituye la integración positiva de VCDIFF con una ROM.

### GitHub Pages, preparado para un futuro repositorio público

`game-pages.yml` solo tiene el trigger manual `workflow_dispatch`. Antes de llamar a la acción oficial de despliegue, consulta los metadatos actuales del repositorio y se detiene salvo que sea público y la ejecución use la rama predeterminada. Para esta guarda solo usa el endpoint oficial de solo lectura [Get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository); el workflow no llama por sí mismo a ningún endpoint de Pages. El job de despliegue solicita explícitamente solo `pages: write` e `id-token: write`. La guarda de visibilidad usa el `GITHUB_TOKEN` que GitHub crea automáticamente para leer los metadatos del repositorio; `metadata` no es una clave admitida en el mapa `permissions` de un workflow. Esto sigue la [lista oficial de permisos](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). La acción de despliegue contacta Pages solo durante una ejecución manual que supere las guardas.

Cuando el repositorio se haga público de forma deliberada, GitHub Free permite Pages para ese repositorio público, sin necesitar Pro ([disponibilidad](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)). El workflow sigue los [requisitos oficiales de despliegue con workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Entonces:

1. Integra estos archivos en la rama predeterminada.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen.
3. Abre **Actions → Prepare and deploy game site**, selecciona la rama predeterminada y ejecuta el workflow manualmente.
4. Revisa el resultado y la URL del entorno `github-pages`.

Cambiar la visibilidad del repositorio no inicia un despliegue. El workflow sigue siendo manual, y una ejecución privada falla con un mensaje claro antes de llamar a la acción de despliegue. La preparación de este bundle no ha configurado Pages ni publicado el sitio.

### Acciones oficiales fijadas

| Acción | Versión | Pin completo del commit |
| --- | --- | --- |
| `actions/checkout` | `v7.0.1` | [`3d3c42e5aac5ba805825da76410c181273ba90b1`](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1) |
| `actions/upload-pages-artifact` | `v5.0.0` | [`fc324d3547104276b827a68afc52ff2a11cc49c9`](https://github.com/actions/upload-pages-artifact/commit/fc324d3547104276b827a68afc52ff2a11cc49c9) |
| `actions/deploy-pages` | `v5.0.1` | [`368f82528645a54fb793d4d04e342629a3f51346`](https://github.com/actions/deploy-pages/commit/368f82528645a54fb793d4d04e342629a3f51346) |

### Comprobaciones locales

Desde la raíz del repositorio:

```sh
cd game
python3 tools/build_site.py
python3 -m unittest discover -s tests -v
node --check web/vendor/rompatcher/vcdiff.js
```

Estos comandos no necesitan una ROM. La prueba positiva de integración requiere una ROM limpia con el hash esperado y se mantiene como validación local separada.
