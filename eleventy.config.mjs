import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginRss from "@11ty/eleventy-plugin-rss";
import clean from "eleventy-plugin-clean";

export default async function(eleventyConfig) {
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

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addCollection("post", function (collectionApi) {
  const posts = collectionApi
    .getFilteredByGlob("./src/writing/*.html")
    .filter(post => !post.data.draft);

  console.log("Collected posts:", posts.length);

  return posts;
});

  eleventyConfig.addCollection("poetry", function (collectionApi) {
  const poems = collectionApi.getFilteredByGlob("./src/poetry/*.html");
  console.log("Collected poems:", poems.length);

  return poems;
  });

  eleventyConfig.addCollection("allWriting", function(collectionApi) {
  const posts = collectionApi.getFilteredByGlob("./src/writing/*.html");
  const poems = collectionApi.getFilteredByGlob("./src/poetry/*.html");

  return [...posts, ...poems]
    .filter(item => !item.data.draft)
    .sort((a, b) => b.date - a.date);
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
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/CNAME");
  eleventyConfig.addPassthroughCopy("./src/feed.xsl");

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "includes",
    },
  };
};
