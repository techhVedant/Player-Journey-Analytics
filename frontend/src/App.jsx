import { useEffect, useState, useMemo } from "react";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import TimelineSlider from "./components/TimelineSlider";
import MapCanvas from "./components/MapCanvas";
import Legend from "./components/Legend";
import EventDrawer from "./components/EventDrawer";
import OnboardingModal from "./components/OnboardingModal";
import styles from "./App.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ?? (import.meta.env.DEV ? "http://127.0.0.1:8000" : "/api");

const safeDate = (ts) => {
  if (!ts) return 0;
  // Convert 1970-01-21T11:52:33.063000 to Safari-safe ISO 8601
  let safeStr = typeof ts === 'string' ? ts.replace(' ', 'T') : ts;
  
  // Truncate microseconds to milliseconds (Safari rejects >3 decimal places)
  if (safeStr.includes('.')) {
    const parts = safeStr.split('.');
    safeStr = parts[0] + '.' + parts[1].substring(0, 3);
  }
  
  // Append Z to enforce UTC/valid timezone to prevent invalid date errors
  if (!safeStr.endsWith('Z')) {
    safeStr += 'Z';
  }
  
  const time = new Date(safeStr).getTime();
  return isNaN(time) ? 0 : time;
};

function App() {
  // Navigation & Modes
  const [useGlobal, setUseGlobal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Time & Playback
  const [currentTime, setCurrentTime] = useState(0);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filters
  const [selectedEventGroups, setSelectedEventGroups] = useState(["Kill", "Death", "Loot", "Storm"]);
  const [selectedPlayerTypes, setSelectedPlayerTypes] = useState(["human", "bot"]);

  // Selection state
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  
  // Data
  const [globalData, setGlobalData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventGroup = (event) => {
    switch (event) {
      case "Kill":
      case "BotKill":
        return "Kill";
      case "Killed":
      case "BotKilled":
        return "Death";
      case "Loot":
        return "Loot";
      case "KilledByStorm":
        return "Storm";
      default:
        return "Other";
    }
  };

  const toggleEventGroup = (group) => {
    setSelectedEventGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const togglePlayerType = (type) => {
    setSelectedPlayerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // 1. Fetch available maps
  useEffect(() => {
    fetch(`${BASE_URL}/maps`)
      .then((res) => res.json())
      .then(setMaps)
      .catch(console.error);
  }, []);

  // 2. Fetch global data
  useEffect(() => {
    fetch(`${BASE_URL}/global`)
      .then((res) => res.json())
      .then(setGlobalData)
      .catch(console.error);
  }, []);

  // 3. Fetch matches when map selected
  useEffect(() => {
    setSelectedMatch("");
    setData([]);

    if (!selectedMap) {
      setMatches([]);
      return;
    }

    fetch(`${BASE_URL}/matches?map_id=${selectedMap}`)
      .then((res) => res.json())
      .then(setMatches)
      .catch(console.error);
  }, [selectedMap]);

  // 4. Fetch specific match data
  useEffect(() => {
    if (!selectedMatch) return;
    fetch(`${BASE_URL}/match/${selectedMatch}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [selectedMatch]);

  // 5. Compute min/max/current time based on match data
  useEffect(() => {
    const dataSource = useGlobal ? globalData : data;
    if (!dataSource || dataSource.length === 0) return;

    const relevantData = useGlobal && selectedMap 
      ? dataSource.filter(e => e.map_id === selectedMap) 
      : dataSource;

    if (relevantData.length === 0) return;

    const minTs = Math.min(...relevantData.map((e) => safeDate(e.ts)));
    const maxTs = Math.max(...relevantData.map((e) => safeDate(e.ts)));
    setMinTime(minTs);
    setMaxTime(maxTs);
    setCurrentTime(minTs);
    setIsPlaying(false);
  }, [data, globalData, useGlobal, selectedMap]);

  // Playback Interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const timeRange = maxTime - minTime;
        const step = timeRange > 0 ? timeRange / 100 : 0;
        const nextTime = prev + step;
        if (nextTime >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return nextTime;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, minTime, maxTime]);

  // Derived filtered data
  const { importantEvents, filteredHeatmapData } = useMemo(() => {
    const dataSource = useGlobal ? globalData : data;
    
    const baseEvents = dataSource.filter((e) => {
      const group = getEventGroup(e.event);
      const matchesSelectedMap =
        !selectedMap ||
        !e.map_id ||
        e.map_id === selectedMap;

      return (
        e.event !== "Position" &&
        e.event !== "BotPosition" &&
        selectedEventGroups.includes(group) &&
        selectedPlayerTypes.includes(e.player_type) &&
        matchesSelectedMap
      );
    });

    const getEventPriority = (event) => {
      const group = getEventGroup(event);
      switch (group) {
        case "Loot": return 1;
        case "Storm": return 2;
        case "Death": return 3;
        case "Kill": return 4;
        default: return 0;
      }
    };

    const sortedEvents = [...baseEvents].sort(
      (a, b) => getEventPriority(a.event) - getEventPriority(b.event)
    );

    const important = sortedEvents.filter(e => safeDate(e.ts) <= currentTime);
    
    return { importantEvents: important, filteredHeatmapData: sortedEvents };
  }, [useGlobal, globalData, data, selectedEventGroups, selectedPlayerTypes, selectedMap, currentTime]);


  return (
    <div className={styles.appContainer}>
      <TopNav useGlobal={useGlobal} setUseGlobal={setUseGlobal} onOpenIntro={() => setShowIntro(true)} />
      
      {showIntro && <OnboardingModal onClose={() => setShowIntro(false)} />}

      <div className={styles.mainLayout}>
        <Sidebar
          maps={maps}
          selectedMap={selectedMap}
          setSelectedMap={setSelectedMap}
          matches={matches}
          selectedMatch={selectedMatch}
          setSelectedMatch={setSelectedMatch}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          selectedEventGroups={selectedEventGroups}
          toggleEventGroup={toggleEventGroup}
          selectedPlayerTypes={selectedPlayerTypes}
          togglePlayerType={togglePlayerType}
        />

        <div className={styles.contentArea}>
          <div className={styles.canvasWrapper}>
            <MapCanvas 
              selectedMap={selectedMap}
              showHeatmap={showHeatmap}
              importantEvents={importantEvents}
              filteredHeatmapData={filteredHeatmapData}
              onEventClick={setSelectedEvent}
            />
            {selectedMap && <Legend />}
            
            <EventDrawer 
              event={selectedEvent} 
              onClose={() => setSelectedEvent(null)} 
            />
          </div>

          <TimelineSlider
            minTime={minTime}
            maxTime={maxTime}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            events={filteredHeatmapData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
