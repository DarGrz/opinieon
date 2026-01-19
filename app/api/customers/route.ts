import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/**
 * API to receive customer data after a purchase.
 * Example Body:
 * {
 *   "company_id": "...",
 *   "email": "jan@example.com",
 *   "first_name": "Jan",
 *   "product": "Szafka",
 *   "order_id": "123"
 * }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { company_id, email, first_name, last_name, phone, ...metadata } = body

        if (!company_id || (!email && !phone)) {
            return NextResponse.json({ error: 'Missing company_id or contact info (email/phone)' }, { status: 400 })
        }

        const supabase = await createServiceRoleClient()

        // 1. Check if company exists
        const { data: company, error: companyError } = await supabase
            .from('companies' as any)
            .select('id, name')
            .eq('id', company_id)
            .single()

        if (companyError || !company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 })
        }

        // 2. Add or update customer
        const { data: customer, error: customerError } = await supabase
            .from('customers' as any)
            .upsert({
                company_id,
                email,
                phone,
                first_name,
                last_name,
                metadata
            } as any, { onConflict: 'company_id, email' })
            .select()
            .single() as any

        if (customerError) throw customerError

        // 3. Find active campaign for this company
        const { data: campaign } = await supabase
            .from('review_campaigns' as any)
            .select('*')
            .eq('company_id', company_id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle() as any

        if (campaign) {
            // 4. Create a pending invitation
            const { error: invError } = await supabase
                .from('review_invitations' as any)
                .insert({
                    campaign_id: campaign.id,
                    customer_id: customer.id,
                    company_id: company_id,
                    status: 'pending'
                } as any)

            if (invError) console.error('Error creating invitation:', invError)
        }

        return NextResponse.json({
            success: true,
            message: 'Customer registered, invitation queued.',
            customer_id: customer.id
        })

    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
    }
}
