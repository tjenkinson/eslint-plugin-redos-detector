const micromatch = require('micromatch');
const prettier = require('prettier');

const addQuotes = (a) => `"${a}"`;

module.exports = async (allStagedFiles) => {
  const prettierSupportedExtensions = (
    await prettier.getSupportInfo()
  ).languages
    .map(({ extensions }) => extensions)
    .flat();

  const prettierFiles = micromatch(
    allStagedFiles,
    prettierSupportedExtensions.map((extension) => `**/*${extension}`),
  );
  return prettierFiles.length
    ? [`prettier --write ${prettierFiles.map(addQuotes).join(' ')}`]
    : [];
};
