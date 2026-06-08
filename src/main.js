import './style.css'

const SUPABASE_URL = 'https://cxxbuixwdqnxbzcufbwu.supabase.co'
const API_KEY = 'sb_publishable_5FziwtyzC56ZdIQwWjTtnA_G2BmyerF'

document.body.innerHTML = `
<div class="max-w-4xl mx-auto p-6">

  <h1 class="text-4xl font-bold mb-8">
    Lista artykułów
  </h1>

  <div id="articles" class="space-y-6 mb-10"></div>

  <div class="bg-white p-6 rounded shadow">

    <h2 class="text-2xl font-bold mb-4">
      Dodaj artykuł
    </h2>

    <form id="articleForm" class="space-y-4">

      <input
        id="title"
        type="text"
        placeholder="Tytuł"
        class="border p-2 w-full"
        required
      >

      <input
        id="subtitle"
        type="text"
        placeholder="Podtytuł"
        class="border p-2 w-full"
        required
      >

      <input
        id="author"
        type="text"
        placeholder="Autor"
        class="border p-2 w-full"
        required
      >

      <textarea
        id="content"
        placeholder="Treść"
        class="border p-2 w-full"
        rows="5"
        required
      ></textarea>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Dodaj artykuł
      </button>

    </form>

  </div>

</div>
`

const articlesContainer = document.getElementById('articles')

async function loadArticles() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Article?select=*`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`
        }
      }
    )

    const articles = await response.json()

    console.log('Response:', response)
    console.log('Articles:', articles)

    articlesContainer.innerHTML = ''

    articles.forEach(article => {
      articlesContainer.innerHTML += `
        <div class="bg-white p-6 rounded shadow">

          <h2 class="text-2xl font-bold">
            ${article.title}
          </h2>

          <h3 class="text-gray-600">
            ${article.subtitle}
          </h3>

          <p class="text-sm mt-2">
            Autor: ${article.author}
          </p>

          <p class="text-sm">
            Data: ${new Date(article.created_at).toLocaleDateString()}
          </p>

          <p class="mt-4">
            ${article.content}
          </p>

        </div>
      `
    })
  } catch (error) {
    console.error(error)
  }
}

loadArticles()

document
  .getElementById('articleForm')
  .addEventListener('submit', async (e) => {

    e.preventDefault()

    const article = {
      title: document.getElementById('title').value,
      subtitle: document.getElementById('subtitle').value,
      author: document.getElementById('author').value,
      content: document.getElementById('content').value
    }

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/Article`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(article)
        }
      )

      document.getElementById('articleForm').reset()

      loadArticles()
    } catch (error) {
      console.error(error)
    }
  })