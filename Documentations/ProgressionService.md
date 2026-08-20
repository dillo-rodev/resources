# ProgressionService

A modular Roblox progression system for managing player EXP and levels.

## Overview

ProgressionService handles:

- Player EXP
- Player levels
- EXP requirements
- Giving EXP
- Taking EXP
- Retrieving player progression

## LevelToMaxEXP

Calculates the maximum EXP required for a level.

```lua
local MaxEXP = ProgressionService.LevelToMaxEXP(Level)
