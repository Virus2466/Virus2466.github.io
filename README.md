# Dev Patel — C++, graphics & systems

A responsive personal portfolio featuring Caliber, a cache-locality benchmark, Signal, and an AWS CI/CD demo.

## Development

The site is plain HTML, CSS, and JavaScript with no build step or external runtime dependencies. Serve the repository root with a local HTTP server, such as `python3 -m http.server 8080`, and open `http://localhost:8080`.

- `index.html`: content, metadata, project structure, and résumé.
- `style.css`: responsive styling and print layout.
- `app.js`: project dialogs, email copying, and interactive geometry.
- `fonts/`: self-hosted Roboto and its license.

The geometry study uses WebGL with a Canvas renderer for browsers without WebGL. Project illustrations are labeled and are not application screenshots. Reduced-motion preferences are respected.

## Publishing

Push changes to `main`. The existing `.github/workflows/static.yml` workflow publishes the repository root to GitHub Pages at https://virus2466.github.io/. No package installation or build is required.
