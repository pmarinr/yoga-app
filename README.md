# Yoga 12 semanas

PWA personal para seguir un plan de yoga progresivo combinado con dieta mediterránea, peso y gamificación. Pensada como app de estilo de vida (estética tipo Apple Health/Fitness), instalable y 100% local.

## Funcionalidades

### Plan
- **Plan dinámico** de N semanas (1–52) configurable, con 3 fases proporcionales (adaptación · progresión · quema de grasa).
- **Calendario y mapa de calor** agrupados por fase, con rango de fechas reales por fase y por semana.
- **Diseño responsive**: en pantallas grandes los dos calendarios aparecen lado a lado; en móvil se apilan.
- Modal por día con vídeo embebido, duración y notas.

### Vídeos
- Catálogo de Xuan Lan Yoga organizado por fase.
- Reproductor in-app sin salir de la PWA.

### Peso
- Registro con gráfico de evolución (Recharts).
- **Línea de tendencia** por regresión lineal y **fecha estimada de cruce con el objetivo** (ETA).
- **Estimación del peso en la fecha límite** con la tendencia actual (verde si llegas, ámbar si te falta).
- Histórico editable, kg/semana, % al objetivo.

### Dieta
- Plan mediterráneo semanal generado con criterio nutricional (cuotas de pescado, legumbres, ave, huevo, vegetariana, fruta diaria).
- Regenerable por semana; cambios por comida en la misma categoría para no romper el equilibrio.
- Búsqueda directa de recetas en **Google AI** y **YouTube** desde cada plato.
- Edición libre y diario de comidas marcadas.

### Gamificación
- Anillos de actividad (yoga / dieta / peso) y heat-map de consistencia.
- Rachas, mejor racha, semanas completas.
- 17 medallas desbloqueables (rachas, sesiones, fases, dieta perfecta, % de peso al objetivo).
- Niveles del yogui (Aprendiz → Sensei) por XP acumulada.
- Confetti y animaciones tipo Apple al completar hitos.
- Frase motivadora del día.

### Ajustes
- **Meta configurable**: peso inicial, peso meta, fecha de inicio, semanas y fecha límite (sincronizadas).
- **Botón "Actualizar"** con borrador local: tus cambios no se aplican hasta confirmarlos.
- Tema **claro / oscuro / auto** (sigue al sistema).
- **Sincronización entre dispositivos por QR** (sin servidor, sin login).
- **Exportar / Importar JSON** como backup adicional.
- **Recordatorio diario** (Notification API) con hora configurable.

### Visual
- Tipografía SF Pro (system) y paleta iOS por sección.
- Cards "glass" con backdrop-blur, esquinas 3xl, sombras suaves.
- Sidebar con título dinámico **Yoga N semanas**, peso inicio→meta y rango de fechas.
- `document.title` actualizado al cambiar la meta.

## Comandos rápidos de Claude Code

Estos comandos están en `.claude/commands/` y se invocan dentro de Claude Code:

| Comando | Qué hace |
|---------|----------|
| `/dev` | Arranca el servidor Vite en `http://localhost:5173/yoga-app/`. Instala dependencias si faltan y evita duplicar el proceso si ya está corriendo. |
| `/stop` | Detiene el servidor de desarrollo y libera el puerto 5173. |
| `/push [mensaje]` | `git add + commit + push` a `main` desde `yoga-app/`. Si no le pasas mensaje, lo redacta a partir del diff. Avisa si detecta secretos. |

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

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** con `darkMode: 'class'`
- **vite-plugin-pwa** (manifest + service worker offline)
- **react-router-dom** v7
- **Recharts** para la gráfica de peso
- **framer-motion** para animaciones, **canvas-confetti** para los hitos
- **qrcode** + **qr-scanner** + **lz-string** para sync por QR
- Persistencia con `localStorage` (claves bajo el namespace `yoga.*`)

## Estructura

```
yoga-app/
├─ src/
│  ├─ components/   Card, Layout, ActivityRings, HeatMap, WeekGrid…
│  ├─ data/         plan, videos, dietPool, badges, quotes
│  ├─ hooks/        useGoals, usePlan, useStats, useLevel, useBadges, useDietPlan…
│  ├─ lib/          backup, sync, forecast, dates, dietGenerator
│  └─ pages/        Dashboard, Plan, Videos, Peso, Dieta, Logros, Guia, Ajustes
└─ public/
   ├─ recursos/     calendario y guía de posturas (PNG)
   └─ favicon.svg
```

## Datos

Todo se guarda en `localStorage` del navegador. Claves principales:

- `yoga.goals` — peso inicial / meta / semanas
- `yoga.startDate` — fecha de inicio del plan
- `yoga.sessions` — sesiones marcadas como hechas
- `yoga.weights` — registros de peso
- `yoga.dietSeeds` / `yoga.dietOverrides` / `yoga.dietDone` — dieta generada y marcada
- `yoga.badgesSeen` — medallas vistas (para evitar volver a notificarlas)
- `yoga.theme` — preferencia de tema
- `yoga.reminder` — hora del recordatorio

Para no perder los datos al cambiar de dispositivo:

- **Ajustes → Compartir / Importar por QR** (escaneo entre móviles).
- **Ajustes → Exportar / Importar JSON** (archivo).

## Git manual

Si prefieres no usar `/push`:

```bash
cd yoga-app
git add . && git commit -m "Resumen del cambio" && git push
```
