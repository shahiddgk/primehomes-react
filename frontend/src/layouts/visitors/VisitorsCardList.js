import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import VisitingCard from './VisitorsCard';

export default function VisitorsCardList() {
  const [visitorCards, setVisitorCards] = useState([]);

  useEffect(() => {
    axios.get('/visitors/cards/')
      .then(response => {
        console.log('visitors Details', response.data.data);
        setVisitorCards(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching visitor cards:', error);
      });
  }, []);

  return (
    <DashboardLayout>
    <DashboardNavbar />
<div>
      {visitorCards.map(visitor => (
        <VisitingCard key={visitor._id} visitor={visitor} />
      ))}
    </div>
   </DashboardLayout>
  );
}
