const axios = require("axios").default,
  token =
    process.argv[
      process.argv.findIndex((v) => v == "--token" || v == "-T") + 1
    ];
async function getLatestVersionData(githubRepoUrl) {
  return (
    await axios({
      url: `https://api.github.com/repos/${
        githubRepoUrl.match(/(?<=github.com\/).+?\/[^\n\/]+/gm)[0]
      }/releases`,
      method: "get",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
  ).data;
}
function getLatestZipballUrlFromData(data) {
  return data.zipball_url;
}
function getLatestTarballUrlFromData(data) {
  return data.tarball_url;
}
async function getLatestZipballUrl(repo) {
  const data = (await getLatestVersionData(repo))[0];
  return [data.tag_name, getLatestZipballUrlFromData(data)];
}
async function getLatestTarballUrl(repo) {
  const data = (await getLatestVersionData(repo))[0];
  return [data.tag_name, getLatestTarballUrlFromData(data)];
}
/**
 *
 * @param {string} repo
 * @returns {Promise<[string,Awaited<ReturnType<typeof axios>>]>}
 */
async function getLatestZipball(repo) {
  const url = await getLatestZipballUrl(repo);
  return [
    url[0],
    await axios({ url: url[1], method: "get", responseType: "stream" }),
  ];
}
/**
 *
 * @param {string} repo
 * @returns {Promise<[string,ReturnType<typeof axios>]>}
 */
async function getLatestTarball(repo) {
  const url = await getLatestTarballUrl(repo);
  return [
    url[0],
    await axios({ url: url[1], method: "get", responseType: "stream" }),
  ];
}
module.exports = {
  getLatestVersionData,
  getLatestZipballUrlFromData,
  getLatestTarballUrlFromData,
  getLatestZipballUrl,
  getLatestTarballUrl,
  getLatestZipball,
  getLatestTarball,
};
