var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // About page
  {
    path: '/boats/',
    componentUrl: './pages/boats.html',
    name: 'boats',
  },
  {
    path: '/boats/add_boat/',
    url: './pages/add_boat.html',
    name: 'add_boat',
  },
  {
    path: '/boats/edit_boat/:boat_id',
    templateUrl: './pages/edit_boat.html',
    name: 'edit_boat',
  },
  {
    path: '/data_fields/:field_id',
    templateUrl: './pages/data_fields.html',
    name: 'data_fields',
  },
  
  // Right Panel pages

  // Components
  {
    path: '/accordion/',
    url: './pages/accordion.html',
  },
  {
    path: '/action-sheet/',
    componentUrl: './pages/action-sheet.html',
  },
  {
    path: '/autocomplete/',
    componentUrl: './pages/autocomplete.html',
  },
  {
    path: '/badge/',
    componentUrl: './pages/badge.html',
  },
  {
    path: '/buttons/',
    url: './pages/buttons.html',
  },
  {
    path: '/calendar/',
    componentUrl: './pages/calendar.html',
  }
  ];
