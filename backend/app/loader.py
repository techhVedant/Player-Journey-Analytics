import os
import polars as pl
from app.config import DATA_PATH

def load_all_data():
    dfs = []
    file_count = 0

    for root, _, files in os.walk(DATA_PATH):
        for f in files:
            filepath = os.path.join(root, f)
            file_count += 1
            try:
                df = pl.read_parquet(filepath, use_pyarrow=True)
                dfs.append(df)
            except Exception as e:
                print(f"Skipping {filepath}: {e}")

    print(f"Total files found: {file_count}")
    print(f"Total files loaded: {len(dfs)}")

    if not dfs:
        print("❌ No data loaded")
        return pl.DataFrame()

    df = pl.concat(dfs)
    print(f"✅ Total rows: {df.shape[0]}")

    return df