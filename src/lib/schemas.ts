import { z } from 'zod';
export const enquirySchema = z.object({
 name:z.string().trim().min(2,'Enter your full name.').max(100), email:z.string().trim().email('Enter a valid email address.').max(255),
 phone:z.string().trim().max(40), company:z.string().trim().max(150), product:z.string().trim().max(150), message:z.string().trim().min(3,'Please tell us about your requirements.').max(5000),
 kind:z.enum(['contact','quote','distributor']), location:z.string().trim().max(100), preferred_contact:z.enum(['email','phone']), website:z.string().max(0),
});
