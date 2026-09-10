-- ==============================================================================
-- Seed Data: Indian Antarctic Stations
-- ==============================================================================

INSERT INTO stations (id, name, latitude, longitude, status)
VALUES 
    ('station-maitri', 'Maitri Research Station (Schirmacher Oasis)', -70.765833, 11.735833, 'ONLINE'),
    ('station-bharati', 'Bharati Research Station (Larsemann Hills)', -69.407778, 76.187222, 'ONLINE')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    status = EXCLUDED.status;

-- ==============================================================================
-- Seed Data: User Profiles (India Operator, Maitri Operator, Bharati Operator)
-- Note: In Supabase Auth, profiles link to auth.users via matching UUID.
-- ==============================================================================

INSERT INTO user_profiles (id, full_name, role, station_id)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Dr. Rajesh Sharma (HQ National Command)', 'india_operator', NULL),
    ('00000000-0000-0000-0000-000000000002', 'Cmdr. Vikram Nair (Maitri Lead)', 'station_operator', 'station-maitri'),
    ('00000000-0000-0000-0000-000000000003', 'Dr. Sunita Deshmukh (Bharati Lead)', 'station_operator', 'station-bharati')
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    station_id = EXCLUDED.station_id;
