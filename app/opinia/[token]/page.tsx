import { createServiceRoleClient } from '@/lib/supabase/server'
import { ReviewForm } from '@/components/ReviewForm'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'
import { Star, CheckCircle, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function AutomatedReviewPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    const supabase = await createServiceRoleClient()

    // 1. Fetch invitation details
    const { data: invitation, error } = await supabase
        .from('review_invitations' as any)
        .select(`
            id,
            status,
            company:companies(id, name, logo_url, slug, gmb_link),
            customer:customers(first_name, email, metadata),
            campaign:review_campaigns(portals)
        `)
        .eq('token', token)
        .single() as any

    if (error || !invitation) {
        return notFound()
    }

    // 2. Track that the link was clicked (if not already completed)
    if (invitation.status === 'pending' || invitation.status === 'sent' || invitation.status === 'opened') {
        await supabase
            .from('review_invitations' as any)
            .update({
                status: 'clicked',
                clicked_at: new Date().toISOString()
            } as any)
            .eq('token', token)
    }

    const company = invitation.company as any
    const customer = invitation.customer as any
    const portals = (invitation.campaign as any)?.portals || ['opinieon']

    // Find the portal ID for 'opinieon' (needed for ReviewForm)
    const { data: portalData } = await supabase
        .from('portals')
        .select('id')
        .eq('slug', 'opinieon')
        .single()

    const opinieonPortalId = portalData?.id

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <HomeHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="max-w-xl w-full">
                    {/* Welcome Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-green-600 p-8 text-white text-center">
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Cześć {customer.first_name}!</h1>
                            <p className="text-green-50 opacity-90">
                                Dziękujemy za zakup w firmie <strong>{company.name}</strong>.
                                Twoja opinia jest dla nas bardzo ważna.
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Gdzie chcesz zostawić opinię?</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {portals.includes('google') && company.gmb_link && (
                                        <a
                                            href={company.gmb_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-blue-900">Google My Business</p>
                                                    <p className="text-xs text-blue-700">Najszybszy sposób</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                                        </a>
                                    )}

                                    {portals.includes('opinieon') && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-2xl">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Star className="w-6 h-6 text-green-600 fill-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-green-900">Bezpośrednio na opinieOn.pl</p>
                                                    <p className="text-xs text-green-700">Twoja opinia pojawi się na profilu firmy</p>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <ReviewForm
                                                    companyId={company.id}
                                                    portalId={opinieonPortalId as string}
                                                    companyName={company.name}
                                                    onSuccess={async () => {
                                                        'use server'
                                                        // Update invitation status to converted
                                                        const supabase = await createServiceRoleClient()
                                                        await supabase
                                                            .from('review_invitations' as any)
                                                            .update({
                                                                status: 'converted',
                                                                converted_at: new Date().toISOString()
                                                            } as any)
                                                            .eq('token', token)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400">
                                    Dziękujemy, zespół {company.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social proof or extra info */}
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Masz pytania? <a href={`mailto:kontakt@${company.slug}.pl`} className="text-green-600 hover:underline">Skontaktuj się z nami</a>
                    </p>
                </div>
            </main>

            <HomeFooter />
        </div>
    )
}
