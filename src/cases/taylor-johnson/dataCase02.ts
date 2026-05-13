// Data source for the AS/400 → PDF animation (Case 02).

export const PDF_PAGE = { w: 297, h: 210, orientation: 'landscape' as const }

export interface PdfParam {
  type: 'TEXT' | 'RECT' | 'LINE'
  x: number
  y: number
  w?: number
  align: 'L' | 'R' | '-'
  text: string
  size: number
  r: number
  g: number
  b: number
}

export const PDF_PARAMS: PdfParam[] = [
  // ── Top banner ─────────────────────────────────────────────────────────────
  { type: 'RECT', x: 0,   y: 0,   w: 297, align: '-', text: '-',                                           size: 34,  r: 37,  g: 99,  b: 235 },
  { type: 'TEXT', x: 15,  y: 14,  align: 'L', text: 'BANCO PRESTO S.A.',                                   size: 8,   r: 191, g: 219, b: 254 },
  { type: 'TEXT', x: 15,  y: 24,  align: 'L', text: 'PLAN DE PAGOS',                                       size: 18,  r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 282, y: 12,  align: 'R', text: 'REF: PDFP001-2026-082347',                            size: 7,   r: 191, g: 219, b: 254 },
  { type: 'TEXT', x: 282, y: 18,  align: 'R', text: 'Emitido: 22/05/2026 14:32',                           size: 7,   r: 191, g: 219, b: 254 },
  { type: 'TEXT', x: 282, y: 26,  align: 'R', text: 'Credito de Consumo  -  Libre Inv.',                   size: 9,   r: 255, g: 255, b: 255 },
  // ── Deudor ─────────────────────────────────────────────────────────────────
  { type: 'TEXT', x: 15,  y: 46,  align: 'L', text: 'INFORMACION DEL DEUDOR',                              size: 7,   r: 100, g: 116, b: 139 },
  { type: 'LINE', x: 15,  y: 48,  w: 130, align: '-', text: '-',                                           size: 130, r: 226, g: 232, b: 240 },
  { type: 'TEXT', x: 15,  y: 56,  align: 'L', text: 'Cliente',                                             size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 15,  y: 63,  align: 'L', text: 'GARCIA RAMIREZ MARIA',                                size: 11,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 80,  y: 56,  align: 'L', text: 'Identificacion',                                      size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 80,  y: 63,  align: 'L', text: 'C.C. 1.045.293.110',                                  size: 11,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 15,  y: 72,  align: 'L', text: 'Producto',                                            size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 15,  y: 79,  align: 'L', text: 'Libre inversion - Cuota fija',                        size: 11,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 80,  y: 72,  align: 'L', text: 'No. de obligacion',                                   size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 80,  y: 79,  align: 'L', text: '0140-2384-99-7762',                                   size: 11,  r: 28,  g: 25,  b: 23  },
  // ── Condiciones financieras ────────────────────────────────────────────────
  { type: 'TEXT', x: 155, y: 46,  align: 'L', text: 'CONDICIONES FINANCIERAS',                             size: 7,   r: 100, g: 116, b: 139 },
  { type: 'LINE', x: 155, y: 48,  w: 127, align: '-', text: '-',                                           size: 127, r: 226, g: 232, b: 240 },
  { type: 'TEXT', x: 155, y: 56,  align: 'L', text: 'Monto desembolsado',                                  size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 155, y: 63,  align: 'L', text: '$ 24.000.000',                                        size: 12,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 200, y: 56,  align: 'L', text: 'Tasa EM / EA',                                        size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 200, y: 63,  align: 'L', text: '1,42% / 18,42%',                                      size: 12,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 245, y: 56,  align: 'L', text: 'Plazo',                                               size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 245, y: 63,  align: 'L', text: '36 meses',                                            size: 12,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 155, y: 72,  align: 'L', text: 'Cuota fija mensual',                                  size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 155, y: 79,  align: 'L', text: '$ 870.452',                                           size: 12,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 200, y: 72,  align: 'L', text: 'Primer pago',                                         size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 200, y: 79,  align: 'L', text: '30/06/2026',                                          size: 12,  r: 28,  g: 25,  b: 23  },
  { type: 'TEXT', x: 245, y: 72,  align: 'L', text: 'Total a pagar',                                       size: 7,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 245, y: 79,  align: 'L', text: '$ 31.336.272',                                        size: 12,  r: 28,  g: 25,  b: 23  },
  // ── Tabla: encabezado ──────────────────────────────────────────────────────
  { type: 'RECT', x: 15,  y: 92,  w: 267, align: '-', text: '-',                                           size: 8,   r: 37,  g: 99,  b: 235 },
  { type: 'TEXT', x: 19,  y: 96,  align: 'L', text: '#',                                                   size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 32,  y: 96,  align: 'L', text: 'FECHA DE PAGO',                                       size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 85,  y: 96,  align: 'R', text: 'DIAS',                                                size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 135, y: 96,  align: 'R', text: 'ABONO CAPITAL',                                       size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 180, y: 96,  align: 'R', text: 'INTERESES',                                           size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 222, y: 96,  align: 'R', text: 'CUOTA',                                               size: 7,   r: 255, g: 255, b: 255 },
  { type: 'TEXT', x: 278, y: 96,  align: 'R', text: 'SALDO RESTANTE',                                      size: 7,   r: 255, g: 255, b: 255 },
  // ── Footer ─────────────────────────────────────────────────────────────────
  { type: 'LINE', x: 15,  y: 188, w: 267, align: '-', text: '-',                                           size: 267, r: 226, g: 232, b: 240 },
  { type: 'TEXT', x: 15,  y: 195, align: 'L', text: 'Documento informativo. Genera obligacion conforme al pagare suscrito.', size: 6, r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 15,  y: 200, align: 'L', text: 'Banco Presto S.A. - NIT 860.034.594-2 - Vigilado Superintendencia Financiera', size: 6, r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 282, y: 195, align: 'R', text: 'Generado por AS400PDFRenderer v3.1',                  size: 6,   r: 115, g: 109, b: 103 },
  { type: 'TEXT', x: 282, y: 200, align: 'R', text: 'Pagina 1 de 1',                                       size: 6,   r: 115, g: 109, b: 103 },
]

