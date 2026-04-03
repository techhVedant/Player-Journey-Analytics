import polars as pl
from app.config import MAP_CONFIG

def transform(df: pl.DataFrame) -> pl.DataFrame:
    if df.is_empty():
        return df

    # decode event
    df = df.with_columns([
        pl.col("event").cast(pl.Utf8)
    ])

    # classify bot vs human
    df = df.with_columns([
        pl.when(pl.col("user_id").str.contains("-"))
        .then(pl.lit("human"))
        .otherwise(pl.lit("bot"))
        .alias("player_type")
    ])

    return df


def world_to_minimap(df: pl.DataFrame) -> pl.DataFrame:
    def convert(row):
        config = MAP_CONFIG[row["map_id"]]

        u = (row["x"] - config["origin_x"]) / config["scale"]
        v = (row["z"] - config["origin_z"]) / config["scale"]

        px = u * 1024
        py = (1 - v) * 1024

        return px, py

    coords = df.select(["x", "z", "map_id"]).to_dicts()

    pixel_x = []
    pixel_y = []

    for row in coords:
        px, py = convert(row)
        pixel_x.append(px)
        pixel_y.append(py)

    df = df.with_columns([
        pl.Series("px", pixel_x),
        pl.Series("py", pixel_y)
    ])

    return df