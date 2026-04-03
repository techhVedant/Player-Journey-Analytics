import { useEffect, useState } from "react";
import { getMatchData } from "../api";

export default function MapView({ matchId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!matchId) return;

    getMatchData(matchId).then(setData);
  }, [matchId]);

  return (
    <div style={{ position: "relative", width: 1024, height: 1024 }}>
      
      {/* Minimap */}
      <img
        src="/maps/AmbroseValley_Minimap.png"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      {/* Points */}
      {data.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: e.px,
            top: e.py,
            width: 4,
            height: 4,
            backgroundColor: e.player_type === "human" ? "blue" : "red",
            borderRadius: "50%"
          }}
        />
      ))}
    </div>
  );
}