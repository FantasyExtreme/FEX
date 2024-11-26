import { useState, useEffect, useTransition } from 'react';

// Mock data generator
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `squad-${i + 1}`,
    name: `Squad ${i + 1}`,
    rank: i + 1,
    points: Math.floor(Math.random() * 1000),
    mine: i === count - 1, // The last squad is the user's squad
  }));
};

// Hook to simulate changing data
export const useSimulatedRankings = (initialCount: number) => {
  const [squads, setSquads] = useState(generateMockData(initialCount));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const intervalId = setInterval(() => {
      startTransition(() => {
        setSquads((prevSquads) => {
          // Randomly change points and re-sort
          const updatedSquads = prevSquads.map((squad) => ({
            ...squad,
            // points: squad.points + Math.floor(Math.random() * 200) - 100
            rank:
              squad.rank == 2
                ? 4
                : squad.rank == 4
                  ? 2
                  : squad.rank == 1
                    ? 3
                    : squad.rank == 3
                      ? 1
                      : squad.rank,
            // points: squad.points + Math.floor(Math.random() * 100) - 50
          }));

          // Sort by points
          updatedSquads.sort((a, b) => b.rank - a.rank);

          // Update ranks
          return updatedSquads.map((squad, index) => ({
            ...squad,
          }));
        });
      });
    }, 3000); // Change data every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return squads;
};
