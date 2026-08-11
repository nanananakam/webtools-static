<template>
  <div>
    <h1>UnixTime便利ツール</h1>
    <div>
      UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。
    </div>
    <!-- input time begin-->
    <v-form>
      <v-text-field v-model="inputValue" label="時刻" />
    </v-form>
    <!-- input time end -->
    <!-- select parse mode begin-->
    <v-form>
      <v-select
        v-model="parseMode"
        label="入力形式"
        :items="parseModeList"
        item-value="mode"
        item-title="modeString"
        return-object
      />
    </v-form>
    <!-- select parse mode end-->
    <!-- select time zone begin-->
    <v-form>
      <v-autocomplete
        v-model="timeZoneString"
        label="TimeZone"
        :items="timeZoneList"
        item-value="timeZoneString"
        item-title="timeZoneDetailString"
      />
    </v-form>
    <!-- select time zone end-->
    <!-- show parse result begin-->
    <h2>変換結果</h2>
    <v-data-table
      :headers="resultDateTimeDataTableHeaders"
      :items="resultDateTimeDataTableItems"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #[`item.resultInTargetTimeZone`]="{ item }">
        <ValueToClipboard :text="item.resultInTargetTimeZone" />
      </template>
      <template #[`item.resultInUtc`]="{ item }">
        <ValueToClipboard :text="item.resultInUtc" />
      </template>
    </v-data-table>
    <h2>追加情報</h2>
    <v-data-table
      :headers="resultOtherDataTableHeaders"
      :items="resultOtherDataTableItems"
      :items-per-page="-1"
      hide-default-header
      hide-default-footer
    />
    <!-- time math button begin-->
    <h2>日時操作</h2>
    <div class="text-center">
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="firstDayOfLastMonth"
        >前月1日</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="firstDayOfThisMonth"
        >今月1日</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="setZeroZero"
        >00:00:00</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="firstDayOfNextMonth"
        >翌月1日</v-btn
      >
      <br />
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="minusOneMonths"
        >-1ヶ月</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="minusOneDay"
        >-1日</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="minusOneHour"
        >-1時間</v-btn
      >
      <v-btn class="d-inline-flex ma-2" @click="setNow">現在時刻</v-btn>
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="plusOneHour"
        >+1時間</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="plusOneDay"
        >+1日</v-btn
      >
      <v-btn
        :disabled="luxonDateTime == null"
        class="d-inline-flex ma-2"
        @click="plusOneMonths"
        >+1ヶ月</v-btn
      >
    </div>
    <!-- time math button end-->
    <h2>入力可能な形式</h2>
    <v-data-table
      :headers="inputFormatDataTableHeaders"
      :items="inputFormatDatatableItems"
      :items-per-page="-1"
      hide-default-header
      hide-default-footer
    >
      <template #[`item.example`]="{ item }">
        <pre>{{ item.example }}</pre>
      </template>
    </v-data-table>
    <h2>解説</h2>
    <h3>UnixTime</h3>
    <div>
      UnixTime(Unix時間)は、別名POSIX時間、エポック秒などとも呼ばれますが、協定世界時(UTC)1970年1月1日午前0時0分0秒からのうるう秒を除いた経過秒数で示した時刻です。
    </div>
    <h3>SQL形式</h3>
    <div>
      SQL形式は、リレーショナルデータベース問い合わせ言語のSQLで用いられる時刻の形式です。ISO8601と似ています。
    </div>
    <h3>ISO 8601形式</h3>
    <div>
      ISO8601は、日付と時刻の表記に関するISOの国際規格です。大→小の順序（ビッグエンディアン
      big-
      endian）を貫徹して、時間の表記は24時間表記のみとし、日付・時刻の記述順序をただ一種類に標準化していることが特徴です。
    </div>
    <h3>HTTP形式</h3>
    <div>
      RFC 850/RFC
      1123などで規定された歴史的にHTTP関係でよく使われていた形式です。
    </div>
    <h3>RFC 2822形式</h3>
    <div>
      RFC2822で規定された歴史的に電子メール関係でよく使われていた形式です。
    </div>
    <!-- show parse result end-->
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { DurationUnits } from 'luxon'
import { getTimeZones } from '@vvo/tzdb'
import type { CommonDataTableHeaders, CommonDataTableItem } from '~/types/table'

type FormatType = 'unix' | 'sql' | 'iso' | 'rfc' | 'http'
type ParseModeType = FormatType | 'auto'

interface ParseModeSelectorElement {
  mode: ParseModeType
  modeString: string
}

interface TimeZoneElement {
  timeZoneString: string
  timeZoneDetailString: string
}

interface InputFormatExampleDataTableItem {
  formatName: string
  example: string
}

interface ResultDateTimeDataTableItem {
  formatTypeString: string
  resultInTargetTimeZone: string
  resultInUtc: string
}

const description =
  'UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。'

useSeoMeta({
  title: 'UnixTime便利ツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: 'UnixTime便利ツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/unixtime/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/unixtime/' },
  ],
})

