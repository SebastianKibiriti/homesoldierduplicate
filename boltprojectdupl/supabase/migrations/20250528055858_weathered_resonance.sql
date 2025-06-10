/*
  # Add Chore Completion Requests

  1. New Tables
    - `chore_completion_requests`
      - `id` (uuid, primary key)
      - `chore_id` (uuid, references chores)
      - `child_id` (uuid, references children)
      - `status` (text: pending, approved, rejected)
      - `submitted_at` (timestamp)
      - `reviewed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for children to create requests
    - Add policies for parents to manage requests
*/

CREATE TABLE IF NOT EXISTS chore_completion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chore_id uuid NOT NULL,
  child_id uuid NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chore_completion_requests ENABLE ROW LEVEL SECURITY;

-- Children can create completion requests
CREATE POLICY "Children can create completion requests"
  ON chore_completion_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE id = child_id
      AND parent_id = auth.uid()
    )
  );

-- Children can view their own completion requests
CREATE POLICY "Children can view own completion requests"
  ON chore_completion_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE id = child_id
      AND parent_id = auth.uid()
    )
  );

-- Parents can view completion requests for their children
CREATE POLICY "Parents can view children completion requests"
  ON chore_completion_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE id = child_id
      AND parent_id = auth.uid()
    )
  );

-- Parents can update completion requests
CREATE POLICY "Parents can update completion requests"
  ON chore_completion_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE id = child_id
      AND parent_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER set_chore_completion_requests_updated_at
  BEFORE UPDATE ON chore_completion_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();