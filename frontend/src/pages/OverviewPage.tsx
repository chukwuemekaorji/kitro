import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";

interface OverviewStats {
  total_sold: number;
  total_available: number;
}

const STAT_CARDS = [
  { key: "total_sold" as const, label: "Total Products Sold" },
  { key: "total_available" as const, label: "Total Products Available" },
];

export function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<OverviewStats>("/overview/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load overview stats.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Overview
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {!error && !stats && <CircularProgress />}

      {stats && (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {STAT_CARDS.map((card) => (
            <Card key={card.key} variant="outlined" sx={{ minWidth: 220 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  {stats[card.key].toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
