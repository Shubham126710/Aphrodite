const fs = require('fs');

let auth = fs.readFileSync('src/components/Auth.tsx', 'utf-8');
auth = auth.replace(
`        setUserProfile({
          id: data.user?.id || '',
          firstName,`,
`        setUserProfile({
          id: 'guest',
          firstName,`);
fs.writeFileSync('src/components/Auth.tsx', auth);


let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
dash = dash.replace(
`    return {
      letter: frames[0] || flames[0],`,
`    return {
      letter: flames[0],`);
      
dash = dash.replace(
`        const { data, error } = await supabase.from('profiles').select('*').limit(20);`,
`        const { data } = await supabase.from('profiles').select('*').limit(20);`);

dash = dash.replace(
`        setUserProfile({ firstName: 'Guest', lastName: '', avatarUrl: '/avatar1.png', hasCompletedTour: true });`,
`        setUserProfile({ id: 'guest', firstName: 'Guest', lastName: '', avatarUrl: '/avatar1.png', hasCompletedTour: true });`);

dash = dash.replace(
`            await supabase.auth.updateUser({`,
`            
            if (userProfile && userProfile.id !== 'guest') {
              await supabase.auth.updateUser({`
);

dash = dash.replace(
`            });
          } catch (err)`,
`            });
            }
          } catch (err)`
);

fs.writeFileSync('src/components/Dashboard.tsx', dash);
