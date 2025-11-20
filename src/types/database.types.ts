export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journal: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          title: string | null
          content: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          title?: string | null
          content?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          title?: string | null
          content?: string | null
        }
      }
      mood: {
        Row: {
          id: string
          created_at: string
          mood: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          mood?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          mood?: string | null
          user_id?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
        }
      }
      user_profile: {
        Row: {
          created_at: string
          user_id: string
          streak: number | null
          points: number | null
        }
        Insert: {
          created_at?: string
          user_id?: string
          streak?: number | null
          points?: number | null
        }
        Update: {
          created_at?: string
          user_id?: string
          streak?: number | null
          points?: number | null
        }
      }
    }
  }
}

// Helper types
export type Journal = Database['public']['Tables']['journal']['Row']
export type Mood = Database['public']['Tables']['mood']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type UserProfile = Database['public']['Tables']['user_profile']['Row']

