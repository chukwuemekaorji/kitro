import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
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
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Product } from "../types";

const SEARCH_DEBOUNCE_MS = 300;

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

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

  async function handleConfirmDelete() {
    if (!productPendingDelete) return;
    setDeleting(true);
    setActionError(null);
    try {
      await api.delete(`/products/${productPendingDelete.id}`);
      setProducts((prev) => prev?.filter((p) => p.id !== productPendingDelete.id) ?? prev);
      setProductPendingDelete(null);
    } catch {
      setActionError("Could not delete product.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleFavourite(product: Product) {
    setTogglingId(product.id);
    setActionError(null);
    try {
      const updated = await api.patch<Product>(`/products/${product.id}/favourite`);
      setProducts((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? prev);
    } catch {
      setActionError("Could not update favourite.");
    } finally {
      setTogglingId(null);
    }
  }

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
      {actionError && <Alert severity="error">{actionError}</Alert>}
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.stock_quantity}</TableCell>
                  <TableCell align="right">{product.total_sold}</TableCell>
                  <TableCell align="right">€{product.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label={
                        product.is_favourite
                          ? `Remove ${product.name} from favourites`
                          : `Add ${product.name} to favourites`
                      }
                      size="small"
                      disabled={togglingId === product.id}
                      onClick={() => handleToggleFavourite(product)}
                    >
                      {product.is_favourite ? (
                        <StarIcon fontSize="small" sx={{ color: "primary.main" }} />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      aria-label={`Delete ${product.name}`}
                      size="small"
                      onClick={() => setProductPendingDelete(product)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={productPendingDelete !== null}
        title="Delete product"
        description={
          productPendingDelete
            ? `Are you sure you want to delete "${productPendingDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductPendingDelete(null)}
        loading={deleting}
      />
    </Box>
  );
}
