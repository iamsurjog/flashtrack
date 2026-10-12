import sqlite3
import json
import pandas as pd

# Adjust terminal view for wide data
pd.set_option("display.max_columns", None)
pd.set_option("display.width", 120)

DB_PATH = "data.db"  # Replace with your actual .db file path

conn = sqlite3.connect(DB_PATH)


def safe_json_parse(val):
    """Safely parse JSON strings, returning an empty dict on null/malformed values."""
    if not val or not isinstance(val, str):
        return {}
    try:
        return json.loads(val)
    except (json.JSONDecodeError, TypeError):
        return {"raw_text": val}


# ---------------------------------------------------------
# 1. Quick Peek at Raw Data
# ---------------------------------------------------------
print("=== RAW SESSIONS (FIRST 3 ROWS) ===")
df_sessions_raw = pd.read_sql_query("SELECT * FROM sessions LIMIT 3;", conn)
print(df_sessions_raw)

print("\n=== RAW WATCHDATA (FIRST 3 ROWS) ===")
df_watch_raw = pd.read_sql_query("SELECT * FROM watchData LIMIT 3;", conn)
print(df_watch_raw)

# ---------------------------------------------------------
# 2. Extract and Flatten Semi-Structured 'info' Fields
# ---------------------------------------------------------
print("\nExtracting and flattening records...")

df_sessions = pd.read_sql_query("SELECT * FROM sessions;", conn)
df_watch = pd.read_sql_query("SELECT * FROM watchData;", conn)
conn.close()

# Parse JSON inside sessions.info
sessions_parsed = df_sessions["info"].apply(safe_json_parse)
sessions_flat = pd.json_normalize(sessions_parsed).add_prefix("session_")
sessions_clean = pd.concat([df_sessions[["id"]], sessions_flat], axis=1)

# Parse JSON inside watchData.info
watch_parsed = df_watch["info"].apply(safe_json_parse)
watch_flat = pd.json_normalize(watch_parsed).add_prefix("watch_")
watch_clean = pd.concat(
    [df_watch[["sessionId", "type"]], watch_flat], axis=1
)

# ---------------------------------------------------------
# 3. Join on Key (sessions.id == watchData.sessionId)
# ---------------------------------------------------------
merged_df = pd.merge(
    sessions_clean,
    watch_clean,
    left_on="id",
    right_on="sessionId",
    how="inner",
)

# Drop redundant key column
merged_df.drop(columns=["sessionId"], inplace=True)

# ---------------------------------------------------------
# 4. Exploratory Data Profiling
# ---------------------------------------------------------
print("\n=== MERGED DATASET SHAPE ===")
print(f"Total Rows (Events): {merged_df.shape[0]}")
print(f"Total Columns: {merged_df.shape[1]}")
print(f"Unique Sessions: {merged_df['id'].nunique()}")

print("\n=== COLUMN SCHEMA & NON-NULL COUNTS ===")
print(merged_df.info())

print("\n=== MISSING VALUES PER COLUMN ===")
missing = merged_df.isnull().sum()
print(missing[missing > 0])

print("\n=== EVENT TYPE DISTRIBUTION ('type' column) ===")
if "type" in merged_df.columns:
    print(merged_df["type"].value_counts(dropna=False))

print("\n=== FIRST 5 ROWS OF FLATTENED DATASET ===")
print(merged_df.head(5))
