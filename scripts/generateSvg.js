require("dotenv").config();

const fs = require("fs");
const path = require("path");

// =============================================
// Configuration
// =============================================

const CONFIG = {
    username: process.env.GITHUB_USERNAME || "GitHub",

    fontFamily: "Consolas, Monaco, 'Courier New', monospace",

    fontSize: 16,

    lineHeight: 22,

    padding: 40,

    titleBarHeight: 52,

    footerHeight: 90,

    borderRadius: 14,

    terminalPadding: 12,

    background: "#0D1117",

    terminalBackground: "#161B22",

    borderColor: "#30363D",

    titleColor: "#8B949E",

    footerColor: "#C9D1D9"
};

// =============================================
// File Paths
// =============================================

const INPUT = path.join(
    __dirname,
    "../assets/face.txt"
);

const OUTPUT = path.join(
    __dirname,
    "../assets/animated-face.svg"
);

// =============================================
// Read ASCII File
// =============================================

function readAscii() {

    if (!fs.existsSync(INPUT)) {

        throw new Error("face.txt not found.");

    }

    return fs
        .readFileSync(INPUT, "utf8")
        .replace(/\r/g, "")
        .split("\n");

}

// =============================================
// Calculate SVG Dimensions
// =============================================

function calculateDimensions(ascii) {

    const longestLine = Math.max(
        ...ascii.map(line => line.length)
    );

    const width =
        longestLine * 10 +
        CONFIG.padding * 2;

    const portraitHeight =
        ascii.length *
        CONFIG.lineHeight;

    const height =
        CONFIG.titleBarHeight +
        portraitHeight +
        CONFIG.footerHeight +
        CONFIG.padding * 2;

    return {

        width,

        height,

        portraitHeight,

        longestLine

    };

}

// =============================================
// SVG Definitions
// =============================================

function createDefinitions() {

    return `

<defs>

<linearGradient
id="asciiGradient"
x1="0%"
y1="0%"
x2="100%"
y2="0%"
>

<animate
attributeName="x1"
values="-100%;100%;-100%"
dur="12s"
repeatCount="indefinite"
/>

<animate
attributeName="x2"
values="0%;200%;0%"
dur="12s"
repeatCount="indefinite"
/>

<stop
offset="0%"
stop-color="#00F5FF"
>

<animate
attributeName="stop-color"
values="
#00F5FF;
#6A5CFF;
#FF4FD8;
#00FF9C;
#00F5FF"
dur="10s"
repeatCount="indefinite"
/>

</stop>

<stop
offset="100%"
stop-color="#6A5CFF"
>

<animate
attributeName="stop-color"
values="
#6A5CFF;
#FF4FD8;
#00FF9C;
#00F5FF;
#6A5CFF"
dur="10s"
repeatCount="indefinite"
/>

</stop>

</linearGradient>

<filter id="glow">

<feGaussianBlur
stdDeviation="2.2"
result="blur"
/>

<feMerge>

<feMergeNode in="blur"/>

<feMergeNode in="SourceGraphic"/>

</feMerge>

</filter>

</defs>

`;

}

// =============================================
// Window
// =============================================

function createWindow(width, height) {

    return `

<rect
width="100%"
height="100%"
fill="${CONFIG.background}"
/>

<rect
x="${CONFIG.terminalPadding}"
y="${CONFIG.terminalPadding}"
width="${width - CONFIG.terminalPadding * 2}"
height="${height - CONFIG.terminalPadding * 2}"
rx="${CONFIG.borderRadius}"
fill="${CONFIG.terminalBackground}"
stroke="${CONFIG.borderColor}"
/>

`;

}

// =============================================
// Title Bar
// =============================================

function createTitleBar(width) {

    return `

<circle
cx="32"
cy="36"
r="6"
fill="#FF5F56"
/>

<circle
cx="52"
cy="36"
r="6"
fill="#FFBD2E"
/>

<circle
cx="72"
cy="36"
r="6"
fill="#27C93F"
/>

<text
x="92"
y="41"
font-family="${CONFIG.fontFamily}"
font-size="14"
fill="${CONFIG.titleColor}"
>

terminal://${CONFIG.username}

</text>

<line
x1="${CONFIG.terminalPadding}"
y1="${CONFIG.titleBarHeight}"
x2="${width - CONFIG.terminalPadding}"
y2="${CONFIG.titleBarHeight}"
stroke="${CONFIG.borderColor}"
/>

`;

}

// =============================================
// ASCII Portrait
// =============================================

