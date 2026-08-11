import type { VDataTable } from 'vuetify/components'

/** v-data-table の headers プロパティの型 */
export type CommonDataTableHeaders = VDataTable['$props']['headers']

/** 「項目名 / 値」の2列で表示する表の1行 */
export interface CommonDataTableItem {
  key: string
  value: string
}
