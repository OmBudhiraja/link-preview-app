import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';
import { isValidUrl } from '../../util/isValidUrl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    res.status(400).json({ error: 'Please enter a valid url' });
    return;
  }

  try {
    let contentType: string | null;

    const urlResponse = await fetch(url);
    const data = await urlResponse.text();
    contentType = urlResponse.headers.get('content-type');

    console.log(urlResponse);

    if (contentType && contentType.includes('text/html')) {
      const $ = cheerio.load(data);

      const metaTags = $('meta');
      const result: { [key: string]: string } = {};

      metaTags.each((i, el) => {
        const metaProperty = $(el).attr('property');

        if (metaProperty && metaProperty.startsWith('og:')) {
          const property = metaProperty.replace('og:', '');
          result[property] = $(el).attr('content') ?? '';
        }
      });

      if (!result.title) {
        result.title = $('title').text() ?? '';
      }

      if (!result.description) {
        result.description = $('meta[name="description"]').attr('content') ?? '';
      }

      if (!result.image) {
        console.log($('link[rel="icon"]').get(1));
        result.image = $('link[rel="icon"]').last().attr('href') ?? '';
      }

      if (!result.url) {
        result.url = url;
      }

      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'Not a valid URL' });
    }
  } catch (err) {
    console.log('something broke', err);

    res.status(400).json({ error: 'Could not fetch any data from URL' });
  }
}
