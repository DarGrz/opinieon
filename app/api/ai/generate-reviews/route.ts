import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { portal_id, company_id, prompt, keywords, count, ratingDistribution } = await request.json()

    if (!portal_id || !company_id || !count) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Define rating instructions based on distribution
    let ratingInstructions = ''
    switch (ratingDistribution) {
      case 'excellent':
        ratingInstructions = '- Wszystkie opinie muszą mieć 5 gwiazdek'
        break
      case 'very-good':
        ratingInstructions = '- 90% opinii: 5 gwiazdek, 10% opinii: 4 gwiazdki'
        break
      case 'good':
        ratingInstructions = '- 60% opinii: 5 gwiazdek, 30% opinii: 4 gwiazdki, 10% opinii: 3 gwiazdki'
        break
      case 'mixed':
        ratingInstructions = '- Różnorodne oceny: głównie 4-5 gwiazdek, czasem 3, rzadko 2'
        break
      default:
        ratingInstructions = '- Oceny: głównie 4-5 gwiazdek, czasem 3'
    }

    // Get API key from environment
    const apiKey = process.env.CLAUDE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Get company name for context (use service role to bypass RLS)
    const supabaseAdmin = createServiceRoleClient()
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('id', company_id)
      .single()

    // Initialize Claude client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Build prompt
    const systemPrompt = `Jesteś ekspertem od tworzenia autentycznych opinii klientów. Twoim zadaniem jest wygenerowanie ${count} różnorodnych opinii o firmie "${company?.name}".

Wytyczne:
${prompt || 'Twórz pozytywne, ale realistyczne opinie.'}

${keywords ? `Słowa kluczowe do uwzględnienia: ${keywords}` : ''}

WAŻNE:
- Każda opinia powinna być unikalna i naturalna
- Używaj polskiego języka
- Długość opinii: 50-200 słów
${ratingInstructions}
- Imiona autorów: polskie imiona i nazwiska
- Styl: naturalny, jak prawdziwy klient

Zwróć TYLKO i wyłącznie poprawny JSON w formacie:
{
  "reviews": [
    {
      "author_name": "Jan Kowalski",
      "rating": 5,
      "content": "Treść opinii..."
    }
  ]
}

Nie dodawaj żadnych innych komentarzy ani tekstu poza JSON.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Wygeneruj ${count} opinii zgodnie z wytycznymi.`
        }
      ],
      system: systemPrompt
    })

    // Parse response
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response format')
    }

    // Extract JSON from response
    let jsonText = content.text.trim()
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    const result = JSON.parse(jsonText)

    if (!result.reviews || !Array.isArray(result.reviews)) {
      throw new Error('Invalid response format')
    }

    // Validate reviews
    const validReviews = result.reviews.filter((r: any) => 
      r.author_name && 
      r.rating >= 1 && 
      r.rating <= 5 && 
      r.content && 
      r.content.length >= 20
    )

    return NextResponse.json({ 
      reviews: validReviews,
      count: validReviews.length
    })

  } catch (error: any) {
    console.error('Error generating reviews:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate reviews' },
      { status: 500 }
    )
  }
}
