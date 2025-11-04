"use client"
import React, { useState, useEffect } from 'react'
import LeaderboardList from './LeaderboardList'
import dataArr from '../../public/data.json'
import useMobileLayout from '@/hooks/useMobileLayout';

import lockedPlayersArr from '../../public/locked_players.json';

function Leaderboard({ topPerformer }) {
  const isMobile = useMobileLayout();

  const imported_data = JSON.stringify(dataArr);
  const data = JSON.parse(imported_data);

  const [Participationdata, setParticipationdata] = useState(() => {
    const lockedPlayersMap = new Map(lockedPlayersArr.map(p => [p["User Name"], p.locked_position]));

    const indexedData = data.map((participant, index) => ({
      ...participant,
      originalIndex: index,
      locked_position: lockedPlayersMap.get(participant["User Name"]),
    }));

    const lockedParticipants = [];
    const newMilestoneParticipants = [];
    const otherParticipants = [];

    indexedData.forEach(participant => {
      const badges = Number(participant['# of Skill Badges Completed'] ?? 0);
      const games = Number(participant['# of Arcade Games Completed'] ?? 0);

      if (participant.locked_position) {
        lockedParticipants.push(participant);
      } else if (badges === 19 && games === 1) {
        newMilestoneParticipants.push(participant);
      } else {
        otherParticipants.push(participant);
      }
    });

    lockedParticipants.sort((a, b) => a.locked_position - b.locked_position);

    const sortByScore = (a, b) => {
      const coursesA = Number(a['# of Courses Completed'] ?? 0);
      const coursesB = Number(b['# of Courses Completed'] ?? 0);
      if (coursesB !== coursesA) return coursesB - coursesA;

      const badgesA = Number(a['# of Skill Badges Completed'] ?? 0);
      const badgesB = Number(b['# of Skill Badges Completed'] ?? 0);
      if (badgesB !== badgesA) return badgesB - badgesA;

      const gamesA = Number(a['# of Arcade Games Completed'] ?? 0);
      const gamesB = Number(b['# of Arcade Games Completed'] ?? 0);
      if (gamesB !== gamesA) return gamesB - gamesA;

      return a.originalIndex - b.originalIndex;
    };

    newMilestoneParticipants.sort(sortByScore);
    otherParticipants.sort(sortByScore);

    return [...lockedParticipants, ...newMilestoneParticipants, ...otherParticipants].slice(0, 100);
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = Participationdata.filter((participant) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    const name = String(participant['User Name'] || '').toLowerCase();
    const email = String(participant['User Email'] || '').toLowerCase();
    const badges = String(participant['# of Skill Badges Completed'] ?? '').toLowerCase();
    const games = String(participant['# of Arcade Games Completed'] ?? '').toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query) ||
      badges.includes(query) ||
      games.includes(query)
    );
  });

  return (
    <div className='w-full relative px-4 md:px-6'>
      <h2 className="text-2xl md:text-3xl font-bold text-center my-8">Leaderboard</h2>
      <div className="max-w-3xl mx-auto mb-4">
        <input
          type="text"
          aria-label="Search participants by name, email, badges, or games"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-card-background)] px-4 py-2 text-sm text-[var(--color-primary)] placeholder-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      {isMobile ? (
        <LeaderboardList Participationdata={filteredData} searchTerm={searchTerm} topPerformer={topPerformer} />
      ) : (
        <div className='w-full overflow-x-auto'>
          <table className='mx-auto w-full table-fixed m-5 border-collapse'>
            <thead className='text-sm text-[var(--color-secondary)] sticky top-2 z-10'>
              <tr className='text-left'>
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Skill Badges</th>
                <th className="p-4 font-semibold">Arcade Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm text-[var(--color-primary)]">
              {filteredData.map((participant, index) => {
                const badges = Number(participant['# of Skill Badges Completed'] ?? 0);
                const games = Number(participant['# of Arcade Games Completed'] ?? 0);
                const isCampaignCompleter = badges === 19 && games === 1;
                let displayRank = index + 1;
                if (participant.locked_position) {
                  displayRank = participant.locked_position;
                } else {
                  const lockedCount = Participationdata.filter(p => p.locked_position).length;
                  const newMilestoneCount = Participationdata.filter(p => p.badges === 19 && p.games === 1 && !p.locked_position).length;
                  const unlockedBefore = Participationdata.slice(lockedCount + newMilestoneCount).findIndex(p => p["User Name"] === participant["User Name"]);
                  if (unlockedBefore !== -1) {
                    displayRank = lockedCount + newMilestoneCount + unlockedBefore + 1;
                  }
                }
                
                return (
                  <tr key={participant.originalIndex} className={`group transition-colors ${
                    isCampaignCompleter 
                      ? "top-performer-row" 
                      : ""
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{displayRank}</span>
                        
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="truncate">
                        {participant["Google Cloud Skills Boost Profile URL"] ? (
                          <a 
                            href={participant["Google Cloud Skills Boost Profile URL"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors duration-200 ${
                              isCampaignCompleter 
                                ? "" 
                                : "text-[var(--color-primary)] group-hover:text-[var(--color-accent)]"
                            }`}
                            title="View Google Cloud Skills Boost Profile"
                          >
                            {participant["User Name"]}
                          </a>
                        ) : (
                          <span className={`${
                            isCampaignCompleter 
                              ? "" 
                              : "text-[var(--color-primary)] group-hover:text-[var(--color-accent)]"
                          }`}>
                            {participant["User Name"]}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-secondary)] truncate">{participant["User Email"]?.toLowerCase() || "Email hidden"}</div>
                    </td>
                    <td className="p-4">{participant["# of Skill Badges Completed"]}</td>
                    <td className="p-4">{participant["# of Arcade Games Completed"]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Leaderboard;