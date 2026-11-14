import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('reference sites', () => {
  it('reads a Microsoft Learn article\'s text without its metadata, and a hub as a listing of its pages', () => {
    const { parseMicrosoftLearn } = load('microsoft-learn.js', ['parseMicrosoftLearn'])
    visit('https://learn.microsoft.com/en-us/azure/storage/blobs/intro', `<main id="main">
      <div class="content"><h1>Introduction</h1><ul class="metadata"><li>Updated 2026</li></ul></div>
      <div class="content"><p>Blob Storage stores <a href="/en-us/azure/storage/">objects</a>.</p><pre>az storage</pre>
        <section class="feedback-section"><p>Was this page helpful?</p></section></div></main>`)
    expect(parseMicrosoftLearn()).toEqual({
      title: 'Introduction',
      content: ['Blob Storage stores objects.', 'az storage'],
      links: [{ url: 'https://learn.microsoft.com/en-us/azure/storage/', title: 'objects', score: 0.1 }],
    })
    visit('https://learn.microsoft.com/en-us/dotnet/', '<main id="main"><section id="landing-head"></section><a href="/en-us/dotnet/a?tabs=x">A</a><a href="https://github.com/">GitHub</a></main>')
    expect(parseMicrosoftLearn()).toEqual({ listing: true, links: [{ url: 'https://learn.microsoft.com/en-us/dotnet/a', score: 1 }] })
  })
})
