export type EstadoItem = 'hay' | 'hay_poco' | 'no_hay';

export type Categoria =
  | 'lacteos'
  | 'carnes'
  | 'verduras'
  | 'frutas'
  | 'limpieza'
  | 'otros';

export interface Lista {
  id: string;
  nombre: string;
  created_at: string;
  configuracion?: Record<string, unknown>;
}

export interface Item {
  id: string;
  lista_id: string;
  nombre: string;
  estado: EstadoItem;
  categoria: Categoria;
  created_at: string;
  ultima_compra?: string;
}

export interface NuevoItem {
  nombre: string;
  categoria: Categoria;
}

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'lacteos', label: 'Lacteos' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'verduras', label: 'Verduras' },
  { value: 'frutas', label: 'Frutas' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'otros', label: 'Otros' },
];

export const ESTADOS: { value: EstadoItem; label: string; color: string }[] = [
  { value: 'hay', label: 'Hay', color: '#22c55e' },
  { value: 'hay_poco', label: 'Hay poco', color: '#eab308' },
  { value: 'no_hay', label: 'No hay', color: '#ef4444' },
];