const parseModeList: ParseModeSelectorElement[] = [
  { mode: 'auto', modeString: '自動判別' },
  { mode: 'unix', modeString: 'UnixTime(秒)' },
  { mode: 'sql', modeString: 'SQL形式' },
  { mode: 'iso', modeString: 'ISO 8601形式' },
  { mode: 'rfc', modeString: 'RFC 2822形式' },
  { mode: 'http', modeString: 'HTTP 形式(RFC 850/RFC 1123)' },
]

const timeZoneList: TimeZoneElement[] = getTimeZones({ includeUtc: true }).map(
  (timeZone) => ({
    timeZoneString: timeZone.name,
    timeZoneDetailString:
      timeZone.rawFormat +
      ' (' +
      timeZone.name +
      ', ' +
      timeZone.abbreviation +
      ')',
  }),
)

const resultOtherDataTableHeaders: CommonDataTableHeaders = [
  { title: '', key: 'key', sortable: false },
  { title: '', key: 'value', sortable: false },
]

const inputFormatDataTableHeaders: CommonDataTableHeaders = [
  { title: '形式', key: 'formatName', sortable: false },
  { title: '例', key: 'example', sortable: false },
]

const inputFormatDatatableItems: InputFormatExampleDataTableItem[] = [
  { formatName: 'Unixtime(秒)', example: '1542674993' },
  {
    formatName: 'SQL形式',
    example: `2017-05-15 09:24:15
2017-05-15
09:24:15`,
  },
  {
    formatName: 'ISO 8601形式',
    example: `2016
2016-05
201605
2016-05-25
20160525
2016-05-25T09
2016-05-25T09:24
2016-05-25T09:24:15
2016-05-25T0924
2016-05-25T092415
2016-W21-3
2016W213
2016-200
2016200
09:24
09:24:15`,
  },
  {
    formatName: 'RFC 2822形式',
    example: 'Tue, 01 Nov 2016 13:23:12 +0630',
  },
  {
    formatName: 'HTTP(RFC 850/RFC 1123)形式',
    example: `Sunday, 06-Nov-94 08:49:37 GMT
Sun, 06 Nov 1994 08:49:37 GMT`,
  },
]

// 現在時刻と実行環境のTimeZoneはビルド時ではなくブラウザ側で決める必要があるため、
// プリレンダリング結果と食い違わないようマウント後に初期化する。
const inputValue = ref('')
const timeZoneString = ref('UTC')
const parseMode = ref<ParseModeSelectorElement>(parseModeList[0]!)

onMounted(() => {
  timeZoneString.value = DateTime.now().zoneName
  inputValue.value = DateTime.now().toFormat('X')
})

function parseWith(
  formatType: FormatType,
  value: string,
  zone: string,
): { dateTime: DateTime; formatType: FormatType } | null {
  let parsed: DateTime
  switch (formatType) {
    case 'unix':
      parsed = DateTime.fromSeconds(Number(value))
      break
    case 'sql':
      parsed = DateTime.fromSQL(value)
      break
    case 'iso':
      parsed = DateTime.fromISO(value)
      break
    case 'rfc':
      parsed = DateTime.fromRFC2822(value)
      break
    case 'http':
      parsed = DateTime.fromHTTP(value)
      break
  }
  if (!parsed.isValid) {
    return null
  }
  return { dateTime: parsed.setZone(zone), formatType }
}

const parseResult = computed<{
  dateTime: DateTime
  formatType: FormatType
} | null>(() => {
  const value = inputValue.value
  const zone = timeZoneString.value
  if (parseMode.value.mode !== 'auto') {
    return parseWith(parseMode.value.mode, value, zone)
  }
  // 自動判別: 数値ならUnixTime、それ以外はSQL→ISO→RFC2822→HTTPの順に試す
  if (/^[0-9]+$/.exec(value)) {
    return parseWith('unix', value, zone)
  }
  for (const formatType of ['sql', 'iso', 'rfc', 'http'] as const) {
    const result = parseWith(formatType, value, zone)
    if (result != null) {
      return result
    }
  }
  return null
})

const formatType = computed<FormatType | null>(
  () => parseResult.value?.formatType ?? null,
)

const luxonDateTime = computed<DateTime | null>(
  () => parseResult.value?.dateTime ?? null,
)

const utcLuxonDateTime = computed<DateTime | null>(
  () => luxonDateTime.value?.setZone('UTC') ?? null,
)

const unixTimeString = computed<string>(
  () => luxonDateTime.value?.toFormat('X') ?? '',
)

const dateString = computed<string>(
  () => luxonDateTime.value?.toLocaleString(DateTime.DATETIME_FULL) ?? '',
)

const utcDateString = computed<string>(
  () => utcLuxonDateTime.value?.toLocaleString(DateTime.DATETIME_FULL) ?? '',
)

const isoString = computed<string>(() => luxonDateTime.value?.toISO() ?? '')

const utcIsoString = computed<string>(
  () => utcLuxonDateTime.value?.toISO() ?? '',
)

const rfcString = computed<string>(() => luxonDateTime.value?.toRFC2822() ?? '')

const utcRfcString = computed<string>(
  () => utcLuxonDateTime.value?.toRFC2822() ?? '',
)

