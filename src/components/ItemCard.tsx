import { useState, useRef, useEffect } from 'react';
import type { Item, EstadoItem } from '../types';
import { ESTADOS } from '../types';
import styles from './ItemCard.module.css';

interface ItemCardProps {
  item: Item;
  onEstadoChange: (itemId: string, estado: EstadoItem) => void;
  onNombreChange: (itemId: string, nombre: string) => void;
  onDelete: (itemId: string) => void;
}

const ESTADO_COLORS: Record<EstadoItem, string> = {
  hay: 'rgba(34, 197, 94, 0.15)',
  hay_poco: 'rgba(234, 179, 8, 0.15)',
  no_hay: 'rgba(239, 68, 68, 0.15)',
};

const ESTADO_BORDER: Record<EstadoItem, string> = {
  hay: 'rgba(34, 197, 94, 0.4)',
  hay_poco: 'rgba(234, 179, 8, 0.4)',
  no_hay: 'rgba(239, 68, 68, 0.4)',
};

export function ItemCard({ item, onEstadoChange, onNombreChange, onDelete }: ItemCardProps) {
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState(item.nombre);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNombre(item.nombre);
  }, [item.nombre]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = nombre.trim();
    if (trimmed && trimmed !== item.nombre) {
      onNombreChange(item.id, trimmed);
    } else {
      setNombre(item.nombre);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setNombre(item.nombre);
      setEditing(false);
    }
  };

  const cycleEstado = () => {
    const order: EstadoItem[] = ['no_hay', 'hay_poco', 'hay'];
    const currentIndex = order.indexOf(item.estado);
    const nextIndex = (currentIndex + 1) % order.length;
    onEstadoChange(item.id, order[nextIndex]);
  };

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: ESTADO_COLORS[item.estado],
        borderColor: ESTADO_BORDER[item.estado],
      }}
    >
      <div className={styles.estadoIndicator} onClick={cycleEstado}>
        {ESTADOS.map((estado) => (
          <span
            key={estado.value}
            className={`${styles.dot} ${item.estado === estado.value ? styles.active : ''}`}
            style={{ backgroundColor: estado.color }}
            onClick={(e) => {
              e.stopPropagation();
              onEstadoChange(item.id, estado.value);
            }}
            title={estado.label}
          />
        ))}
      </div>

      <div className={styles.info}>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            className={styles.editInput}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className={styles.nombre}
            onClick={() => setEditing(true)}
            title="Click para editar"
          >
            {item.nombre}
          </span>
        )}
        <span className={styles.categoria}>{item.categoria}</span>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => {
          if (window.confirm(`¿Eliminar "${item.nombre}"?`)) {
            onDelete(item.id);
          }
        }}
        title="Eliminar"
      >
        ×
      </button>
    </div>
  );
}
