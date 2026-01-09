import { createServiceRoleClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * Weryfikuje klucz API portalu
 * @param apiKey - Klucz API z headera X-Portal-Key
 * @param portalSlug - Slug portalu (np. 'dobre-firmy')
 * @returns Portal ID jeśli klucz jest poprawny, null w przeciwnym razie
 */
export async function verifyPortalKey(
  apiKey: string | null,
  portalSlug: string | null
): Promise<string | null> {
  console.log('[PORTAL-AUTH] Verifying portal key...', {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey?.substring(0, 10),
    portalSlug,
  })

  if (!apiKey || !portalSlug) {
    console.error('[PORTAL-AUTH] Missing API key or portal slug')
    return null
  }

  const supabase = createServiceRoleClient()

  // Hash klucza
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')
  console.log('[PORTAL-AUTH] Key hash generated:', {
    hashPrefix: keyHash.substring(0, 20),
  })

  // Sprawdź w bazie
  const { data, error } = await supabase
    .from('portal_keys')
    .select('portal_id, active, rate_limit, portals!inner(slug, is_active)')
    .eq('key_hash', keyHash)
    .eq('active', true)
    .maybeSingle() as { data: { portal_id: string; active: boolean; rate_limit: number | null; portals: { slug: string; is_active: boolean } } | null; error: any }

  console.log('[PORTAL-AUTH] Database query result:', {
    found: !!data,
    error: error?.message,
    data: data ? { portal_id: data.portal_id, active: data.active } : null,
  })

  if (!data) {
    console.error('[PORTAL-AUTH] Invalid API key or portal slug')
    return null
  }

  const portalData = (data as any).portals

  // Sprawdź czy slug się zgadza i portal jest aktywny
  if (portalData?.slug !== portalSlug || portalData?.is_active !== true) {
    console.error('[PORTAL-AUTH] Portal slug mismatch or inactive', {
      expected: portalSlug,
      actual: portalData?.slug,
      active: portalData?.is_active,
    })
    return null
  }

  // Zaktualizuj last_used_at
  await (supabase as any)
    .from('portal_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', keyHash)

  return (data as any).portal_id
}
