import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? "/overview";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await api.post<LoginResponse>("/auth/login", { email, password });
      login(response.access_token);
      navigate(redirectTo, { replace: true });
    } catch {
      // generic message either way - don't reveal which field was wrong
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={0} variant="outlined" sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}>
          Kitro
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" disabled={submitting} fullWidth>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
