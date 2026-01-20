import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Lista } from '../types';

export function useList(listaId: string | null) {
  const [lista, setLista] = useState<Lista | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listaId) {
      setLoading(false);
      return;
    }

    async function fetchLista() {
      try {
        const { data, error } = await supabase
          .from('listas')
          .select('*')
          .eq('id', listaId)
          .single();

        if (error) throw error;
        setLista(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la lista');
      } finally {
        setLoading(false);
      }
    }

    fetchLista();
  }, [listaId]);

  const crearLista = useCallback(async (nombre: string = 'Mi Lista') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listas')
        .insert({ nombre })
        .select()
        .single();

      if (error) throw error;
      return data as Lista;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la lista');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarNombre = useCallback(async (listaId: string, nombre: string) => {
    try {
      const { error } = await supabase
        .from('listas')
        .update({ nombre })
        .eq('id', listaId);

      if (error) throw error;
      setLista((prev) => prev ? { ...prev, nombre } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar nombre de lista');
    }
  }, []);

  return { lista, loading, error, crearLista, actualizarNombre };
}
