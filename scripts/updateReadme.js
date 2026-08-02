const fs = require("fs");
const path = require("path");

// ================================
// Paths
// ================================

const TEMPLATE = path.join(
    __dirname,
    "../templates/README.template.md"
);

const README = path.join(
    __dirname,
    "../README.md"
);

const STATS = path.join(
    __dirname,
    "../data/stats.json"
);

// ================================
// Read Files
// ================================

const template = fs.readFileSync(
    TEMPLATE,
    "utf8"
);

const stats = JSON.parse(
    fs.readFileSync(
        STATS,
        "utf8"
    )
);

// ================================
// Tech Stack
// ================================

const techStack =
    stats.techStack.join(",");

// ================================
// Profile Buttons
// ================================

const profileConfig = {

    portfolio: {
        label: "Portfolio",
        color: "111827",
        logo: "vercel"
    },

   linkedin: {
    label: "LinkedIn",
    badge:
        "https://img.shields.io/badge/LinkedIn-0077b5?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjU2JyBoZWlnaHQ9JzI1NicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSd4TWlkWU1pZCcgdmlld0JveD0nMCAwIDI1NiAyNTYnPjxwYXRoIGQ9J00yMTguMTIzIDIxOC4xMjdoLTM3LjkzMXYtNTkuNDAzYzAtMTQuMTY1LS4yNTMtMzIuNC0xOS43MjgtMzIuNC0xOS43NTYgMC0yMi43NzkgMTUuNDM0LTIyLjc3OSAzMS4zNjl2NjAuNDNoLTM3LjkzVjk1Ljk2N2gzNi40MTN2MTYuNjk0aC41MWEzOS45MDcgMzkuOTA3IDAgMCAxIDM1LjkyOC0xOS43MzNjMzguNDQ1IDAgNDUuNTMzIDI1LjI4OCA0NS41MzMgNTguMTg2bC0uMDE2IDY3LjAxM1pNNTYuOTU1IDc5LjI3Yy0xMi4xNTcuMDAyLTIyLjAxNC05Ljg1Mi0yMi4wMTYtMjIuMDA5LS4wMDItMTIuMTU3IDkuODUxLTIyLjAxNCAyMi4wMDggMjIuMDE2IDEyLjE1Ny0uMDAzIDIyLjAxNCA5Ljg1MSAyMi4wMTYgMjIuMDA4QTIyLjAxMyAyMi4wMTMgMCAwIDEgNTYuOTU1IDc5LjI3bTE4Ljk2NiAxMzguODU4SDM3Ljk1Vjk1Ljk2N2gzNy45N3YxMjIuMTZaTTIzNy4wMzMuMDE4SDE4Ljg5QzguNTgtLjA5OC4xMjUgOC4xNjEtLjAwMSAxOC40NzF2MjE5LjA1M2MuMTIyIDEwLjMxNSA4LjU3NiAxOC41ODIgMTguODkgMTguNDc0aDIxOC4xNDRjMTAuMzM2LjEyOCAxOC44MjMtOC4xMzkgMTguOTY2LTE4LjQ3NFYxOC40NTRjLS4xNDctMTAuMzMtOC42MzUtMTguNTg4LTE4Ljk2Ni0xOC40NTMnIGZpbGw9JyNmZmYnLz48L3N2Zz4K"
},

    medium: {
        label: "Medium",
        color: "12100E",
        logo: "medium"
    },

    twitter: {
        label: "X",
        color: "000000",
        logo: "x"
    }

};

const profileButtons = Object.entries(stats.profiles)
    .map(([key, url]) => {

        const config = profileConfig[key];

        if (!config || !url) {

            return "";

        }

        const badge = config.badge
    ? config.badge
    : `https://img.shields.io/badge/${encodeURIComponent(config.label)}-${config.color}?style=for-the-badge&logo=${config.logo}&logoColor=white`;

return `
<a href="${url}" target="_blank">

<img
src="${badge}"
alt="${config.label}"
/>

</a>`;

    })
    .join("\n");

// ================================
// Template Replacements
// ================================

const replacements = {

    username: stats.username,

    name: stats.name,

    role: stats.role,

    location: stats.location,

    status: stats.status,

    publicRepos: stats.publicRepos,

    followers: stats.followers,

    following: stats.following,

    totalStars: stats.totalStars,

    githubSince: stats.githubSince,

    techStack,

    profileButtons

};

let readme = template;

for (const [key, value] of Object.entries(replacements)) {

    readme = readme.replaceAll(
        `{{${key}}}`,
        String(value)
    );

}

// ================================
// Generate README
// ================================

fs.writeFileSync(
    README,
    readme
);

console.log("README generated successfully!");