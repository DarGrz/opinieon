export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionPlan = 'START' | 'PRO' | 'BIZNES'
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'archived'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      portals: {
        Row: {
          id: string
          name: string
          domain: string
          slug: string
          settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain: string
          slug: string
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string
          slug?: string
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string | null
          nip: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          phone: string | null
          website: string | null
          email: string | null
          gmb_link: string | null
          description: string | null
          geolocation: Json | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug?: string | null
          nip?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          gmb_link?: string | null
          description?: string | null
          geolocation?: Json | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string | null
          nip?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          gmb_link?: string | null
          description?: string | null
          geolocation?: Json | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'companies_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          plan: SubscriptionPlan
          status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          trial_end: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id?: string | null
          plan: SubscriptionPlan
          status: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string | null
          plan?: SubscriptionPlan
          status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          }
        ]
      }
      company_portal_profiles: {
        Row: {
          id: string
          company_id: string
          portal_id: string
          is_active: boolean
          profile_url: string | null
          custom_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          portal_id: string
          is_active?: boolean
          profile_url?: string | null
          custom_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          portal_id?: string
          is_active?: boolean
          profile_url?: string | null
          custom_data?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_portal_profiles_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'company_portal_profiles_portal_id_fkey'
            columns: ['portal_id']
            isOneToOne: false
            referencedRelation: 'portals'
            referencedColumns: ['id']
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          company_id: string
          portal_id: string
          author_name: string
          author_email: string | null
          rating: number
          title: string | null
          content: string | null
          pros: string | null
          cons: string | null
          status: ReviewStatus
          review_date: string
          is_verified: boolean
          helpful_count: number
          response_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          portal_id: string
          author_name: string
          author_email?: string | null
          rating: number
          title?: string | null
          content?: string | null
          pros?: string | null
          cons?: string | null
          status?: ReviewStatus
          review_date?: string
          is_verified?: boolean
          helpful_count?: number
          response_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          portal_id?: string
          author_name?: string
          author_email?: string | null
          rating?: number
          title?: string | null
          content?: string | null
          pros?: string | null
          cons?: string | null
          status?: ReviewStatus
          review_date?: string
          is_verified?: boolean
          helpful_count?: number
          response_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_portal_id_fkey'
            columns: ['portal_id']
            isOneToOne: false
            referencedRelation: 'portals'
            referencedColumns: ['id']
          }
        ]
      }
      review_replies: {
        Row: {
          id: string
          review_id: string
          company_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          review_id: string
          company_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          company_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'review_replies_review_id_fkey'
            columns: ['review_id']
            isOneToOne: false
            referencedRelation: 'reviews'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'review_replies_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'review_replies_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      plan_portal_access: {
        Row: {
          id: string
          plan: SubscriptionPlan
          portal_id: string
          created_at: string
        }
        Insert: {
          id?: string
          plan: SubscriptionPlan
          portal_id: string
          created_at?: string
        }
        Update: {
          id?: string
          plan?: SubscriptionPlan
          portal_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'plan_portal_access_portal_id_fkey'
            columns: ['portal_id']
            isOneToOne: false
            referencedRelation: 'portals'
            referencedColumns: ['id']
          }
        ]
      }
      portal_keys: {
        Row: {
          id: string
          portal_id: string
          key_hash: string
          name: string
          rate_limit: number
          active: boolean
          last_used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          portal_id: string
          key_hash: string
          name: string
          rate_limit?: number
          active?: boolean
          last_used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          portal_id?: string
          key_hash?: string
          name?: string
          rate_limit?: number
          active?: boolean
          last_used_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'portal_keys_portal_id_fkey'
            columns: ['portal_id']
            isOneToOne: false
            referencedRelation: 'portals'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      company_portal_stats: {
        Row: {
          company_id: string
          portal_id: string
          portal_slug: string
          portal_name: string
          review_count: number
          avg_rating: number | null
          five_star_count: number
          four_star_count: number
          three_star_count: number
          two_star_count: number
          one_star_count: number
          reviews_enabled: boolean
          discussions_enabled: boolean
          is_active: boolean
        }
        Relationships: []
      }
    }
    Functions: {
      has_portal_access: {
        Args: {
          p_user_id: string
          p_portal_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      subscription_plan: 'START' | 'PRO' | 'BIZNES'
      subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid'
      review_status: 'pending' | 'approved' | 'rejected' | 'archived'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
