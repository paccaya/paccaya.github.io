const { DateTime } = require("luxon");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = async function(eleventyConfig) {
  const clean = (await import("eleventy-plugin-clean")).default;
  await eleventyConfig.addPlugin(clean);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .setZone("America/New_York")
      .toFormat("dd LLL yyyy hh:mm a");
  });

  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return jsToDateTime(dateObj).toISO();
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addCollection("post", function (collectionApi) {
  const posts = collectionApi.getFilteredByGlob("./src/writing/*.html");
  console.log("Collected posts:", posts.length);
  return posts;
  });

  eleventyConfig.addCollection("poetry", function (collectionApi) {
  const poems = collectionApi.getFilteredByGlob("./src/poetry/*.html");
  console.log("Collected poems:", poems.length);
  return poems;
  });

  eleventyConfig.addCollection("books", function (collectionApi) {
  const books = collectionApi.getFilteredByGlob("src/books/**/*.html");

  console.log("Collected books:", books.length);

  return books.sort((a, b) => {
    const dateA = a.data.finished ? new Date(a.data.finished) : 0;
    const dateB = b.data.finished ? new Date(b.data.finished) : 0;

    return dateB - dateA; // newest first
  });
  });

  eleventyConfig.addFilter("truncate", function (str, words = 20) {
    if (!str) return "";
    return str.split(" ").slice(0, words).join(" ") + (str.split(" ").length > words ? "…" : "");
  });

  eleventyConfig.addFilter("strip_html", function (str) {
    return str ? str.replace(/<[^>]*>/g, "") : "";
  });

  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
    }
  });

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "includes",
    },
  };
};
