export interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "User";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Entity {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  table_name: string;
  created_at: string;
  fields?: EntityField[];
}

export interface EntityCreate {
  name: string;
  display_name: string;
  description?: string;
}

export interface EntityField {
  id: string;
  entity_id: string;
  name: string;
  display_name: string;
  field_type: FieldType;
  is_required: boolean;
  max_length: number | null;
  column_name: string;
  display_order: number;
  created_at: string;
}

export interface FieldCreate {
  name: string;
  display_name: string;
  field_type: FieldType;
  is_required: boolean;
  max_length?: number;
}

export type FieldType = "TEXT" | "NUMBER" | "INTEGER" | "DATE" | "BOOLEAN";

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}
