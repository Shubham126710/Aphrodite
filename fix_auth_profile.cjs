const fs = require('fs');
let auth = fs.readFileSync('src/components/Auth.tsx', 'utf-8');

auth = auth.replace(
`        setUserProfile({
          firstName: metadata.first_name || "User",`,
`        setUserProfile({
          id: data.session ? data.session.user.id : data.user.id,
          firstName: metadata.first_name || "User",`);

auth = auth.replace(
`        setUserProfile({
          firstName,`,
`        setUserProfile({
          id: data.user?.id || '',
          firstName,`);

fs.writeFileSync('src/components/Auth.tsx', auth);
