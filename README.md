# Personal Portfolio & Project Showcase

A modern, responsive, and lightweight personal portfolio and live GitHub project showcase website for **Devaki Wakode** ([@devaki03](https://github.com/devaki03)).

## 🌟 Features

- **Dynamic GitHub Showcase**: Fetches live public repositories directly from the GitHub REST API (`https://api.github.com/users/devaki03/repos`) with stars, forks, and language tags.
- **Search & Filter**: Real-time filtering by programming language and instant keyword search.
- **Dark / Light Mode**: Theme toggle with persistent preference saved to `localStorage`.
- **Responsive Layout**: Mobile-first architecture built with modern CSS variables, flexbox, and CSS grid.
- **Zero-Build Dependencies**: Runs natively in any web browser without needing Node.js or bundlers.
- **Automated GitHub Synchronization**: Configured to synchronize automatically with `devaki03/my-workspace` on GitHub.

## 📁 Project Structure

```text
my-workspace/
├── index.html        # Main HTML5 semantic page
├── css/
│   └── style.css     # CSS custom properties, themes, responsive layout
├── js/
│   ├── app.js        # GitHub API fetch, search/filter, theme toggling
│   └── projects.js   # Fallback repository catalogue
├── .gitignore        # Excludes secrets, env files, and temporary artifacts
└── README.md         # Project documentation
```

## 🚀 How to View Locally

Simply open `index.html` in your default web browser (Edge, Chrome, Firefox, etc.).

## 🌐 Deploy to GitHub Pages (Free Hosting)

1. Open your repository on GitHub: [devaki03/my-workspace](https://github.com/devaki03/my-workspace)
2. Go to **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select branch: `main` and folder: `/ (root)`.
5. Click **Save**.
6. In a few seconds, your portfolio will be live at:
   `https://devaki03.github.io/my-workspace/`
