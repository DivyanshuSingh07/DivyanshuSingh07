require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ================================
// Configuration
// ================================

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const OUTPUT = path.join(
    __dirname,
    "../data/stats.json"
);

// ================================
// Validation
// ================================

if (!GITHUB_USERNAME) {
    console.error("❌ Missing GITHUB_USERNAME in .env");
    process.exit(1);
}

if (!GITHUB_TOKEN) {
    console.error("❌ Missing GITHUB_TOKEN in .env");
    process.exit(1);
}

console.log("==================================");
console.log("GitHub Username :", GITHUB_USERNAME);
console.log("Token Loaded    :", "✅");
console.log("==================================");

// ================================
// Fetch Stats
// ================================

async function fetchStats() {
    try {

        // ----------------------------
        // User Information
        // ----------------------------

        const userResponse = await axios.get(
            `https://api.github.com/users/${GITHUB_USERNAME}`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        // ----------------------------
        // Repository Information
        // ----------------------------

        const reposResponse = await axios.get(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        const user = userResponse.data;
        const repos = reposResponse.data;

        // ----------------------------
        // Calculate Total Stars
        // ----------------------------

        let totalStars = 0;

        // ----------------------------
        // Count Languages
        // ----------------------------

        const languageCount = {};

        repos.forEach((repo) => {

            totalStars += repo.stargazers_count;

            if (repo.language) {

                languageCount[repo.language] =
                    (languageCount[repo.language] || 0) + 1;

            }

        });

        // ----------------------------
        // Most Used Language
        // ----------------------------

        let mostUsedLanguage = "Unknown";

        if (Object.keys(languageCount).length > 0) {

            mostUsedLanguage = Object.entries(languageCount)
                .sort((a, b) => b[1] - a[1])[0][0];

        }

        // ----------------------------
        // Latest Repository
        // ----------------------------

        const latestRepo = [...repos]
            .sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            )[0];

        // ----------------------------
        // Create Stats Object
        // ----------------------------

        const stats = {

            username: user.login,

            name: user.name,

            publicRepos: user.public_repos,

            followers: user.followers,

            following: user.following,

            totalStars,

            mostUsedLanguage,

            latestRepository: latestRepo
                ? latestRepo.name
                : "None",

            githubSince:
                new Date(user.created_at).getFullYear(),

            profileUrl: user.html_url,

            avatar: user.avatar_url

        };

        // ----------------------------
        // Save JSON
        // ----------------------------

        fs.writeFileSync(
            OUTPUT,
            JSON.stringify(stats, null, 4)
        );

        console.log("\n✅ Stats generated successfully!");
        console.log(`📄 Saved to ${OUTPUT}`);

    }
    catch (error) {

        console.error("\n❌ Failed to fetch GitHub data\n");

        if (error.response) {

            console.error(error.response.status);
            console.error(error.response.data);

        }
        else {

            console.error(error.message);

        }

    }
}

fetchStats();