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

    githubSince: stats.githubSince

};

const techIcons =
    stats.techStack.join(",");

const projectButtons =
    stats.projects
        .map(project => {

            const badge =
                project.name.replace(/ /g, "%20");

            return `
<a href="${project.url}">
<img src="https://img.shields.io/badge/${badge}-${project.color}?style=for-the-badge&logo=${project.logo}&logoColor=white"/>
</a>`;

        })
        .join("\n");

let readme = template;

readme = readme.replaceAll(
    "{{techStack}}",
    techIcons
);

readme = readme.replaceAll(
    "{{projectButtons}}",
    projectButtons
);

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