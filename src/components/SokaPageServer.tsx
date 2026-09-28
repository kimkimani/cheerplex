import App from '../App';
import { getMarkdownContent, buildCanonicalUrl } from '../content/markdownLoader';
import { jackpotsData } from '../jackpotsData';
import { defaultExternalLinks } from '../data';
import { getInboundLinks } from '../utils/inboundLinks';

interface CheerplexPageServerProps {
  pageId: string;
  customCanonical?: string;
}

export default async function CheerplexPageServer({ pageId, customCanonical }: CheerplexPageServerProps) {
  const pageMd = getMarkdownContent(pageId);
  const fullCanonicalUrl = buildCanonicalUrl(customCanonical || pageMd.link, pageId);
  const inboundGroup = getInboundLinks(pageId, pageMd.type, pageMd.jackpotId);

  // Preloaded static data for initial render (fast & non-blocking)
  const preloadedJackpots = jackpotsData;
  const preloadedPredictions: any[] = [];

  return (
    <>
      {/* SEO fallback container for bots that ignore JS hydration */}
      <div className="sr-only opacity-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <h2>{pageMd.displayTitle || pageMd.title}</h2>
        <p>{pageMd.description}</p>
        <div>{pageMd.intro}</div>
        <div>{pageMd.meat}</div>
        <div>{pageMd.faq}</div>
        <nav aria-label="Related Inbound Navigation Links">
          <h2>{inboundGroup.sectionTitle}</h2>
          <ul>
            {inboundGroup.links.map((link) => (
              <li key={link.id}>
                <a href={link.url}>{link.title}</a> - {link.description}
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="External Football Links">
          <ul>
            {defaultExternalLinks.map((link) => (
              <li key={`seo-ext-${link.id}`}>
                <a 
                  href={link.url} 
                  rel={link.isDofollow || link.rel === 'dofollow' ? 'noopener' : 'nofollow noopener noreferrer'}
                >
                  {link.anchorText}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Interactive Hydrated React Application */}
      <App 
        initialPage={pageId} 
        initialJackpotId={pageId} 
        initialPredictions={preloadedPredictions} 
        initialJackpots={preloadedJackpots} 
      />
    </>
  );
}

export const SokaPageServer = CheerplexPageServer;

