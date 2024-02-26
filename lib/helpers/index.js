const micromatch = require("micromatch");
const path = require("path");

function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function getIsIgnoredFile(ignoreFilesPatterns, currentFilePath) {
    return ignoreFilesPatterns.some(ignorePattern => micromatch.isMatch(currentFilePath, ignorePattern));
}

function getNormalizedCurrentPath(currentFilePath) {
    const normalizedPath = currentFilePath.replace(/\\/g, '/');
    return normalizedPath.split('src')[1];
}

function getRelativePath(from, to) {
    let relativePath = path.relative(from, `/${to}`);
    if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`
    }

    return relativePath;
}

function getCurrentFileLayer(currentFilePath) {
    const projectPath = getNormalizedCurrentPath(currentFilePath);
    const segments = projectPath?.split('/')

    return segments?.[1];
}

function getCurrentFileSlice(currentFilePath) {
    const projectPath = getNormalizedCurrentPath(currentFilePath)
    const segments = projectPath?.split('/')

    return segments?.[2];
}

module.exports = {
    isPathRelative,
    getIsIgnoredFile,
    getNormalizedCurrentPath,
    getRelativePath,
    getCurrentFileLayer,
    getCurrentFileSlice,
}
