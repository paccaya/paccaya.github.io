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