function createAscii(ascii) {

    const text = ascii
        .map((line, index) => {

            return `

<tspan
x="${CONFIG.padding}"
dy="${index === 0 ? 0 : CONFIG.lineHeight}"
>

${line}

</tspan>

`;

        })
        .join("");

    return `

<text
x="${CONFIG.padding}"
y="${CONFIG.titleBarHeight + 30}"
font-family="${CONFIG.fontFamily}"
font-size="${CONFIG.fontSize}"
fill="url(#asciiGradient)"
filter="url(#glow)"
xml:space="preserve"
>

${text}

</text>

`;

}

// =============================================
// Footer
// =============================================

function createFooter(width, height) {

    const footerTop =
        height - CONFIG.footerHeight;

    return `

<line
x1="${CONFIG.terminalPadding}"
y1="${footerTop}"
x2="${width - CONFIG.terminalPadding}"
y2="${footerTop}"
stroke="${CONFIG.borderColor}"
/>

<text
x="${CONFIG.padding}"
y="${footerTop + 28}"
font-family="${CONFIG.fontFamily}"
font-size="15"
fill="${CONFIG.footerColor}"
>

&gt; status : online

</text>

<text
x="${CONFIG.padding}"
y="${footerTop + 52}"
font-family="${CONFIG.fontFamily}"
font-size="15"
fill="${CONFIG.footerColor}"
>


&gt; profile: github

</text>

`;

}

// =============================================
// Build SVG
// =============================================

function buildSvg(ascii) {

    const {
        width,
        height
    } = calculateDimensions(ascii);

    return `

<svg
xmlns="http://www.w3.org/2000/svg"
width="${width}"
height="${height}"
viewBox="0 0 ${width} ${height}"
>

${createDefinitions()}

${createWindow(width, height)}

${createTitleBar(width)}

${createAscii(ascii)}

${createFooter(width, height)}

</svg>

`;

}

// =============================================
// Write SVG
// =============================================

function writeSvg(svg) {

    fs.writeFileSync(
        OUTPUT,
        svg,
        "utf8"
    );

}

// =============================================
// Main
// =============================================

function main() {

    console.log("");

    console.log(
        "Reading face.txt..."
    );

    const ascii =
        readAscii();

    console.log(
        "Calculating layout..."
    );

    console.log(
        "Building SVG..."
    );

    const svg =
        buildSvg(ascii);

    console.log(
        "Writing animated-face.svg..."
    );

    writeSvg(svg);

    console.log("");

    console.log(
        "✔ SVG generated successfully!"
    );

    console.log(
        `Location: ${OUTPUT}`
    );

    console.log("");

}

main();






// const fs = require("fs");
// const path = require("path");

// const INPUT = path.join(
//     __dirname,
//     "../assets/face.txt"
// );

// const OUTPUT = path.join(
//     __dirname,
//     "../assets/animated-face.svg"
// );

// const ascii = fs
//     .readFileSync(INPUT, "utf-8")
//     .split("\n");

// const longestLine = Math.max(
//     ...ascii.map((line) => line.length)
// );

// const USERNAME = "DivyanshuSingh07";


// const fontSize = 16;
// const lineHeight = 22;
// const padding = 40;

// const width =
//     longestLine * 10 +
//     padding * 2;

// const height =
//     ascii.length *
//     lineHeight +
//     120;

// const asciiText = ascii
//     .map(
//         (line, index) => `
// <tspan
//     x="${padding}"
//     dy="${index === 0 ? 0 : lineHeight}"
// >
// ${line}
// </tspan>
// `
//     )
//     .join("");

// const svg = `
// <svg
// xmlns="http://www.w3.org/2000/svg"
// width="${width}"
// height="${height}"
// viewBox="0 0 ${width} ${height}"
// >

// <defs>

//     <linearGradient
//         id="gradient"
//         x1="0%"
//         y1="0%"
//         x2="100%"
//         y2="0%"
//     >

//         <animate
//             attributeName="x1"
//             values="-100%;100%;-100%"
//             dur="8s"
//             repeatCount="indefinite"
//         />

//         <animate
//             attributeName="x2"
//             values="0%;200%;0%"
//             dur="8s"
//             repeatCount="indefinite"
//         />

//         <stop offset="0%" stop-color="#00F5FF">
//             <animate
//                 attributeName="stop-color"
//                 values="
//                 #00F5FF;
//                 #6A5CFF;
//                 #FF4FD8;
//                 #00FF9C;
//                 #00F5FF"
//                 dur="10s"
//                 repeatCount="indefinite"
//             />
//         </stop>

