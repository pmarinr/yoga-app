import type { MealSlot } from '../hooks/useMeals'

// Plantilla semanal con criterio nutricional (dieta mediterránea, déficit moderado, 50 años)
// Garantiza por semana: pescado 4–5×, legumbres 3×, pollo/pavo 2–3×, huevo 1–2× cena,
// verduras en todas las comidas y cenas, fruta diaria.

export type DesayunoCat = 'yogurAvena' | 'porridge' | 'tostadaSalada' | 'huevoTostada'
export type SnackCat = 'fruta_fs' | 'fruta_lacteo' | 'lacteo_fs' | 'salado_ligero'
export type ComidaCat = 'legumbre' | 'pescado' | 'pollo' | 'cereal_verde'
export type CenaCat = 'pescado' | 'pollo_pavo' | 'huevo' | 'verdura_ligera'

export type MealCat = DesayunoCat | SnackCat | ComidaCat | CenaCat

// Plantilla por día de la semana (índice 0 = lunes ... 6 = domingo)
// Equilibrio semanal: 5 pescados (2 comida + 3 cena), 3 legumbres, 3 pollo (1 com + 2 cena),
// 1 huevo cena, 1 vegetariana comida, 1 cena verdura ligera.
export const WEEK_TEMPLATE: Record<MealSlot, MealCat[]> = {
  desayuno: ['yogurAvena', 'tostadaSalada', 'yogurAvena', 'huevoTostada', 'porridge', 'tostadaSalada', 'yogurAvena'],
  mediamanana: ['fruta_fs', 'fruta_lacteo', 'fruta_fs', 'salado_ligero', 'fruta_lacteo', 'fruta_fs', 'fruta_lacteo'],
  comida: ['legumbre', 'pescado', 'pollo', 'legumbre', 'pescado', 'legumbre', 'cereal_verde'],
  merienda: ['lacteo_fs', 'fruta_fs', 'lacteo_fs', 'fruta_fs', 'lacteo_fs', 'fruta_fs', 'lacteo_fs'],
  cena: ['pescado', 'pollo_pavo', 'pescado', 'huevo', 'pescado', 'pollo_pavo', 'verdura_ligera'],
}

