const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace(
  `<div className="perspective-container">
            {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} setUserProfile={setUserProfile} />}
            
            {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} userProfile={userProfile} setUserProfile={setUserProfile} />}
            
            {currentPage === 'manifesto' && <Manifesto setCurrentPage={setCurrentPage} />}`,
  `{currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} userProfile={userProfile} setUserProfile={setUserProfile} />}
          <div className="perspective-container">
            {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} setUserProfile={setUserProfile} />}
            
            {currentPage === 'manifesto' && <Manifesto setCurrentPage={setCurrentPage} />}`
);

fs.writeFileSync('src/App.tsx', app);