//         <stop offset="100%" stop-color="#6A5CFF">
//             <animate
//                 attributeName="stop-color"
//                 values="
//                 #6A5CFF;
//                 #FF4FD8;
//                 #00FF9C;
//                 #00F5FF;
//                 #6A5CFF"
//                 dur="10s"
//                 repeatCount="indefinite"
//             />
//         </stop>

//     </linearGradient>

//     <filter id="glow">

//         <feGaussianBlur
//             stdDeviation="2"
//             result="blur"
//         />

//         <feMerge>
//             <feMergeNode in="blur"/>
//             <feMergeNode in="SourceGraphic"/>
//         </feMerge>

//     </filter>

// </defs>

// <!-- Background -->

// <rect
//     width="100%"
//     height="100%"
//     fill="#090B10"
// />

// <!-- Terminal -->

// <rect
//     x="10"
//     y="10"
//     width="${width - 20}"
//     height="${height - 20}"
//     rx="12"
//     fill="#161B22"
//     stroke="#30363D"
// />

// <!-- Window Controls -->

// <circle
//     cx="30"
//     cy="30"
//     r="6"
//     fill="#FF5F56"
// />

// <circle
//     cx="50"
//     cy="30"
//     r="6"
//     fill="#FFBD2E"
// />

// <circle
//     cx="70"
//     cy="30"
//     r="6"
//     fill="#27C93F"
// />

// <!-- Title -->

// <text
//     x="90"
//     y="35"
//     font-family="monospace"
//     font-size="14"
//     fill="#8B949E"
// >
// terminal://${USERNAME}
// </text>

// <!-- ASCII -->

// <text
//     x="${padding}"
//     y="70"
//     font-family="monospace"
//     font-size="${fontSize}"
//     fill="url(#gradient)"
//     filter="url(#glow)"
//     xml:space="preserve"
// >
// ${asciiText}
// </text>

// </svg>
// `;

// fs.writeFileSync(
//     OUTPUT,
//     svg
// );

// console.log(
//     "Animated SVG Generated!"
// );




// const fs = require("fs");
// const path = require("path");

// const INPUT = path.join(
//     __dirname,
//     "../assets/face.txt"
// );

// const OUTPUT = path.join(
//     __dirname,
//     "../assets/animated-face.svg"
// );

// // Read ASCII lines
// const ascii = fs
//     .readFileSync(INPUT, "utf-8")
//     .split("\n");

// // Find longest line
// const longestLine = Math.max(
//     ...ascii.map((line) => line.length)
// );

// // Configuration
// const fontSize = 16;
// const lineHeight = 22;
// const padding = 40;

// // Dynamic dimensions
// const width = longestLine * 10 + padding * 2;

// const height =
//     ascii.length * lineHeight + 120;

// // Generate tspans
// const asciiText = ascii
//     .map(
//         (line, index) => `
// <tspan
//     x="${padding}"
//     dy="${index === 0 ? 0 : lineHeight}"
// >
// ${line}
// </tspan>`
//     )
//     .join("");

// // Generate SVG
// const svg = `
// <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="${width}"
//     height="${height}"
//     viewBox="0 0 ${width} ${height}"
// >

//     <!-- Background -->
//     <rect
//         width="100%"
//         height="100%"
//         fill="#090B10"
//     />

//     <!-- Terminal Window -->
//     <rect
//         x="10"
//         y="10"
//         width="${width - 20}"
//         height="${height - 20}"
//         rx="12"
//         fill="#161B22"
//         stroke="#30363D"
//     />

//     <!-- Window Controls -->
//     <circle
//         cx="30"
//         cy="30"
//         r="6"
//         fill="#FF5F56"
//     />

//     <circle
//         cx="50"
//         cy="30"
//         r="6"
//         fill="#FFBD2E"
//     />

//     <circle
//         cx="70"
//         cy="30"
//         r="6"
//         fill="#27C93F"
//     />

//     <!-- Terminal Title -->
//     <text
//         x="90"
//         y="35"
//         font-family="monospace"
//         font-size="14"
//         fill="#8B949E"
//     >
//         terminal://DivyanshuSingh07
//     </text>

//     <!-- ASCII Face -->
//     <text
//         x="${padding}"
//         y="70"
//         font-family="monospace"
//         font-size="${fontSize}"
//         fill="#00F5FF"
//         xml:space="preserve"
//     >
//         ${asciiText}
//     </text>

// </svg>
// `;

// fs.writeFileSync(
//     OUTPUT,
//     svg
// );

// console.log(
//     "SVG Generated Successfully!"
// );