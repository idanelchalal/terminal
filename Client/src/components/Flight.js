import React from 'react'

const Flight = ({ flightId, phase, isDeparture }) => {
    return (
        <ul style={{ listStyle: 'none' }}>
            <li>Flight ID: {flightId}</li>
            <li>{isDeparture ? 'Departuring' : 'Landing'}</li>
            <li>Currently on Terminal {phase}</li>
        </ul>
    )
}

export default Flight
