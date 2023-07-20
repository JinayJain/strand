import dayjs from "dayjs";
import { RESET_TIMEZONE } from "./consts";

export function getResetTime(time?: Parameters<typeof dayjs>[0]) {
  return dayjs(time).tz(RESET_TIMEZONE).startOf("day").toDate();
}
