const handleLogout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
    // REMOVE THIS??
  } else {
    alert('Failed to Logout');
  }
};

document.getElementById('logout').addEventListener('click', handleLogout);
