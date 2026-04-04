# Player Journey Visualization Insights

## Overview

This analysis explores player behavior using spatial and temporal event data from multiple matches. The goal is to identify patterns in how players move, loot, engage in combat, and get eliminated, and to derive actionable recommendations for improving game design.

## Insight 1: Loot Behavior Dominates Player Activity

### Observation

Loot-related events (`12,885`) significantly outnumber all other event types.

### Evidence

- Loot: `12,885` events
- Combat-related (`Kill` + `BotKill`): about `2,418` events
- Heatmap shows dense clustering of loot activity in specific regions

### Interpretation

Players spend the majority of their time looting, especially in the early phases of a match. Loot appears to be concentrated in specific zones, which leads to predictable movement and clustering.

### Why This Matters

- Creates early-game congestion
- Reduces exploration across the map
- Leads to repetitive gameplay patterns

### Recommendation

- Redistribute loot more evenly across the map
- Introduce dynamic or randomized loot spawning
- Incentivize exploration by placing high-value loot in underused areas

## Insight 2: Combat Is Predominantly Against Bots

### Observation

Bot-related combat events significantly exceed player-vs-player interactions.

### Evidence

- `BotKill`: `2,415` events
- `Kill` (human vs human): `3` events
- `BotKilled`: `700` events

### Interpretation

Most combat interactions involve bots rather than real players. This suggests player-vs-player engagement is minimal in the current match data.

### Why This Matters

- Reduces competitive intensity
- May hurt retention for experienced players
- Limits meaningful combat-driven gameplay

### Recommendation

- Reduce bot density in matches
- Improve matchmaking to increase human player interactions
- Introduce stronger incentives for player-vs-player engagements

## Insight 3: Combat Happens in Specific Hotspots

### Observation

Combat events are not evenly distributed and instead cluster in specific map regions.

### Evidence

- Kill heatmaps show tight clusters rather than even spread
- High overlap of combat events appears in select zones

### Interpretation

Certain areas act as natural choke points or high-value zones where players converge, likely because of loot concentration or map design.

### Why This Matters

- Creates predictable gameplay patterns
- Encourages repeated engagements in the same locations
- Reduces strategic diversity

### Recommendation

- Add alternative routes
- Redistribute loot
- Create multiple viable hotspots
- Reduce over-centralization of player activity

## Insight 4: Storm and Natural Deaths Are Rare

### Observation

Storm-related and natural deaths occur very infrequently.

### Evidence

- `KilledByStorm`: `39` events
- `Killed`: `3` events

### Interpretation

Players are highly effective at avoiding environmental hazards such as the storm, or the storm mechanics are not punishing enough.

### Why This Matters

- Reduces tension in late-game phases
- Limits environmental pressure on player movement
- Makes survival mechanics less meaningful

### Recommendation

- Increase storm damage or progression speed
- Introduce mechanics that force players into contested zones
- Reward risk-taking near storm boundaries

## Insight 5: Large Areas of the Map Are Underused

### Observation

Significant portions of the map show little to no activity in the heatmaps.

### Evidence

- Heatmaps reveal dense clusters in certain areas and large empty regions elsewhere

### Interpretation

Players consistently avoid certain regions, likely because of:

- lack of loot
- weak positioning
- low strategic value

### Why This Matters

- Wastes map design space
- Reduces gameplay diversity
- Makes player movement more predictable

### Recommendation

- Introduce better loot in low-activity zones
- Add unique objectives
- Add dynamic events
- Rebalance map layout to distribute player activity more evenly

## Conclusion

This analysis highlights three broad patterns:

- player behavior is heavily driven by loot distribution
- combat is concentrated and bot-dominated
- large parts of the map remain unused

Addressing these issues can lead to:

- more balanced gameplay
- increased player engagement
- improved strategic diversity

This tool shows how spatial and temporal visualization can uncover actionable insights for game design and product decisions.
