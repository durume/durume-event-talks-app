const fs = require('fs');
const path = require('path');

const projectRoot = __dirname; // Current directory is the project root

const htmlFilePath = path.join(projectRoot, 'index.html');
const cssFilePath = path.join(projectRoot, 'style.css');
const jsFilePath = path.join(projectRoot, 'script.js');
const outputDir = path.join(projectRoot, 'dist');
const outputFilePath = path.join(outputDir, 'index.html');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');

    // Inline CSS and JS
    const finalHtml = htmlContent
        .replace('<style id="inlined-css"></style>', `<style>${cssContent}</style>`)
        .replace('<script id="inlined-js"></script>', `<script>${jsContent}</script>`);

    fs.writeFileSync(outputFilePath, finalHtml, 'utf8');
    console.log(`Successfully bundled website to ${outputFilePath}`);
} catch (error) {
    console.error('Error during bundling:', error);
}
