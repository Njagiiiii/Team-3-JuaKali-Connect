   import { useState, useEffect } from 'react';

   function BookingsTest() {
     const [bookings, setBookings] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       fetch('http://localhost:5000/api/bookings')
         .then((res) => {
           if (!res.ok) throw new Error('Network response was not ok');
           return res.json();
         })
         .then((data) => {
           setBookings(data);
           setLoading(false);
         })
         .catch((err) => {
           setError(err.message);
           setLoading(false);
         });
     }, []);

     if (loading) return <p>Loading bookings...</p>;
     if (error) return <p>Error: {error}</p>;

     return (
       <div style={{ padding: '20px', background: '#fff' }}>
         <h2>Bookings (test)</h2>
         <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
           <thead>
             <tr>
               <th>ID</th>
               <th>Artisan</th>
               <th>Service</th>
               <th>Status</th>
             </tr>
           </thead>
           <tbody>
             {bookings.map((b) => (
               <tr key={b.id}>
                 <td>{b.id}</td>
                 <td>{b.artisan_name}</td>
                 <td>{b.service}</td>
                 <td>{b.status}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }

   export default BookingsTest;