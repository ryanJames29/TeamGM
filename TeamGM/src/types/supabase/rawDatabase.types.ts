export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      home_insight_snapshots: {
        Row: {
          facts_as_of: string | null
          generated_at: string
          id: string
          payload: Json
          run_type: Database["public"]["Enums"]["home_insight_run_type"]
          user_id: string
        }
        Insert: {
          facts_as_of?: string | null
          generated_at?: string
          id?: string
          payload: Json
          run_type?: Database["public"]["Enums"]["home_insight_run_type"]
          user_id: string
        }
        Update: {
          facts_as_of?: string | null
          generated_at?: string
          id?: string
          payload?: Json
          run_type?: Database["public"]["Enums"]["home_insight_run_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_insight_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_cap_settings: {
        Row: {
          cap_ceiling_cents: number
          cap_floor_cents: number
          ltir_enabled: boolean
          max_contracts: number
          max_roster_size: number
          season_id: string
          updated_at: string
        }
        Insert: {
          cap_ceiling_cents: number
          cap_floor_cents: number
          ltir_enabled?: boolean
          max_contracts?: number
          max_roster_size?: number
          season_id: string
          updated_at?: string
        }
        Update: {
          cap_ceiling_cents?: number
          cap_floor_cents?: number
          ltir_enabled?: boolean
          max_contracts?: number
          max_roster_size?: number
          season_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_cap_settings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_cap_settings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_cap_settings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
        ]
      }
      nhl_player_contract_years: {
        Row: {
          base_salary_cents: number
          contract_id: string
          id: string
          performance_bonus_cents: number
          season_start_year: number
          signing_bonus_cents: number
          total_salary_cents: number | null
          updated_at: string
        }
        Insert: {
          base_salary_cents?: number
          contract_id: string
          id?: string
          performance_bonus_cents?: number
          season_start_year: number
          signing_bonus_cents?: number
          total_salary_cents?: number | null
          updated_at?: string
        }
        Update: {
          base_salary_cents?: number
          contract_id?: string
          id?: string
          performance_bonus_cents?: number
          season_start_year?: number
          signing_bonus_cents?: number
          total_salary_cents?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_player_contract_years_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "nhl_player_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_contract_years_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "nhl_roster_with_contracts"
            referencedColumns: ["contract_id"]
          },
        ]
      }
      nhl_player_contracts: {
        Row: {
          aav_cents: number
          cap_hit_cents: number
          contract_end: string
          contract_start: string
          contract_type: string
          expiry_status: string
          expiry_year: number | null
          has_nmc: boolean
          has_ntc: boolean
          id: string
          is_buried: boolean
          is_ltir: boolean
          player_id: string
          rights_status: string
          season_id: string
          signed_date: string | null
          team_id: string | null
          updated_at: string
          years_remaining: number
          years_total: number
        }
        Insert: {
          aav_cents: number
          cap_hit_cents: number
          contract_end: string
          contract_start: string
          contract_type?: string
          expiry_status?: string
          expiry_year?: number | null
          has_nmc?: boolean
          has_ntc?: boolean
          id?: string
          is_buried?: boolean
          is_ltir?: boolean
          player_id: string
          rights_status?: string
          season_id: string
          signed_date?: string | null
          team_id?: string | null
          updated_at?: string
          years_remaining: number
          years_total: number
        }
        Update: {
          aav_cents?: number
          cap_hit_cents?: number
          contract_end?: string
          contract_start?: string
          contract_type?: string
          expiry_status?: string
          expiry_year?: number | null
          has_nmc?: boolean
          has_ntc?: boolean
          id?: string
          is_buried?: boolean
          is_ltir?: boolean
          player_id?: string
          rights_status?: string
          season_id?: string
          signed_date?: string | null
          team_id?: string | null
          updated_at?: string
          years_remaining?: number
          years_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "nhl_player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_expiring_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_free_agents"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_roster_with_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_player_season_stats: {
        Row: {
          assists: number
          gaa: number | null
          games_played: number
          goals: number
          pim: number
          player_id: string
          plus_minus: number
          points: number | null
          save_pct: number | null
          season_id: string
          shots: number | null
          team_id: string
          toi_seconds: number | null
          updated_at: string
        }
        Insert: {
          assists?: number
          gaa?: number | null
          games_played?: number
          goals?: number
          pim?: number
          player_id: string
          plus_minus?: number
          points?: number | null
          save_pct?: number | null
          season_id: string
          shots?: number | null
          team_id: string
          toi_seconds?: number | null
          updated_at?: string
        }
        Update: {
          assists?: number
          gaa?: number | null
          games_played?: number
          goals?: number
          pim?: number
          player_id?: string
          plus_minus?: number
          points?: number | null
          save_pct?: number | null
          season_id?: string
          shots?: number | null
          team_id?: string
          toi_seconds?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_expiring_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_free_agents"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_roster_with_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_season_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_players: {
        Row: {
          birth_country: string | null
          birth_date: string | null
          created_at: string
          draft_pick: number | null
          draft_round: number | null
          draft_year: number | null
          external_id: string | null
          external_source: string | null
          first_name: string | null
          full_name: string
          height_cm: number | null
          id: string
          is_active: boolean
          last_name: string | null
          position_group: string
          primary_position: string
          secondary_positions: string[]
          shoots_catches: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          birth_country?: string | null
          birth_date?: string | null
          created_at?: string
          draft_pick?: number | null
          draft_round?: number | null
          draft_year?: number | null
          external_id?: string | null
          external_source?: string | null
          first_name?: string | null
          full_name: string
          height_cm?: number | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          position_group: string
          primary_position: string
          secondary_positions?: string[]
          shoots_catches?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          birth_country?: string | null
          birth_date?: string | null
          created_at?: string
          draft_pick?: number | null
          draft_round?: number | null
          draft_year?: number | null
          external_id?: string | null
          external_source?: string | null
          first_name?: string | null
          full_name?: string
          height_cm?: number | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          position_group?: string
          primary_position?: string
          secondary_positions?: string[]
          shoots_catches?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      nhl_roster_entries: {
        Row: {
          assigned_from: string
          assigned_to: string | null
          captaincy: string | null
          created_at: string
          id: string
          jersey_number: number | null
          player_id: string
          roster_status: string
          season_id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          assigned_from?: string
          assigned_to?: string | null
          captaincy?: string | null
          created_at?: string
          id?: string
          jersey_number?: number | null
          player_id: string
          roster_status?: string
          season_id: string
          team_id: string
          updated_at?: string
        }
        Update: {
          assigned_from?: string
          assigned_to?: string | null
          captaincy?: string | null
          created_at?: string
          id?: string
          jersey_number?: number | null
          player_id?: string
          roster_status?: string
          season_id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_roster_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_expiring_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_free_agents"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "nhl_roster_with_contracts"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_seasons: {
        Row: {
          created_at: string
          end_year: number
          id: string
          is_current: boolean
          regular_season_end: string | null
          regular_season_start: string | null
          start_year: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_year: number
          id: string
          is_current?: boolean
          regular_season_end?: string | null
          regular_season_start?: string | null
          start_year: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_year?: number
          id?: string
          is_current?: boolean
          regular_season_end?: string | null
          regular_season_start?: string | null
          start_year?: number
          updated_at?: string
        }
        Relationships: []
      }
      nhl_team_records: {
        Row: {
          losses: number
          ot_losses: number
          points: number | null
          position: number | null
          record: string
          season: number
          standing: string | null
          team_id: number
          team_name: string
          updated_at: string
          wins: number
        }
        Insert: {
          losses?: number
          ot_losses?: number
          points?: number | null
          position?: number | null
          record: string
          season: number
          standing?: string | null
          team_id: number
          team_name: string
          updated_at?: string
          wins?: number
        }
        Update: {
          losses?: number
          ot_losses?: number
          points?: number | null
          position?: number | null
          record?: string
          season?: number
          standing?: string | null
          team_id?: number
          team_name?: string
          updated_at?: string
          wins?: number
        }
        Relationships: []
      }
      nhl_team_season_cap: {
        Row: {
          annual_cap_hit_cents: number | null
          bonus_overages_cents: number
          ltir_pool_cents: number
          notes: string | null
          potential_bonuses_cents: number
          season_id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          annual_cap_hit_cents?: number | null
          bonus_overages_cents?: number
          ltir_pool_cents?: number
          notes?: string | null
          potential_bonuses_cents?: number
          season_id: string
          team_id: string
          updated_at?: string
        }
        Update: {
          annual_cap_hit_cents?: number | null
          bonus_overages_cents?: number
          ltir_pool_cents?: number
          notes?: string | null
          potential_bonuses_cents?: number
          season_id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_team_season_cap_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_team_season_cap_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_team_season_cap_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_team_season_cap_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_season_cap_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_season_cap_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_team_staff: {
        Row: {
          created_at: string
          ended_on: string | null
          first_name: string | null
          full_name: string
          id: string
          is_current: boolean | null
          last_name: string | null
          role_detail: string | null
          staff_role: string
          started_on: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_on?: string | null
          first_name?: string | null
          full_name: string
          id?: string
          is_current?: boolean | null
          last_name?: string | null
          role_detail?: string | null
          staff_role: string
          started_on: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_on?: string | null
          first_name?: string | null
          full_name?: string
          id?: string
          is_current?: boolean | null
          last_name?: string | null
          role_detail?: string | null
          staff_role?: string
          started_on?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          timezone: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          abbreviation: string
          api_sports_team_id: number
          created_at: string
          id: string
          is_active: boolean
          league: Database["public"]["Enums"]["major_league"]
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          abbreviation: string
          api_sports_team_id: number
          created_at?: string
          id: string
          is_active?: boolean
          league: Database["public"]["Enums"]["major_league"]
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          abbreviation?: string
          api_sports_team_id?: number
          created_at?: string
          id?: string
          is_active?: boolean
          league?: Database["public"]["Enums"]["major_league"]
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_favorite_teams: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      nhl_expiring_contracts: {
        Row: {
          aav_cents: number | null
          cap_hit_cents: number | null
          contract_end: string | null
          expiry_status: string | null
          expiry_year: number | null
          full_name: string | null
          has_nmc: boolean | null
          has_ntc: boolean | null
          player_id: string | null
          position_group: string | null
          primary_position: string | null
          rights_status: string | null
          season_id: string | null
          team_id: string | null
          team_name: string | null
          years_remaining: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_free_agents: {
        Row: {
          contract_end: string | null
          full_name: string | null
          last_aav_cents: number | null
          last_cap_hit_cents: number | null
          last_team_id: string | null
          player_id: string | null
          position_group: string | null
          primary_position: string | null
          rights_status: string | null
          season_id: string | null
          secondary_positions: string[] | null
          shoots_catches: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["last_team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["last_team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_player_contracts_team_id_fkey"
            columns: ["last_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_gm_team_overview: {
        Row: {
          abbreviation: string | null
          active_roster_count: number | null
          bonus_overages_cents: number | null
          cap_ceiling_cents: number | null
          cap_hit_cents: number | null
          cap_space_cents: number | null
          defence_cap_hit_cents: number | null
          forwards_cap_hit_cents: number | null
          general_manager_name: string | null
          goalies_cap_hit_cents: number | null
          head_coach_name: string | null
          ltir_pool_cents: number | null
          max_roster_size: number | null
          points: number | null
          potential_bonuses_cents: number | null
          record: string | null
          season_id: string | null
          standing: string | null
          standings_position: number | null
          team_id: string | null
          team_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "user_favorite_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_roster_with_contracts: {
        Row: {
          aav_cents: number | null
          cap_hit_cents: number | null
          captaincy: string | null
          contract_end: string | null
          contract_id: string | null
          expiry_status: string | null
          expiry_year: number | null
          full_name: string | null
          has_nmc: boolean | null
          has_ntc: boolean | null
          is_ltir: boolean | null
          jersey_number: number | null
          player_id: string | null
          position_group: string | null
          primary_position: string | null
          rights_status: string | null
          roster_entry_id: string | null
          roster_status: string | null
          season_base_salary_cents: number | null
          season_id: string | null
          season_signing_bonus_cents: number | null
          season_total_salary_cents: number | null
          secondary_positions: string[] | null
          shoots_catches: string | null
          team_id: string | null
          years_remaining: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_gm_team_overview"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_roster_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_team_cap_summary: {
        Row: {
          abbreviation: string | null
          active_roster_count: number | null
          bonus_overages_cents: number | null
          cap_ceiling_cents: number | null
          cap_floor_cents: number | null
          cap_hit_cents: number | null
          cap_space_cents: number | null
          defence_cap_hit_cents: number | null
          forwards_cap_hit_cents: number | null
          goalies_cap_hit_cents: number | null
          ltir_pool_cents: number | null
          max_roster_size: number | null
          potential_bonuses_cents: number | null
          season_id: string | null
          start_year: number | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: []
      }
      nhl_team_staff_current: {
        Row: {
          ended_on: string | null
          first_name: string | null
          full_name: string | null
          last_name: string | null
          role_detail: string | null
          staff_id: string | null
          staff_role: string | null
          started_on: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_cap_summary"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "nhl_team_standings"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "nhl_team_staff_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      nhl_team_standings: {
        Row: {
          abbreviation: string | null
          logo_url: string | null
          losses: number | null
          ot_losses: number | null
          points: number | null
          position: number | null
          record: string | null
          standing: string | null
          start_year: number | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
          wins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      home_insight_run_type: "morning" | "postgame" | "manual"
      major_league: "nfl" | "nba" | "mlb" | "nhl"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      home_insight_run_type: ["morning", "postgame", "manual"],
      major_league: ["nfl", "nba", "mlb", "nhl"],
    },
  },
} as const
