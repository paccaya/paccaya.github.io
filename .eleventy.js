const { DateTime } = require("luxon");
const eleventyGoogleFonts = require("eleventy-google-fonts");

module.exports = async function(eleventyConfig) {
  const clean = (await import("eleventy-plugin-clean")).default;
  await eleventyConfig.addPlugin(clean);
}

module.exports = function (eleventyConfig) {
  // Fix addDateParsing to handle various date formats
  eleventyConfig.addDateParsing((dateValue) => {
    if (!dateValue) {
      return new Date(); // Default to current date if undefined
    }

    if (typeof dateValue === "string") {
      return DateTime.fromISO(dateValue).toJSDate();
    }

    return dateValue; // Return as-is if it's already a Date object
  });

  // Add readableDate filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "No date"; // Prevents errors
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d, yyyy");
  });

   eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: 'html',    // Apply to .html files
    formats: ['avif', 'webp', null], // Create images in AVIF, WebP, or original format
    widths: [640, 928],     // Generate images in these widths
    defaultAttributes: {
      loading: 'lazy',      // Enable lazy loading
      sizes: '100vw',       // Set sizes to 100% of the viewport width
      decoding: 'async',    // Enable async decoding
    },
  });

  eleventyConfig.addPlugin(eleventyGoogleFonts);


  // Passthrough copies
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/files");
  eleventyConfig.addPassthroughCopy("./src/.nojekyll");

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
  };
};

const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
