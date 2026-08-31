import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Product } from "../types";

const SEARCH_DEBOUNCE_MS = 300;

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // debounce so we're not firing a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const query = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    api
      .get<Product[]>(`/products${query}`)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load products.");
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Products
      </Typography>

      <TextField
        label="Search by name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
        sx={{ mb: 2, width: 320 }}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {!error && !products && <CircularProgress />}

      {products && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Stock Quantity</TableCell>
                <TableCell align="right">Total Sold</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.stock_quantity}</TableCell>
                  <TableCell align="right">{product.total_sold}</TableCell>
                  <TableCell align="right">€{product.price}</TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
