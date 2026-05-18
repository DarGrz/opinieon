'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addReview(data: {
    companyId: string;
    portalId: string;
    rating: number;
    title?: string;
    content: string;
    authorName: string;
    authorEmail?: string;
    slug: string;
}) {
    if (!data.companyId || !data.portalId || !data.rating || !data.content || !data.authorName) {
        throw new Error('Missing required fields')
    }

    const supabase = createServiceRoleClient()

    const { error } = await supabase.from('reviews').insert({
        company_id: data.companyId,
        portal_id: data.portalId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        author_name: data.authorName,
        author_email: data.authorEmail,
        status: 'approved' as any
    })

    if (error) {
        console.error('Add review error:', error)
        throw new Error(error.message)
    }

    revalidatePath(`/${data.slug}`)
    return { success: true }
}
