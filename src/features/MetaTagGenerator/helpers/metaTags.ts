export type MetaFields = {
  pageTitle: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  twitterHandle: string;
};

export function generateMetaTags(fields: MetaFields): string {
  const { pageTitle, description, url, imageUrl, siteName, twitterHandle } = fields;
  const tags = [
    `<!-- Primary Meta Tags -->`,
    `<meta name="title" content="${pageTitle}" />`,
    `<meta name="description" content="${description}" />`,
    ``,
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${pageTitle}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    ``,
    `<!-- Twitter -->`,
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:url" content="${url}" />`,
    `<meta property="twitter:title" content="${pageTitle}" />`,
    `<meta property="twitter:description" content="${description}" />`,
    `<meta property="twitter:image" content="${imageUrl}" />`,
  ];

  if (twitterHandle) {
    tags.push(`<meta property="twitter:site" content="${twitterHandle}" />`);
    tags.push(`<meta property="twitter:creator" content="${twitterHandle}" />`);
  }

  return tags.join('\n');
}