const sqlString = computed<string>(
  () => luxonDateTime.value?.toFormat('yyyy-MM-dd HH:mm:ss') ?? '',
)

const utcSqlString = computed<string>(
  () => utcLuxonDateTime.value?.toFormat('yyyy-MM-dd HH:mm:ss') ?? '',
)

const utcHttpString = computed<string>(
  () => utcLuxonDateTime.value?.toHTTP() ?? '',
)

const diffString = computed<string>(() => {
  const dateTime = luxonDateTime.value
  if (dateTime == null) {
    return ''
  }
  // 1秒未満を切り捨てるためにちょっと回りくどいことをしている
  const nowUnixTime = DateTime.now().toFormat('X')
  if (dateTime.toFormat('X') === nowUnixTime) {
    return '0秒'
  }
  const now = DateTime.fromSeconds(Number(nowUnixTime))
  const isBeforeNow = now > dateTime

  // secondの小数点以下が出ないようにmillisecondsも指定する
  const units: DurationUnits = [
    'years',
    'months',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
  ]
  const diff = isBeforeNow
    ? now.diff(dateTime, units).toObject()
    : dateTime.diff(now, units).toObject()

  let result = ''
  if (diff.years) {
    result = result + String(diff.years) + '年'
  }
  if (diff.months) {
    result = result + String(diff.months) + 'ヶ月'
  }
  if (diff.days) {
    result = result + String(diff.days) + '日'
  }
  if (diff.hours) {
    result = result + String(diff.hours) + '時間'
  }
  if (diff.minutes) {
    result = result + String(diff.minutes) + '分'
  }
  if (diff.seconds) {
    result = result + String(diff.seconds) + '秒'
  }

  return result + (isBeforeNow ? '前' : '後')
})

const resultDateTimeDataTableHeaders = computed<CommonDataTableHeaders>(() => [
  { title: '形式', key: 'formatTypeString', sortable: false },
  {
    title: timeZoneString.value,
    key: 'resultInTargetTimeZone',
    sortable: false,
  },
  { title: 'utc', key: 'resultInUtc', sortable: false },
])

const resultDateTimeDataTableItems = computed<ResultDateTimeDataTableItem[]>(
  () => [
    {
      formatTypeString: 'UnixTime形式',
      resultInTargetTimeZone: unixTimeString.value,
      resultInUtc: unixTimeString.value,
    },
    {
      formatTypeString: '日時表記(環境依存)',
      resultInTargetTimeZone: dateString.value,
      resultInUtc: utcDateString.value,
    },
    {
      formatTypeString: 'SQL形式',
      resultInTargetTimeZone: sqlString.value,
      resultInUtc: utcSqlString.value,
    },
    {
      formatTypeString: 'ISO 8601形式',
      resultInTargetTimeZone: isoString.value,
      resultInUtc: utcIsoString.value,
    },
    {
      formatTypeString: 'RFC 2822形式',
      resultInTargetTimeZone: rfcString.value,
      resultInUtc: utcRfcString.value,
    },
    {
      formatTypeString: 'HTTP(RFC 850/RFC 1123)形式',
      resultInTargetTimeZone: utcHttpString.value,
      resultInUtc: utcHttpString.value,
    },
  ],
)

const resultOtherDataTableItems = computed<CommonDataTableItem[]>(() => {
  const inputFormat = parseModeList.find(
    (mode) => mode.mode === formatType.value,
  )
  return [
    { key: '現在時刻との差', value: diffString.value },
    { key: '入力形式', value: inputFormat?.modeString ?? '-' },
  ]
})

function resetParseMode() {
  parseMode.value = parseModeList[0]!
}

function setInputValueFrom(transform: (dateTime: DateTime) => DateTime): void {
  if (luxonDateTime.value != null) {
    inputValue.value = transform(luxonDateTime.value).toFormat('X')
    resetParseMode()
  }
}

const plusOneHour = () => setInputValueFrom((d) => d.plus({ hours: 1 }))
const minusOneHour = () => setInputValueFrom((d) => d.minus({ hours: 1 }))
const plusOneDay = () => setInputValueFrom((d) => d.plus({ days: 1 }))
const minusOneDay = () => setInputValueFrom((d) => d.minus({ days: 1 }))
const plusOneMonths = () => setInputValueFrom((d) => d.plus({ months: 1 }))
const minusOneMonths = () => setInputValueFrom((d) => d.minus({ months: 1 }))
const setZeroZero = () =>
  setInputValueFrom((d) => d.set({ hour: 0, minute: 0, second: 0 }))
const firstDayOfThisMonth = () => setInputValueFrom((d) => d.startOf('month'))
const firstDayOfLastMonth = () =>
  setInputValueFrom((d) =>
    d.startOf('month').minus({ days: 1 }).startOf('month'),
  )
const firstDayOfNextMonth = () =>
  setInputValueFrom((d) => d.endOf('month').plus({ days: 1 }).startOf('month'))

function setNow() {
  resetParseMode()
  inputValue.value = DateTime.now().toFormat('X')
}
</script>
