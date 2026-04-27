# Yoga 12 semanas

PWA personal para seguir el plan de yoga de 12 semanas (94 → 85 kg).

## Funcionalidades

- Dashboard con la sesión recomendada de hoy y vídeo embebido.
- Plan visual de 12 semanas × 7 días con check de sesión y modal por día.
- Catálogo de vídeos (Xuan Lan Yoga) por fase.
- Registro de peso con gráfico de evolución y % al objetivo.
- Diario diario de comidas mediterráneas.
- Export/Import JSON para backup local.
- Funciona offline (PWA instalable).

## Desarrollo

```bash
npm install --legacy-peer-deps
npm run dev
```

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

Todo se guarda en `localStorage` del navegador. Usa **Ajustes → Exportar JSON** para no perder los datos al cambiar de dispositivo.
