// Step 1: Set up a new Node.js project
// Initialize a new project and install the required dependencies:
// $ npm init
// $ npm install express axios xml2js xmlbuilder cheerio

// Step 2: Import required modules
const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const xmlbuilder = require("xmlbuilder");
const cheerio = require("cheerio");

const feeds = require("./feeds");

const app = express();
const port = process.env.PORT || 3123;


// Step 3: Read the RSS feed
async function fetchRSSFeed(url) {
  const response = await axios.get(url);
  const parsedData = await xml2js.parseStringPromise(response.data);
  return parsedData;
}

// Step 4: Extract article links
function extractArticleLinks(parsedData) {
  const links = parsedData.rss.channel[0].item.map((item) => item.link[0]);
  return links;
}

// Step 5: Fetch full article content
async function fetchArticleContent(url, selector) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  // Use the provided selector to match the article content container on the website
  const articleContent = $(selector).html();
  return articleContent;
}

// Step 6: Generate a new RSS feed with the full content
// Step 6: Generate a new RSS feed with the full content
async function createFullContentRSSFeed(originalFeedUrl, selector) {
  const parsedData = await fetchRSSFeed(originalFeedUrl);
  const articleLinks = extractArticleLinks(parsedData);
  const originalTitles = parsedData.rss.channel[0].item.map((item) => item.title[0]);
  const originalDates = parsedData.rss.channel[0].item.map((item) => item.pubDate[0]);
  const originalFeedTitle = parsedData.rss.channel[0].title[0];

  const updatedItems = await Promise.all(
    articleLinks.map(async (link, index) => {
      const content = await fetchArticleContent(link, selector);
      return {
        title: originalTitles[index],
        link: link,
        description: content,
        pubDate: originalDates[index],
      };
    })
  );

  const updatedFeed = xmlbuilder
    .create("rss", { version: "1.0", encoding: "UTF-8" })
    .att("version", "2.0");
  const channel = updatedFeed.ele("channel");
  channel.ele("title", null, originalFeedTitle); // Use the original feed title

  updatedItems.forEach((item) => {
    const entry = channel.ele("item");
    entry.ele("title", null, item.title);
    entry.ele("link", null, item.link);
    entry.ele("description", null, item.description);
    entry.ele("pubDate", null, item.pubDate);
  });

  return updatedFeed.end({ pretty: true });
}

// Modify the route to accept a feed name as a parameter
app.get("/feed/:feedName", async (req, res) => {
  const feedName = req.params.feedName;

  if (!feeds[feedName]) {
    res.status(404).send("Feed not found");
    return;
  }

  const originalFeedUrl = feeds[feedName].url;
  const selector = feeds[feedName].selector;
  const fullContentFeed = await createFullContentRSSFeed(originalFeedUrl, selector);
  res.header("Content-Type", "application/rss+xml");
  res.send(fullContentFeed);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});