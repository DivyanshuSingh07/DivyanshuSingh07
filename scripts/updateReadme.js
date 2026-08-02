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
        color: "0A66C2",
        logo: "linkedin"
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

        return `
<a href="${url}" target="_blank">

<img
src="https://img.shields.io/badge/${encodeURIComponent(config.label)}-${config.color}?style=for-the-badge&logo=${config.logo}&logoColor=white"
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