# Third-Party Notices

This project includes portions adapted from the following open-source project.

## Firefly

- Source: https://github.com/CuteLeaf/Firefly
- License: MIT License
- Usage: Wiki Link processing and PlantUML rendering were adapted and modified for Mizuki and retained in this project. Earlier versions also included adapted Markdown code-group and diagram interaction/style files.

The retained adapted files are:

- `src/plugins/remark-wiki-link.mjs`
- `src/plugins/plantuml-encoder.mjs`
- `src/plugins/remark-plantuml.mjs`
- `src/plugins/rehype-plantuml.mjs`

Historical files `src/components/features/markdown/CodeGroupManager.astro`, `src/components/features/markdown/DiagramManager.astro`, and the `rehype-code-group` section in `src/styles/expressive-code.css` were removed during the site restructuring. They remain part of the attribution history, but are not current source paths. The copyright notices and license below are preserved.

### Firefly MIT License

MIT License

Copyright (c) 2024 saicaca  
Copyright (c) 2025 CuteLeaf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
