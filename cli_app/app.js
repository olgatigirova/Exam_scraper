#!/usr/bin/env node

const command = require('commander');
const chalk = require('chalk');
const scraper = require('./scraperClient');

const LEVEL_DEFAULT = 2;

command
  .option('-u, --url <url>', 'URL to search')
  .option('-e, --element <element>', 'Element to search')
  .option('-l, --level <level>', 'Search depth level')
  .option('-d, --delete', 'Delete search request')
  .option('-s, --list', 'Show search history')
  .parse(process.argv);

if (command.list) {
  scraper.searchHistory();
} else {
  if (!command.url) {
    console.log(chalk.red('URL parameter is missed.'));
    process.exit(1);
  }
  if (!command.element) {
    console.log(chalk.red('Element parameter is missed.'));
    process.exit(1);
  }
  if (!command.level) {
    console.log(`Default level ${LEVEL_DEFAULT} is used.`);
    command.level = LEVEL_DEFAULT;
  }

  const request = scraper.generateRequest(command.url, command.element, command.level);
  if (command.delete) {
    scraper.deleteSearchRequest(request);
  } else {
    scraper.getDomElements(request);
  }
}