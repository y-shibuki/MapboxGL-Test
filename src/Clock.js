import { useEffect, useState } from "react";

const Clock = () => {
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(null);

    useEffect(() => {
        setInterval(() => {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();
            var dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

            setDate(year + "年" + month + "月" + day + "日（" + dayOfWeek + "）");
            setTime(hour + ':' + minute + ':' + second);
        }, 1000);
    }, []);

    return (
        <div className="Clock">
            {date}<br />{time}
        </div>
    )
}

export default Clock;