# Algorithm Lab

An interactive React + TypeScript learning platform for algorithms, data structures, and language-specific implementations.

## Available learning experiences

- **Binary Search Visualizer:** configurable sorted integer data, ascending/descending order, custom lists, playback controls, comparison history, statistics, and pseudocode.
- **Linear Search Visualizer:** step through comparisons on unsorted input.
- **Array Explorer:** access, update, search, insert, and delete values; inspect complexity and language-specific memory notes.
- **Language Explorer:** compare curated examples in C#, C, C++, Python, Rust, Go, JavaScript, TypeScript, Java, and PHP.
- **Under the Hood:** learn about allocation, references, element storage, runtime behavior, and memory-management differences.
- **Catalog:** categorized algorithms and data structures, with unfinished topics marked Coming Soon.
- **Animated landing page:** introduces the platform, learning outcomes, featured topics, and clear paths into the labs. The landing page is the default screen; Binary Search is opened only when the learner chooses it.
- Persistent dark/light theme, responsive layout, and reduced-motion support.

Memory notes distinguish language guarantees from typical runtime implementation details. They are educational summaries, not a promise of a particular physical layout on every compiler or runtime.

## Landing page

The home screen uses CSS and inline vector-style graphics rather than large external image assets. Lightweight animations illustrate search steps, memory concepts, and language exploration. Users can navigate from the landing page to Binary Search, Linear Search, Arrays, or the Language Explorer.

## Run locally

```bash
npm install
npm run dev
```

## Verify a production build

```bash
npm run build
npm run preview
```

## GitHub Pages

The Vite base path is configured for `/BinarySearch/`. Push this repository to `https://github.com/mhsaleemalzayat/BinarySearch`, then open **Settings → Pages** and select **GitHub Actions** as the deployment source. The workflow in `.github/workflows/deploy.yml` builds and deploys the app on pushes to `main`.

Expected site URL: https://mhsaleemalzayat.github.io/BinarySearch/
