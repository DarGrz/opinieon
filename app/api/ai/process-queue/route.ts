import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// This endpoint should be called by a cron job (e.g., Vercel Cron)
// Run once daily at 9:00 AM to publish reviews
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceRoleClient()
    const now = new Date()

    // Get pending reviews where review_date has already passed
    // Limit to 2 reviews per day to maintain natural pace
    const { data: pendingReviews, error: fetchError } = await supabase
      .from('review_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('review_date', now.toISOString())
      .order('review_date', { ascending: true })
      .limit(2) // Publish max 2 reviews per day

    if (fetchError) {
      console.error('Error fetching pending reviews:', fetchError)
      throw fetchError
    }

    if (!pendingReviews || pendingReviews.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No reviews to publish',
        processed: 0
      })
    }

    const results = {
      published: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each review
    for (const queueItem of pendingReviews) {
      try {
        // Insert into reviews table
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({
            company_id: queueItem.company_id,
            portal_id: queueItem.portal_id,
            author_name: queueItem.author_name,
            rating: queueItem.rating,
            content: queueItem.content,
            review_date: queueItem.review_date,
            created_at: new Date().toISOString(),
            status: 'published',
            is_verified: false,
            source: 'ai_generated'
          })

        if (insertError) {
          console.error('Error inserting review:', insertError)
          
          // Mark as failed in queue
          await supabase
            .from('review_queue')
            .update({
              status: 'failed',
              error_message: insertError.message
            })
            .eq('id', queueItem.id)

          results.failed++
          results.errors.push(`Failed to publish review ${queueItem.id}: ${insertError.message}`)
          continue
        }

        // Mark as published in queue
        const { error: updateError } = await supabase
          .from('review_queue')
          .update({
            status: 'published',
            published_at: new Date().toISOString()
          })
          .eq('id', queueItem.id)

        if (updateError) {
          console.error('Error updating queue status:', updateError)
        }

        results.published++

      } catch (error: any) {
        console.error('Error processing review:', error)
        results.failed++
        results.errors.push(`Error processing review ${queueItem.id}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      processed: pendingReviews.length,
      published: results.published,
      failed: results.failed,
      errors: results.errors
    })

  } catch (error: any) {
    console.error('Error in queue processor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process queue' },
      { status: 500 }
    )
  }
}
