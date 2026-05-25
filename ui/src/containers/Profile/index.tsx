import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Assuming you have a RootState defined in your store, 
// replace 'any' with 'RootState' if you have it exported from '../../redux/store'
const Profile = () => {
    // 1. Pull user data from Redux Auth state
    const { user } = useSelector((state: any) => state.auth);

    // 2. Local state for delivery details
    const [deliveryDetails, setDeliveryDetails] = useState({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    // 3. Local state for Cart (Defaults to empty for new users)
    // Eventually, you should pull this from a Redux Cart slice
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeliveryDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically dispatch a Redux action or make an API call to save the address
        console.log("Saving delivery details:", deliveryDetails);
        alert("Delivery details saved successfully!");
    };

    return (
        <div className='Profile' style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}> 
            <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>My Profile</h1>

            {/* --- SECTION 1: User Information --- */}
            <section style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
                <h2>Account Details</h2>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>Name:</strong> {user?.name || 'Guest User'}</p>
                    <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
                    {user?.role && <p><strong>Role:</strong> {user.role}</p>}
                </div>
            </section>

            {/* --- SECTION 2: Delivery Details Form --- */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Delivery Information</h2>
                <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Street Address</label>
                        <input type="text" name="address" value={deliveryDetails.address} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>City</label>
                            <input type="text" name="city" value={deliveryDetails.city} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>State</label>
                            <input type="text" name="state" value={deliveryDetails.state} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Zip Code</label>
                            <input type="text" name="zipCode" value={deliveryDetails.zipCode} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={deliveryDetails.phone} onChange={handleInputChange} required style={{ padding: '0.5rem' }} />
                        </div>
                    </div>

                    <button type="submit" style={{ padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
                        Save Delivery Details
                    </button>
                </form>
            </section>

            {/* --- SECTION 3: Cart Status --- */}
            <section>
                <h2>Current Cart Status</h2>
                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666' }}>
                            <p>Your cart is currently empty.</p>
                            <p>Browse our products to add something here!</p>
                        </div>
                    ) : (
                        <ul>
                            {cartItems.map((item, index) => (
                                <li key={index}>
                                    {item.name} - ${item.price}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};
 
export default Profile;