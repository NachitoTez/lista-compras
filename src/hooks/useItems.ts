import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Item, EstadoItem, NuevoItem } from '../types';

export function useItems(listaId: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial items
  useEffect(() => {
    if (!listaId) {
      setLoading(false);
      return;
    }

    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('lista_id', listaId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar items');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [listaId]);

  // Realtime subscription
  useEffect(() => {
    if (!listaId) return;

    const channel = supabase
      .channel(`items:${listaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `lista_id=eq.${listaId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new as Item]);
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as Item) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listaId]);

  const agregarItem = useCallback(
    async (nuevoItem: NuevoItem) => {
      if (!listaId) return null;

      try {
        const { data, error } = await supabase
          .from('items')
          .insert({
            lista_id: listaId,
            nombre: nuevoItem.nombre,
            categoria: nuevoItem.categoria,
            estado: 'no_hay',
          })
          .select()
          .single();

        if (error) throw error;
        return data as Item;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al agregar item');
        return null;
      }
    },
    [listaId]
  );

  const actualizarEstado = useCallback(async (itemId: string, estado: EstadoItem) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ estado })
        .eq('id', itemId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado');
    }
  }, []);

  const eliminarItem = useCallback(async (itemId: string) => {
    // Optimistic update - remove immediately from UI
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      const { error } = await supabase.from('items').delete().eq('id', itemId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar item');
      // TODO: could restore item on error, but keeping simple for now
    }
  }, []);

  const actualizarNombre = useCallback(async (itemId: string, nombre: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ nombre })
        .eq('id', itemId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar nombre');
    }
  }, []);

  return {
    items,
    loading,
    error,
    agregarItem,
    actualizarEstado,
    actualizarNombre,
    eliminarItem,
  };
}
