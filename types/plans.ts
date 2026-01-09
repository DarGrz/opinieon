import type { SubscriptionPlan } from './database'

export interface PlanFeatures {
  name: string
  price: number
  companies: number
  portals: string[]
  analytics: boolean
  features: string[]
  stripePriceId: string
}

export const PLAN_CONFIG: Record<SubscriptionPlan, PlanFeatures> = {
  START: {
    name: 'Start',
    price: 299,
    companies: 1,
    portals: ['dobre-firmy'],
    analytics: false,
    features: [
      '1 firma',
      'Portal Dobre Firmy',
      'Podstawowe zarządzanie opiniami',
      'Dodawanie i edycja opinii',
      'Wsparcie email',
    ],
    stripePriceId: process.env.STRIPE_PRICE_START || '',
  },
  PRO: {
    name: 'Pro',
    price: 499,
    companies: 1,
    portals: ['dobre-firmy', 'arena-biznesu', 'panteonfirm'],
    analytics: true,
    features: [
      '1 firma',
      'Wszystkie 3 portale',
      'Zaawansowane zarządzanie opiniami',
      'Analityka i statystyki',
      'Odpowiedzi na opinie',
      'Wsparcie priorytetowe',
    ],
    stripePriceId: process.env.STRIPE_PRICE_PRO || '',
  },
  BIZNES: {
    name: 'Biznes',
    price: 699,
    companies: 3,
    portals: ['dobre-firmy', 'arena-biznesu', 'panteonfirm'],
    analytics: true,
    features: [
      'Do 3 firm',
      'Wszystkie 3 portale',
      'Pełna analityka i raporty',
      'Odpowiedzi na opinie',
      'Wielokrotne profile firm',
      'Dedykowane wsparcie',
      'Priorytetowe feature requests',
    ],
    stripePriceId: process.env.STRIPE_PRICE_BIZNES || '',
  },
}

export const PORTAL_NAMES: Record<string, string> = {
  'dobre-firmy': 'Dobre Firmy',
  'arena-biznesu': 'Arena Biznesu',
  'panteonfirm': 'Panteon Firm',
}

export function getPlanLimits(plan: SubscriptionPlan) {
  return {
    companies: PLAN_CONFIG[plan].companies,
    portals: PLAN_CONFIG[plan].portals,
    hasAnalytics: PLAN_CONFIG[plan].analytics,
  }
}

export function canAccessPortal(plan: SubscriptionPlan, portalSlug: string): boolean {
  return PLAN_CONFIG[plan].portals.includes(portalSlug)
}

export function canAddCompany(plan: SubscriptionPlan, currentCompaniesCount: number): boolean {
  return currentCompaniesCount < PLAN_CONFIG[plan].companies
}
