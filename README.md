# Full Content RSS

This repository contains a Node.js application that generates full-content RSS feeds by fetching and parsing existing RSS feeds and extracting the full article content from the corresponding web pages.

## Features

- Fetches and parses existing RSS feeds
- Extracts full article content from web pages using CSS selectors
- Generates a new full-content RSS feed in XML format
- Supports multiple feed sources

## Installation

1. Clone this repository:

```bash
git clone https://github.com/petrismt/full-content-rss.git
```


2.  Navigate to the project directory:

```bash
cd full-content-rss
```

3.  Install the required dependencies:

```bash
npm install
```

## Usage

### Add or update the feeds in the feeds.js file:

``` javascript

// feeds.js
const feeds = {
  maroelamedia: {
    url: "https://maroelamedia.co.za/kategorie/nuus/feed",
    selector: "div.wprt-container",
  },
  // Add more feeds here, for example:
  // examplefeed: {
  //   url: "https://example.com/rss",
  //   selector: "div.example-content",
  // },
};

module.exports = feeds;
```

### Start the server:

```bash
npm start
```

### Access the full-content RSS feed by visiting the following URL in your browser or RSS reader:

``` bash
http://localhost:3123/feed/feedName
```

Replace feedName with the name of the feed you want to access, as defined in the feeds.js file.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.


## License

This project is licensed under the MIT License - see the LICENSE file for details.