-- Tabla de listas
CREATE TABLE listas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL DEFAULT 'Mi Lista',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lista_id UUID REFERENCES listas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  estado TEXT CHECK (estado IN ('hay', 'hay_poco', 'no_hay')) DEFAULT 'no_hay',
  categoria TEXT DEFAULT 'otros',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para queries por lista
CREATE INDEX idx_items_lista ON items(lista_id);

-- Habilitar realtime para la tabla items
ALTER PUBLICATION supabase_realtime ADD TABLE items;

-- Row Level Security (permisivo para simplificar - cualquiera puede leer/escribir)
ALTER TABLE listas ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Politicas permisivas para listas
CREATE POLICY "Allow all operations on listas" ON listas
  FOR ALL USING (true) WITH CHECK (true);

-- Politicas permisivas para items
CREATE POLICY "Allow all operations on items" ON items
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- MIGRACIONES
-- ============================================

-- Migración 2025-01-20: Preparar terreno para features futuros
-- Ejecutar manualmente en Supabase SQL Editor:

-- Agregar campo ultima_compra a items (para tracking de frescura)
-- Se actualiza cuando un item pasa a estado "hay"
ALTER TABLE items ADD COLUMN IF NOT EXISTS ultima_compra TIMESTAMPTZ;

-- Agregar configuracion JSON a listas (para feature flags futuros)
ALTER TABLE listas ADD COLUMN IF NOT EXISTS configuracion JSONB DEFAULT '{}';
