from fastapi import APIRouter
from app.loader import load_all_data
from app.transformer import transform, world_to_minimap

router = APIRouter()

# Load once (for MVP)
raw_df = load_all_data()

if raw_df is None or raw_df.is_empty():
    print("❌ Data not loaded or empty")
    df = raw_df
else:
    try:
        df = transform(raw_df)
        df = world_to_minimap(df)
        print(f"✅ Final DF rows: {df.shape[0]}")
    except Exception as e:
        print(f"❌ Transform failed: {e}")
        df = raw_df


@router.get("/maps")
def get_maps():
    return df.select("map_id").unique()["map_id"].to_list()


@router.get("/matches")
def get_matches(map_id: str):
    return (
        df.filter(df["map_id"] == map_id)
        .select("match_id")
        .unique()["match_id"]
        .to_list()
    )


@router.get("/match/{match_id}")
def get_match(match_id: str):
    data = df.filter(df["match_id"] == match_id).sort("ts")

    return data.select([
        "match_id",
        "map_id",
        "user_id",
        "player_type",
        "event",
        "px",
        "py",
        "ts"
    ]).to_dicts()


@router.get("/global")
def get_global_data():
    return df.select([
        "map_id",
        "event",
        "player_type",
        "px",
        "py",
    ]).to_dicts()
