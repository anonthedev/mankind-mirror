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
      daily_progress: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          mood: string | null
          sleep: string | null
          gratefulness: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          mood?: string | null
          sleep?: string | null
          gratefulness?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          mood?: string | null
          sleep?: string | null
          gratefulness?: string[] | null
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
export type DailyProgress = Database['public']['Tables']['daily_progress']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type UserProfile = Database['public']['Tables']['user_profile']['Row']

