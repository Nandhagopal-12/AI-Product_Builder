const rentals = [
  {
    id: 'shared-house',
    title: 'Shared House For Working Friends',
    city: 'Hyderabad',
    area: 'Madhapur',
    type: 'Shared',
    rent: 12000,
    bedrooms: 3,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    highlights: ['Work desk', 'Wi-Fi ready', 'Close to offices'],
    description:
      'A shared home option for people who want lower rent and a social living setup.',
  },
  {
    id: 'lake-view-room',
    title: 'Lake View Room For Students',
    city: 'Chennai',
    area: 'Velachery',
    type: 'Shared',
    rent: 9500,
    bedrooms: 1,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=900&q=80',
    highlights: ['Near bus stop', 'Study table', 'Shared kitchen'],
    description:
      'A budget-friendly shared room for students who want a simple place near transport.',
  },
  {
    id: 'cozy-terrace-flat',
    title: 'Cozy Terrace Flat',
    city: 'Bengaluru',
    area: 'Koramangala',
    type: 'Apartment',
    rent: 36000,
    bedrooms: 2,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
    highlights: ['Private terrace', 'Near cafes', 'Fully furnished'],
    description:
      'A comfortable apartment with a terrace space, good for small families or working couples.',
  },
  {
    id: 'budget-studio',
    title: 'Budget Studio Near IT Park',
    city: 'Hyderabad',
    area: 'Gachibowli',
    type: 'Studio',
    rent: 16000,
    bedrooms: 1,
    furnished: false,
    image:
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    highlights: ['Near IT park', 'Lift access', 'Good ventilation'],
    description:
      'A simple studio rental for someone who wants a budget-friendly place near work.',
  },
  {
    id: 'ladakh-mountain-stay',
    title: 'Mountain Stay Near Leh Market',
    city: 'Ladakh',
    area: 'Leh',
    type: 'Studio',
    rent: 22000,
    bedrooms: 1,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&w=900&q=80',
    highlights: ['Mountain view', 'Heater included', 'Near market'],
    description:
      'A furnished studio for someone who wants a quiet rental close to the main Leh market.',
  },
  {
    id: 'rishikesh-river-apartment',
    title: 'River View Apartment',
    city: 'Rishikesh',
    area: 'Tapovan',
    type: 'Apartment',
    rent: 28000,
    bedrooms: 2,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    highlights: ['River view', 'Yoga studios nearby', 'Peaceful lane'],
    description:
      'A calm apartment in Rishikesh for renters who want nature, cafes, and easy daily living.',
  },
  {
    id: 'udaipur-lake-house',
    title: 'Lake Side Shared House',
    city: 'Udaipur',
    area: 'Ambamata',
    type: 'Shared',
    rent: 14000,
    bedrooms: 3,
    furnished: false,
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
    highlights: ['Near lake', 'Large common room', 'Rooftop access'],
    description:
      'A shared rental near Udaipur lake areas, good for friends or students on a budget.',
  },
  {
    id: 'kashmir-valley-cottage',
    title: 'Kashmir Valley Cottage',
    city: 'Kashmir Valley',
    area: 'Srinagar',
    type: 'Apartment',
    rent: 26000,
    bedrooms: 2,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
    highlights: ['Valley view', 'Wooden interiors', 'Quiet neighborhood'],
    description:
      'A warm furnished rental in Kashmir Valley for people who want peaceful views and a slower pace.',
  },
  {
    id: 'golden-temple-stay',
    title: 'Stay Near The Golden Temple',
    city: 'Amritsar',
    area: 'Golden Temple Area',
    type: 'Studio',
    rent: 17000,
    bedrooms: 1,
    furnished: true,
    image:
      'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80',
    highlights: ['Walkable location', 'Furnished room', 'Local markets nearby'],
    description:
      'A simple studio rental near The Golden Temple area in Amritsar, good for short stays or city living.',
  },
]

module.exports = rentals
