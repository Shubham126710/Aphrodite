const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace(
`export interface UserProfileData {
  firstName: string;`, 
`export interface UserProfileData {
  id: string;
  firstName: string;`);

app = app.replace(
`        setUserProfile({
          
          firstName: metadata.first_name || "User",`,
`        setUserProfile({
          id: session.user.id,
          firstName: metadata.first_name || "User",`);

fs.writeFileSync('src/App.tsx', app);
