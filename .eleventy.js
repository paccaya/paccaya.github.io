const { DateTime } = require("luxon");

module.exports = async function(eleventyConfig) {
  const clean = (await import("eleventy-plugin-clean")).default;
  await eleventyConfig.addPlugin(clean);
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy hh:mm a");
  });

  eleventyConfig.addPassthroughCopy("./src/css");

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

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "docs",
      includes: "includes",
    },
  };
};
