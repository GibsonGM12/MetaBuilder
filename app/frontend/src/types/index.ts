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
  target_entity_id?: string;
  target_display_field?: string;
}

export type FieldType = "TEXT" | "NUMBER" | "INTEGER" | "DATE" | "BOOLEAN" | "RELATION";

export interface EntityRelationship {
  id: string;
  source_entity_id: string;
  target_entity_id: string;
  relationship_type: string;
  source_field_id: string;
  target_display_field: string;
  created_at: string;
}

export interface LookupItem {
  id: string;
  display_value: string;
}

export interface DynamicRecord {
  id: string;
  created_at: string;
  data: Record<string, unknown>;
}

export interface PaginatedRecords {
  items: DynamicRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}

export type WidgetType =
  | "STAT_CARD"
  | "KPI_CARD"
  | "DATA_GRID"
  | "BAR_CHART"
  | "PIE_CHART"
  | "LINE_CHART"
  | "RECENT_LIST";

export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  entity_id: string;
  widget_type: WidgetType;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
  display_order: number;
  created_at: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  layout_config: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  widgets: DashboardWidget[];
}

export interface DashboardListItem {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_by: string;
  created_at: string;
  widget_count: number;
}

export interface DashboardCreate {
  name: string;
  description?: string;
}

export interface DashboardUpdate {
  name?: string;
  description?: string;
  is_default?: boolean;
}

export interface WidgetCreate {
  entity_id: string;
  widget_type: WidgetType;
  title: string;
  position?: { x: number; y: number; w: number; h: number };
  config?: Record<string, unknown>;
}

export interface WidgetUpdate {
  title?: string;
  position?: { x: number; y: number; w: number; h: number };
  config?: Record<string, unknown>;
  entity_id?: string;
  widget_type?: WidgetType;
}

export type SectionType = "FIELDS" | "LOOKUP" | "DETAIL_TABLE" | "CALCULATED";

export interface FormSectionField {
  id: string;
  section_id: string;
  entity_field_id: string | null;
  display_order: number;
  config: Record<string, unknown>;
  created_at: string;
}

export interface FormSection {
  id: string;
  form_id: string;
  section_type: SectionType;
  entity_id: string | null;
  title: string;
  display_order: number;
  config: Record<string, unknown>;
  created_at: string;
  fields: FormSectionField[];
}

export interface Form {
  id: string;
  name: string;
  description: string | null;
  primary_entity_id: string;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  sections: FormSection[];
}

export interface FormListItem {
  id: string;
  name: string;
  description: string | null;
  primary_entity_id: string;
  created_by: string;
  created_at: string;
  section_count: number;
}

export interface FormSectionCreate {
  section_type: SectionType;
  entity_id?: string;
  title: string;
  config?: Record<string, unknown>;
  fields?: Array<{ entity_field_id?: string; config?: Record<string, unknown> }>;
}

export interface FormCreatePayload {
  name: string;
  description?: string;
  primary_entity_id: string;
  sections?: FormSectionCreate[];
}

export interface FormUpdatePayload {
  name?: string;
  description?: string;
  sections?: FormSectionCreate[];
}

export interface FormSubmissionData {
  header: Record<string, unknown>;
  lookups: Record<string, string>;
  detail_lines: Array<Record<string, unknown>>;
}

export interface FormSubmissionResult {
  success: boolean;
  header_id: string | null;
  detail_ids: string[];
  message: string;
}
