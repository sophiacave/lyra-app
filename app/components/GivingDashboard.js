import React from 'react';

import React, { useState, useEffect } from 'react';

export default function GivingDashboard() {
  const [totalDonated, setTotalDonated] = useState(0);
  const [currentTier, setCurrentTier] = useState('Starter');
  const [recipients, setRecipients] = useState([]);
  const [missionStatement, setMissionStatement] = useState('Our mission is to support HIV Cure Research.');
  const [givingScale, setGivingScale] = useState(['$5/mo', '$25/mo', '$100/mo']);

  useEffect(() => {
    // Fetch data from Supabase or an API here
    // Example:
    // fetch('https://api.example.com/giving-data')
    //   .then(response => response.json())
    //   .then(data => {
    //     setTotalDonated(data.totalDonated);
    //     setCurrentTier(data.currentTier);
    //     setRecipients(data.recipients);
    //     setMissionStatement(data.missionStatement);
    //     setGivingScale(data.givingScale);
    //   })
    //   .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Giving Dashboard</h2>
      <p>Total Donated: $0</p>
      <p>Current Tier: Starter</p>
      <p>Recipients: None</p>
      <p>Mission Statement: Our mission is to support HIV Cure Research.</p>
      <p>Giving Scale: $5/mo, $25/mo, $100/mo</p>
    </div>
  );
}
