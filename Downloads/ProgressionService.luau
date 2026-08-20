local ProgressionService = {}

function ProgressionService.LevelToMaxEXP(Level)
	return math.floor(100 * Level ^ 1.65)
end

function ProgressionService:Setup(Player)
	Player:SetAttribute("EXP", 5)
	Player:SetAttribute("Level", 1)
	
	Player:GetAttributeChangedSignal("EXP"):Connect(function()
		self:Update(Player)
	end)
	
	Player:GetAttributeChangedSignal("Level"):Connect(function()
		self:Update(Player)
	end)
end

function ProgressionService:Update(Player)
	local EXP = Player:GetAttribute("EXP") or 0
	local Level = Player:GetAttribute("Level") or 1
	local MaxEXP = self.LevelToMaxEXP(Level)

	while EXP >= MaxEXP do
		EXP -= MaxEXP
		Level += 1
		MaxEXP = self.LevelToMaxEXP(Level)
	end

	while EXP < 0 and Level > 1 do
		Level -= 1
		MaxEXP = self.LevelToMaxEXP(Level)
		EXP += MaxEXP
	end

	EXP = math.max(0, EXP)

	Player:SetAttribute("EXP", EXP)
	Player:SetAttribute("Level", Level)
	Player:SetAttribute("MaxEXP", MaxEXP)
end

function ProgressionService:Give(Player, Amount)
	local EXP = Player:GetAttribute("EXP") or 0

	Player:SetAttribute("EXP", EXP + Amount)
	self:Update(Player)
end

function ProgressionService:Take(Player, Amount)
	local EXP = Player:GetAttribute("EXP") or 0

	Player:SetAttribute("EXP", EXP - Amount)
	self:Update(Player)
end

function ProgressionService:GetEXP(Player)
	return Player:GetAttribute("EXP") or 0
end

function ProgressionService:GetLevel(Player)
	return Player:GetAttribute("Level") or 1
end

function ProgressionService:GetMaxEXP(Player)
	return Player:GetAttribute("MaxEXP") or self.LevelToMaxEXP(self:GetLevel(Player))
end

return ProgressionService