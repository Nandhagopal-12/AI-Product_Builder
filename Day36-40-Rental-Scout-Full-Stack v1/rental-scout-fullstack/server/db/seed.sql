INSERT INTO users (
  name,
  email,
  password_hash
)
VALUES (
  'Test User',
  'test@example.com',
  'test_password_hash'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO listings (
    title, 
    location, 
    price, 
    bedrooms, 
    bathrooms, 
    description, 
    image_url
)
VALUES
(
  'Modern Studio Apartment',
  'Kochi',
  18000,
  1,
  1,
  'A compact studio apartment near public transport.',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
),
(
  'Two Bedroom Family Home',
  'Bengaluru',
  32000,
  2,
  2,
  'A comfortable home with good sunlight and nearby schools.',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
),
(
  'Budget One Bedroom Flat',
  'Chennai',
  15000,
  1,
  1,
  'A simple rental flat suitable for students or working professionals.',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
),
(
  'Lakeview farmhouse',
  'Ladhak',
  18000,
  1,
  1,
  'A lake-view famrhouse for travellers.',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'
),
(
  '4BHK Aparment with Studio',
  'Mangalore',
  26000,
  4,
  1,
  'A 4BHK large family Apartment with compact Studio.',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858'
);
