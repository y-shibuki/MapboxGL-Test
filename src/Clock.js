import { useEffect, useState } from "react";

let offset = 0;

export class Clock {
    static setDate(new_date) {
        const d = new Date();
        offset = new_date.getTime() - d.getTime();
    }
    
    static getDate() {
        const d = new Date();
        d.setTime(d.getTime() + offset);
        return d;
    }

    static str2date(str) {
        const [h, m, s] = str.split(":"),
            d = new Date();
    
        d.setHours(h);
        d.setMinutes(m);
        d.setSeconds(s);
    
        return d;
    }
}

export const ClockComponent = () => {
    const [date, setDate] = useState({"date": "", "time": ""});

    useEffect(() => {
        setInterval(() => {
            const d = Clock.getDate();
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const hour = ("0" + d.getHours()).slice(-2);
            const minute = ("0" + d.getMinutes()).slice(-2);
            const second = ("0" + d.getSeconds()).slice(-2);
            const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];

            setDate({
                "date": year + "年" + month + "月" + day + "日（" + dayOfWeek + "）",
                "time": hour + ':' + minute + ':' + second
            });
        }, 1000);
    }, []);

    return (
        <div className="Clock">
            {date["date"]}<br />{date["time"]}
        </div>
    )
}