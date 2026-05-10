export interface BankRow {
  id: string
  name: string
  segment: 'P' | 'M' | 'E'
  status: 'A' | 'I' | 'B'
  city: string
  prod: number
  selected: boolean
}

export interface Movement {
  date: string
  desc: string
  ref: string
  amount: number
  sign: '+' | '-'
}

export interface SelectedClient {
  id: string
  idType: string
  name: string
  address: string
  city: string
  phone: string
  segment: 'P' | 'M' | 'E'
  segmentLabel: string
  status: 'A' | 'I' | 'B'
  statusLabel: string
  openDate: string
  products: number
}

export interface Account {
  program: string
  programDesc: string
  number: string
  type: string
  typeLabel: string
  holder: string
  holderId: string
  branch: string
  openDate: string
  status: 'A' | 'I' | 'B'
  statusLabel: string
  balance: number
  available: number
  held: number
  currency: string
  movements: Movement[]
}

export interface BankData {
  program: string
  programDesc: string
  date: string
  time: string
  user: string
  selected: SelectedClient
  account: Account
  rows: BankRow[]
}

export const BANK_DATA: BankData = {
  program: 'CLNT100',
  programDesc: 'MANTENIMIENTO DE CLIENTES',
  date: '22/05/2026',
  time: '10:34:18',
  user: 'OPER01',

  selected: {
    id: '52089474',
    idType: 'CC',
    name: 'GARCIA RAMIREZ MARIA',
    address: 'CRA 15 # 93-47 OF 502',
    city: 'BOGOTA',
    phone: '+57 310 482 9933',
    segment: 'P',
    segmentLabel: 'PREMIUM',
    status: 'A',
    statusLabel: 'ACTIVO',
    openDate: '14/03/2018',
    products: 3,
  },

  account: {
    program: 'CTAS150',
    programDesc: 'CONSULTA DE CUENTA',
    number: '0140-2384-99-7762',
    type: 'AHO',
    typeLabel: 'AHORROS',
    holder: 'GARCIA RAMIREZ MARIA',
    holderId: 'CC 52089474',
    branch: '014 - CHAPINERO',
    openDate: '14/03/2018',
    status: 'A',
    statusLabel: 'ACTIVA',
    balance: 12_487_320,
    available: 12_087_320,
    held: 400_000,
    currency: 'COP',
    movements: [
      { date: '22/05', desc: 'TRF RECIBIDA NOMINA',   ref: 'TRF7821', amount:  4_500_000, sign: '+' },
      { date: '21/05', desc: 'PAGO TC VISA 4093',      ref: 'PAG3318', amount:    890_500, sign: '-' },
      { date: '20/05', desc: 'RETIRO ATM CHAPINERO',   ref: 'ATM0094', amount:    300_000, sign: '-' },
      { date: '18/05', desc: 'COMPRA PSE CLARO',       ref: 'PSE6612', amount:    129_900, sign: '-' },
      { date: '15/05', desc: 'TRF RECIBIDA M.LOPEZ',   ref: 'TRF6648', amount:  1_200_000, sign: '+' },
    ],
  },

  rows: [
    { id: '52089474', name: 'GARCIA RAMIREZ MARIA',   segment: 'P', status: 'A', city: 'BOGOTA',        prod: 3, selected: true  },
    { id: '79284611', name: 'LOPEZ MORENO CARLOS',    segment: 'M', status: 'A', city: 'MEDELLIN',      prod: 2, selected: false },
    { id: '41093822', name: 'TORRES VARGAS ANA',      segment: 'P', status: 'A', city: 'CALI',          prod: 4, selected: false },
    { id: '88472019', name: 'RUIZ CASTRO PEDRO',      segment: 'E', status: 'B', city: 'BARRANQUILLA',  prod: 7, selected: false },
    { id: '60338215', name: 'MARTINEZ DIAZ LAURA',    segment: 'M', status: 'A', city: 'BUCARAMANGA',   prod: 1, selected: false },
    { id: '33920184', name: 'GOMEZ HERRERA JOSE',     segment: 'P', status: 'I', city: 'CARTAGENA',     prod: 2, selected: false },
  ],
}