export interface PlanRow {
  n: number
  fecha: string
  dias: number
  capital: number
  interes: number
  cuota: number
  saldo: number
}

export interface PlanPagos {
  cliente: string
  credito: string
  monto: number
  tasa: string
  plazo: string
  cuotaFija: number
  rows: PlanRow[]
}

function genSchedule(): PlanRow[] {
  const principal = 24_000_000
  const rate = 0.0142
  const n = 36
  const cuota = (principal * rate) / (1 - Math.pow(1 + rate, -n))
  let saldo = principal
  const out: PlanRow[] = []
  const startMonth = 6
  for (let i = 1; i <= n; i++) {
    const interes = saldo * rate
    const capital = cuota - interes
    saldo -= capital
    const m = ((startMonth - 1 + (i - 1)) % 12) + 1
    const y = 2026 + Math.floor((startMonth - 1 + (i - 1)) / 12)
    out.push({
      n: i,
      fecha: `30/${String(m).padStart(2, '0')}/${y}`,
      dias: i === 1 ? 39 : 30,
      capital: Math.round(capital),
      interes: Math.round(interes),
      cuota: Math.round(cuota),
      saldo: Math.max(0, Math.round(saldo)),
    })
  }
  return out
}

const _rows = genSchedule()

export const PLAN_PAGOS: PlanPagos = {
  cliente: 'GARCIA RAMIREZ MARIA',
  credito: '0140-2384-99-7762',
  monto: 24_000_000,
  tasa: '1,42% EM',
  plazo: '36 meses',
  cuotaFija: _rows[0].cuota,
  rows: _rows,
}
