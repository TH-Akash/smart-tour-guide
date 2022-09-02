import React from 'react'
import moment from 'moment'

const DateTime = Props => {
    const { date } = Props

    if (!date) return null

    return <>{moment.utc(date).local().format("DD/MM/YYYY, h:mm a")}</>
}
export default DateTime