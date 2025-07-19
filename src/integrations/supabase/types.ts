export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      user_portfolio: {
        Row: {
          available_balance: number
          created_at: string
          current_value: number
          day_pnl: number
          id: string
          invested_amount: number
          losing_trades: number
          max_drawdown: number
          roi_percentage: number
          total_capital: number
          total_pnl: number
          total_trades: number
          updated_at: string
          user_id: string
          winning_trades: number
        }
        Insert: {
          available_balance?: number
          created_at?: string
          current_value?: number
          day_pnl?: number
          id?: string
          invested_amount?: number
          losing_trades?: number
          max_drawdown?: number
          roi_percentage?: number
          total_capital?: number
          total_pnl?: number
          total_trades?: number
          updated_at?: string
          user_id: string
          winning_trades?: number
        }
        Update: {
          available_balance?: number
          created_at?: string
          current_value?: number
          day_pnl?: number
          id?: string
          invested_amount?: number
          losing_trades?: number
          max_drawdown?: number
          roi_percentage?: number
          total_capital?: number
          total_pnl?: number
          total_trades?: number
          updated_at?: string
          user_id?: string
          winning_trades?: number
        }
        Relationships: []
      }
      user_positions: {
        Row: {
          average_price: number
          created_at: string
          current_price: number
          current_value: number
          day_pnl: number
          id: string
          invested_amount: number
          symbol: string
          total_quantity: number
          unrealized_pnl: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_price: number
          created_at?: string
          current_price: number
          current_value: number
          day_pnl?: number
          id?: string
          invested_amount: number
          symbol: string
          total_quantity?: number
          unrealized_pnl?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_price?: number
          created_at?: string
          current_price?: number
          current_value?: number
          day_pnl?: number
          id?: string
          invested_amount?: number
          symbol?: string
          total_quantity?: number
          unrealized_pnl?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trades: {
        Row: {
          amount: number
          created_at: string
          entry_price: number
          entry_time: string
          exit_price: number | null
          exit_time: string | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          quantity: number
          realized_pnl: number | null
          status: Database["public"]["Enums"]["trade_status"]
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          trade_type: Database["public"]["Enums"]["trade_type"]
          unrealized_pnl: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          entry_price: number
          entry_time?: string
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          quantity: number
          realized_pnl?: number | null
          status?: Database["public"]["Enums"]["trade_status"]
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          trade_type: Database["public"]["Enums"]["trade_type"]
          unrealized_pnl?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          entry_price?: number
          entry_time?: string
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          quantity?: number
          realized_pnl?: number | null
          status?: Database["public"]["Enums"]["trade_status"]
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          trade_type?: Database["public"]["Enums"]["trade_type"]
          unrealized_pnl?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_type: "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT"
      trade_status: "OPEN" | "CLOSED" | "CANCELLED"
      trade_type: "BUY" | "SELL"
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
      order_type: ["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"],
      trade_status: ["OPEN", "CLOSED", "CANCELLED"],
      trade_type: ["BUY", "SELL"],
    },
  },
} as const
