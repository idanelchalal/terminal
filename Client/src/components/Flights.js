import { useState, useEffect } from 'react'
import Flight from './Flight'
import io from 'socket.io-client'

const Flights = () => {
    const [flights, setFlights] = useState([])
    const [completed, setCompleted] = useState([])
    const [socket, setSocket] = useState()

    const flightCompleted = (payload) => {
        setFlights((lastSnap) => {
            const newArr = lastSnap.filter(
                (flight) =>
                    flight.flightObject.flightId !==
                    payload.flightObject.flightId
            )
            return [...newArr]
        })
        setCompleted((lastSnap) => {
            const newArr = lastSnap.filter(
                (flight) =>
                    flight.flightObject.flightId !==
                    payload.flightObject.flightId
            )
            return [...newArr, payload]
        })
    }

    const filterFlights = (payload) => {
        setFlights((lastSnap) => {
            const newArr = lastSnap.filter(
                (flight) =>
                    flight.flightObject.flightId !==
                    payload.flightObject.flightId
            )
            return [...newArr, payload]
        })
    }

    const newFlight = (payload) => {
        setFlights((lastSnap) => [...lastSnap, payload])
    }

    useEffect(() => {
        const newSocket = io('http://localhost:3001')
        setSocket(newSocket)
        newSocket.on('flightCompleted', (payload) => flightCompleted(payload))
        newSocket.on('newFlight', (payload) => newFlight(payload))
        newSocket.on('occupyPhase', (payload) => filterFlights(payload))

        return () => {
            newSocket.close()
        }
    }, [])

    let getLandingContent = () => {
        if (flights.length < 0) return
        const landingArr = flights.filter(
            (flight) => flight.flightObject.settings.isDeparture === false
        )

        return landingArr.map((flight) => (
            <Flight
                isDeparture={flight.flightObject.settings.isDeparture}
                key={flight.flightObject.flightId}
                phase={flight.flightObject.phase}
                flightId={flight.flightObject.flightId}
            />
        ))
    }
    let landing = getLandingContent()
    let getDepartureContent = () => {
        if (flights.length < 0) return
        const departuringArr = flights.filter(
            (flight) => flight.flightObject.settings.isDeparture === true
        )

        return departuringArr.map((flight) => (
            <Flight
                isDeparture={flight.flightObject.settings.isDeparture}
                key={flight.flightObject.flightId}
                phase={flight.flightObject.phase}
                flightId={flight.flightObject.flightId}
            />
        ))
    }
    let departuring = getDepartureContent()
    let completedContent = completed.map((flight) => (
        <Flight
            isDeparture={flight.flightObject.settings.isDeparture}
            key={flight.flightObject.flightId}
            phase={flight.flightObject.phase}
            flightId={flight.flightObject.flightId}
        />
    ))
    return (
        <>
            <header className="align-items-center justify-content-center">
                TERMINALY
            </header>
            <nav className="align-items-center justify-content-center">
                Flights Panel
            </nav>
            <article>
                <section>
                    <h1 className="text-align-center">Completed Flights</h1>
                    <ul>{completedContent.length > 0 && completedContent}</ul>
                </section>
                <section>
                    <h1 className="text-align-center">Departure:</h1>
                    <ul>{departuring.length > 0 && departuring}</ul>
                </section>
                <section>
                    <h1 className="text-align-center">Landing:</h1>
                    <ul>{landing.length > 0 && landing}</ul>
                </section>
            </article>
        </>
    )
}

export default Flights
