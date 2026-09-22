# How to Add Custom Confirmation Email in Supabase

Follow these quick steps to apply your branded **WriteMyWords** email template in your Supabase dashboard:

---

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project (`onsmhjrqpciereiwzrzs`).
2. In the left navigation sidebar, click on **Authentication** (icon with user/key).
3. Under Configuration, click on **Email Templates**.

---

### Step 2: Apply the "Confirm signup" (Verification) Template
1. Under **Email Templates**, click on **Confirm signup**.
2. **Subject line**:
   ```
   Confirm your WriteMyWords account
   ```
3. **Body (HTML)**:
   - Clear whatever is currently in the message box.
   - Copy all contents from [confirm_signup.html](file:///c:/Users/VARUN-PC/Downloads/files%20(3)/writemywords-react/writemywords-react/email_templates/confirm_signup.html) and paste it into the editor.
4. Click **Save** at the bottom right.

---

### Step 3: Configure the Redirect URL
1. In the Supabase sidebar under **Authentication**, click on **URL Configuration**.
2. Under **Site URL**, set your production domain (or `http://localhost:5173` during local development).
3. Under **Redirect URLs**, add:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/dashboard
   https://your-domain.vercel.app/auth/callback
   ```
4. Click **Save**.

---

### Step 4: (Optional) Apply Password Reset Template
1. Under **Email Templates**, click on **Reset password**.
2. **Subject line**:
   ```
   Reset your WriteMyWords password
   ```
3. Copy all contents from [reset_password.html](file:///c:/Users/VARUN-PC/Downloads/files%20(3)/writemywords-react/writemywords-react/email_templates/reset_password.html) and paste into the editor.
4. Click **Save**.

---

### How the Flow Works:
1. When a user signs up on the signup page, Supabase sends the branded HTML email.
2. The user clicks **Verify Email Address**.
3. They are directed to `http://localhost:5173/auth/callback` where the app automatically verifies their token, creates their profile, and logs them in directly to their dashboard.
