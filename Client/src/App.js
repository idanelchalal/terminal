import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

function App() {
    const [flights, setFlights] = useState({})

    useEffect(() => {
        socket.on('message', (data) => {
            setFlights(data)
        })
    }, [])

    return <div></div>
}

export default App
