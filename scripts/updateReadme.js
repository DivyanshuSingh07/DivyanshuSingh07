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
// Replace Placeholders
// ================================

const replacements = {

    username: stats.username,

    name: stats.name,

    publicRepos: stats.publicRepos,

    followers: stats.followers,

    following: stats.following,

    totalStars: stats.totalStars,

    mostUsedLanguage: stats.mostUsedLanguage,

    latestRepository: stats.latestRepository,

    githubSince: stats.githubSince

};

let readme = template;

for (const [key, value] of Object.entries(replacements)) {

    readme = readme.replaceAll(
        `{{${key}}}`,
        value
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