// Pool por slot y categoría
export const POOL: Record<MealSlot, Record<string, string[]>> = {
  desayuno: {
    yogurAvena: [
      'Yogur natural + 30 g avena + plátano + 5 nueces',
      'Yogur griego + 30 g avena + frutos rojos + almendras',
      'Yogur natural + copos de avena + manzana rallada + canela',
      'Yogur natural + avena + kiwi + semillas de chía',
      'Yogur natural + muesli sin azúcar + arándanos',
    ],
    porridge: [
      'Porridge de avena con leche, canela y arándanos',
      'Porridge de avena con manzana, nueces y miel',
      'Porridge de avena con plátano, cacao puro y almendras',
      'Porridge de copos integrales con peras y semillas de lino',
    ],
    tostadaSalada: [
      'Tostada integral con tomate rallado, AOVE y queso fresco',
      'Tostada integral con aguacate, tomate y AOVE',
      'Tostada integral con hummus, tomate cherry y orégano',
      'Tostada integral con queso fresco, tomate y orégano',
      'Tostada integral con sardinillas, tomate y AOVE',
    ],
    huevoTostada: [
      '2 huevos revueltos con espinacas + tostada integral + 1 fruta',
      'Tortilla francesa de 2 huevos + tostada integral + 1 fruta',
      'Huevo poché + tostada integral con aguacate + 1 fruta',
      'Huevos revueltos con tomate + tostada integral + 1 fruta',
    ],
  },

  mediamanana: {
    fruta_fs: [
      'Manzana + 10 almendras',
      'Pera + 5 nueces',
      'Plátano + 8 almendras',
      '2 mandarinas + 5 nueces',
      'Naranja + puñado de pistachos',
      'Kiwi + 6 almendras',
    ],
    fruta_lacteo: [
      'Pera + yogur natural sin azúcar',
      'Manzana + yogur griego natural',
      'Plátano + yogur natural',
      'Macedonia de fruta + yogur natural',
      'Fresas + yogur griego sin azúcar',
    ],
    lacteo_fs: [
      'Yogur natural + 5 almendras',
      'Yogur griego + 3 nueces',
      'Yogur natural con canela + pipas de calabaza',
      'Kéfir + puñado de almendras',
    ],
    salado_ligero: [
      'Tostada integral con tomate y AOVE',
      'Zanahorias baby + 2 cucharadas de hummus',
      'Pepino y palitos de zanahoria con hummus',
      '4 nueces + 1 fruta + 1 onza de chocolate negro 85%',
    ],
  },

  comida: {
    legumbre: [
      'Lentejas estofadas con verduras + ensalada',
      'Garbanzos con espinacas y comino + tomate aliñado',
      'Ensalada de lentejas con tomate, pepino, cebolla y AOVE',
      'Potaje de garbanzos con verduras y bacalao desmigado',
      'Hummus con crudités + ensalada completa con quinoa',
      'Judías blancas con verduras y un huevo cocido',
      'Lentejas rojas al curry con arroz integral y verduras',
    ],
    pescado: [
      'Salmón al horno + verduras asadas',
      'Merluza al vapor + judías verdes salteadas + patata cocida pequeña',
      'Bacalao al horno con pimientos asados + ensalada',
      'Atún a la plancha + ensalada de quinoa con tomate y aceitunas',
      'Lubina al horno con cebolla, tomate y patata fina',
      'Caballa al horno con limón + verduras al vapor',
    ],
    pollo: [
      'Pechuga de pollo a la plancha + ensalada grande + 4 cdas. de arroz integral',
      'Pollo al limón con verduras al horno',
      'Wok de pollo y verduras + arroz integral pequeño',
      'Pavo a la plancha + crema de calabacín + ensalada',
      'Brochetas de pollo con verduras + cuscús integral',
    ],
    cereal_verde: [
      'Arroz integral con pisto + huevo cocido + ensalada',
      'Quinoa con verduras asadas y queso feta + ensalada',
      'Pasta integral con verduras salteadas y atún + ensalada',
      'Bowl de arroz integral, garbanzos, aguacate y verduras',
    ],
  },

  merienda: {
    fruta_fs: [
      'Manzana + 10 almendras',
      'Plátano + 5 nueces',
      'Pera + 8 almendras',
      'Mandarinas + pipas de girasol',
      'Fruta de temporada + 5 avellanas',
    ],
    lacteo_fs: [
      'Yogur natural + canela + 4 nueces',
      'Yogur griego sin azúcar + 5 almendras',
      'Kéfir + puñado pequeño de frutos secos',
      'Yogur natural + semillas de chía + canela',
    ],
    fruta_lacteo: [
      'Manzana + queso fresco batido',
      'Pera + yogur natural',
      'Macedonia + yogur natural',
    ],
    salado_ligero: [
      'Tortita de arroz integral con aguacate y tomate',
      'Hummus con palitos de zanahoria',
      'Tostada integral con queso fresco y tomate',
    ],
  },

  cena: {
    pescado: [
      'Salmón a la plancha + ensalada + verduras al vapor',
      'Merluza al vapor + judías verdes salteadas',
      'Bacalao al horno con tomate y cebolla + ensalada',
      'Lubina al papillote con verduras',
      'Sepia a la plancha + crema de puerros + ensalada',
      'Wok de gambas con verduras + ración pequeña de arroz integral',
      'Pescado blanco al horno con limón + espárragos trigueros',
    ],
    pollo_pavo: [
      'Pechuga de pavo a la plancha + crema de verduras + ensalada',
      'Pollo al limón + ensalada mixta',
      'Brochetas de pollo con verduras + ensalada',
      'Pavo a la plancha con calabacín y zanahoria al vapor',
    ],
    huevo: [
      'Tortilla francesa de 2 huevos + ensalada completa',
      'Tortilla de calabacín + ensalada',
      'Revuelto de espárragos y gambas + ensalada',
      'Huevos al plato con tomate y espinacas + tostada integral',
    ],
    verdura_ligera: [
      'Crema de calabacín + queso fresco batido + 1 huevo cocido',
      'Sopa de verduras + tortilla francesa + ensalada',
      'Ensalada completa: lechuga, atún, huevo, tomate, aguacate',
      'Crema de puerros + queso fresco + tostada integral',
    ],
  },
}
