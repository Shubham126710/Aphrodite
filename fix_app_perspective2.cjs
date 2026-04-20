const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace(
  /<div className="perspective-container">\s*\{currentPage === 'auth'.*?\s*\{currentPage === 'dashboard'.*?\s*\{currentPage === 'manifesto'/s,
  `{currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} userProfile={userProfile} setUserProfile={setUserProfile} />}
          <div className="perspective-container">
            {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} setUserProfile={setUserProfile} />}
            {currentPage === 'manifesto'`
);
fs.writeFileSync('src/App.tsx', app);
