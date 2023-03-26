import { useState, useEffect } from 'react'
import Flight from './components/Flight'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

function App() {
    const landed = []
    const departure = []
    const [inAir, setInAir] = useState([])

    useEffect(() => {
        socket.on('message', ({ action, payload }) => {
            if (action === 'newFlight') {
                console.log(payload)
            }

            if (action === 'flightCompleted') {
            }
        })
    }, [])

    let inAirContent = 'No flights are in air right now...'
    if (inAir.length > 0) {
        inAirContent = inAir.map((flight) => (
            <li className="flight">
                <Flight
                    key={flight.flightId}
                    phase={flight.phase}
                    flightId={flight.flightId}
                    isDeparture={flight.settings.isDeparure}
                />
            </li>
        ))
    }

    return (
        <>
            <div className="container">
                <header className="align-items-center justify-content-center">
                    TERMINALY
                </header>
                <nav className="align-items-center justify-content-center">
                    Flights Panel
                </nav>
                <article>
                    <section>
                        <h1 className="text-align-center">FLIGHTS ON AIR</h1>
                        <ul>{inAirContent}</ul>
                    </section>
                    <section>
                        <h1 className="text-align-center">Departure:</h1>
                        {}
                    </section>
                    <section>
                        <h1 className="text-align-center">Departure:</h1>
                        {}
                    </section>
                </article>
            </div>
        </>
    )
}

export default App
