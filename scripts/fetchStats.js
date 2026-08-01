require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ======================================================
// Configuration
// ======================================================

const CONFIG = {

    username:
        process.env.GITHUB_USERNAME,

    token:
        process.env.GITHUB_TOKEN,

    output:
        path.join(
            __dirname,
            "../data/stats.json"
        )

};

// ======================================================
// Validation
// ======================================================

if (!CONFIG.username) {

    console.error(
        "❌ Missing GITHUB_USERNAME in .env"
    );

    process.exit(1);

}

if (!CONFIG.token) {

    console.error(
        "❌ Missing GITHUB_TOKEN in .env"
    );

    process.exit(1);

}

console.log("");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

console.log(
    "Fetching GitHub Statistics"
);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

console.log("");

console.log(
    `Username : ${CONFIG.username}`
);

console.log(
    "Token    : Loaded"
);

console.log("");

// ======================================================
// Read Existing stats.json
// ======================================================

function readExistingStats() {

    if (
        !fs.existsSync(CONFIG.output)
    ) {

        return {};

    }

    try {

        return JSON.parse(

            fs.readFileSync(
                CONFIG.output,
                "utf8"
            )

        );

    }

    catch {

        return {};

    }

}

// ======================================================
// Fetch GitHub Data
// ======================================================

async function fetchGitHubData() {

    const headers = {

        Authorization:
            `Bearer ${CONFIG.token}`,

        Accept:
            "application/vnd.github+json"

    };

    //------------------------------------------
    // User
    //------------------------------------------

    const userResponse =
        await axios.get(

            `https://api.github.com/users/${CONFIG.username}`,

            { headers }

        );

    //------------------------------------------
    // Repositories
    //------------------------------------------

    const repoResponse =
        await axios.get(

            `https://api.github.com/users/${CONFIG.username}/repos?per_page=100`,

            { headers }

        );

    return {

        user:
            userResponse.data,

        repos:
            repoResponse.data

    };

}

// ======================================================
// Calculate Statistics
// ======================================================

function buildGitHubStats(user, repos) {

    //------------------------------------------
    // Total Stars
    //------------------------------------------

    let totalStars = 0;

    repos.forEach(repo => {

        totalStars +=
            repo.stargazers_count;

    });

    //------------------------------------------
    // Latest Repository
    //------------------------------------------

    const latestRepository =

        repos.length === 0

            ? "None"

            : [...repos]

                .sort(

                    (a, b) =>

                        new Date(b.created_at) -

                        new Date(a.created_at)

                )[0].name;

    //------------------------------------------

    return {

        username:
            user.login,

        name:
            user.name,

        publicRepos:
            user.public_repos,

        followers:
            user.followers,

        following:
            user.following,

        totalStars,

        latestRepository,

        githubSince:
            new Date(
                user.created_at
            ).getFullYear(),

        profileUrl:
            user.html_url,

        avatar:
            user.avatar_url

    };

}

// ======================================================
// Save
// ======================================================

function saveStats(stats) {

    fs.writeFileSync(

        CONFIG.output,

        JSON.stringify(
            stats,
            null,
            4
        )

    );

}

// ======================================================
// Main
// ======================================================

async function main() {

    try {

        //--------------------------------------
        // Preserve custom fields
        //--------------------------------------

        const existingStats =
            readExistingStats();

        //--------------------------------------
        // Fetch GitHub
        //--------------------------------------

        console.log(
            "✔ Fetching user..."
        );

        const {

            user,

            repos

        } = await fetchGitHubData();

        //--------------------------------------
        // Build new GitHub stats
        //--------------------------------------

        const githubStats =
            buildGitHubStats(
                user,
                repos
            );

        //--------------------------------------
        // Merge
        //--------------------------------------

        const finalStats = {

            ...existingStats,

            ...githubStats

        };

        //--------------------------------------
        // Save
        //--------------------------------------

        saveStats(
            finalStats
        );

        console.log("");

        console.log(
            "✔ stats.json updated successfully"
        );

        console.log("");

        console.log(
            `Repositories : ${githubStats.publicRepos}`
        );

        console.log(
            `Followers    : ${githubStats.followers}`
        );

        console.log(
            `Following    : ${githubStats.following}`
        );

        console.log(
            `Stars        : ${githubStats.totalStars}`
        );

        console.log(
            `Latest Repo  : ${githubStats.latestRepository}`
        );

        console.log("");

    }

    catch (error) {

        console.log("");

        console.error(
            "❌ Failed to fetch GitHub data"
        );

        console.log("");

        if (error.response) {

            console.error(
                error.response.status
            );

            console.error(
                error.response.data
            );

        }

        else {

            console.error(
                error.message
            );

        }

        process.exit(1);

    }

}

// ======================================================

main();