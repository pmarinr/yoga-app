# Yoga 12 semanas

PWA personal para seguir el plan de yoga de 12 semanas (94 → 85 kg).

## Funcionalidades

- Dashboard con la sesión recomendada de hoy y vídeo embebido.
- Plan visual de 12 semanas × 7 días con check de sesión y modal por día.
- Catálogo de vídeos (Xuan Lan Yoga) por fase.
- Registro de peso con gráfico de evolución, línea de tendencia y fecha estimada al objetivo.
- Dieta mediterránea semanal con criterio nutricional, regenerable y editable.
- Búsqueda de recetas en Google AI y YouTube por comida.
- Gamificación: rachas, medallas, niveles, anillos de actividad, heat-map y confetti.
- Sincronización entre dispositivos por código QR (sin servidor).
- Recordatorios diarios (PWA notifications).
- Modo claro / oscuro / auto con diseño tipo Apple.
- Export/Import JSON para backup local.
- Funciona offline (PWA instalable).

## Comandos rápidos de Claude Code

Estos comandos están en `.claude/commands/` y se invocan dentro de Claude Code:

| Comando | Qué hace |
|---------|----------|
| `/dev` | Arranca el servidor Vite en `http://localhost:5173/yoga-app/`. Instala dependencias si faltan y evita duplicar el proceso si ya está corriendo. |
| `/stop` | Detiene el servidor de desarrollo y libera el puerto 5173. |
| `/push [mensaje]` | `git add + commit + push` a `main`. Si no le pasas mensaje, lo redacta a partir del diff. Avisa si detecta secretos. |

Ejemplo de flujo típico:

```
/dev
… haces cambios …
/push mejora la gráfica de peso
/stop
```

## Desarrollo manual (sin Claude Code)

```bash
npm install --legacy-peer-deps
npm run dev
```

URL local: `http://localhost:5173/yoga-app/`

## Build

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

1. Crea un repo público llamado `yoga-app` y haz push.
2. En GitHub → **Settings → Pages → Source: GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` despliega en cada push a `main`.
4. URL final: `https://<usuario>.github.io/yoga-app/`

Si tu repo se llama distinto, edita `base` en `vite.config.ts` y `start_url`/`scope` del manifest.

## Datos

Todo se guarda en `localStorage` del navegador. Para no perderlos al cambiar de dispositivo tienes dos opciones:

- **Ajustes → Compartir / Importar por QR** (escaneo entre móviles).
- **Ajustes → Exportar / Importar JSON** (archivo).

## Git manual

Si prefieres no usar `/push`:

```bash
git add . && git commit -m "Resumen del cambio" && git push
```
