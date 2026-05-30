-- Add review_form_enabled field to company_portal_profiles
ALTER TABLE company_portal_profiles 
ADD COLUMN IF NOT EXISTS review_form_enabled BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN company_portal_profiles.review_form_enabled IS 'Controls whether the review submission form is visible on the portal';
