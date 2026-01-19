#!/bin/bash
# Script para validar el estado de la app Lista de Compras
# Uso: ./scripts/validate.sh [lista_id]

set -e

# Cargar variables de entorno
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
elif [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "Error: No se encontró archivo .env"
  exit 1
fi

SUPABASE_URL="https://tivrnxbzqnkpyyrovhbu.supabase.co"
LISTA_ID="${1:-}"

echo "=== Validación Lista de Compras ==="
echo ""

# 1. Verificar conexión a Supabase
echo "1. Conexión a Supabase..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/listas?select=id&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY")
if [ "$HEALTH" = "200" ]; then
  echo "   ✅ Supabase conectado"
else
  echo "   ❌ Error de conexión (HTTP $HEALTH)"
  exit 1
fi

# 2. Contar listas
echo ""
echo "2. Estadísticas generales..."
LISTAS=$(curl -s "$SUPABASE_URL/rest/v1/listas?select=id" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "Prefer: count=exact" -I 2>/dev/null | grep -i content-range | sed 's/.*\///')
echo "   Total listas: ${LISTAS:-0}"

ITEMS_TOTAL=$(curl -s "$SUPABASE_URL/rest/v1/items?select=id" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "Prefer: count=exact" -I 2>/dev/null | grep -i content-range | sed 's/.*\///')
echo "   Total items: ${ITEMS_TOTAL:-0}"

# 3. Si se pasó una lista específica, mostrar detalles
if [ -n "$LISTA_ID" ]; then
  echo ""
  echo "3. Detalle de lista: $LISTA_ID"

  # Obtener items de la lista
  ITEMS=$(curl -s "$SUPABASE_URL/rest/v1/items?lista_id=eq.$LISTA_ID&select=nombre,estado,categoria&order=created_at" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY")

  if [ "$ITEMS" = "[]" ]; then
    echo "   Lista vacía o no existe"
  else
    echo ""
    echo "   Items:"
    echo "$ITEMS" | python3 -c "
import sys, json
items = json.load(sys.stdin)
estados = {'no_hay': '🔴', 'hay_poco': '🟡', 'hay': '🟢'}
for item in items:
    icon = estados.get(item['estado'], '⚪')
    print(f\"   {icon} {item['nombre']} ({item['categoria']})\")" 2>/dev/null || echo "$ITEMS"

    # Resumen por estado
    echo ""
    echo "   Resumen:"
    echo "$ITEMS" | python3 -c "
import sys, json
from collections import Counter
items = json.load(sys.stdin)
estados = Counter(item['estado'] for item in items)
print(f\"   🔴 No hay: {estados.get('no_hay', 0)}\")
print(f\"   🟡 Hay poco: {estados.get('hay_poco', 0)}\")
print(f\"   🟢 Hay: {estados.get('hay', 0)}\")" 2>/dev/null
  fi
fi

# 4. Verificar Vercel
echo ""
echo "4. Vercel deployment..."
VERCEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://lista-compras-beta-three.vercel.app")
if [ "$VERCEL_STATUS" = "200" ]; then
  echo "   ✅ Vercel respondiendo (HTTP 200)"
else
  echo "   ⚠️  Vercel HTTP $VERCEL_STATUS"
fi

echo ""
echo "=== Validación completa ==="
