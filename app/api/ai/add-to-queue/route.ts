import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// Helper function to generate random review_date from the past
// Each review gets a unique day to ensure max ~2 reviews per day
function generateReviewDate(index: number): Date {
  const now = new Date()
  
  // Each opinion gets a different day: 
  // index 0,1 -> 1-2 days ago
  // index 2,3 -> 3-4 days ago
  // index 4,5 -> 5-6 days ago, etc.
  const dayGroup = Math.floor(index / 2) // 0,1->0, 2,3->1, 4,5->2
  const daysAgo = (dayGroup * 2) + 1 + (index % 2) // +1 or +2 within group
  
  const reviewDate = new Date(now)
  reviewDate.setDate(reviewDate.getDate() - daysAgo)
  
  // Random hour between 9-21
  const randomHour = Math.floor(Math.random() * 13) + 9
  const randomMinute = Math.floor(Math.random() * 60)
  
  reviewDate.setHours(randomHour, randomMinute, 0, 0)
  
  return reviewDate
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reviews } = await request.json()

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews provided' }, { status: 400 })
    }

    // Prepare queue items with review dates from the past
    const queueItems = reviews.map((review, index) => {
      const reviewDate = generateReviewDate(index)
      
      return {
        user_id: user.id,
        company_id: review.company_id,
        portal_id: review.portal_id,
        author_name: review.author_name,
        rating: review.rating,
        content: review.content,
        review_date: reviewDate.toISOString(),
        generation_prompt: review.generation_prompt,
        status: 'pending' as const
      }
    })

    // Insert into queue (use service role to bypass RLS)
    const supabaseAdmin = createServiceRoleClient()
    const { data, error } = await supabaseAdmin
      .from('review_queue')
      .insert(queueItems)
      .select()

    if (error) {
      console.error('Error inserting to queue:', error)
      throw error
    }

    return NextResponse.json({ 
      success: true,
      count: data.length,
      items: data
    })

  } catch (error: any) {
    console.error('Error adding to queue:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add to queue' },
      { status: 500 }
    )
  }
}
