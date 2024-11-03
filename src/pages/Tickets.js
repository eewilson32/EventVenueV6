import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';
import { BiNetworkChart } from 'react-icons/bi';
import { CartContext } from '../CartContext';

function Tickets() {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();

    const [boxTickets, setBoxTickets] = useState(0);
    const [orchestraTickets, setOrchestraTickets] = useState(0);
    const [mainFloorTickets, setMainFloorTickets] = useState(0);
    const [balconyTickets, setBalconyTickets] = useState(0);
    const [ticketPrices, setTicketPrices] = useState(null); // State to hold ticket prices
    const [error, setError] = useState(null); // State for error handling

    /*useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            console.log("Cart loaded from local storage:", parsedCart); // Check the loaded cart structure
            setCart(parsedCart);
        } else {
            console.log("No cart found in local storage.");
        }
    }, []);

    useEffect(() => {
        // Save cart to local storage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);*/

    useEffect(() => {
        // Fetch ticket prices from the JSON file
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket prices');
                }
                return response.json();
            })
            .then(data => {
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (event) {
                    // Assuming the ticketPrices are in the event's details
                    const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                    if (eventDetail) {
                        setTicketPrices(eventDetail.ticketPrices);
                    } else {
                        setError('Event details not found for the specified date.');
                    }
                } else {
                    setError('Event not found.');
                }
            })
            .catch(err => {
                console.error(err);
                setError('Error fetching ticket prices.');
            });
    }, [eventName, eventDate]);

    const handleAddToCart = () => {

        if (!ticketPrices) return;
    const ticketsToAdd = [
        { eventName: decodeURIComponent(eventName).replace(/-/g, ' '), eventDate: eventDate, type: 'box', quantity: boxTickets, price: ticketPrices.box },
        { eventName: decodeURIComponent(eventName).replace(/-/g, ' '), eventDate: eventDate, type: 'orchestra', quantity: orchestraTickets, price: ticketPrices.orchestra },
        { eventName: decodeURIComponent(eventName).replace(/-/g, ' '), eventDate: eventDate, type: 'mainFloor', quantity: mainFloorTickets, price: ticketPrices.mainFloor },
        { eventName: decodeURIComponent(eventName).replace(/-/g, ' '), eventDate: eventDate, type: 'balcony', quantity: balconyTickets, price: ticketPrices.balcony },
    ].filter(ticket => ticket.quantity > 0); // Only add tickets with quantity > 0

        //console.log("Tickets to Add:", ticketsToAdd); 

        

        if (ticketsToAdd.length === 0) {
            alert("Please select at least one ticket.");
            return;
        }

        // Load existing cart from localStorage
    // Use addToCart from context
    addToCart(decodeURIComponent(eventName).replace(/-/g, ' '), eventDate, ticketsToAdd);
    navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
};

        
/*
        setCart((prevCart) => {
            console.log("Previous Cart State:", prevCart);
            const existingEventIndex = prevCart.findIndex(
                (item) => item.eventName === decodeURIComponent(eventName).replace(/-/g, ' ') && item.eventDate === eventDate
        );

            if (existingEventIndex > -1) {
                const updatedCart = [...prevCart];
                const eventItem = updatedCart[existingEventIndex];

                ticketsToAdd.forEach(ticket => {
                    const ticketIndex = eventItem.tickets.findIndex(t => t.type === ticket.type);
                    if (ticketIndex > -1) {
                        eventItem.tickets[ticketIndex].quantity += ticket.quantity;
                    } else {
                        eventItem.tickets.push(ticket);
                    }
                });
                console.log("Updated Cart:", updatedCart);
                return updatedCart;
            } else {
                return [
                    ...prevCart,
                    {
                        eventName,
                        eventDate,
                        tickets: ticketsToAdd
                    }
                ];
                console.log("New Cart Entry:", newCart); // Log new cart entry
            }
        });
        //localStorage.setItem('cart', JSON.stringify([...cart, ...ticketsToAdd])); 
        navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
    };
*/
    return (
        <div className="tickets-page">
            <h1>Select Your Tickets</h1>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Event: {eventName.replace(/-/g, ' ')} </h3>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Date: {eventDate} </h3>

            {error && <p className="error">{error}</p>}

            {ticketPrices ? (
                <>
                    <div className="ticket-option">
                        <label>Box Tickets (${ticketPrices.box.toFixed(2)} each):</label>
                        <select value={boxTickets} onChange={(e) => setBoxTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Orchestra Tickets (${ticketPrices.orchestra.toFixed(2)} each):</label>
                        <select value={orchestraTickets} onChange={(e) => setOrchestraTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Main Floor Tickets (${ticketPrices.mainFloor.toFixed(2)} each):</label>
                        <select value={mainFloorTickets} onChange={(e) => setMainFloorTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Balcony Tickets (${ticketPrices.balcony.toFixed(2)} each):</label>
                        <select value={balconyTickets} onChange={(e) => setBalconyTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <button
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#FF6700',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </>
            ) : (
                <p>Loading ticket prices...</p>
            )}
        </div>
    );
}

export default Tickets;