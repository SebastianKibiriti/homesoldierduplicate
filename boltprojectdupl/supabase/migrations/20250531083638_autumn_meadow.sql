/*
  # Add chores table and foreign key constraints

  1. New Tables
    - `chores`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, references profiles.id)
      - `name` (text)
      - `description` (text)
      - `points` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add foreign key constraints to `chore_completion_requests`:
      - `child_id` references `children.id`
      - `chore_id` references `chores.id`

  3. Security
    - Enable RLS on `chores` table
    - Add policies for parents to manage chores
    - Add policies for children to view chores
*/

-- Create chores table
CREATE TABLE IF NOT EXISTS chores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE TRIGGER set_chores_updated_at
  BEFORE UPDATE ON chores
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Add RLS policies for chores
CREATE POLICY "Parents can manage own chores"
  ON chores
  FOR ALL
  TO authenticated
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Children can view chores of their parent"
  ON chores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.parent_id = chores.parent_id
      AND children.id = auth.uid()
    )
  );

-- Add foreign key constraints to chore_completion_requests
ALTER TABLE chore_completion_requests
  ADD CONSTRAINT chore_completion_requests_child_id_fkey
  FOREIGN KEY (child_id) REFERENCES children(id)
  ON DELETE CASCADE;

ALTER TABLE chore_completion_requests
  ADD CONSTRAINT chore_completion_requests_chore_id_fkey
  FOREIGN KEY (chore_id) REFERENCES chores(id)
  ON DELETE CASCADE;