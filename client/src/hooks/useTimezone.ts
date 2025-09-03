import { useSession } from "@/providers/sessionProvider";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { isValidTimezone } from "@/lib/common/getTimezones";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TZ = "UTC";

export const useTimezone = () => {
    const session = useSession();

    const tz: string = isValidTimezone(session?.timezone) ? (session?.timezone as string) : DEFAULT_TZ;

    const offset = dayjs().tz(tz).format("Z");

    const dt = (date: dayjs.ConfigType, format: string = "DD/MM/YYYY HH:MM") => {
        return dayjs(date).tz(tz).format(format);
    };

    const daysSince = (date: dayjs.ConfigType) => {
        const due = dayjs(date).tz(tz);
        const now = dayjs().tz(tz);
        return now.diff(due, "day");
    };

    return { dt, daysSince, tz, offset };
};
