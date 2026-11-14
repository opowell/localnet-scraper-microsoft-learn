// What a Learn article shows that is not its text: its metadata (date, contributors), the feedback and "was this
// page helpful" sections, its buttons and what is hidden.
const LEARN_SKIP = '.metadata, .page-metadata, #article-header, [data-bi-name="feedback-section"], .feedback-section, #assertive-live-region, [hidden], .visually-hidden, button, .action-container'

// An article (/en-us/azure/storage/blobs/storage-blobs-introduction) reads as its title (<h1>) and the paragraphs,
// headings, list items, code blocks, pictures and table rows of its text (main#main's .content), without its metadata
// and feedback sections, linking with weight 0.1 to each page its text links to. A landing or hub page, built of
// cards (section#landing-head, .hubpage), is a listing of each of the site's pages it links to.
function parseMicrosoftLearn(_profileId) {
  if (location.hostname !== 'learn.microsoft.com') {
    return null
  }
  const main = document.querySelector('main#main')
  if (!main) {
    return null
  }
  if (main.querySelector('section#landing-head, .hubpage, [data-bi-name="hub-page"]')) {
    const here = location.href.split(/[?#]/)[0]
    return listingOf(Array.from(main.querySelectorAll('a[href]'), a => a.href.split(/[?#]/)[0])
      .filter(url => url !== here && url.startsWith('https://learn.microsoft.com/'))) ?? { listing: true }
  }
  const parts = Array.from(main.querySelectorAll('.content')).filter(part => !part.parentElement.closest('.content'))
  const title = main.querySelector('h1')?.innerText.trim()
  const content = parts.flatMap(part => textBlocks(part, { lists: true, tables: true, skip: `h1, ${LEARN_SKIP}` }))
  if (!title || !content.length) {
    return null
  }
  return { title, content, links: contentLinks(parts, { skip: LEARN_SKIP }) }
}

// The parser a scrape calls.
registerParser(parseMicrosoftLearn)
