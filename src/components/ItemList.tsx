import type { Item, EstadoItem, Categoria } from '../types';
import { ItemCard } from './ItemCard';
import styles from './ItemList.module.css';

interface ItemListProps {
  items: Item[];
  filtroCategoria: Categoria | 'todas';
  onEstadoChange: (itemId: string, estado: EstadoItem) => void;
  onNombreChange: (itemId: string, nombre: string) => void;
  onDelete: (itemId: string) => void;
}

const ESTADO_ORDER: Record<EstadoItem, number> = {
  no_hay: 0,
  hay_poco: 1,
  hay: 2,
};

export function ItemList({
  items,
  filtroCategoria,
  onEstadoChange,
  onNombreChange,
  onDelete,
}: ItemListProps) {
  const itemsFiltrados =
    filtroCategoria === 'todas'
      ? items
      : items.filter((item) => item.categoria === filtroCategoria);

  const itemsOrdenados = [...itemsFiltrados].sort((a, b) => {
    return ESTADO_ORDER[a.estado] - ESTADO_ORDER[b.estado];
  });

  if (itemsOrdenados.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay items{filtroCategoria !== 'todas' ? ' en esta categoria' : ''}.</p>
        <p>Agrega uno usando el formulario de arriba.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {itemsOrdenados.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEstadoChange={onEstadoChange}
          onNombreChange={onNombreChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
