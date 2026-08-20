# ProgressionService

A lightweight Luau module for handling player leveling and experience points (EXP) using Roblox Attributes.

## Overview

`ProgressionService` manages a player's EXP and Level progression using an exponential EXP curve. It stores all progression data directly on the `Player` instance as Attributes, automatically keeping `EXP`, `Level`, and `MaxEXP` in sync whenever EXP or Level changes. This makes progression data easy to read from the client, replicate automatically via Roblox's attribute replication, and integrate with UI without needing custom RemoteEvents.

The module handles level-up and level-down logic automatically (e.g. giving enough EXP to cross a level threshold will increment the Level and carry over remaining EXP), and clamps EXP so it never goes negative.

## Functions

### LevelToMaxEXP

Calculates the amount of EXP required to complete a given level, using the formula `100 * Level ^ 1.65`.

**Syntax**
```lua
ProgressionService.LevelToMaxEXP(Level: number): number
```

**Parameters**
- `Level` (`number`) — The level to calculate the max EXP requirement for.

**Returns**
- `number` — The maximum EXP for that level, rounded down to the nearest integer.

**Example**
```lua
local maxExp = ProgressionService.LevelToMaxEXP(5)
print(maxExp) -- e.g. 954
```

> Note: This is called with a dot (`.`), not a colon (`:`) — it does not use `self`.

---

### Setup

Initializes a player's progression attributes and connects listeners so that `EXP`/`Level` changes automatically trigger `Update`. Should be called once per player, typically on join.

**Syntax**
```lua
ProgressionService:Setup(Player: Player)
```

**Parameters**
- `Player` (`Player`) — The player to initialize progression for.

**Returns**
- `nil`

**Example**
```lua
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
	ProgressionService:Setup(player)
end)
```

---

### Update

Recalculates and normalizes a player's `EXP`, `Level`, and `MaxEXP` attributes. Handles carrying EXP overflow into level-ups (in a loop, so multiple level-ups can happen at once) and carrying EXP deficit into level-downs (down to a minimum of Level 1). Also sets the `MaxEXP` attribute to reflect the current level's requirement. This is called automatically by `Give`, `Take`, and the attribute-changed connections from `Setup`, but can also be called manually.

**Syntax**
```lua
ProgressionService:Update(Player: Player)
```

**Parameters**
- `Player` (`Player`) — The player whose progression should be recalculated.

**Returns**
- `nil`

**Example**
```lua
ProgressionService:Update(player)
```

---

### Give

Adds EXP to a player and immediately updates their progression (handling any resulting level-ups).

**Syntax**
```lua
ProgressionService:Give(Player: Player, Amount: number)
```

**Parameters**
- `Player` (`Player`) — The player to give EXP to.
- `Amount` (`number`) — The amount of EXP to add.

**Returns**
- `nil`

**Example**
```lua
-- Reward the player for completing a quest
ProgressionService:Give(player, 250)
```

---

### Take

Removes EXP from a player and immediately updates their progression (handling any resulting level-downs).

**Syntax**
```lua
ProgressionService:Take(Player: Player, Amount: number)
```

**Parameters**
- `Player` (`Player`) — The player to remove EXP from.
- `Amount` (`number`) — The amount of EXP to subtract.

**Returns**
- `nil`

**Example**
```lua
-- Penalize the player for dying
ProgressionService:Take(player, 50)
```

---

### GetEXP

Returns the player's current EXP.

**Syntax**
```lua
ProgressionService:GetEXP(Player: Player): number
```

**Parameters**
- `Player` (`Player`) — The player to query.

**Returns**
- `number` — The player's current EXP, or `0` if not set.

**Example**
```lua
local exp = ProgressionService:GetEXP(player)
print(exp .. " EXP")
```

---

### GetLevel

Returns the player's current Level.

**Syntax**
```lua
ProgressionService:GetLevel(Player: Player): number
```

**Parameters**
- `Player` (`Player`) — The player to query.

**Returns**
- `number` — The player's current level, or `1` if not set.

**Example**
```lua
local level = ProgressionService:GetLevel(player)
print("Level " .. level)
```

---

### GetMaxEXP

Returns the EXP required to complete the player's current level.

**Syntax**
```lua
ProgressionService:GetMaxEXP(Player: Player): number
```

**Parameters**
- `Player` (`Player`) — The player to query.

**Returns**
- `number` — The `MaxEXP` attribute if set, otherwise it's calculated on the fly from the player's current level via `LevelToMaxEXP`.

**Example**
```lua
local exp = ProgressionService:GetEXP(player)
local maxExp = ProgressionService:GetMaxEXP(player)
print(("%d / %d EXP"):format(exp, maxExp))
```

## Attributes

`ProgressionService` reads and writes the following Attributes directly on the `Player` instance:

| Attribute | Type     | Purpose                                                  | Default Value |
|-----------|----------|-----------------------------------------------------------|----------------|
| `EXP`     | `number` | Current experience points the player has accumulated.     | `5` (set in `Setup`) |
| `Level`   | `number` | Current level of the player.                               | `1` (set in `Setup`) |
| `MaxEXP`  | `number` | EXP required to complete the player's current level. Recalculated by `Update`. | Set on first `Update` call |

Since these are standard Roblox Attributes, they replicate automatically to the client and can be read directly with `Player:GetAttribute("EXP")`, or bound to UI with `Player:GetAttributeChangedSignal(...)`.

## Examples

**Basic setup on player join**
```lua
local Players = game:GetService("Players")
local ProgressionService = require(game.ReplicatedStorage.ProgressionService)

Players.PlayerAdded:Connect(function(player)
	ProgressionService:Setup(player)
end)
```

**Rewarding EXP for killing an enemy**
```lua
local function onEnemyKilled(player, enemy)
	local expReward = enemy:GetAttribute("EXPReward") or 10
	ProgressionService:Give(player, expReward)
end
```

**Displaying a live EXP bar on the client**
```lua
local player = game.Players.LocalPlayer

local function updateBar()
	local exp = player:GetAttribute("EXP") or 0
	local maxExp = player:GetAttribute("MaxEXP") or 100
	expBar.Size = UDim2.fromScale(exp / maxExp, 1)
	levelLabel.Text = "Level " .. (player:GetAttribute("Level") or 1)
end

player:GetAttributeChangedSignal("EXP"):Connect(updateBar)
player:GetAttributeChangedSignal("Level"):Connect(updateBar)
updateBar()
```

**Penalizing EXP loss (e.g. PvP death)**
```lua
local function onPlayerDied(player)
	ProgressionService:Take(player, 25)
end
```

## API Reference

| Function | Parameters | Description |
|----------|------------|--------------|
| `LevelToMaxEXP(Level)` | `Level: number` | Calculates max EXP required for a given level (`100 * Level ^ 1.65`). |
| `Setup(Player)` | `Player: Player` | Initializes `EXP`/`Level` attributes and connects auto-update listeners. |
| `Update(Player)` | `Player: Player` | Normalizes EXP/Level, handling level-up/down overflow and clamping EXP at 0. |
| `Give(Player, Amount)` | `Player: Player`, `Amount: number` | Adds EXP to the player and triggers an update. |
| `Take(Player, Amount)` | `Player: Player`, `Amount: number` | Subtracts EXP from the player and triggers an update. |
| `GetEXP(Player)` | `Player: Player` | Returns the player's current EXP. |
| `GetLevel(Player)` | `Player: Player` | Returns the player's current Level. |
| `GetMaxEXP(Player)` | `Player: Player` | Returns the EXP required to complete the player's current level. |
