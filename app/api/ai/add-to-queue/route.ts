import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// Helper function to get dates that already have reviews
async function getExistingReviewDates(company_id: string, supabaseAdmin: any): Promise<Map<string, number>> {
  // Get dates from published reviews
  const { data: existingReviews } = await supabaseAdmin
    .from('reviews')
    .select('review_date')
    .eq('company_id', company_id)

  // Get dates from queue
  const { data: queuedReviews } = await supabaseAdmin
    .from('review_queue')
    .select('review_date')
    .eq('company_id', company_id)
    .eq('status', 'pending')

  // Count reviews per day (without time)
  const dateCount = new Map<string, number>()
  
  const allDates = [
    ...(existingReviews?.map((r: any) => r.review_date) || []),
    ...(queuedReviews?.map((r: any) => r.review_date) || [])
  ]

  allDates.forEach(dateStr => {
    const date = new Date(dateStr)
    const dayKey = date.toISOString().split('T')[0] // YYYY-MM-DD
    dateCount.set(dayKey, (dateCount.get(dayKey) || 0) + 1)
  })

  return dateCount
}

// Helper function to find next available date with < 2 reviews
function findAvailableDate(existingDates: Map<string, number>, startDaysAgo: number): Date {
  let daysAgo = startDaysAgo
  
  // Look for a day with less than 2 reviews
  while (daysAgo < 365) { // Max 1 year back
    const testDate = new Date()
    testDate.setDate(testDate.getDate() - daysAgo)
    const dayKey = testDate.toISOString().split('T')[0]
    
    const count = existingDates.get(dayKey) || 0
    if (count < 2) {
      // Found available day
      const randomHour = Math.floor(Math.random() * 13) + 9 // 9-21
      const randomMinute = Math.floor(Math.random() * 60)
      testDate.setHours(randomHour, randomMinute, 0, 0)
      
      // Mark this day as used for subsequent reviews in same batch
      existingDates.set(dayKey, count + 1)
      
      return testDate
    }
    
    daysAgo++
  }
  
  // Fallback - should not happen
  const fallback = new Date()
  fallback.setDate(fallback.getDate() - daysAgo)
  return fallback
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

    // Get company_id from first review (all should have same company_id)
    const company_id = reviews[0]?.company_id
    if (!company_id) {
      return NextResponse.json({ error: 'Missing company_id' }, { status: 400 })
    }

    // Use service role to bypass RLS
    const supabaseAdmin = createServiceRoleClient()

    // Get existing review dates to avoid exceeding 2 reviews per day
    const existingDates = await getExistingReviewDates(company_id, supabaseAdmin)

    // Prepare queue items with review dates from the past
    const queueItems = reviews.map((review, index) => {
      // Start looking from 1 day ago, then 2, then 3, etc.
      const startDaysAgo = index + 1
      const reviewDate = findAvailableDate(existingDates, startDaysAgo)
      
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

    // Insert into queue
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
