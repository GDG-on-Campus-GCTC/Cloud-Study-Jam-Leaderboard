import React from "react";

function ParticipantCard({ participant, position, topPerformer }) {
  const badges = Number(participant['# of Skill Badges Completed'] ?? 0);
  const games = Number(participant['# of Arcade Games Completed'] ?? 0);
  const isCampaignCompleter = badges === 19 && games === 1;
  
  return (
    <div className={`p-3 rounded-lg shadow-md flex items-center space-x-3 transition-all duration-300 group ${
      isCampaignCompleter 
        ? "top-performer-card" 
        : "bg-[var(--color-card-background)]"
    }`}>
      
      {/* Position / Rank number in black/white based on theme */}
      <div className="text-lg font-semibold text-[var(--color-header-text)] flex-shrink-0 flex items-center gap-2">
        <span>{position}</span>
      </div>

      <div className="flex-grow min-w-0">
        <div className="text-base font-medium text-[var(--color-primary)] truncate">
          {participant["Google Cloud Skills Boost Profile URL"] ? (
            <a 
              href={participant["Google Cloud Skills Boost Profile URL"]}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-200 ${
                isCampaignCompleter 
                  ? "text-yellow-600 font-semibold" 
                  : "text-[var(--color-primary)]"
              }`}
              title="View Google Cloud Skills Boost Profile"
              >
                {participant["User Name"]}
              </a>
          ) : (
            <span className={`${
              isCampaignCompleter 
                ? "text-yellow-600 font-semibold" 
                : "text-[var(--color-primary)]"
            }`}>
              {participant["User Name"]}
            </span>
          )}
        </div>
        <div className="text-sm text-[var(--color-secondary)] truncate">
          {participant["User Email"]?.toLowerCase() || "Email hidden"}
        </div>
      </div>

      <div className="flex flex-col items-end flex-shrink-0">
        <div className="text-xs text-[var(--color-primary)]">
          Skill Badges: {participant["# of Skill Badges Completed"]}
        </div>
        <div className="text-xs text-[var(--color-primary)]">
          Arcade Games: {participant["# of Arcade Games Completed"]}
        </div>
      </div>

    </div>
  );
}

export default ParticipantCard;
