import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  url: string;
  source: string;
  content: string;
  timestamp: string;
}

export class WebScraperService {
  async scrapeNews(sourceUrl: string): Promise<ScrapedArticle[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(sourceUrl, { waitUntil: 'networkidle2' });
    
    const content = await page.content();
    const $ = cheerio.load(content);
    const articles: ScrapedArticle[] = [];

    // Generic scraper logic (can be specialized per domain)
    $('article, .news-item, .post').each((i, el) => {
      const title = $(el).find('h1, h2, h3').first().text().trim();
      const url = $(el).find('a').first().attr('href') || '';
      const summary = $(el).find('p, .summary').first().text().trim();
      
      if (title && url) {
        articles.push({
          title,
          url,
          source: new URL(sourceUrl).hostname,
          content: summary,
          timestamp: new Date().toISOString()
        });
      }
    });

    await browser.close();
    return articles;
  }
}
