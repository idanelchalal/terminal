import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

function App() {
    const [landed, setLanded] = useState({})
    const [departure, setDeparture] = useState({})

    useEffect(() => {
        socket.on('message', (context) => {})
    }, [])

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
                        <h1 className="text-align-center">Landed:</h1>
                        <ul></ul>
                    </section>
                    <section>
                        <h1 className="text-align-center">Departure:</h1>
                        <ul></ul>
                    </section>
                </article>
            </div>
        </>
    )
}

export default App
