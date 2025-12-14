CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS mini_depots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mini_depots ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS transporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transporters ENABLE ROW LEVEL SECURITY;

INSERT INTO mini_depots (name, city, address, phone) VALUES
  ('Mini-Dépôt Tunis Centre', 'Tunis', 'Avenue Habib Bourguiba, 1000 Tunis', '+216 71 123 456'),
  ('Mini-Dépôt Sousse', 'Sousse', 'Avenue de la République, 4000 Sousse', '+216 73 234 567'),
  ('Mini-Dépôt Sfax', 'Sfax', 'Avenue Hedi Chaker, 3000 Sfax', '+216 74 345 678')
ON CONFLICT DO NOTHING;

INSERT INTO transporters (name, phone) VALUES
  ('Aramex Tunisie', '+216 71 111 222'),
  ('DHL Express', '+216 71 222 333'),
  ('Chronopost', '+216 71 333 444')
ON CONFLICT DO NOTHING;
